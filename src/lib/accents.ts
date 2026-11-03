export type AccentKey = "signal" | "amber" | "violet" | "rose";

/** Class + hex pairs — hex drives the canvas mesh and inline blur blobs. */
export const ACCENTS: Record<
  AccentKey,
  { text: string; border: string; bg: string; hex: string; shadow: string }
> = {
  signal: {
    text: "text-signal",
    border: "border-signal/50",
    bg: "bg-signal/10",
    hex: "#c6ff00",
    shadow: "brutal",
  },
  amber: {
    text: "text-amber",
    border: "border-amber/50",
    bg: "bg-amber/10",
    hex: "#ff6b1a",
    shadow: "brutal--orange",
  },
  violet: {
    text: "text-violet",
    border: "border-violet/50",
    bg: "bg-violet/10",
    hex: "#ff2e97",
    shadow: "brutal--magenta",
  },
  rose: {
    text: "text-rose",
    border: "border-rose/50",
    bg: "bg-rose/10",
    hex: "#00e5ff",
    shadow: "brutal--cyan",
  },
};
