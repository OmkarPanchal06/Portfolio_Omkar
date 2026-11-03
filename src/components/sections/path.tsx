import Reveal from "@/components/reveal";
import SectionHead from "@/components/section-head";
import { profile } from "@/data/profile";

const KIND_ACCENT: Record<string, string> = {
  experience: "bg-signal",
  education: "bg-violet",
};

export default function Path() {
  return (
    <section id="path" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead
        index="04"
        kicker="Path"
        title={
          <>
            Classroom
            <br />
            <span className="text-gradient">to live dashboards.</span>
          </>
        }
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] sm:mt-16">
        {/* --- timeline --- */}
        <ol className="relative border-l-2 border-line pl-7 sm:pl-9">
          {profile.experience.map((e, i) => (
            <Reveal key={e.role + e.from} delay={i * 90} as="li" className="relative pb-9 last:pb-0">
              <span
                className={`absolute -left-[calc(1.75rem+5px)] top-2 h-[10px] w-[10px] ring-4 ring-base sm:-left-[calc(2.25rem+5px)] ${
                  KIND_ACCENT[e.kind] ?? "bg-signal"
                }`}
                aria-hidden="true"
              />

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-signal">
                  {e.from} — {e.to}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                  {e.mode}
                </span>
              </div>

              <h3 className="mt-2 font-display text-lg font-bold uppercase tracking-tight text-fg sm:text-xl">
                {e.role}
              </h3>
              <p className="mt-0.5 text-sm text-muted">{e.org}</p>

              <ul className="mt-3 space-y-1.5">
                {e.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-[0.9rem] leading-relaxed text-muted">
                    <span className="mt-[0.6em] h-0.5 w-3.5 shrink-0 bg-signal" aria-hidden="true" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>

        {/* --- side column --- */}
        <div className="space-y-6">
          <Reveal>
            <div className="border-2 border-line bg-panel/60 p-6 brutal">
              <h3 className="eyebrow rule-dot">Recognition</h3>
              <ul className="mt-5 space-y-4">
                {profile.achievements.map((a) => (
                  <li
                    key={a.title}
                    className="border-b-2 border-line-soft pb-4 last:border-b-0 last:pb-0"
                  >
                    <p className="font-display text-[0.98rem] font-bold uppercase leading-snug tracking-tight text-fg">
                      {a.title}
                    </p>
                    <p className="mt-1 text-[0.85rem] leading-relaxed text-muted">{a.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="border-2 border-line bg-panel/60 p-6 brutal brutal--magenta">
              <h3 className="eyebrow rule-dot">Certifications</h3>
              <ul className="mt-5 space-y-3">
                {profile.certifications.map((c) => (
                  <li key={c.name} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 bg-violet"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-[0.95rem] font-medium leading-snug text-fg">{c.name}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                        {c.org}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
