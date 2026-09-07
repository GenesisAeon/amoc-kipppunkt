export type Locale = "de" | "en";

export type Messages = {
  language: string;
  documentTitle: string;
  eyebrow: string;
  title: string;
  lead: string;
  simYear: string;
  play: string;
  pause: string;
  reset: string;
  step50: string;
  kickRecover: string;
  kickPerturb: string;
  sweepStop: string;
  sweepStart: string;
  modelUtac: string;
  modelFold: string;
  badgeHysteresisWindow: string;
  badgeOutsideFold: string;
  badgeBistable: string;
  badgeMonostable: string;
  badgeCollapsed: string;
  modelHintUtac: string;
  modelHintFold: (fov: string) => string;
  timeTitle: string;
  timeHint: string;
  hystTitle: string;
  hystHint: (fov: string) => string;
  presetRapid: string;
  presetHalf: string;
  presetHosing: string;
  presetOff: string;
  footerParams: string;
  forcingTitle: string;
  forcingLead: (fovPresent: string, alpha: string, fovRef: string) => string;
  forcingRelative: string;
  forcingToday: string;
  forcingAria: string;
  badgeFovBistable: string;
  badgeFovOutside: string;
  stateTitle: string;
  tendencyWeakening: string;
  tendencyRecovering: string;
  tendencyNearEq: string;
  barHintUtac: (hStar: string) => string;
  barHintFold: string;
  hintAmocStrength: string;
  hintUtacCompare: string;
  hintUtacTarget: string;
  hintTendency: string;
  hintEta: string;
  hintFovResonance: string;
  stateEqFoot: (K: string, s: string, r: string) => string;
  contextEyebrow: string;
  ditlevsenTitle: (year: number) => string;
  ditlevsenBody: (doi: string, year: number) => string;
  ipccTitle: string;
  ipccBodyLead: string;
  ipccBodyTail: (ssp126: string, ssp126Lo: string, ssp126Hi: string, ssp585: string, ssp585Lo: string, ssp585Hi: string) => string;
  morrCritique: string;
  contextFoot: (doi: string) => string;
  schematicAria: string;
  nordmeer: string;
  freshwater: string;
  surfaceNorth: string;
  nadwSouth: string;
  offState: string;
  schematicH: string;
  schematicF: string;
  schematicRapid: (sv: string) => string;
};

