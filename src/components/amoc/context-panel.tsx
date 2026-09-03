import {
  AR6_WEAKENING_SSP126_PCT,
  AR6_WEAKENING_SSP585_PCT,
  CHAVENT_2026_WEAKENING_BY,
  DITLEVSEN_CENTRAL,
  DITLEVSEN_CORRECTION_DOI,
  DITLEVSEN_RANGE,
  IPCC_AR6_CITATION,
  IPCC_AR6_CONFIDENCE_STATEMENT,
  MORR_2026_CRITIQUE,
  PACKAGE_REPO,
  VAN_WESTEN_DOI,
} from "@/lib/amoc/constants";

export function ContextPanel() {
  return (
    <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        Kontext, keine Vorhersage dieser Sandbox
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article>
          <h3 className="font-serif text-base font-medium">
            Ditlevsen {DITLEVSEN_CENTRAL}
          </h3>
          <p className="mt-1 font-mono text-sm tabular-nums text-warn">
            {DITLEVSEN_CENTRAL} [{DITLEVSEN_RANGE[0]}–{DITLEVSEN_RANGE[1]}]
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Korrigierte Kippjahr-Schätzung (Author Correction 2025, DOI{" "}
            {DITLEVSEN_CORRECTION_DOI}). Einzelstudie, statistisch, nicht der
            IPCC-Konsens — und nicht das Ergebnis der UTAC-ODE hier. Chavent et
            al. (2026): 50 % Schwächung bis {CHAVENT_2026_WEAKENING_BY}.
          </p>
        </article>
        <article>
          <h3 className="font-serif text-base font-medium">IPCC AR6</h3>
          <p className="mt-1 text-sm text-foam">
            {IPCC_AR6_CONFIDENCE_STATEMENT}.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {IPCC_AR6_CITATION}. „Medium confidence“ ist keine
            Wahrscheinlichkeitszahl. Kollaps vor 2100 ist nicht explizit
            ausgeschlossen. Schwächung bis 2100: SSP1-2.6 {AR6_WEAKENING_SSP126_PCT[0]}{" "}
            % [{AR6_WEAKENING_SSP126_PCT[1]}–{AR6_WEAKENING_SSP126_PCT[2]}],
            SSP5-8.5 {AR6_WEAKENING_SSP585_PCT[0]} % [
            {AR6_WEAKENING_SSP585_PCT[1]}–{AR6_WEAKENING_SSP585_PCT[2]}].
          </p>
        </article>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        {MORR_2026_CRITIQUE} Fov-Frühwarnung: van Westen et al. 2024, DOI{" "}
        {VAN_WESTEN_DOI}. Quelle:{" "}
        <a
          href={PACKAGE_REPO}
          className="text-foam underline decoration-foam/30 underline-offset-2 hover:decoration-foam"
          target="_blank"
          rel="noreferrer"
        >
          GenesisAeon/amoc-utac
        </a>
        .
      </p>
    </section>
  );
}
