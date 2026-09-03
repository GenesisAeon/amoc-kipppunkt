import { create } from "zustand";
import {
  AMOC_RAPID_MEAN_SV,
  DT_YEAR,
  F_MAX,
  F_MIN,
  HISTORY_MAX_POINTS,
  HISTORY_STRIDE_YEAR,
  START_YEAR,
  SWEEP_RATE,
  YEAR_CAP,
} from "./constants";
import {
  snapshot,
  stepModel,
  type ModelId,
  type Sample,
} from "./physics";
import { clamp } from "@/lib/utils";

export type Ramp = {
  rate: number;
  lo: number;
  hi: number;
  reversing: boolean;
};

export type PhasePoint = {
  F: number;
  H: number;
  dir: "fwd" | "rev";
};

type AmocStore = {
  running: boolean;
  speed: number;
  year: number;
  H: number;
  F: number;
  model: ModelId;
  history: Sample[];
  phase: PhasePoint[];
  ramp: Ramp | null;
  setRunning: (running: boolean) => void;
  setSpeed: (speed: number) => void;
  setF: (F: number) => void;
  setH: (H: number) => void;
  setModel: (model: ModelId) => void;
  stepYears: (years: number) => void;
  reset: (opts?: { H?: number; F?: number; model?: ModelId }) => void;
  kick: (delta?: number) => void;
  startSweep: () => void;
  stopSweep: () => void;
};

function seed(H: number, F: number): Pick<
  AmocStore,
  "year" | "H" | "F" | "history" | "phase" | "ramp"
> {
  return {
    year: START_YEAR,
    H,
    F,
    history: [snapshot(START_YEAR, H, F)],
    phase: [{ F, H, dir: "fwd" }],
    ramp: null,
  };
}

export const useAmoc = create<AmocStore>((set, get) => ({
  running: true,
  speed: 8,
  model: "utac",
  ...seed(AMOC_RAPID_MEAN_SV, 0),

  setRunning: (running) => set({ running }),
  setSpeed: (speed) => set({ speed }),
  setModel: (model) => set({ model }),

  setF: (F) => {
    const next = clamp(F, F_MIN, F_MAX);
    const { year, H, history, phase, ramp } = get();
    const last = history[history.length - 1];
    const hist =
      last && Math.abs(last.year - year) < 1e-9
        ? [...history.slice(0, -1), snapshot(year, H, next)]
        : history;
    set({
      F: next,
      history: hist,
      phase: ramp ? phase : [...phase.slice(-400), { F: next, H, dir: "fwd" }],
    });
  },

  setH: (H) => {
    const next = Math.max(0, H);
    const { year, F, history } = get();
    set({
      H: next,
      history: [...history.slice(0, -1), snapshot(year, next, F)],
    });
  },

  stepYears: (years) => {
    const state = get();
    if (years <= 0) return;
    let { H, year, F, history, phase, ramp, model } = state;
    const n = Math.max(1, Math.round(years / DT_YEAR));
    let lastRecord = history[history.length - 1]?.year ?? year;
    let dir: PhasePoint["dir"] = ramp && ramp.rate < 0 ? "rev" : "fwd";
    let Fprev = F;

    for (let i = 0; i < n; i += 1) {
      if (year >= YEAR_CAP) break;
      if (ramp) {
        F += ramp.rate * DT_YEAR;
        if (F > ramp.hi) {
          F = ramp.hi;
          if (ramp.reversing) {
            ramp = { ...ramp, rate: -Math.abs(ramp.rate) };
            dir = "rev";
          } else {
            ramp = null;
          }
        } else if (F < ramp.lo) {
          F = ramp.lo;
          ramp = null;
        }
        F = clamp(F, F_MIN, F_MAX);
      }

      H = stepModel(model, H, F, DT_YEAR);
      year += DT_YEAR;

      if (year - lastRecord >= HISTORY_STRIDE_YEAR - 1e-9) {
        history.push(snapshot(year, H, F));
        lastRecord = year;
      }
      if (ramp && Math.abs(F - Fprev) > 1e-5) {
        phase.push({ F, H, dir });
        Fprev = F;
      }
    }

    if (history.length > HISTORY_MAX_POINTS) {
      history = history.slice(history.length - HISTORY_MAX_POINTS);
    }
    if (phase.length > 1400) {
      phase = phase.slice(phase.length - 1400);
    }
    if (year >= YEAR_CAP) {
      set({ H, year, F, history, phase, ramp: null, running: false });
      return;
    }
    set({ H, year, F, history, phase, ramp });
  },

  reset: (opts) => {
    const H = opts?.H ?? AMOC_RAPID_MEAN_SV;
    const F = opts?.F ?? 0;
    const model = opts?.model ?? get().model;
    set({
      model,
      ...seed(H, F),
    });
  },

  kick: (delta = 1) => {
    const { H, year, F, history } = get();
    const next = Math.max(0.2, H + delta);
    set({
      H: next,
      history: [...history, snapshot(year, next, F)],
    });
  },

  startSweep: () => {
    const { H } = get();
    const h0 = Math.max(H, AMOC_RAPID_MEAN_SV);
    set({
      running: true,
      model: "fold",
      F: F_MIN,
      H: h0,
      year: START_YEAR,
      history: [snapshot(START_YEAR, h0, F_MIN)],
      phase: [{ F: F_MIN, H: h0, dir: "fwd" }],
      ramp: {
        rate: SWEEP_RATE,
        lo: F_MIN,
        hi: F_MAX,
        reversing: true,
      },
    });
  },

  stopSweep: () => set({ ramp: null }),
}));
