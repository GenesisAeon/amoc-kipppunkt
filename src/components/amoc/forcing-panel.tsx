import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { F_MAX, F_MIN, FOV_ALPHA, FOV_REF } from "@/lib/amoc/constants";
import { FOV_PRESENT } from "@/lib/amoc/physics";
import { fmtDe, pct } from "@/lib/utils";

type Props = {
  F: number;
  fov: number;
  bistable: boolean;
  onChange: (F: number) => void;
  disabled?: boolean;
};

export function ForcingPanel({ F, fov, bistable, onChange, disabled }: Props) {
  const zeroPct = ((0 - F_MIN) / (F_MAX - F_MIN)) * 100;
  const refPct = ((FOV_REF - F_MIN) / (F_MAX - F_MIN)) * 100;

  return (
    <section className="rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="font-serif text-lg font-medium tracking-tight">
            Süßwasser-Einspeisung
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Extra-Hosing F, addiert auf Fov<sub>heute</sub> = {fmtDe(FOV_PRESENT, 3)}{" "}
            Sv (α · Ψ · ΔS / S<sub>0</sub>, α = {fmtDe(FOV_ALPHA, 2)}). Skala
            Fov_ref = {fmtDe(FOV_REF, 1)} Sv.
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl tabular-nums leading-none tracking-tight text-foam">
            {F >= 0 ? "+" : ""}
            {fmtDe(F, 3)}
            <span className="ml-1 text-sm text-muted-foreground">Sv</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">F relativ zu heute</p>
        </div>
      </div>

      <div className="relative mt-4 px-1">
        <div
          className="pointer-events-none absolute top-4 h-2 w-px bg-foam/70"
          style={{ left: pct(zeroPct) }}
        />
        <div
          className="pointer-events-none absolute top-4 h-2 w-px bg-warn/80"
          style={{ left: pct(refPct) }}
        />
        <Slider
          min={F_MIN}
          max={F_MAX}
          step={0.002}
          value={[F]}
          disabled={disabled}
          onValueChange={(v) => onChange(v[0] ?? 0)}
          aria-label="Süßwasser-Einspeisung F in Sverdrup"
        />
        <div className="mt-1 flex justify-between font-mono text-xs text-muted-foreground">
          <span>{fmtDe(F_MIN, 2)}</span>
          <span>heute</span>
          <span>Fov_ref {fmtDe(FOV_REF, 1)}</span>
          <span>+{fmtDe(F_MAX, 2)}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant={bistable ? "on" : "off"}>
          {bistable
            ? "Fov < 0 · bistabil (van Westen 2024)"
            : "Fov ≥ 0 · außerhalb des bistabilen Fensters"}
        </Badge>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          Fov_eff {fmtDe(fov, 3)} Sv
        </span>
      </div>
    </section>
  );
}
