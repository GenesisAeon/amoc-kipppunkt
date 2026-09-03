import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Deterministic de-DE grouping so SSR and the client never disagree. */
export function fmtDe(value: number, digits = 2): string {
  const neg = value < 0 || Object.is(value, -0);
  const abs = Math.abs(value);
  const [intPart, fracPart] = abs.toFixed(digits).split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const body = digits > 0 ? `${grouped},${fracPart}` : grouped;
  return neg ? `-${body}` : body;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function pct(value: number): string {
  return `${clamp(value, 0, 100).toFixed(2)}%`;
}
