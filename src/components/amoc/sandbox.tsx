import { useEffect, useMemo, useRef } from "react";
import {
  FastForward,
  Pause,
  Play,
  RotateCcw,
  Spline,
  Zap,
} from "lucide-react";
import { AtlanticSchematic } from "@/components/amoc/atlantic-schematic";
import { ContextPanel } from "@/components/amoc/context-panel";
import { ForcingPanel } from "@/components/amoc/forcing-panel";
import { HysteresisChart } from "@/components/amoc/hysteresis-chart";
import { StatePanel } from "@/components/amoc/state-panel";
import { TimeChart } from "@/components/amoc/time-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  AMOC_RAPID_MEAN_SV,
  DT_YEAR,
  FOV_REF,
  K,
} from "@/lib/amoc/constants";
import { dHdtModel, utacState } from "@/lib/amoc/physics";
import { useAmoc } from "@/lib/amoc/store";
import { cn, fmtDe } from "@/lib/utils";

const SPEEDS = [2, 8, 24];

function useEngine() {
  const running = useAmoc((s) => s.running);
  const acc = useRef(0);
  const last = useRef(0);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    last.current = performance.now();
    acc.current = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last.current) / 1000);
      last.current = now;
      const { speed, stepYears } = useAmoc.getState();
      acc.current += dt * speed;
      const n = Math.min(80, Math.floor(acc.current / DT_YEAR));
      if (n > 0) {
        acc.current -= n * DT_YEAR;
        stepYears(n * DT_YEAR);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}

