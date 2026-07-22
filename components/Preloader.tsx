"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const BRAND = "KADRAJ".split("");

// Full-screen preloader: counts 00 -> 100, staggers the brand letters in,
// then lifts a curtain to reveal the hero. Plays once per session.
// Visibility/teardown is driven through the DOM + GSAP (no React state) so
// the skip path (reduced-motion or already-played) hides before first paint.
export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const played = sessionStorage.getItem("kadraj_preloaded");

    // Skip: hide before paint (useLayoutEffect) and reveal the hero now.
    if (reduced || played) {
      if (root.current) root.current.style.display = "none";
      onDone();
      return;
    }

    sessionStorage.setItem("kadraj_preloaded", "1");

    const ctx = gsap.context(() => {
      const count = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          if (root.current) root.current.style.display = "none";
          onDone();
        },
      });

      tl.from(".pre-letter", {
        yPercent: 120,
        stagger: 0.06,
        duration: 0.7,
        ease: "power4.out",
      })
        .to(
          count,
          {
            v: 100,
            duration: 1.6,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(
                  Math.round(count.v)
                ).padStart(2, "0");
              }
            },
          },
          0
        )
        // Curtain lifts up to reveal the hero underneath.
        .to(root.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
        })
        .to(".pre-content", { autoAlpha: 0, duration: 0.3 }, "<");
    }, root);

    return () => ctx.revert();
  }, [onDone]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background"
    >
      <div className="pre-content flex flex-col items-center gap-8">
        <div className="flex overflow-hidden">
          {BRAND.map((l, i) => (
            <span key={i} className="pre-letter display text-6xl md:text-8xl">
              {l}
            </span>
          ))}
        </div>
        <div className="micro-label flex items-center gap-3">
          <span>Loading</span>
          <span ref={counterRef} className="text-text tabular-nums">
            00
          </span>
        </div>
      </div>
    </div>
  );
}
