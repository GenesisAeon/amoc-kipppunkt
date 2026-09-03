import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { F_MAX, F_MIN, FOV_REF, K } from "@/lib/amoc/constants";
import { foldBranch, utacBranch, type ModelId } from "@/lib/amoc/physics";
import type { PhasePoint } from "@/lib/amoc/store";
import { fmtDe } from "@/lib/utils";

type Props = {
  model: ModelId;
  phase: PhasePoint[];
  F: number;
  H: number;
};

export function HysteresisChart({ model, phase, F, H }: Props) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const fold = useMemo(() => foldBranch(), []);
  const foldOn = useMemo(
    () =>
      fold
        .filter((p) => p.stable && p.H > 0.5 * K)
        .map((p) => ({ F: p.F, H: p.H })),
    [fold],
  );
  const foldOff = useMemo(
    () =>
      fold
        .filter((p) => p.stable && p.H <= 0.5 * K)
        .map((p) => ({ F: p.F, H: p.H })),
    [fold],
  );
  const foldUnstable = useMemo(
    () => fold.filter((p) => !p.stable).map((p) => ({ F: p.F, H: p.H })),
    [fold],
  );
  const utac = useMemo(
    () => utacBranch(F_MIN, F_MAX).map((p) => ({ F: p.F, H: p.H })),
    [],
  );
  const fwd = useMemo(
    () => phase.filter((p) => p.dir === "fwd").map((p) => ({ F: p.F, H: p.H })),
    [phase],
  );
  const rev = useMemo(
    () => phase.filter((p) => p.dir === "rev").map((p) => ({ F: p.F, H: p.H })),
    [phase],
  );

  if (!ready) {
    return <div className="h-52 w-full sm:h-56" />;
  }

  return (
    <div className="h-52 w-full sm:h-56">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid
            stroke="var(--color-border)"
            strokeDasharray="2 6"
            vertical={false}
          />
          <XAxis
            type="number"
            dataKey="F"
            domain={[F_MIN, F_MAX]}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            tickFormatter={(v) => fmtDe(Number(v), 2)}
            axisLine={{ stroke: "var(--color-border)" }}
            tickLine={false}
          />
          <YAxis
            type="number"
            dataKey="H"
            domain={[0, 22]}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            cursor={{ stroke: "var(--color-border)" }}
            contentStyle={{
              background: "var(--color-popover)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value, name) => {
              const n = typeof value === "number" ? value : Number(value);
              if (name === "F") return [`${fmtDe(n, 3)} Sv`, "F"];
              return [`${fmtDe(n, 2)} Sv`, String(name)];
            }}
          />
          <ReferenceLine
            x={0}
            stroke="var(--color-muted-foreground)"
            strokeOpacity={0.35}
          />
          <ReferenceLine
            x={FOV_REF}
            stroke="var(--color-warn)"
            strokeDasharray="3 3"
            strokeOpacity={0.55}
          />
          <ReferenceLine
            x={-FOV_REF}
            stroke="var(--color-rapid)"
            strokeDasharray="3 3"
            strokeOpacity={0.45}
          />
          <Line
            name="An"
            data={foldOn}
            dataKey="H"
            stroke="var(--color-primary)"
            strokeWidth={model === "fold" ? 1.8 : 1}
            strokeOpacity={model === "fold" ? 0.9 : 0.28}
            dot={false}
            isAnimationActive={false}
            type="linear"
          />
          <Line
            name="Aus"
            data={foldOff}
            dataKey="H"
            stroke="var(--color-warn)"
            strokeWidth={model === "fold" ? 1.8 : 1}
            strokeOpacity={model === "fold" ? 0.9 : 0.28}
            dot={false}
            isAnimationActive={false}
            type="linear"
          />
          <Line
            name="instabil"
            data={foldUnstable}
            dataKey="H"
            stroke="var(--color-muted-foreground)"
            strokeDasharray="4 4"
            strokeWidth={1}
            strokeOpacity={0.45}
            dot={false}
            isAnimationActive={false}
            type="linear"
          />
          <Line
            name="H* UTAC"
            data={utac}
            dataKey="H"
            stroke="var(--color-foam)"
            strokeDasharray="5 4"
            strokeWidth={model === "utac" ? 1.8 : 1}
            strokeOpacity={model === "utac" ? 0.95 : 0.3}
            dot={false}
            isAnimationActive={false}
            type="linear"
          />
          {fwd.length > 1 ? (
            <Line
              name="vorwärts"
              data={fwd}
              dataKey="H"
              stroke="var(--color-primary)"
              strokeWidth={1.4}
              strokeOpacity={0.7}
              dot={false}
              isAnimationActive={false}
              type="linear"
            />
          ) : null}
          {rev.length > 1 ? (
            <Line
              name="rückwärts"
              data={rev}
              dataKey="H"
              stroke="var(--color-warn)"
              strokeWidth={1.4}
              strokeOpacity={0.7}
              dot={false}
              isAnimationActive={false}
              type="linear"
            />
          ) : null}
          <Scatter
            name="jetzt"
            data={[{ F, H }]}
            dataKey="H"
            fill="var(--color-foam)"
            r={5}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
