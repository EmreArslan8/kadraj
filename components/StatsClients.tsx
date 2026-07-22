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
const AWARDS = ["Awwwards SOTD", "FWA shortlist", "ADC finalist", "Brand Film Festival"];

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
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="micro-label">Proof</span>
          <h2 className="display mt-4 max-w-3xl text-[clamp(2.25rem,6vw,5.5rem)]">
            Trusted across formats, markets and deadlines.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted md:text-base">
          Long-running partnerships and production systems designed to stay
          consistent from hero film to the smallest cutdown.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-px bg-hairline md:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="min-w-0 overflow-hidden bg-background p-4 sm:p-5 md:p-6"
          >
            <p className="display flex min-w-0 items-baseline whitespace-nowrap text-[clamp(2.5rem,7vw,5.25rem)] leading-none">
              <span className="stat-num min-w-0" data-value={s.value}>
                <span>0</span>
              </span>
              {s.suffix && (
                <span className="ml-1 text-[0.42em] text-accent md:ml-2">
                  {s.suffix}
                </span>
              )}
            </p>
            <p className="micro-label mt-3">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-[1fr_0.8fr]">
        <div>
          <span className="micro-label mb-6 block">Selected clients</span>
          <div className="grid border-t border-hairline">
          {CLIENTS.map((c) => (
            <span
              key={c}
              className="display cursor-default border-b border-hairline py-4 text-2xl text-muted transition-colors duration-300 hover:text-accent md:text-4xl"
            >
              {c}
            </span>
          ))}
          </div>
        </div>

        <div>
          <span className="micro-label mb-6 block">Recognition</span>
          <div className="grid border-t border-hairline">
            {AWARDS.map((a, i) => (
              <div key={a} className="flex items-center justify-between border-b border-hairline py-4">
                <span className="text-base text-text md:text-lg">{a}</span>
                <span className="micro-label">{String(i + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
