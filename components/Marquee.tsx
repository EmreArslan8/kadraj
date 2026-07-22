"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WORDS = ["FILM", "BRAND", "POST", "CGI", "SOUND", "DIGITAL"];

// Infinite horizontal marquee between hairlines. Speeds up slightly with
// scroll velocity (clamped) via ScrollTrigger's onUpdate velocity read.
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Two copies sit side by side; loop the first copy's width.
      const loop = gsap.to(track.current, {
        xPercent: -50,
        duration: 22,
        ease: "none",
        repeat: -1,
      });

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          // Map scroll velocity to a clamped timeScale boost.
          const v = Math.abs(self.getVelocity());
          const boost = gsap.utils.clamp(1, 4, 1 + v / 600);
          gsap.to(loop, { timeScale: boost, duration: 0.4, overwrite: true });
        },
      });

      return () => {
        st.kill();
        loop.kill();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  // The strip content, duplicated so the -50% loop is seamless.
  const strip = (
    <div className="flex shrink-0 items-center">
      {WORDS.concat(WORDS).map((w, i) => (
        <span key={i} className="flex items-center">
          <span className="display px-6 text-[clamp(2rem,6vw,4.5rem)] text-text">
            {w}
          </span>
          <span className="text-accent text-[clamp(2rem,6vw,4.5rem)]">—</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={root}
      className="hairline-t hairline-b overflow-hidden py-4"
      aria-hidden="true"
    >
      <div ref={track} className="flex w-max flex-nowrap">
        {strip}
        {strip}
      </div>
    </div>
  );
}