export function AmocSandbox() {
  useEngine();
  const year = useAmoc((s) => s.year);
  const H = useAmoc((s) => s.H);
  const F = useAmoc((s) => s.F);
  const model = useAmoc((s) => s.model);
  const running = useAmoc((s) => s.running);
  const speed = useAmoc((s) => s.speed);
  const history = useAmoc((s) => s.history);
  const phase = useAmoc((s) => s.phase);
  const ramp = useAmoc((s) => s.ramp);
  const setRunning = useAmoc((s) => s.setRunning);
  const setSpeed = useAmoc((s) => s.setSpeed);
  const setF = useAmoc((s) => s.setF);
  const setModel = useAmoc((s) => s.setModel);
  const reset = useAmoc((s) => s.reset);
  const kick = useAmoc((s) => s.kick);
  const startSweep = useAmoc((s) => s.startSweep);
  const stopSweep = useAmoc((s) => s.stopSweep);
  const stepYears = useAmoc((s) => s.stepYears);

  const u = utacState(F);
  const dHdt = dHdtModel(model, H, F);
  const collapsed = H < 0.15;
  const foldWindow = Math.abs(F) <= FOV_REF + 1e-9;

  const chartHistory = useMemo(() => {
    if (history.length <= 420) return history;
    const stride = Math.ceil(history.length / 420);
    return history.filter(
      (_, i) => i % stride === 0 || i === history.length - 1,
    );
  }, [history]);

  const phaseView = useMemo(() => {
    if (phase.length <= 360) return phase;
    const stride = Math.ceil(phase.length / 360);
    return phase.filter((_, i) => i % stride === 0 || i === phase.length - 1);
  }, [phase]);

  return (
    <TooltipProvider>
      <div className="min-h-dvh bg-background">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-5 sm:px-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                GenesisAeon P18 · amoc-utac
              </p>
              <h1 className="mt-1 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
                AMOC-Kipppunkt
              </h1>
              <p className="mt-1 max-w-lg text-sm text-muted-foreground">
                Physik-Sandbox der Atlantischen Umwälzzirkulation. Die ODE kommt
                aus dem kalibrierten Paket — keine erfundenen Zahlen.
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-3xl tabular-nums leading-none sm:text-4xl">
                {Math.floor(year)}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                Simulationsjahr
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl space-y-4 px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={running ? "outline" : "default"}
              onClick={() => setRunning(!running)}
              aria-pressed={running}
            >
              {running ? <Pause /> : <Play className="ml-0.5" />}
              {running ? "Pause" : "Lauf"}
            </Button>
            <div className="flex rounded-md bg-secondary p-1">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeed(s)}
                  className={cn(
                    "h-11 min-w-11 rounded-sm px-3 font-mono text-xs tabular-nums transition-colors duration-150",
                    speed === s
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s} a/s
                </button>
              ))}
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => stepYears(50)}
            >
              <FastForward />
              +50 a
            </Button>
            <Button type="button" variant="ghost" onClick={() => reset()}>
              <RotateCcw />
              Reset
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => kick(collapsed ? 2 : 1)}
            >
              <Zap />
              {collapsed ? "Anstoßen" : "Störung +1 Sv"}
            </Button>
            <Button
              type="button"
              variant={ramp ? "default" : "outline"}
              onClick={() => (ramp ? stopSweep() : startSweep())}
            >
              <Spline />
              {ramp ? "Sweep stoppen" : "Hysterese-Sweep"}
            </Button>
          </div>

          <ForcingPanel
            F={F}
            fov={u.fov}
            bistable={u.bistable}
            onChange={setF}
            disabled={Boolean(ramp)}
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setModel("utac")}
              className={cn(
                "h-11 rounded-md px-4 text-sm transition-colors duration-150",
                model === "utac"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground shadow-[var(--shadow-border)] hover:text-foreground",
              )}
            >
              UTAC-Logistik
            </button>
            <button
              type="button"
              onClick={() => setModel("fold")}
              className={cn(
                "h-11 rounded-md px-4 text-sm transition-colors duration-150",
                model === "fold"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground shadow-[var(--shadow-border)] hover:text-foreground",
              )}
            >
              Bistabile Falte
            </button>
            <Badge variant={model === "fold" ? (foldWindow ? "on" : "off") : u.bistable ? "on" : "off"}>
              {model === "fold"
                ? foldWindow
                  ? "Hysterese-Fenster"
                  : "außerhalb der Falte"
                : u.bistable
                  ? "Bistabil"
                  : "Monostabil"}
            </Badge>
            {collapsed ? <Badge variant="off">H ≈ 0, absorbierend</Badge> : null}
          </div>
          <p className="text-sm text-muted-foreground">
            {model === "utac"
              ? "Live-ODE: dH/dt = r H (H*/K − H/K) mit H* = K tanh(σ Γ). Ein Attraktor H*; Kollaps bei H = 0 bleibt liegen — ohne Anstoß keine Erholung."
              : `Sattel-Knoten mit Faltpunkten bei ±Fov_ref = ±${fmtDe(FOV_REF, 1)} Sv (K, r, Fov_ref aus P18). Zeigt die Hysterese dieses Systemtyps.`}
          </p>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <AtlanticSchematic H={H} F={F} className="min-h-72 lg:min-h-full" />
            <StatePanel
              H={H}
              hStar={u.hStar}
              dHdt={dHdt}
              gamma={u.gamma}
              eta={u.eta}
              R={u.R}
              model={model}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-serif text-lg font-medium tracking-tight">
                  Zeitentwicklung
                </h2>
                <p className="text-xs text-muted-foreground">
                  Band RAPID · gestrichelt H* · Marke 2065
                </p>
              </div>
              <TimeChart history={chartHistory} year={year} />
            </section>
            <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-serif text-lg font-medium tracking-tight">
                  Hysterese
                </h2>
                <p className="text-xs text-muted-foreground">
                  H gegen F · Falte ±{fmtDe(FOV_REF, 1)} Sv
                </p>
              </div>
              <HysteresisChart
                model={model}
                phase={phaseView}
                F={F}
                H={H}
              />
            </section>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => reset({ H: AMOC_RAPID_MEAN_SV, F: 0 })}
            >
              RAPID heute, F = 0
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => reset({ H: 0.5 * K, F: 0 })}
            >
              50 %-Schwelle
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                reset({ H: AMOC_RAPID_MEAN_SV, F: FOV_REF + 0.02, model: "fold" })
              }
            >
              Hosing über Falte
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => reset({ H: 1, F: 0, model: "fold" })}
            >
              Off-Zustand
            </Button>
          </div>

          <ContextPanel />

          <p className="pb-6 text-xs text-muted-foreground">
            Parameter aus amoc-utac: σ = 2,2, r = 0,08 a⁻¹, K = 18 Sv, Γ_AMOC =
            arctanh(0,50)/2,2, Fov_ref = 0,1 Sv, α = −0,05, RAPID-Mittel 17 Sv.
            Die UTAC-Logistik hat H = 0 als invarianten Kollaps; die Falte ist das
            didaktische bistabile Normalform-Modell desselben Systemtyps, skaliert
            nur mit Paketkonstanten.
          </p>
        </main>
      </div>
    </TooltipProvider>
  );
}
