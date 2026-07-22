"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Large statement whose words fade from dim to full as the user scrolls
// through — the classic Locomotive word-reveal pattern.
const TEXT =
  "We build stories from light, motion and sound — chasing the single frame where craft becomes";
const ACCENT = "feeling";
const TAIL = ", and a brand starts to breathe on its own.";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const para = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const words = para.current?.querySelectorAll<HTMLElement>(".m-word");
      if (!words) return;
      gsap.set(words, { opacity: 0.15 });
      gsap.to(words, {
        opacity: 1,
        stagger: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          end: "bottom 60%",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const renderWords = (str: string, accent = false) =>
    str.split(" ").map((w, i) => (
      <span key={`${str}-${i}`} className="m-word inline-block">
        {accent ? <em className="accent-serif">{w}</em> : w}
        {" "}
      </span>
    ));

  return (
    <section
      ref={root}
      id="manifesto"
      className="hairline-t px-5 py-[clamp(6rem,16vh,12rem)] md:px-10"
    >
      <span className="micro-label mb-10 block">Manifesto</span>
      <p
        ref={para}
        className="max-w-5xl text-[clamp(1.75rem,5vw,4rem)] font-semibold leading-[1.15] tracking-tight"
      >
        {renderWords(TEXT)}
        {renderWords(ACCENT, true)}
        {renderWords(TAIL)}
      </p>
    </section>
  );
}
