"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { profile } from "@/data/profile";

const LINKS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "path", label: "Path" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((s) => io.observe(s));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300",
        scrolled
          ? "border-b-2 border-signal/60 bg-base/90 backdrop-blur-xl"
          : "border-b-2 border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          className="group flex items-center gap-3 font-display text-sm font-semibold tracking-tight"
          aria-label="Back to top"
        >
          <span className="grid h-7 w-7 place-items-center border-2 border-signal bg-signal font-mono text-[11px] font-bold text-[#08080a] transition-colors group-hover:bg-transparent group-hover:text-signal">
            {profile.initials}
          </span>
          <span className="hidden text-fg sm:inline">{profile.name}</span>
        </a>

        {/* desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={cn(
                  "relative block px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors",
                  active === l.id ? "text-signal" : "text-muted hover:text-fg",
                )}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-0.5 origin-left bg-signal transition-transform duration-300",
                    active === l.id ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={profile.links.resume}
            download
            className="hidden border-2 border-signal px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-signal transition-colors hover:bg-signal hover:text-[#08080a] sm:inline-block"
          >
            Résumé ↓
          </a>

          {/* mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle navigation"
            className="grid h-8 w-8 place-items-center border-2 border-line text-muted md:hidden"
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1">
              <span
                className={cn(
                  "block h-px w-4 bg-current transition-transform",
                  open && "translate-y-[3px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-px w-4 bg-current transition-transform",
                  open && "-translate-y-[3px] -rotate-45",
                )}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* mobile sheet */}
      <div
        className={cn(
          "overflow-hidden border-t-2 border-line bg-base/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 md:hidden",
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <ul className="px-5 py-3">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "block border-b border-line-soft py-3 font-mono text-[11px] uppercase tracking-[0.18em] last:border-b-0",
                  active === l.id ? "text-signal" : "text-muted",
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
