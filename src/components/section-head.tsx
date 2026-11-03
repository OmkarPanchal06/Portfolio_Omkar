import Reveal from "@/components/reveal";

type Props = {
  /** big outlined section number, e.g. "01" */
  index: string;
  kicker: string;
  title: React.ReactNode;
  description?: string;
};

export default function SectionHead({ index, kicker, title, description }: Props) {
  return (
    <header className="max-w-4xl">
      <Reveal>
        <div className="flex items-end gap-3 sm:gap-5">
          <span
            aria-hidden="true"
            className="u-outline-acid select-none font-display text-[clamp(3rem,9vw,5.75rem)] font-bold leading-[0.78] tracking-[-0.05em]"
          >
            {index}
          </span>
          <p className="eyebrow mb-1.5 sm:mb-3">{kicker}</p>
        </div>
      </Reveal>

      <Reveal delay={80} className="mt-4">
        <h2 className="font-display text-[clamp(2rem,6.5vw,4.25rem)] font-bold uppercase leading-[0.9] tracking-[-0.035em] text-fg">
          {title}
        </h2>
      </Reveal>

      {description ? (
        <Reveal delay={150} className="mt-6">
          <p className="max-w-2xl border-l-4 border-signal pl-4 leading-relaxed text-muted">
            {description}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}
