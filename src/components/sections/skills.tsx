import Reveal from "@/components/reveal";
import SectionHead from "@/components/section-head";
import { skillGroups } from "@/data/skills";

function Level({ level = 0 }: { level?: number }) {
  return (
    <span className="flex items-center gap-[3px]">
      {/* aria-label on a bare <span> is ignored by screen readers — use real text */}
      <span className="sr-only">Confidence {level} out of 5</span>
      <span aria-hidden="true" className="flex items-center gap-[3px]">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={n <= level ? "h-[5px] w-3.5 bg-signal" : "h-[5px] w-3.5 bg-line"}
          />
        ))}
      </span>
    </span>
  );
}

export default function Skills() {
  return (
    <section id="stack" className="relative border-y-2 border-line bg-ink/40">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHead
          index="03"
          kicker="Stack"
          title={
            <>
              What&rsquo;s in
              <br />
              <span className="text-gradient">the toolbox.</span>
            </>
          }
          description="Honest confidence levels rather than inflated percentages — five bars means I have shipped production work with it, three means I am comfortable but still learning."
        />

        <div className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g, i) => (
            <Reveal key={g.id} delay={i * 60} className="h-full">
              <div className="h-full border-2 border-line bg-base/70 p-6 brutal">
                <div className="flex items-baseline justify-between gap-3 border-b-2 border-line pb-3">
                  <h3 className="font-display text-base font-bold uppercase tracking-tight text-fg">
                    {g.label}
                  </h3>
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-signal">
                    {g.note}
                  </span>
                </div>

                <ul className="mt-4 space-y-3">
                  {g.items.map((it) => (
                    <li key={it.name} className="flex items-center justify-between gap-4">
                      <span className="text-[0.9rem] text-muted">{it.name}</span>
                      <Level level={it.level} />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
