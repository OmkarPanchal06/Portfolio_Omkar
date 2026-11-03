"use client";

import { useEffect, useRef, useState } from "react";
import { IconMail } from "@/components/icons";

export default function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2200);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="group inline-flex items-center gap-2.5 border-2 border-line bg-panel/60 px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted transition-colors hover:border-signal hover:text-fg"
    >
      <IconMail className="h-4 w-4 text-signal" />
      <span className="hidden sm:inline">{email}</span>
      <span className="sm:hidden">Email</span>
      <span
        className={
          state === "copied"
            ? "text-signal"
            : state === "failed"
              ? "text-rose"
              : "text-dim transition-colors group-hover:text-signal"
        }
      >
        {state === "copied" ? "✓ Copied" : state === "failed" ? "Select it manually" : "Copy"}
      </span>
    </button>
  );
}
