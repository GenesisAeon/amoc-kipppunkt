/**
 * UTAC logistic (amoc-utac / tipping_predictor.py, system.py):
 *
 *   H_star(Gamma) = K * tanh(sigma * Gamma)
 *   dH/dt = r * H * (H_star/K - H/K)
 *
 * Fov at 34S (freshwater.py):
 *   Fov ~ alpha * Psi * dS / S0
 *   R   = 1 / (1 + exp(Fov / Fov_ref))     // CREP R-component
 *
 * Gamma composition (crep_amoc.py):
 *   Gamma = 0.30 C + 0.35 R + 0.20 E + 0.15 (1 - P)
 *
 * The slider is extra freshwater hosing F [Sv]. Present-day Fov is held as
 * the CREP baseline so F = 0 recovers the calibrated Gamma_AMOC ~ 0.251.
 * C, E, P stay frozen at the unique offset that makes that calibration true.
 *
 * Fold mode is the pedagogical saddle-node normal form of a bistable
 * tipping element, scaled only with K, r and Fov_ref from the package
 * (folds at +/- Fov_ref). It is not a new calibrated AMOC forecast.
 */

import { clamp } from "@/lib/utils";
import {
  CREP_WEIGHTS,
  DELTA_S,
  FOLD_AMP,
  FOV_ALPHA,
  FOV_REF,
  GAMMA_AMOC,
  K,
  S0,
  UTAC_R,
  UTAC_SIGMA,
} from "./constants";

export function fovDiagnostic(amocSv: number): number {
  return (FOV_ALPHA * amocSv * DELTA_S) / S0;
}

/** Present-day Fov implied by the freshwater.py parameterisation at K = 18 Sv. */
export const FOV_PRESENT = fovDiagnostic(K);

export function crepR(fov: number): number {
  return 1 / (1 + Math.exp(fov / FOV_REF));
}

const R_PRESENT = crepR(FOV_PRESENT);
/** wC*C + wE*E + wP*(1-P) such that Gamma(Fov_present) = Gamma_AMOC. */
export const CREP_OFFSET = GAMMA_AMOC - CREP_WEIGHTS.R * R_PRESENT;

export function gammaFromFov(fov: number): number {
  return clamp(CREP_OFFSET + CREP_WEIGHTS.R * crepR(fov), 0, 1);
}

export function hStarFromGamma(gamma: number): number {
  return K * Math.tanh(UTAC_SIGMA * gamma);
}

export function etaFromGamma(gamma: number): number {
  return Math.tanh(UTAC_SIGMA * gamma);
}

/** Effective Fov seen by CREP: present-day diagnostic plus hosing F. */
export function fovEffective(F: number): number {
  return FOV_PRESENT + F;
}

export function utacState(F: number): {
  fov: number;
  R: number;
  gamma: number;
  eta: number;
  hStar: number;
  bistable: boolean;
} {
  const fov = fovEffective(F);
  const R = crepR(fov);
  const gamma = gammaFromFov(fov);
  const eta = etaFromGamma(gamma);
  const hStar = hStarFromGamma(gamma);
  return { fov, R, gamma, eta, hStar, bistable: fov < 0 };
}

export function dHdtUtac(H: number, hStar: number): number {
  if (H <= 0) return 0;
  return UTAC_R * H * (hStar / K - H / K);
}

export function stepUtac(H: number, hStar: number, dt: number): number {
  const k1 = dHdtUtac(H, hStar);
  const k2 = dHdtUtac(H + 0.5 * dt * k1, hStar);
  const k3 = dHdtUtac(H + 0.5 * dt * k2, hStar);
  const k4 = dHdtUtac(H + dt * k3, hStar);
  return Math.max(0, H + (dt / 6) * (k1 + 2 * k2 + 2 * k3 + k4));
}

/**
 * Fold normal form on x = 2H/K - 1 in [-1, 1]:
 *   dx/dt = r * (x - x^3 - (F / Fov_ref) * 2/(3*sqrt(3)))
 * Folds at F = +/- Fov_ref. Upper branch ~ on, lower branch ~ off.
 */
export function dHdtFold(H: number, F: number): number {
  const x = (2 * H) / K - 1;
  const fExt = (F / FOV_REF) * FOLD_AMP;
  const dx = UTAC_R * (x - x * x * x - fExt);
  return (K / 2) * dx;
}

export function stepFold(H: number, F: number, dt: number): number {
  const k1 = dHdtFold(H, F);
  const k2 = dHdtFold(H + 0.5 * dt * k1, F);
  const k3 = dHdtFold(H + 0.5 * dt * k2, F);
  const k4 = dHdtFold(H + dt * k3, F);
  const next = H + (dt / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
  return clamp(next, 0, K * 1.15);
}

export type ModelId = "utac" | "fold";

export function stepModel(
  model: ModelId,
  H: number,
  F: number,
  dt: number,
): number {
  if (model === "fold") return stepFold(H, F, dt);
  return stepUtac(H, utacState(F).hStar, dt);
}

export function dHdtModel(model: ModelId, H: number, F: number): number {
  if (model === "fold") return dHdtFold(H, F);
  return dHdtUtac(H, utacState(F).hStar);
}

export type BranchPoint = {
  F: number;
  H: number;
  stable: boolean;
};

/** Parametric cubic branch H(F) for the hysteresis diagram. */
export function foldBranch(samples = 241): BranchPoint[] {
  const out: BranchPoint[] = [];
  for (let i = 0; i < samples; i += 1) {
    const x = -1 + (2 * i) / (samples - 1);
    const fExt = x - x * x * x;
    const F = (fExt / FOLD_AMP) * FOV_REF;
    const H = ((x + 1) / 2) * K;
    const stable = Math.abs(x) > 1 / Math.sqrt(3);
    out.push({ F, H, stable });
  }
  return out;
}

export function utacBranch(Fmin: number, Fmax: number, samples = 121): BranchPoint[] {
  const out: BranchPoint[] = [];
  for (let i = 0; i < samples; i += 1) {
    const F = Fmin + ((Fmax - Fmin) * i) / (samples - 1);
    out.push({ F, H: utacState(F).hStar, stable: true });
  }
  return out;
}

export type Sample = {
  year: number;
  H: number;
  hStar: number;
  F: number;
  gamma: number;
  fov: number;
};

export function snapshot(year: number, H: number, F: number): Sample {
  const s = utacState(F);
  return {
    year,
    H,
    hStar: s.hStar,
    F,
    gamma: s.gamma,
    fov: s.fov,
  };
}
