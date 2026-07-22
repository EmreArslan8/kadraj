"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 120, suffix: "+", label: "Projects" },
  { value: 18, suffix: "", label: "Awards" },
  { value: 9, suffix: "", label: "Countries" },
  { value: 10, suffix: "yrs", label: "In business" },
];

const CLIENTS = ["AURELIA", "NORTHPEAK", "KIVI", "MONO+", "SAHRA", "VOLTA"];

// Counters snap-count up on enter; clients row highlights on hover.
export default function StatsClients() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const target = Number(el.dataset.value);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          snap: { v: 1 },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.firstChild!.textContent = String(Math.round(obj.v));
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="hairline-t px-5 py-16 md:px-10 md:py-24">
      <div className="grid grid-cols-2 gap-px md:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="border-hairline p-6 md:border-l md:first:border-l-0"
          >
            <p className="display text-[clamp(3rem,8vw,6rem)] leading-none">
              <span className="stat-num" data-value={s.value}>
                <span>0</span>
              </span>
              <span className="text-accent">{s.suffix}</span>
            </p>
            <p className="micro-label mt-3">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <span className="micro-label mb-6 block">Selected clients</span>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
          {CLIENTS.map((c) => (
            <span
              key={c}
              className="display cursor-default text-2xl text-muted transition-colors duration-300 hover:text-accent md:text-3xl"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
