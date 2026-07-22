"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Studio", href: "#studio" },
  { label: "Manifesto", href: "#manifesto" },
  { label: "Contact", href: "#contact" },
];

// Minimal fixed nav: logo left, fake links center-right, live IST clock right.
export default function Nav() {
  const [clock, setClock] = useState("IST --:--");
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 z-50 flex w-full items-center justify-between border-b border-hairline bg-background/35 px-5 py-4 backdrop-blur-md md:px-10">
        <a href="#top" className="display text-xl leading-none tracking-tight">
          KADRAJ
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="micro-label text-text transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="micro-label hidden text-text tabular-nums sm:block">{clock}</span>
          <a
            href="mailto:hello@kadraj.studio"
            className="micro-label hidden border border-current px-3 py-2 text-text transition-colors hover:text-accent sm:block"
          >
            Start a project
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-10 cursor-pointer place-items-center border border-hairline md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className="relative block h-3.5 w-4">
              <span className={`absolute top-1 left-0 h-px w-4 bg-text transition-transform ${menuOpen ? "translate-y-[3px] rotate-45" : ""}`} />
              <span className={`absolute bottom-1 left-0 h-px w-4 bg-text transition-transform ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[45] flex flex-col justify-between bg-background px-5 pt-28 pb-8 transition-all duration-500 md:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="grid border-t border-hairline">
          {LINKS.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between border-b border-hairline py-5"
              tabIndex={menuOpen ? 0 : -1}
            >
              <span className="display text-[clamp(2.5rem,14vw,5rem)]">{link.label}</span>
              <span className="micro-label text-accent">0{index + 1}</span>
            </a>
          ))}
        </div>
        <div className="flex items-end justify-between">
          <div>
            <span className="micro-label block">New productions</span>
            <span className="mt-2 block text-base">hello@kadraj.studio</span>
          </div>
          <span className="micro-label text-text">{clock}</span>
        </div>
      </div>
    </>
  );
}
