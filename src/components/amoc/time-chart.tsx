import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AMOC_RAPID_MEAN_SV,
  AMOC_RAPID_STD_SV,
  DITLEVSEN_CENTRAL,
  DITLEVSEN_RANGE,
  K,
  START_YEAR,
} from "@/lib/amoc/constants";
import type { Sample } from "@/lib/amoc/physics";
import { fmtDe } from "@/lib/utils";

type Props = {
  history: Sample[];
  year: number;
};

const RAPID_HI = AMOC_RAPID_MEAN_SV + AMOC_RAPID_STD_SV;
const RAPID_LO = AMOC_RAPID_MEAN_SV - AMOC_RAPID_STD_SV;
const HALF = 0.5 * K;

export function TimeChart({ history, year }: Props) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const data = useMemo(() => {
    if (history.length === 0) {
      return [
        {
          year: START_YEAR,
          H: AMOC_RAPID_MEAN_SV,
          hStar: HALF,
        },
      ];
    }
    return history.map((s) => ({
      year: s.year,
      H: s.H,
      hStar: s.hStar,
    }));
  }, [history]);

  const xMax = Math.max(2110, Math.ceil(year + 2));

  if (!ready) {
    return <div className="h-56 w-full sm:h-64" />;
  }

  return (
    <div className="h-56 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            stroke="var(--color-border)"
            strokeDasharray="2 6"
            vertical={false}
          />
          <XAxis
            dataKey="year"
            type="number"
            domain={[START_YEAR, xMax]}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            tickFormatter={(v) => String(Math.round(v))}
            axisLine={{ stroke: "var(--color-border)" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 22]}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-popover)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={(v) => `Jahr ${Math.round(Number(v))}`}
            formatter={(value, name) => {
              const n = typeof value === "number" ? value : Number(value);
              const label = name === "H" ? "H" : "H*";
              return [`${fmtDe(n, 2)} Sv`, label];
            }}
          />
          <ReferenceArea
            y1={RAPID_LO}
            y2={RAPID_HI}
            fill="var(--color-rapid)"
            fillOpacity={0.1}
            ifOverflow="hidden"
          />
          <ReferenceArea
            x1={DITLEVSEN_RANGE[0]}
            x2={DITLEVSEN_RANGE[1]}
            fill="var(--color-warn)"
            fillOpacity={0.07}
            ifOverflow="hidden"
          />
          <ReferenceLine
            y={HALF}
            stroke="var(--color-foam)"
            strokeDasharray="4 4"
            strokeOpacity={0.45}
          />
          <ReferenceLine
            x={DITLEVSEN_CENTRAL}
            stroke="var(--color-warn)"
            strokeDasharray="3 3"
            strokeOpacity={0.7}
          />
          <ReferenceLine
            x={2100}
            stroke="var(--color-muted-foreground)"
            strokeDasharray="2 4"
            strokeOpacity={0.4}
          />
          <Line
            type="monotone"
            dataKey="hStar"
            stroke="var(--color-foam)"
            strokeWidth={1.25}
            strokeDasharray="5 4"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="H"
            stroke="var(--color-primary)"
            strokeWidth={2.25}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
