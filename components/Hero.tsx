"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import MediaSlot from "./MediaSlot";
import { splitLines } from "@/lib/splitText";

// Full-viewport hero: showreel MediaSlot background with a slow scale-in,
// masked line-reveal headline, sub-line and animated scroll hint.
export default function Hero({ start }: { start: boolean }) {
  const root = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const bg = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!start) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduced) return;

      // Slow background scale settle on load.
      if (bg.current) {
        gsap.fromTo(
          bg.current,
          { scale: 1.08 },
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
        <MediaSlot label="VIDEO — SHOWREEL" hue={18} className="h-full w-full" />
      </div>
      {/* Cinematic darkening gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/70" />

      <div className="relative z-10 px-5 pb-16 md:px-10 md:pb-20">
        <h1
          ref={headline}
          className="display max-w-[15ch] text-[clamp(3rem,13vw,11rem)]"
        >
          We frame <em className="accent-serif">stories</em>
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="hero-fade max-w-md text-base leading-relaxed text-muted md:text-lg">
            A production studio framing stories since 2016 — film, brand, CGI
            and sound, built frame by frame.
          </p>
          <div className="hero-fade flex items-center gap-4">
            <span className="micro-label">Scroll</span>
            <span className="relative block h-10 w-px overflow-hidden bg-hairline">
              <span className="scroll-hint-line absolute inset-0 block origin-top scale-y-0 bg-accent" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
