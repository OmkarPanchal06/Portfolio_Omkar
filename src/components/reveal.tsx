"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** ms before the transition starts */
  delay?: number;
  as?: ElementType;
};

/**
 * IntersectionObserver-driven entrance. Animates only opacity + transform.
 *
 * `seen` must evaluate to the SAME value on server and client, otherwise the
 * className mismatches at hydration. The server has no IntersectionObserver, so
 * the fallback lives in the effect (a direct classList mutation), never in the
 * render path.
 *
 * threshold is 0 so a tall element can never fail to trigger — any element
 * larger than the viewport would never satisfy a percentage threshold.
 */
export default function Reveal({ children, className, delay = 0, as }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", seen && "is-in", className)}
    >
      {children}
    </Tag>
  );
}
