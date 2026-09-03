import { AMOC_RAPID_MEAN_SV, K } from "@/lib/amoc/constants";
import { cn, fmtDe } from "@/lib/utils";

type Props = {
  H: number;
  F: number;
  className?: string;
};

export function AtlanticSchematic({ H, F, className }: Props) {
  const strength = Math.min(1, Math.max(0, H / K));
  const collapsed = strength < 0.12;
  const weak = strength < 0.5;
  const surfaceW = 1.4 + 8.2 * strength;
  const deepW = 1 + 5.2 * strength;
  const surfaceOp = 0.22 + 0.78 * strength;
  const melt = Math.max(0, Math.min(1, F / 0.2));
  const stroke = weak ? "var(--color-warn)" : "var(--color-foam)";

  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-deep", className)}>
      <svg
        viewBox="0 0 440 300"
        className="h-full w-full"
        role="img"
        aria-label="Meridionaler Schnitt der AMOC: warmer Oberflächenstrom nach Norden, kalter Tiefenstrom nach Süden"
      >
        <defs>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.18" />
            <stop offset="42%" stopColor="var(--color-deep)" />
            <stop offset="100%" stopColor="var(--color-background)" />
          </linearGradient>
          <linearGradient id="warm" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor={stroke} />
          </linearGradient>
        </defs>

        <rect width="440" height="300" fill="url(#water)" />

        <text
          x="28"
          y="28"
          fill="var(--color-muted-foreground)"
          fontSize="10"
          fontFamily="var(--font-sans)"
          letterSpacing="0.16em"
        >
          34°S
        </text>
        <text
          x="412"
          y="28"
          textAnchor="end"
          fill="var(--color-muted-foreground)"
          fontSize="10"
          fontFamily="var(--font-sans)"
          letterSpacing="0.16em"
        >
          NORDMEER
        </text>

        {melt > 0.04 ? (
          <g opacity={0.35 + melt * 0.55} fill="var(--color-foam)">
            <circle cx="348" cy="36" r={2.2 + melt * 2.4} />
            <circle cx="362" cy="44" r={1.6 + melt * 1.8} />
            <circle cx="376" cy="34" r={1.4 + melt * 2} />
            <circle cx="388" cy="48" r={1.2 + melt * 1.6} />
            <text
              x="412"
              y="62"
              textAnchor="end"
              fill="var(--color-foam)"
              fontSize="9"
              fontFamily="var(--font-sans)"
            >
              Süßwasser
            </text>
          </g>
        ) : null}

        <path
          d="M48 92 C 140 68, 250 66, 360 88"
          fill="none"
          stroke="url(#warm)"
          strokeWidth={surfaceW}
          strokeLinecap="round"
          opacity={surfaceOp}
          strokeDasharray="12 9"
          className="flow-surface"
        />
        <path
          d="M360 88 C 378 96, 386 118, 378 148"
          fill="none"
          stroke={stroke}
          strokeWidth={surfaceW * 0.72}
          strokeLinecap="round"
          opacity={surfaceOp * 0.85}
          strokeDasharray="8 8"
          className="flow-surface"
        />
        <path
          d="M378 148 C 360 196, 250 228, 86 216"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={deepW}
          strokeLinecap="round"
          opacity={surfaceOp * 0.55}
          strokeDasharray="7 11"
          className="flow-deep"
        />
        <path
          d="M86 216 C 70 190, 62 140, 48 92"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={deepW * 0.7}
          strokeLinecap="round"
          opacity={surfaceOp * 0.4}
          strokeDasharray="6 10"
          className="flow-deep"
        />

        <line
          x1="248"
          y1="54"
          x2="248"
          y2="248"
          stroke="var(--color-rapid)"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.75"
        />
        <text
          x="252"
          y="68"
          fill="var(--color-rapid)"
          fontSize="9"
          fontFamily="var(--font-mono)"
        >
          RAPID 26°N
        </text>

        <line
          x1="86"
          y1="54"
          x2="86"
          y2="248"
          stroke="var(--color-warn)"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.55"
        />
        <text
          x="90"
          y="248"
          fill="var(--color-warn)"
          fontSize="9"
          fontFamily="var(--font-mono)"
        >
          Fov 34°S
        </text>

        <text
          x="196"
          y="84"
          fill="var(--color-foam)"
          fontSize="10"
          fontFamily="var(--font-sans)"
          opacity={surfaceOp}
        >
          Oberfläche → N
        </text>
        <text
          x="168"
          y="208"
          fill="var(--color-primary)"
          fontSize="10"
          fontFamily="var(--font-sans)"
          opacity={surfaceOp * 0.8}
        >
          NADW → S
        </text>

        {collapsed ? (
          <g>
            <rect
              x="150"
              y="118"
              width="140"
              height="36"
              rx="8"
              fill="var(--color-background)"
              opacity="0.72"
            />
            <text
              x="220"
              y="141"
              textAnchor="middle"
              fill="var(--color-warn)"
              fontSize="12"
              fontFamily="var(--font-sans)"
              fontWeight="500"
            >
              Off-Zustand
            </text>
          </g>
        ) : null}
      </svg>

      <div className="pointer-events-none absolute bottom-8 left-3 right-3 flex items-end justify-between">
        <div className="rounded-md bg-background/70 px-2.5 py-1.5 backdrop-blur-sm">
          <p
            className="font-mono text-xs tabular-nums text-foam"
            aria-live="polite"
          >
            {fmtDe(H, 1)} Sv
          </p>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            AMOC-Stärke
          </p>
        </div>
        <div className="rounded-md bg-background/70 px-2.5 py-1.5 text-right backdrop-blur-sm">
          <p className="font-mono text-xs tabular-nums text-muted-foreground">
            RAPID {fmtDe(AMOC_RAPID_MEAN_SV, 0)} ± 4 Sv
          </p>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            2004–2023
          </p>
        </div>
      </div>
    </div>
  );
}
