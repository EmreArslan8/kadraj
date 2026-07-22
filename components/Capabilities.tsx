"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CAPABILITIES = [
  ["Direction", "Creative direction, treatment, visual language and shoot planning."],
  ["Production", "Film crews, stills, set design, talent, locations and remote supervision."],
  ["Post", "Edit, grade, motion, CGI, compositing, sound design and delivery masters."],
  ["Launch", "Cutdown systems, social formats, retail loops and asset libraries."],
];

export default function Capabilities() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".cap-row").forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0.35 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: row,
              start: "top 80%",
              end: "top 35%",
              scrub: true,
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="studio" className="hairline-t px-5 py-16 md:px-10 md:py-24">
      <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr]">
        <div className="md:sticky md:top-24 md:h-fit">
          <span className="micro-label">Capabilities</span>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted md:text-base">
            One senior team from treatment to delivery, assembled around the
            exact needs of every production.
          </p>
        </div>

        <div className="border-t border-hairline">
          {CAPABILITIES.map(([title, copy], index) => (
            <article
              key={title}
              className="cap-row group grid gap-5 border-b border-hairline py-7 md:grid-cols-[96px_0.9fr_1.1fr] md:items-start"
            >
              <span className="display text-4xl text-muted transition-colors group-hover:text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="display text-[clamp(2rem,5vw,5rem)]">{title}</h3>
              <p className="max-w-lg text-sm leading-relaxed text-muted md:text-base">
                {copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
