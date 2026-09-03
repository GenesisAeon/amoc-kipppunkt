import { GAMMA_AMOC, K, UTAC_R, UTAC_SIGMA } from "@/lib/amoc/constants";
import type { ModelId } from "@/lib/amoc/physics";
import { fmtDe, pct } from "@/lib/utils";

type Props = {
  H: number;
  hStar: number;
  dHdt: number;
  gamma: number;
  eta: number;
  R: number;
  model: ModelId;
};

function Stat({
  label,
  value,
  unit,
  hint,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-mono text-xl tabular-nums leading-none sm:text-2xl">
        {value}
        {unit ? (
          <span className="ml-1 text-xs text-muted-foreground">{unit}</span>
        ) : null}
      </p>
      {hint ? (
        <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function tendency(dHdt: number): string {
  if (dHdt < -0.05) return "schwächt";
  if (dHdt > 0.05) return "erholt sich";
  return "nahe Gleichgewicht";
}

export function StatePanel({
  H,
  hStar,
  dHdt,
  gamma,
  eta,
  R,
  model,
}: Props) {
  const frac = H / K;
  const starPct = Math.min(100, Math.max(0, (hStar / K) * 100));
  return (
    <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-serif text-lg font-medium tracking-tight">Zustand</h2>
        <p className="font-mono text-xs tabular-nums text-muted-foreground">
          H/K = {fmtDe(frac * 100, 0)} % · {tendency(dHdt)}
        </p>
      </div>

      <div
        className="relative mt-4 h-2 overflow-hidden rounded-full bg-secondary"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200 ease-out"
          style={{ width: pct(frac * 100) }}
        />
        {model === "utac" ? (
          <div
            className="absolute top-0 h-full w-px bg-foam"
            style={{ left: pct(starPct) }}
          />
        ) : null}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {model === "utac"
          ? `Balken H · Marke H* = ${fmtDe(hStar, 1)} Sv`
          : "Balken H · Falten-Äste im Hysterese-Diagramm"}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
        <Stat label="H" value={fmtDe(H, 2)} unit="Sv" hint="AMOC-Stärke" />
        <Stat
          label="H*"
          value={fmtDe(hStar, 2)}
          unit="Sv"
          hint={model === "fold" ? "UTAC-Vergleich" : "UTAC-Sollwert"}
        />
        <Stat
          label="dH/dt"
          value={`${dHdt > 0 ? "+" : ""}${fmtDe(dHdt, 3)}`}
          unit="Sv/a"
          hint="Tendenz"
        />
        <Stat
          label="Γ"
          value={fmtDe(gamma, 3)}
          hint={`Γ_AMOC = ${fmtDe(GAMMA_AMOC, 3)}`}
        />
        <Stat label="η = tanh(σΓ)" value={fmtDe(eta, 3)} hint="50 % bei 0,50" />
        <Stat label="R (CREP)" value={fmtDe(R, 3)} hint="Fov-Resonanz" />
      </div>

      <div className="mt-5 rounded-md bg-muted px-3 py-3 font-serif text-sm leading-relaxed text-foam">
        <p>
          H<sup>*</sup> = K · tanh(σ · Γ)
        </p>
        <p className="mt-1">
          dH/dt = r · H · (H<sup>*</sup>/K − H/K)
        </p>
        <p className="mt-2 font-sans text-xs text-muted-foreground">
          K = {fmtDe(K, 0)} Sv · σ = {fmtDe(UTAC_SIGMA, 1)} · r = {fmtDe(UTAC_R, 2)}{" "}
          a⁻¹ · Γ_AMOC = arctanh(0,50)/2,2
        </p>
      </div>
    </section>
  );
}
