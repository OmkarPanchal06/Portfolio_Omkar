import Reveal from "@/components/reveal";
import SectionHead from "@/components/section-head";
import { profile } from "@/data/profile";
import { ACCENTS, type AccentKey } from "@/lib/accents";

export default function Pillars() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead
        index="01"
        kicker="What I do"
        title={
          <>
            Hardware, data,
            <br />
            <span className="text-gradient">and product.</span>
          </>
        }
        description="Most people pick one layer and go deep. I chose the IoT specialisation precisely because it forces you to understand all three: the sensor has to be trustworthy, the pipeline has to survive real telemetry, and someone has to actually read the dashboard."
      />

      <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-3">
        {profile.pillars.map((p, i) => {
          const accent = ACCENTS[p.accent as AccentKey];
          return (
            <Reveal key={p.id} delay={i * 90} className="h-full">
              <article
                className={`group flex h-full flex-col border-2 border-line bg-panel/60 p-6 brutal ${accent.shadow} sm:p-7`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`font-display text-[2.5rem] font-bold leading-none tracking-tighter ${accent.text}`}
                  >
                    {p.index}
                  </span>
                  <span className="mt-1 h-2.5 w-2.5 bg-signal led" aria-hidden="true" />
                </div>

                <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-tight text-fg">
                  {p.title}
                </h3>

                <p className="mt-3 flex-1 text-[0.94rem] leading-relaxed text-muted">{p.body}</p>

                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <li
                      key={s}
                      className={`border ${accent.border} ${accent.bg} px-2 py-1 font-mono text-[10px] font-bold tracking-wide ${accent.text}`}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
