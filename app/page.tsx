import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { EarlyAccessFigure } from "@/components/EarlyAccess";
import { FooterArt } from "@/components/FooterArt";
import { WaitlistForm } from "@/components/WaitlistForm";
import { ConstellationBackdrop } from "@/components/HeroMotion";

export const metadata: Metadata = {
  title: "Project Q — foundational data infrastructure for imaging AI",
  description:
    "Project Q takes medical-imaging archives from raw DICOM to validated training datasets — search, curation, annotation, and versioned export with full lineage.",
};

const CONTRACT = `<!--
DIRECTION 5 — CINEMATIC ARCHITECTURE × BRAND PALETTE (user-directed fusion of
d2 and d4). THESIS: d2's art-directed, framed, modular cinematic layout,
recolored into the brand's lab-report palette. OWN-WORLD: warm ivory #f5f0e6
foundation, deep panel tone #ede7d9, near-black ink #17150f type and cinematic
sections, deep diagnostic red #a31621 reserved for action (bright #e05561 for
small red text on dark), muted grey #6b6656 support. DM Sans light oversized
display (cinematic voice) + Fragment Mono letter-spaced report labels (brand
voice). Framed hero media with corner ticks, strict grid lines, bordered
modular panels, split modules, horizontal team rail, rounded-md buttons.
FIRST VIEWPORT: nav, oversized light headline, one supporting line, red CTA,
then the framed hero-media panel on ink. MOTION: slow reveals, animated
dash-flow pipeline, horizontal rail. IMAGERY: flat palette-matched stand-ins,
aspect-locked for zero-shift drop-in.
-->`;

const BTN_RED =
  "inline-block rounded-md bg-accent px-6 py-3 text-[14px] font-medium text-ivory transition-colors hover:bg-accent-hover";
const BTN_GHOST =
  "inline-block rounded-md border border-ink/25 px-6 py-3 text-[14px] font-medium text-ink transition-colors hover:border-ink";

const MONO = "font-mono text-[10.5px] tracking-[0.18em] uppercase";

const FLOW = [
  {
    name: "Connect",
    line: "Connect local or remote cloud storage with no data duplication, or ingest from enterprise PACS via DICOMweb",
  },
  {
    name: "Agent Q",
    line: "Reads every study — findings, anatomy, quality — into tags and pre-annotations",
  },
  {
    name: "Discover",
    line: "Natural-language and metadata search, interpretation always visible",
  },
  {
    name: "Curate",
    line: "Deduplicated, class-balanced, reproducible collections",
  },
  {
    name: "Annotate & review",
    line: "Blind multi-reader annotation, consensus, ground-truth approval",
  },
  {
    name: "Export",
    line: "DICOM SEG · RT Struct · NIfTI · JSON — versioned, with full lineage",
  },
];

const PANELS = [
  {
    title: "Search & curation",
    body: "Ask in plain language and see exactly how the query was interpreted. Filters span DICOM metadata, Agent Q findings, and report-derived tags — with similarity search, duplicate detection, and class-aware sampling into reproducible collections.",
    img: "/panel-discover.jpg",
    alt: "Interpreted query filters — natural-language search resolved into metadata, AI-finding, and report-derived filter chips with an open field picker (concept render)",
  },
  {
    title: "Viewer & annotation",
    body: "A reading room in the browser: OHIF-based DICOM viewing with multiplanar reconstruction, calibrated measurements, pixel masks, and 3D label maps — with Agent Q pre-annotations ready to accept, correct, or reject.",
    img: "/panel-viewer.jpg",
    alt: "Viewer fragment — axial chest CT with an amber segmentation contour and a floating annotation panel offering accept, correct, and reject (concept render)",
  },
  {
    title: "Quality workflows",
    body: "Ground truth you can defend: blind multi-reader annotation, agreement scoring, consensus, and adjudication — so “done” means validated, not just drawn.",
    img: "/panel-review.jpg",
    alt: "Consensus card — Dice agreement meter, three blind-reader statuses, and an approve-ground-truth action floating over ghosted worklist rows (concept render)",
  },
  {
    title: "Governance & export",
    body: "Your data stays in your custody: zero-copy storage options, project-scoped access, immutable audit events. Exports ship versioned — DICOM SEG, RT Struct, NIfTI, JSON — with lineage from every label back to its source study, model run, and reviewer.",
    img: "/panel-registry.jpg",
    alt: "Export manifest card — DICOM SEG, RT Struct, NIfTI, and JSON formats with a lineage chain from source study to export (concept render)",
  },
];

