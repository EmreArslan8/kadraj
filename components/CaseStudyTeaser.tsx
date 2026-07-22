"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MediaSlot from "./MediaSlot";

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  {
    k: "01",
    title: "Brief",
    copy: "Turn a seasonal launch into a film system that can live across cinema, paid social and retail screens.",
  },
  {
    k: "02",
    title: "Method",
    copy: "Build the world in camera first, then extend it with CGI, grade and sound until every asset shares one atmosphere.",
  },
  {
    k: "03",
    title: "Output",
    copy: "Hero film, vertical cutdowns, product loops, press stills and motion templates for the brand team.",
  },
];

export default function CaseStudyTeaser() {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        media.current,
        { clipPath: "inset(14% 10% 14% 10%)", scale: 1.08 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            end: "top 15%",
            scrub: true,
          },
        }
      );

      gsap.from(".case-line", {
        yPercent: 110,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
        scrollTrigger: {
          trigger: root.current,
          start: "top 55%",
          once: true,
        },
      });

      gsap.to(".case-index", {
        color: "var(--accent)",
        stagger: 0.2,
        scrollTrigger: {
          trigger: root.current,
          start: "top 35%",
          end: "bottom 60%",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="hairline-t grid min-h-svh gap-10 px-5 py-16 md:grid-cols-[0.95fr_1.05fr] md:px-10 md:py-24"
    >
      <div className="flex flex-col justify-between gap-10">
        <div>
          <span className="micro-label">Featured case / Orbit</span>
          <h2 className="display mt-5 max-w-4xl text-[clamp(2.75rem,6.5vw,6.5rem)]">
            <span className="block overflow-hidden">
              <span className="case-line block">One world.</span>
            </span>
            <span className="block overflow-hidden">
              <span className="case-line block">
                Twelve <em className="accent-serif">markets.</em>
              </span>
            </span>
          </h2>
        </div>

        <div className="grid gap-px bg-hairline">
          {CHAPTERS.map((item) => (
            <article key={item.k} className="grid gap-5 bg-background p-5 md:grid-cols-[72px_1fr]">
              <span className="case-index display text-4xl text-muted">{item.k}</span>
              <div>
                <h3 className="display text-2xl">{item.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted md:text-base">
                  {item.copy}
                </p>
              </div>
            </article>
          ))}
        </div>
        <a
          href="#contact"
          className="group flex w-fit items-center gap-4 border-b border-hairline pb-2 text-sm uppercase transition-colors hover:border-accent hover:text-accent"
        >
          Build a project like this
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>

      <div className="relative min-h-[520px] md:min-h-0">
        <div className="sticky top-10">
          <div ref={media} className="relative overflow-hidden">
            <MediaSlot
              src="work-03"
              preload="metadata"
              label="ORBIT — CASE STUDY"
              ratio="4/5"
              hue={205}
              innerClassName="scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between gap-5">
              <div>
                <p className="micro-label text-text">Featured case</p>
                <h3 className="display mt-2 text-4xl md:text-5xl">Orbit</h3>
              </div>
              <span className="micro-label border border-hairline bg-background/60 px-3 py-2 text-text backdrop-blur">
                CGI / 2024
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-px bg-hairline">
            {["12 markets", "48 assets", "1 visual system"].map((item) => (
              <span key={item} className="micro-label bg-background p-4 text-text">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
