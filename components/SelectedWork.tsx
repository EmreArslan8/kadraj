"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MediaSlot from "./MediaSlot";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  index: string;
  title: string;
  category: string;
  year: string;
  hue: number;
  src: string;
}

const PROJECTS: Project[] = [
  { index: "01", title: "NEON HARVEST", category: "Campaign Film", year: "2025", hue: 12, src: "work-01" },
  { index: "02", title: "VELVET / CHROME", category: "Brand Identity", year: "2024", hue: 260, src: "work-02" },
  { index: "03", title: "ORBIT", category: "Product CGI", year: "2024", hue: 200, src: "work-03" },
  { index: "04", title: "AFTERGLOW", category: "Music Video", year: "2023", hue: 330, src: "work-04" },
  { index: "05", title: "TERRA", category: "Documentary", year: "2023", hue: 90, src: "work-05" },
];

// Pinned section: a horizontal track of project cards scrubbed by vertical
// scroll on desktop; a simple vertical stack on mobile (no pin).
export default function SelectedWork() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  // Lazily start the card videos (preload="none") as the section approaches,
  // so they don't download until needed. Posters stand in under reduced-motion.
  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced || !root.current) return;

    const videos = Array.from(
      root.current.querySelectorAll<HTMLVideoElement>("video")
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLVideoElement).play().catch(() => {});
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "400px 0px" }
    );
    videos.forEach((v) => io.observe(v));

    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: pin + horizontal scrub.
      mm.add("(min-width: 768px)", () => {
        const el = track.current;
        if (!el) return;
        const distance = el.scrollWidth - window.innerWidth;

        const tween = gsap.to(el, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progress.current) {
                progress.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });

        // Slight counter-parallax on each card's inner image.
        const parallax: gsap.core.Tween[] = [];
        gsap.utils.toArray<HTMLElement>(".work-inner").forEach((inner) => {
          parallax.push(
            gsap.fromTo(
              // scale set here so the translate never reveals an edge
              // (GSAP's inline transform would otherwise drop the CSS scale).
              inner,
              { xPercent: -8, scale: 1.1 },
              {
                xPercent: 8,
                scale: 1.1,
                ease: "none",
                scrollTrigger: {
                  trigger: root.current,
                  start: "top top",
                  end: () => `+=${distance}`,
                  scrub: true,
                },
              }
            )
          );
        });

        return () => {
          tween.kill();
          parallax.forEach((p) => p.kill());
        };
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="work" className="relative">
      <div className="flex items-baseline justify-between px-5 pt-16 pb-8 md:px-10">
        <span className="micro-label">Selected Work</span>
        <span className="micro-label">2023 — 2025</span>
      </div>

      {/* Track: horizontal row on desktop, vertical stack on mobile */}
      <div
        ref={track}
        className="flex flex-col gap-12 px-5 pb-16 md:h-svh md:flex-row md:items-center md:gap-8 md:px-10 md:pb-0"
      >
        {PROJECTS.map((p) => (
          <article
            key={p.index}
            className="group w-full shrink-0 md:w-[38vw]"
          >
            <div className="overflow-hidden">
              <MediaSlot
                src={p.src}
                preload="none"
                label={`${p.title} — ${p.category}`}
                ratio="4/5"
                hue={p.hue}
                innerClassName="work-inner scale-110"
              />
            </div>
            <div className="mt-4 flex items-start justify-between">
              <div>
                <h3 className="display text-2xl md:text-3xl">{p.title}</h3>
                <p className="micro-label mt-2">
                  {p.category} — {p.year}
                </p>
              </div>
              <span className="display text-accent text-xl">{p.index}</span>
            </div>
          </article>
        ))}
      </div>

      {/* Scrub-linked progress bar */}
      <div className="hidden h-px w-full bg-hairline md:block">
        <span
          ref={progress}
          className="block h-full origin-left scale-x-0 bg-accent"
        />
      </div>
    </section>
  );
}