export const messages: Record<Locale, Messages> = {
  de: {
    language: "Sprache",
    documentTitle: "AMOC-Kipppunkt",
    eyebrow: "GenesisAeon P18 \u00b7 amoc-utac",
    title: "AMOC-Kipppunkt",
    lead: "Physik-Sandbox der Atlantischen Umw\u00e4lzzirkulation. Die ODE kommt aus dem kalibrierten Paket \u2013 keine erfundenen Zahlen.",
    simYear: "Simulationsjahr",
    play: "Lauf",
    pause: "Pause",
    reset: "Reset",
    step50: "+50 a",
    kickRecover: "Ansto\u00dfen",
    kickPerturb: "St\u00f6rung +1 Sv",
    sweepStop: "Sweep stoppen",
    sweepStart: "Hysterese-Sweep",
    modelUtac: "UTAC-Logistik",
    modelFold: "Bistabile Falte",
    badgeHysteresisWindow: "Hysterese-Fenster",
    badgeOutsideFold: "au\u00dferhalb der Falte",
    badgeBistable: "Bistabil",
    badgeMonostable: "Monostabil",
    badgeCollapsed: "H ~ 0, absorbierend",
    modelHintUtac:
      "Live-ODE: dH/dt = r H (H*/K - H/K) mit H* = K tanh(s G). Ein Attraktor H*; Kollaps bei H = 0 bleibt liegen \u2013 ohne Ansto\u00df keine Erholung.",
    modelHintFold: (fov) =>
      `Sattel-Knoten mit Faltpunkten bei \u00b1Fov_ref = \u00b1${fov} Sv (K, r, Fov_ref aus P18). Zeigt die Hysterese dieses Systemtyps.`,
    timeTitle: "Zeitentwicklung",
    timeHint: "Band RAPID \u00b7 gestrichelt H* \u00b7 Marke 2065",
    hystTitle: "Hysterese",
    hystHint: (fov) => `H gegen F \u00b7 Falte \u00b1${fov} Sv`,
    presetRapid: "RAPID heute, F = 0",
    presetHalf: "50 %-Schwelle",
    presetHosing: "Hosing \u00fcber Falte",
    presetOff: "Off-Zustand",
    footerParams:
      "Parameter aus amoc-utac: s = 2,2, r = 0,08 a\u207b\u00b9, K = 18 Sv, G_AMOC = arctanh(0,50)/2,2, Fov_ref = 0,1 Sv, a = -0,05, RAPID-Mittel 17 Sv. Die UTAC-Logistik hat H = 0 als invarianten Kollaps; die Falte ist das didaktische bistabile Normalform-Modell desselben Systemtyps, skaliert nur mit Paketkonstanten.",
    forcingTitle: "S\u00fc\u00dfwasser-Einspeisung",
    forcingLead: (fovPresent, alpha, fovRef) =>
      `Extra-Hosing F, addiert auf Fov_heute = ${fovPresent} Sv (a \u00b7 \u03b7 \u00b7 \u0394S / S\u2080, a = ${alpha}). Skala Fov_ref = ${fovRef} Sv.`,
    forcingRelative: "F relativ zu heute",
    forcingToday: "heute",
    forcingAria: "S\u00fc\u00dfwasser-Einspeisung F in Sverdrup",
    badgeFovBistable: "Fov < 0 \u00b7 bistabil (van Westen 2024)",
    badgeFovOutside: "Fov \u2265 0 \u00b7 au\u00dferhalb des bistabilen Fensters",
    stateTitle: "Zustand",
    tendencyWeakening: "schw\u00e4cht",
    tendencyRecovering: "erholt sich",
    tendencyNearEq: "nahe Gleichgewicht",
    barHintUtac: (hStar) => `Balken H \u00b7 Marke H* = ${hStar} Sv`,
    barHintFold: "Balken H \u00b7 Falten-\u00c4ste im Hysterese-Diagramm",
    hintAmocStrength: "AMOC-St\u00e4rke",
    hintUtacCompare: "UTAC-Vergleich",
    hintUtacTarget: "UTAC-Sollwert",
    hintTendency: "Tendenz",
    hintEta: "50 % bei 0,50",
    hintFovResonance: "Fov-Resonanz",
    stateEqFoot: (K, s, r) =>
      `K = ${K} Sv \u00b7 s = ${s} \u00b7 r = ${r} a\u207b\u00b9 \u00b7 G_AMOC = arctanh(0,50)/2,2`,
    contextEyebrow: "Kontext, keine Vorhersage dieser Sandbox",
    ditlevsenTitle: (year) => `Ditlevsen ${year}`,
    ditlevsenBody: (doi, year) =>
      `Korrigierte Kippjahr-Sch\u00e4tzung (Author Correction 2025, DOI ${doi}). Einzelstudie, statistisch, nicht der IPCC-Konsens \u2013 und nicht das Ergebnis der UTAC-ODE hier. Chavent et al. (2026): 50 % Schw\u00e4chung bis ${year}.`,
    ipccTitle: "IPCC AR6",
    ipccBodyLead:
      '"Medium confidence" ist keine Wahrscheinlichkeitszahl. Kollaps vor 2100 ist nicht explizit ausgeschlossen.',
    ipccBodyTail: (ssp126, ssp126Lo, ssp126Hi, ssp585, ssp585Lo, ssp585Hi) =>
      `Schw\u00e4chung bis 2100: SSP1-2.6 ${ssp126} % [${ssp126Lo}\u2013${ssp126Hi}], SSP5-8.5 ${ssp585} % [${ssp585Lo}\u2013${ssp585Hi}].`,
    morrCritique:
      "Morr et al. (2026), arXiv:2604.20341 (Preprint, nicht peer-reviewed): die Ditlevsen-Fingerprint-Wahl ist fragil; alternative Spezifikationen schieben die Sch\u00e4tzung weit nach hinten.",
    contextFoot: (doi) =>
      `Fov-Fr\u00fchwarnung: van Westen et al. 2024, DOI ${doi}. Quelle:`,
    schematicAria:
      "Meridionaler Schnitt der AMOC: warmer Oberfl\u00e4chenstrom nach Norden, kalter Tiefenstrom nach S\u00fcden",
    nordmeer: "NORDMEER",
    freshwater: "S\u00fc\u00dfwasser",
    surfaceNorth: "Oberfl\u00e4che \u2192 N",
    nadwSouth: "NADW \u2192 S",
    offState: "Off-Zustand",
    schematicH: "H",
    schematicF: "F",
    schematicRapid: (sv) => `RAPID-Mittel ${sv} Sv`,
  },
  en: {
    language: "Language",
    documentTitle: "AMOC tipping point",
    eyebrow: "GenesisAeon P18 \u00b7 amoc-utac",
    title: "AMOC tipping point",
    lead: "Physics sandbox of the Atlantic Meridional Overturning Circulation. The ODE comes from the calibrated package \u2013 no invented numbers.",
    simYear: "Simulation year",
    play: "Run",
    pause: "Pause",
    reset: "Reset",
    step50: "+50 a",
    kickRecover: "Kick-start",
    kickPerturb: "Perturbation +1 Sv",
    sweepStop: "Stop sweep",
    sweepStart: "Hysteresis sweep",
    modelUtac: "UTAC logistics",
    modelFold: "Bistable fold",
    badgeHysteresisWindow: "Hysteresis window",
    badgeOutsideFold: "outside the fold",
    badgeBistable: "Bistable",
    badgeMonostable: "Monostable",
    badgeCollapsed: "H ~ 0, absorbing",
    modelHintUtac:
      "Live ODE: dH/dt = r H (H*/K - H/K) with H* = K tanh(s G). One attractor H*; collapse at H = 0 stays down \u2013 no recovery without a kick.",
    modelHintFold: (fov) =>
      `Saddle-node with fold points at \u00b1Fov_ref = \u00b1${fov} Sv (K, r, Fov_ref from P18). Shows the hysteresis of this system type.`,
    timeTitle: "Time evolution",
    timeHint: "RAPID band \u00b7 dashed H* \u00b7 2065 mark",
    hystTitle: "Hysteresis",
    hystHint: (fov) => `H vs F \u00b7 fold \u00b1${fov} Sv`,
    presetRapid: "RAPID today, F = 0",
    presetHalf: "50 % threshold",
    presetHosing: "Hosing past fold",
    presetOff: "Off state",
    footerParams:
      "Parameters from amoc-utac: s = 2.2, r = 0.08 a\u207b\u00b9, K = 18 Sv, G_AMOC = arctanh(0.50)/2.2, Fov_ref = 0.1 Sv, a = -0.05, RAPID mean 17 Sv. UTAC logistics keeps H = 0 as an invariant collapse; the fold is the didactic bistable normal-form model of the same system type, scaled only with package constants.",
    forcingTitle: "Freshwater forcing",
    forcingLead: (fovPresent, alpha, fovRef) =>
      `Extra hosing F, added on Fov_today = ${fovPresent} Sv (a \u00b7 \u03b7 \u00b7 \u0394S / S\u2080, a = ${alpha}). Scale Fov_ref = ${fovRef} Sv.`,
    forcingRelative: "F relative to today",
    forcingToday: "today",
    forcingAria: "Freshwater forcing F in Sverdrups",
    badgeFovBistable: "Fov < 0 \u00b7 bistable (van Westen 2024)",
    badgeFovOutside: "Fov \u2265 0 \u00b7 outside the bistable window",
    stateTitle: "State",
    tendencyWeakening: "weakening",
    tendencyRecovering: "recovering",
    tendencyNearEq: "near equilibrium",
    barHintUtac: (hStar) => `Bar H \u00b7 mark H* = ${hStar} Sv`,
    barHintFold: "Bar H \u00b7 fold branches in the hysteresis chart",
    hintAmocStrength: "AMOC strength",
    hintUtacCompare: "UTAC comparison",
    hintUtacTarget: "UTAC target",
    hintTendency: "Tendency",
    hintEta: "50 % at 0.50",
    hintFovResonance: "Fov resonance",
    stateEqFoot: (K, s, r) =>
      `K = ${K} Sv \u00b7 s = ${s} \u00b7 r = ${r} a\u207b\u00b9 \u00b7 G_AMOC = arctanh(0.50)/2.2`,
    contextEyebrow: "Context, not a forecast of this sandbox",
    ditlevsenTitle: (year) => `Ditlevsen ${year}`,
    ditlevsenBody: (doi, year) =>
      `Corrected tipping-year estimate (Author Correction 2025, DOI ${doi}). Single study, statistical, not the IPCC consensus \u2013 and not the result of the UTAC ODE here. Chavent et al. (2026): 50 % weakening by ${year}.`,
    ipccTitle: "IPCC AR6",
    ipccBodyLead:
      '"Medium confidence" is not a probability number. Collapse before 2100 is not explicitly ruled out.',
    ipccBodyTail: (ssp126, ssp126Lo, ssp126Hi, ssp585, ssp585Lo, ssp585Hi) =>
      `Weakening by 2100: SSP1-2.6 ${ssp126} % [${ssp126Lo}\u2013${ssp126Hi}], SSP5-8.5 ${ssp585} % [${ssp585Lo}\u2013${ssp585Hi}].`,
    morrCritique:
      "Morr et al. (2026), arXiv:2604.20341 (preprint, not peer-reviewed): Ditlevsen fingerprint choice is fragile; alternative specifications push the estimate far later.",
    contextFoot: (doi) =>
      `Fov early-warning: van Westen et al. 2024, DOI ${doi}. Source:`,
    schematicAria:
      "Meridional section of the AMOC: warm surface flow northward, cold deep flow southward",
    nordmeer: "NORDIC SEAS",
    freshwater: "Freshwater",
    surfaceNorth: "Surface \u2192 N",
    nadwSouth: "NADW \u2192 S",
    offState: "Off state",
    schematicH: "H",
    schematicF: "F",
    schematicRapid: (sv) => `RAPID mean ${sv} Sv`,
  },
};
