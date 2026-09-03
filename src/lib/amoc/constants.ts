/**
 * Physical and model constants — sourced from GenesisAeon P18 amoc-utac
 * (amoc_utac/constants.py, freshwater.py, crep_amoc.py, system.py,
 * tipping_predictor.py). Do not invent replacements.
 */

export const AMOC_PRESENT_SV = 18.0;
export const AMOC_RAPID_MEAN_SV = 17.0;
export const AMOC_RAPID_STD_SV = 4.0;
export const AMOC_WEAKENING_SV = 3.0;

export const UTAC_R = 0.08;
export const UTAC_SIGMA = 2.2;
export const UTAC_SEED = 42;

export const AMOC_TIPPING_ETA = 0.5;
export const GAMMA_AMOC = Math.atanh(AMOC_TIPPING_ETA) / UTAC_SIGMA;

export const FOV_REF = 0.1;
export const FOV_ALPHA = -0.05;

export const S0 = 35.0;
export const S_ATLANTIC = 36.0;
export const S_PACIFIC = 34.5;
export const DELTA_S = S_ATLANTIC - S_PACIFIC;

export const CREP_WEIGHTS = {
  C: 0.3,
  R: 0.35,
  E: 0.2,
  P: 0.15,
} as const;

export const K = AMOC_PRESENT_SV;
export const START_YEAR = 2024;

export const DITLEVSEN_CENTRAL = 2065;
export const DITLEVSEN_RANGE = [2037, 2109] as const;
export const DITLEVSEN_CORRECTION_DOI = "10.1038/s41467-025-63201-y";

export const CHAVENT_2026_WEAKENING_BY = 2100;

export const AR6_WEAKENING_SSP126_PCT = [24.0, 4.0, 46.0] as const;
export const AR6_WEAKENING_SSP585_PCT = [39.0, 17.0, 55.0] as const;

export const IPCC_AR6_CONFIDENCE_STATEMENT =
  "medium confidence that the Atlantic Meridional Overturning Circulation will not collapse abruptly before 2100";

export const IPCC_AR6_CITATION =
  "IPCC AR6 Working Group I, Summary for Policymakers (2021), Section C.3.4";

export const MORR_2026_CRITIQUE =
  "Morr et al. (2026), arXiv:2604.20341 (Preprint, nicht peer-reviewed): die Ditlevsen-Fingerprint-Wahl ist fragil; alternative Spezifikationen schieben die Schätzung weit nach hinten.";

export const VAN_WESTEN_DOI = "10.1126/sciadv.adk1189";
export const PACKAGE_ZENODO = "10.5281/zenodo.19645351";
export const PACKAGE_REPO = "https://github.com/GenesisAeon/amoc-utac";

/** Slider span in units of Fov_ref (package freshwater.py). */
export const F_MIN = -2 * FOV_REF;
export const F_MAX = 4 * FOV_REF;
/** Sweep: one Fov_ref per 25 years. */
export const SWEEP_RATE = FOV_REF / 25;

export const DT_YEAR = 0.05;
export const HISTORY_STRIDE_YEAR = 0.25;
export const HISTORY_MAX_POINTS = 1800;
export const YEAR_CAP = 2300;

/** Saddle-node fold amplitude 2/(3*sqrt(3)) of the normal form x - x^3. */
export const FOLD_AMP = 2 / (3 * Math.sqrt(3));
