"use client";

import { useEffect, useState } from "react";

const LINKS = ["Work", "Manifesto", "Contact"];

// Minimal fixed nav: logo left, fake links center-right, live IST clock right.
export default function Nav() {
  const [clock, setClock] = useState("IST --:--");

  useEffect(() => {
    const update = () => {
      // Istanbul is UTC+3 year-round.
      const now = new Date();
      const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 180) * 60000);
      const hh = String(ist.getHours()).padStart(2, "0");
      const mm = String(ist.getMinutes()).padStart(2, "0");
      setClock(`IST ${hh}:${mm}`);
    };
    update();
    const id = setInterval(update, 1000 * 30);
    return () => clearInterval(id);
  }, []);

  return (
    <nav className="fixed top-0 left-0 z-40 flex w-full items-center justify-between px-5 py-5 md:px-10 mix-blend-difference">
      <a href="#top" className="display text-xl leading-none tracking-tight">
        KADRAJ
      </a>
      <div className="hidden items-center gap-8 md:flex">
        {LINKS.map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase()}`}
            className="micro-label text-text transition-opacity hover:opacity-60"
          >
            {l}
          </a>
        ))}
      </div>
      <span className="micro-label text-text tabular-nums">{clock}</span>
    </nav>
  );
}
