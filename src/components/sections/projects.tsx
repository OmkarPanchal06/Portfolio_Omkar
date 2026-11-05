import Reveal from "@/components/reveal";
import SectionHead from "@/components/section-head";
import { IconExternal, IconGithub, IconArrow } from "@/components/icons";
import { projects, type Project } from "@/data/projects";
import { ACCENTS, type AccentKey } from "@/lib/accents";
import { profile } from "@/data/profile";

const accentOf = (p: Project) => ACCENTS[p.accent as AccentKey];

function StackRow({ p }: { p: Project }) {
  const a = accentOf(p);
  return (
    <ul className="flex flex-wrap gap-1.5">
      {p.stack.map((s) => (
        <li
          key={s}
          className={`border ${a.border} ${a.bg} px-2 py-1 font-mono text-[10px] font-bold tracking-wide ${a.text}`}
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

function RepoLink({ p }: { p: Project }) {
  const a = accentOf(p);
  if (!p.repo) return null;
  return (
    <a
      href={p.repo}
      target="_blank"
      rel="noreferrer noopener"
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] ${a.text} transition-opacity hover:opacity-70`}
    >
      <IconGithub className="h-3.5 w-3.5" />
      Source
      <IconExternal className="h-3 w-3" />
    </a>
  );
}

function DemoLink({ p }: { p: Project }) {
  const a = accentOf(p);
  if (!p.demo) return null;
  return (
    <a
      href={p.demo}
      target="_blank"
      rel="noreferrer noopener"
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] ${a.text} transition-opacity hover:opacity-70`}
    >
      <IconExternal className="h-3.5 w-3.5" />
      Demo
    </a>
  );
}

function FeaturedCard({ p }: { p: Project }) {
  const a = accentOf(p);
  return (
    <Reveal className="relative">
      <article className="group relative overflow-hidden border-2 border-signal bg-gradient-to-br from-ink via-base to-base p-6 brutal brutal--magenta sm:p-8 lg:p-10">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-55"
          style={{ backgroundColor: a.hex }}
          aria-hidden="true"
        />

        <div className="relative flex flex-wrap items-center gap-3">
          <span className="border-2 border-[#08080a] bg-signal px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#08080a]">
            Flagship
          </span>
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-dim">
            {p.index} · {p.kind} · {p.year}
          </span>
        </div>

        <div className="relative mt-6 grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <h3 className="font-display text-[clamp(1.6rem,4vw,2.6rem)] font-bold uppercase leading-[0.95] tracking-tighter text-fg">
              {p.name}
            </h3>
            <p className={`mt-3 font-mono text-xs font-bold ${a.text}`}>{p.tagline}</p>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-muted">{p.body}</p>

            <div className="mt-6">
              <StackRow p={p} />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-5">
              <RepoLink p={p} />
              <DemoLink p={p} />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
                Infotsav&rsquo;25 · ABV-IIITM Gwalior · 4 contributors
              </span>
            </div>
          </div>

          <ul className="grid grid-cols-2 self-start border-2 border-line bg-base/70">
            {p.metrics.map((m, i) => (
              <li
                key={m.label}
                className={`p-4 ${i % 2 === 1 ? "border-l-2 border-line" : ""} ${
                  i >= 2 ? "border-t-2 border-line" : ""
                }`}
              >
                <span className={`block font-display text-xl font-bold ${a.text}`}>{m.value}</span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-dim">
                  {m.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  );
}

function ProjectCard({ p, delay }: { p: Project; delay: number }) {
  const a = accentOf(p);
  return (
    <Reveal delay={delay} className="h-full">
      <article
        className={`group flex h-full flex-col border-2 border-line bg-panel/60 p-6 brutal ${a.shadow}`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`font-display text-[2rem] font-bold leading-none tracking-tighter ${a.text}`}
          >
            {p.index}
          </span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-dim">
            {p.year}
          </span>
        </div>

        <h3 className="mt-4 font-display text-lg font-bold uppercase leading-tight tracking-tight text-fg transition-colors group-hover:text-signal">
          {p.name}
        </h3>
        <p className="mt-2 font-mono text-[11px] leading-relaxed text-dim">{p.tagline}</p>

        <p className="mt-4 line-clamp-4 flex-1 text-[0.9rem] leading-relaxed text-muted">
          {p.body}
        </p>

        <ul className="mt-5 grid grid-cols-2 gap-y-3 border-t-2 border-line pt-4">
          {p.metrics.slice(0, 2).map((m) => (
            <li key={m.label}>
              <span className={`block font-display text-base font-bold ${a.text}`}>{m.value}</span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-dim">
                {m.label}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5">
          <StackRow p={p} />
        </div>

        <div className="mt-6 flex items-center justify-between border-t-2 border-line pt-4">
          <RepoLink p={p} />
          <DemoLink p={p} />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
            {p.kind}
          </span>
        </div>
      </article>
    </Reveal>
  );
}

function MoreReposCard() {
  return (
    <Reveal delay={450} className="h-full">
      <a
        href={profile.links.github}
        target="_blank"
        rel="noreferrer noopener"
        className="group flex h-full flex-col justify-between border-2 border-dashed border-line bg-panel/30 p-6 brutal"
      >
        <div>
          <span className="font-display text-[2rem] font-bold leading-none tracking-tighter text-dim">
            38
          </span>
          <h3 className="mt-4 font-display text-lg font-bold uppercase leading-tight tracking-tight text-fg transition-colors group-hover:text-signal">
            The rest of the repos
          </h3>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">
            Forks, experiments, hackathon sprints, SQL and Python drills. Everything else I have
            pushed lives over on GitHub.
          </p>
        </div>

        <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-signal">
          Browse all 38
          <IconArrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </a>
    </Reveal>
  );
}

export default function Projects() {
  const [flagship, ...rest] = projects;

  return (
    <section id="work" className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHead
        index="02"
        kicker="Selected work"
        title={
          <>
            Six projects,
            <br />
            <span className="text-gradient">no filler.</span>
          </>
        }
        description="Chosen to show range on purpose: edge hardware, cloud pipelines, explainable models, and the interfaces people actually use. Everything below links to source."
      />

      <div className="mt-12 space-y-6 sm:mt-16">
        <FeaturedCard p={flagship} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <ProjectCard key={p.id} p={p} delay={i * 70} />
          ))}
          <MoreReposCard />
        </div>
      </div>
    </section>
  );
}