const STORIES = [
  {
    role: "Data curators",
    line: "Find rare, relevant, and underrepresented studies before annotation budget is committed.",
  },
  {
    role: "Annotation managers",
    line: "Build reproducible collections, taxonomies, and quality workflows that survive an audit.",
  },
  {
    role: "ML engineers",
    line: "Connect models, analyze failure cohorts, and export versioned training datasets with full lineage.",
  },
  {
    role: "Administrators",
    line: "Control access, integrations, retention, data movement, and audit evidence from one place.",
  },
];

export default function D5() {
  return (
    <div className="min-h-screen bg-ivory text-ink">
      <div hidden dangerouslySetInnerHTML={{ __html: CONTRACT }} />
      {/* header */}
      <header className="sticky top-0 z-50 border-b border-ink/15 bg-ivory/95">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
          <a href="#top" className="text-[16px] font-semibold tracking-tight">
            Project&nbsp;Q
          </a>
          <nav className="flex items-center gap-8">
            <div className={`${MONO} hidden items-center gap-7 text-muted md:flex`}>
              <a href="#infrastructure" className="transition-colors hover:text-ink">infrastructure</a>
              <a href="#platform" className="transition-colors hover:text-ink">platform</a>
              <a href="#teams" className="transition-colors hover:text-ink">teams</a>
            </div>
            <a href="#waitlist" className={`${BTN_RED} px-5 py-2.5 text-[13.5px]`}>
              Join waitlist
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* hero */}
        <section className="relative mx-auto max-w-[1400px] px-6 pt-16 pb-10 md:px-10 md:pt-24">
          <ConstellationBackdrop />
          <div className="relative">
          <div className="relative">
            <h1 className="relative max-w-[16ch] text-[clamp(2.5rem,6.6vw,6.4rem)] leading-[1.02] font-light tracking-[-0.03em]">
              Foundational data infrastructure{" "}
              <span className="text-accent">for imaging&nbsp;AI.</span>
            </h1>
            <p className="relative mt-7 max-w-[34ch] text-[clamp(1.15rem,1.9vw,1.5rem)] leading-snug font-normal">
              Accelerate medical-AI development by annotating only what
              matters.
            </p>
          </div>
          <div className="relative mt-10 flex flex-col items-start gap-3">
            <div className="flex w-full flex-wrap items-start gap-4">
              <WaitlistForm variant="inline" />
              <a href="#platform" className={BTN_GHOST}>
                Explore the platform
              </a>
            </div>
            <p className={`${MONO} text-muted`}>
              in development · early access in waves
            </p>
          </div>

          {/* framed hero media */}
          <Reveal className="mt-14">
            <div className="relative border border-ink/20 p-2 md:p-3">
              <span className="absolute -top-px -left-px h-3 w-3 border-t-2 border-l-2 border-ink" aria-hidden />
              <span className="absolute -top-px -right-px h-3 w-3 border-t-2 border-r-2 border-ink" aria-hidden />
              <span className="absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-ink" aria-hidden />
              <span className="absolute -right-px -bottom-px h-3 w-3 border-r-2 border-b-2 border-ink" aria-hidden />
              <div
                className="relative w-full overflow-hidden bg-ink"
                style={{ aspectRatio: "16/9" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-query-4.png"
                  alt="Project Q on a desktop monitor in a lamp-lit workspace — a natural-language query resolving into interpreted filters, including a matched radiology-report phrase, over a cohort of 1,284 studies (concept render)"
                  className="h-full w-full object-cover"
                />
                {/* light film grain so the still sits in the page's material world */}
                <span aria-hidden className="grain-overlay" />
                <span className={`${MONO} absolute top-4 left-4 rounded-md border border-line-inverse-strong bg-ink/70 px-3 py-1.5 text-chip`}>
                  platform · discover
                </span>
              </div>
            </div>
            <div className={`${MONO} mt-3 flex items-baseline justify-between text-muted`}>
              <span>the platform · discover</span>
              <span>fig. 01</span>
            </div>
          </Reveal>
          </div>
        </section>

        {/* dark cinematic section — animated data flow */}
        <section id="infrastructure" className="mt-20 bg-ink text-ivory md:mt-28">
          <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
            <Reveal>
              <h2 className="max-w-[17ch] text-[clamp(2.1rem,4.8vw,4.6rem)] leading-[1.04] font-light tracking-[-0.025em]">
                From unread archive to export-ready dataset — one pipeline.
              </h2>
            </Reveal>
            <Reveal delay={100}>
            <p className="mt-7 max-w-[58ch] text-[15px] leading-relaxed text-muted-inverse">
              Agent Q reads every incoming study in the background — findings,
              anatomy, quality signals, and the concepts your project defines —
              turning raw DICOM into structured tags and spatial
              pre-annotations before anyone opens a viewer. Search, curation,
              annotation, and review all run on that intelligence, and every
              artifact stays linked to its source, model, version, and
              taxonomy.
            </p>
            </Reveal>

            {/* pb/-mb pair absorbs the reveal's 20px translate so the scroll
                container never grows a vertical scrollbar mid-animation */}
            <div className="mt-16 -mb-6 overflow-x-auto pb-6">
              <div className="flex min-w-[880px] items-stretch">
                {FLOW.map((step, i) => (
                  <Reveal key={step.name} delay={i * 90} className="flex flex-1 items-center">
                    <div className="h-full w-full rounded-md border border-line-inverse px-4 py-5">
                      <span className={`${MONO} block text-accent-bright`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-1 block text-[14.5px]">{step.name}</span>
                      <span className="mt-2 block text-[11.5px] leading-snug text-muted-inverse">
                        {step.line}
                      </span>
                    </div>
                    {i < FLOW.length - 1 && (
                      <svg width="36" height="12" viewBox="0 0 36 12" className="shrink-0" aria-hidden>
                        <line
                          x1="0"
                          y1="6"
                          x2="36"
                          y2="6"
                          className="stroke-connector"
                          strokeWidth="1.5"
                          strokeDasharray="6 6"
                          style={{ animation: "dash-flow 1.6s linear infinite" }}
                        />
                      </svg>
                    )}
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal delay={540}>
              <p className={`${MONO} mt-4 text-muted-inverse`}>
                six stages · one governed workflow · provenance preserved end to
                end
              </p>
            </Reveal>
          </div>
        </section>

        {/* modular panels */}
        <section id="platform" className="mx-auto max-w-[1400px] px-6 pt-24 pb-6 md:px-10 md:pt-32">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="max-w-[18ch] text-[clamp(2rem,4.4vw,4.2rem)] leading-[1.05] font-light tracking-[-0.025em]">
                Then the platform, in detail.
              </h2>
              <p className={`${MONO} text-muted`}>
                concept renders · product in development
              </p>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-2">
            <Reveal className="md:col-span-2">
              <div className="group grid items-center gap-8 bg-ivory p-7 md:grid-cols-2 md:p-9">
                <div>
                  <span className={`${MONO} text-accent`}>agent q</span>
                  <h3 className="mt-3 text-[26px] font-medium tracking-tight">
                    Fragmented in. One coded record out.
                  </h3>
                  <p className="mt-3 max-w-[52ch] text-[14.5px] leading-relaxed text-muted">
                    Imaging data arrives scattered — pixels in the archive,
                    findings in free-text reports, context in notes. Agent Q
                    reads the images; the same intelligence reads the
                    radiology reports. Together they return one clean,
                    queryable record per study — every finding coded with
                    location, size, severity, source, and model confidence.
                    AI output stays visibly separate from approved ground
                    truth, always.
                  </p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/panel-record.jpg"
                  alt="Fragmented imaging data — a DICOM tile, a free-text report snippet, and metadata chips — converging into one coded study record with location, size, severity, source, and confidence (concept render)"
                  width={1600}
                  height={904}
                  className="h-auto w-full rounded-md border border-ink/10 transition-[border-color,transform] duration-300 group-hover:-translate-y-[3px] group-hover:border-ink/30"
                />
              </div>
            </Reveal>
            {PANELS.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <div className="group flex h-full flex-col bg-ivory p-7 md:p-9">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.img}
                    alt={p.alt}
                    loading="lazy"
                    width={1600}
                    height={904}
                    className="h-auto w-full rounded-md border border-ink/10 transition-[border-color,transform] duration-300 group-hover:-translate-y-[3px] group-hover:border-ink/30"
                  />
                  <h3 className="mt-7 text-[21px] font-medium tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-3 max-w-[52ch] text-[14.5px] leading-relaxed text-muted">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* team stories */}
        <section id="teams" className="mx-auto max-w-[1400px] px-6 pt-20 md:px-10 md:pt-28">
          <Reveal>
            <h2 className="text-[clamp(1.7rem,3.2vw,2.9rem)] leading-[1.08] font-light tracking-[-0.02em]">
              Built for the whole imaging-data team.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STORIES.map((s, i) => (
              <Reveal key={s.role} delay={i * 80}>
                <div className="h-full rounded-md border border-ink/15 bg-ivory-raised p-7 transition-[border-color,transform] duration-300 hover:-translate-y-[3px] hover:border-ink/35">
                  <span className={`${MONO} text-accent`}>{s.role}</span>
                  <p className="mt-4 text-[16px] leading-relaxed">{s.line}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* split module — early access */}
        <section id="early-access" className="mx-auto max-w-[1400px] px-6 pt-20 pb-6 md:px-10 md:pt-24">
          <div className="grid items-center gap-10 rounded-md border border-ink/15 p-7 md:grid-cols-2 md:p-12">
            <Reveal>
            <div>
              <h3 className="max-w-[16ch] text-[clamp(1.7rem,3.2vw,2.9rem)] leading-[1.08] font-light tracking-[-0.02em]">
                Early access runs in waves.
              </h3>
              <p className="mt-5 max-w-[52ch] text-[14.5px] leading-relaxed text-muted">
                Project Q is in development, and the waitlist is how teams come
                aboard. Each wave is deliberately small — deep onboarding beats
                broad access while the platform takes shape.
              </p>
              <dl className="mt-8">
                {[
                  ["your archive", "Onboarding runs on your data, not a sandbox. Connect storage or PACS, and the first cohorts you build are yours to keep."],
                  ["direct line", "You work with the team building the platform — modality questions, issues, and requests land with engineers, not a ticket queue."],
                  ["real influence", "Wave partners shape what ships: taxonomies, annotation workflows, export formats, and the order the roadmap gets built."],
                ].map(([label, body]) => (
                  <div key={label} className="grid gap-1.5 border-t border-ink/10 py-4 sm:grid-cols-[130px_1fr] sm:gap-6 last:pb-0">
                    <dt className={`${MONO} pt-0.5 text-accent`}>{label}</dt>
                    <dd className="text-[14.5px] leading-relaxed text-muted">{body}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-[14.5px] text-ink">
                Waves are seated from the waitlist, in order.{" "}
                <a
                  href="#waitlist"
                  className="font-medium text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  Join the waitlist
                </a>
              </p>
            </div>
            </Reveal>
            <EarlyAccessFigure />
          </div>
        </section>

        {/* close — dark cinematic */}
        <section id="waitlist" className="mt-24 bg-ink text-ivory md:mt-32">
          <div className="mx-auto grid max-w-[1400px] gap-14 px-6 py-24 md:grid-cols-2 md:px-10 md:py-32">
            <Reveal>
            <div>
              <h2 className="max-w-[13ch] text-[clamp(2.2rem,5vw,4.8rem)] leading-[1.03] font-light tracking-[-0.028em]">
                Build on data you can defend.
              </h2>
              <p className="mt-8 max-w-[44ch] text-[15px] leading-relaxed text-muted-inverse">
                Project Q is in development. Join the waitlist and we&apos;ll
                reach out as early-access onboarding opens — scoped to your
                modality mix, storage setup, and annotation goals. Project Q is
                a data platform, not a diagnostic device — Agent Q outputs are
                not diagnoses.
              </p>
            </div>
            </Reveal>
            <Reveal delay={120}>
              <WaitlistForm variant="full" />
            </Reveal>
          </div>
        </section>
      </main>

      <footer id="footer" className="border-t border-ink/15 bg-ivory">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-x-10 gap-y-4 px-6 py-4 md:px-10">
          <p className="text-[13.5px] font-medium">Project Q — © 2026 Drongo AI Pvt Ltd</p>
          <FooterArt />
        </div>
      </footer>
    </div>
  );
}
