"use cache";

import { profile } from "@/data/profile";
import { IconArrow } from "@/components/icons";

export default async function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-signal bg-base">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-9 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="space-y-1.5">
          <p className="font-display text-xl font-bold uppercase tracking-tight text-fg">
            {profile.name}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
            {profile.email} · {profile.location}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {[
            { href: profile.links.github, label: "GitHub" },
            { href: profile.links.linkedin, label: "LinkedIn" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer noopener"
              className="border-b-2 border-line pb-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted transition-colors hover:border-signal hover:text-signal"
            >
              {l.label}
            </a>
          ))}
          <a
            href={profile.links.resume}
            download
            className="border-b-2 border-line pb-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted transition-colors hover:border-signal hover:text-signal"
          >
            Résumé
          </a>
          <a
            href="#top"
            className="group inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-signal"
          >
            Back to top
            <IconArrow className="h-3 w-3 -rotate-90 transition-transform group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      <div className="border-t-2 border-line">
        <p className="mx-auto max-w-6xl px-5 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-dim sm:px-8">
          © {year} {profile.name} · Built with Next.js 16, Tailwind v4 and one canvas
        </p>
      </div>
    </footer>
  );
}
