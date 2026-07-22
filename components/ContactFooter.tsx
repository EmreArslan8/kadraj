"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = ["Instagram", "Vimeo", "Behance", "LinkedIn"];

// Footer CTA: huge "LET'S TALK" with an accent italic-swap hover, contact
// details and socials with underline-sweep hovers. Content parallaxes up
// as the section enters.
export default function ContactFooter() {
  const root = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner.current,
        { yPercent: 18, autoAlpha: 0.4 },
        {
          yPercent: 0,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "top center",
            scrub: true,
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={root}
      id="contact"
      className="hairline-t relative overflow-hidden px-5 pt-24 pb-10 md:px-10 md:pt-40"
    >
      <div ref={inner}>
        <a
          href="mailto:hello@kadraj.studio"
          className="group block w-fit"
          aria-label="Let's talk — email KADRAJ"
        >
          <span className="display block text-[clamp(3.5rem,16vw,14rem)] leading-[0.9] transition-colors duration-300 group-hover:text-accent">
            Let&rsquo;s{" "}
            {/* italic-swap on hover for the second word */}
            <span className="relative inline-block">
              <span className="group-hover:opacity-0">Talk</span>
              <span className="accent-serif absolute inset-0 text-[0.9em] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                talk
              </span>
            </span>
          </span>
        </a>

        <div className="mt-16 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <span className="micro-label">Say hello</span>
            <a
              href="mailto:hello@kadraj.studio"
              className="text-xl md:text-2xl underline-offset-4 hover:underline"
            >
              hello@kadraj.studio
            </a>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {SOCIALS.map((s) => (
              <a
                key={s}
                href="#"
                className="group relative text-base text-muted transition-colors hover:text-text"
              >
                {s}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
        </div>

        <div className="hairline-t mt-16 flex flex-col gap-2 pt-6 md:flex-row md:items-center md:justify-between">
          <span className="micro-label">© 2026 KADRAJ — Istanbul</span>
          <span className="micro-label">Istanbul — worldwide</span>
        </div>
      </div>
    </footer>
  );
}
