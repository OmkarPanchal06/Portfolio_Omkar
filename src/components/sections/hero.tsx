import Reveal from "@/components/reveal";
import SensorNetwork from "@/components/hero/sensor-network";
import Image from "next/image";
import { IconGithub, IconLinkedin, IconArrow } from "@/components/icons";
import { profile } from "@/data/profile";

const LINE_STYLE = ["u-outline", "", "text-gradient"] as const;

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* blueprint backdrop */}
      <div className="bg-grid bg-grid-fade pointer-events-none absolute inset-0 -z-10" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(198,255,0,0.10),transparent_58%)]"
        aria-hidden="true"
      />
      <SensorNetwork />

      {/* left-edge instrument label */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 -rotate-90 font-mono text-[10px] uppercase tracking-[0.5em] text-dim xl:block"
      >
        Signal ▸ live telemetry
      </div>

      {/* Desktop portrait — sits above the mesh, right of the headline */}
      <div className="pointer-events-none absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 lg:block xl:right-12">
        <Image
          src="/images/omkar-profile.png"
          alt="Omkar Panchal – Developer Profile"
          width={256}
          height={256}
          priority
          className="h-64 w-64 rounded-full border-2 border-signal/60 object-cover shadow-[8px_8px_0_var(--color-violet)]"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-32 sm:px-8 sm:pt-36">
        {/* Mobile portrait */}
        <Reveal delay={40} className="mb-8 flex justify-center lg:hidden">
          <Image
            src="/images/omkar-profile.png"
            alt="Omkar Panchal – Developer Profile"
            width={128}
            height={128}
            priority
            className="h-32 w-32 rounded-full border-2 border-signal/60 object-cover shadow-[4px_4px_0_var(--color-violet)]"
          />
        </Reveal>

        <Reveal delay={60}>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 border-2 border-signal bg-signal px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#08080a]">
              <span className="led">●</span>
              Open to 2027 placements
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-dim">
              {profile.location}
            </span>
          </div>
        </Reveal>

        <h1 className="mt-7 font-display text-[clamp(2.6rem,10vw,7.5rem)] font-bold uppercase leading-[0.87] tracking-[-0.035em]">
          {profile.headline.map((line, i) => (
            <Reveal key={line} delay={140 + i * 120} as="span" className="block">
              <span className={LINE_STYLE[i] ?? ""}>{line}</span>
              {/* preserves word boundaries for screen readers & copy-paste */}
              {i < profile.headline.length - 1 ? " " : null}
            </Reveal>
          ))}
        </h1>

        <Reveal delay={540} className="mt-8 max-w-2xl">
          <p className="border-l-4 border-signal pl-4 text-base leading-relaxed text-muted sm:text-lg">
            {profile.lede}
          </p>
        </Reveal>

        <Reveal delay={640} className="mt-9">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 border-2 border-[#08080a] bg-signal px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#08080a] shadow-[6px_6px_0_var(--color-violet)] transition-transform duration-150 hover:-translate-x-1 hover:-translate-y-1"
            >
              View selected work
              <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 border-2 border-line px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted transition-colors hover:border-signal hover:text-signal"
            >
              Get in touch
            </a>

            <div className="flex items-center gap-2">
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                className="grid h-[52px] w-[52px] place-items-center border-2 border-line text-muted transition-colors hover:border-signal hover:bg-signal hover:text-[#08080a]"
              >
                <IconGithub className="h-4.5 w-4.5" />
              </a>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                className="grid h-[52px] w-[52px] place-items-center border-2 border-line text-muted transition-colors hover:border-violet hover:bg-violet hover:text-[#08080a]"
              >
                <IconLinkedin className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>
        </Reveal>

        {/* telemetry readout */}
        <Reveal delay={760} className="mt-12 max-w-3xl">
          <ul className="grid grid-cols-2 border-2 border-line bg-ink/60 backdrop-blur-sm sm:grid-cols-4">
            {profile.stats.map((s, i) => (
              <li
                key={s.label}
                className={[
                  "px-4 py-4",
                  i % 2 === 1 ? "border-l-2 border-line" : "",
                  i >= 2 ? "border-t-2 border-line sm:border-t-0" : "",
                  i === 2 ? "sm:border-l-2 sm:border-line" : "",
                  i === 3 ? "sm:border-l-2 sm:border-line" : "",
                ].join(" ")}
              >
                <span className="block font-display text-[1.9rem] font-bold leading-none text-signal sm:text-[2.2rem]">
                  {s.value}
                  {s.unit && <span className="text-base text-muted">{s.unit}</span>}
                </span>
                <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.24em] text-dim">
                  {s.label}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
