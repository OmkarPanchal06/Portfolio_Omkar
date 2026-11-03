import Reveal from "@/components/reveal";
import SectionHead from "@/components/section-head";
import CopyEmail from "@/components/copy-email";
import { IconGithub, IconLinkedin, IconArrow } from "@/components/icons";
import { profile } from "@/data/profile";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden border-t-2 border-line">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(198,255,0,0.12),transparent_62%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHead
          index="05"
          kicker="Contact"
          title={
            <>
              Hiring for 2027?
              <br />
              <span className="text-gradient">Talk early.</span>
            </>
          }
          description="I am final-year B.Tech (IoT) at YCCE Nagpur and actively open to data analyst, data engineering and IoT roles — internships or full-time. Fastest reply is by email."
        />

        <Reveal delay={180} className="mt-10">
          <div className="flex flex-wrap items-center gap-3">
            <CopyEmail email={profile.email} />

            <a
              href={`tel:${profile.phoneHref}`}
              className="inline-flex items-center gap-2 border-2 border-line px-5 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted transition-colors hover:border-signal hover:text-signal"
            >
              {profile.phone}
            </a>

            <a
              href={`mailto:${profile.email}?subject=Opportunity%20for%20Omkar`}
              className="group inline-flex items-center gap-2 border-2 border-[#08080a] bg-signal px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#08080a] shadow-[6px_6px_0_var(--color-violet)] transition-transform duration-150 hover:-translate-x-1 hover:-translate-y-1"
            >
              Write to me
              <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>

        <Reveal delay={260} className="mt-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 border-b-2 border-line pb-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted transition-colors hover:border-signal hover:text-signal"
            >
              <IconGithub className="h-4 w-4" />
              OmkarPanchal06
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 border-b-2 border-line pb-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted transition-colors hover:border-violet hover:text-violet"
            >
              <IconLinkedin className="h-4 w-4" />
              omkar-panchal
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
