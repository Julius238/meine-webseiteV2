"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

const links = [
  { href: "#leistungen", label: "Leistungen" },
  { href: "#prozess", label: "Prozess" },
  { href: "#loesungen", label: "Lösungen" },
  { href: "#ueber-mich", label: "Über mich" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div
        className={clsx(
          "mx-auto max-w-6xl px-4 md:px-8 transition-all duration-500"
        )}
      >
        <div
          className={clsx(
            "flex items-center justify-between rounded-full transition-all duration-500",
            scrolled
              ? "px-4 md:px-6 py-2.5 bg-ink-900/70 backdrop-blur-xl border border-white/5"
              : "px-2 py-2 bg-transparent"
          )}
        >
          <a href="#top" className="flex items-center gap-2 group">
            <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent to-accent-deep text-ink-950 font-mono font-bold text-sm">
              JE
              <span className="absolute -inset-1 rounded-md bg-accent/20 blur-md opacity-50 group-hover:opacity-100 transition" />
            </span>
            <span className="font-medium text-sm tracking-tight text-white/90">
              Julius Eggert
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 text-sm text-white/70 hover:text-white transition rounded-full hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a href="#kontakt" className="btn-primary !py-2 !px-4 !text-sm">
            Projekt anfragen
          </a>
        </div>
      </div>
    </header>
  );
}
