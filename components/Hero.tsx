"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import MediaSlot from "./MediaSlot";
import { splitLines } from "@/lib/splitText";

// Full-viewport hero: showreel MediaSlot background with a slow scale-in,
// masked line-reveal headline, sub-line and animated scroll hint.
export default function Hero({ start }: { start: boolean }) {
  const [showreelOpen, setShowreelOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!showreelOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowreelOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showreelOpen]);

  useLayoutEffect(() => {
    if (!start) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Showreel autoplays once the hero is revealed — unless reduced-motion,
    // where the poster image stands in.
    if (!reduced && video.current) {
      video.current.play().catch(() => {});
    }

    const ctx = gsap.context(() => {
      if (reduced) return;

      // Slow background scale settle on load.
      if (bg.current) {
        gsap.fromTo(
          bg.current,
          { scale: 1.025 },
          { scale: 1, duration: 2.4, ease: "power2.out" }
        );
      }

      // Split the headline into masked lines and reveal them.
      const split = headline.current ? splitLines(headline.current) : null;
      const tl = gsap.timeline({ delay: 0.15 });

      if (split) {
        gsap.set(split.lines, { yPercent: 110 });
        tl.to(split.lines, {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.09,
          ease: "power4.out",
        });
      }

      tl.from(
        ".hero-fade",
        { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.12, ease: "power3.out" },
        "-=0.5"
      );

      // Looping scroll-hint line.
      gsap.to(".scroll-hint-line", {
        scaleY: 1,
        transformOrigin: "top",
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }, root);

    return () => ctx.revert();
  }, [start]);

  return (
    <section
      ref={root}
      id="top"
      className="relative flex h-svh min-h-[640px] w-full flex-col justify-end overflow-hidden"
    >
      {/* Full-bleed showreel background */}
      <div ref={bg} className="absolute inset-0">
        <MediaSlot
          ref={video}
          src="hero"
          preload="metadata"
          label="VIDEO — SHOWREEL"
          hue={18}
          className="h-full w-full"
        />
      </div>
      {/* Cinematic darkening gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/70" />
      <div className="pointer-events-none absolute inset-x-5 top-20 bottom-8 z-10 hidden border border-hairline md:block" />
      <span className="frame-corner pointer-events-none top-20 left-5 z-10 hidden border-t border-l md:block" />
      <span className="frame-corner pointer-events-none right-5 bottom-8 z-10 hidden border-r border-b md:block" />

      <div className="pointer-events-none absolute top-1/2 right-5 z-10 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex">
        <span className="micro-label text-text">Istanbul</span>
        <span className="h-24 w-px bg-hairline" />
        <span className="micro-label text-text [writing-mode:vertical-rl]">
          Film / CGI / Sound
        </span>
      </div>

      <div className="relative z-10 px-5 pb-16 md:px-10 md:pb-20">
        <div className="hero-fade mb-7 flex flex-wrap items-center gap-3">
          <span className="micro-label border border-hairline px-3 py-2 text-text">
            Creative Production
          </span>
          <span className="micro-label border border-hairline px-3 py-2 text-text">
            Since 2016
          </span>
        </div>

        <h1
          ref={headline}
          className="display max-w-[12ch] text-[clamp(3rem,11vw,9.5rem)]"
        >
          Film, CGI &amp; visual <em className="accent-serif">worlds</em>
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="hero-fade max-w-md text-base leading-relaxed text-muted md:text-lg">
            KADRAJ is an Istanbul production studio shaping campaigns from first
            treatment to final frame.
          </p>
          <button
            type="button"
            onClick={() => setShowreelOpen(true)}
            className="hero-fade group flex cursor-pointer items-center gap-4 text-left"
            aria-label="Play KADRAJ showreel"
          >
            <span className="grid size-11 place-items-center rounded-full border border-hairline transition-colors group-hover:border-accent group-hover:bg-accent">
              <span className="ml-0.5 block h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-text" />
            </span>
            <span className="micro-label text-text transition-colors group-hover:text-accent">
              Play showreel / 00:12
            </span>
          </button>
          <div className="hero-fade flex items-center gap-4">
            <span className="micro-label text-text">Scroll</span>
            <span className="relative block h-10 w-px overflow-hidden bg-hairline">
              <span className="scroll-hint-line absolute inset-0 block origin-top scale-y-0 bg-accent" />
            </span>
          </div>
        </div>
      </div>

      {showreelOpen && (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-background/95 p-4 backdrop-blur-sm md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label="KADRAJ showreel"
        >
          <button
            type="button"
            onClick={() => setShowreelOpen(false)}
            className="absolute top-5 right-5 z-10 grid size-12 cursor-pointer place-items-center border border-hairline bg-background text-2xl transition-colors hover:border-accent hover:text-accent md:top-8 md:right-10"
            aria-label="Close showreel"
          >
            ×
          </button>
          <div className="w-full max-w-6xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="micro-label text-text">KADRAJ / Showreel 2026</span>
              <span className="micro-label">00:12</span>
            </div>
            <video
              className="aspect-video w-full bg-black object-cover"
              autoPlay
              controls
              playsInline
              preload="auto"
              poster="/media/hero.jpg"
            >
              <source src="/media/hero.mp4" type="video/mp4" />
              <source src="/media/hero.webm" type="video/webm" />
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
