"use client";

import { useState } from "react";

const links = [
  { href: "#rates", label: "Rates" },
  { href: "#calculator", label: "Calculator" },
  { href: "#income", label: "Income" },
  { href: "#states", label: "States" },
  { href: "#trends", label: "Trends" },
  { href: "#act", label: "Act" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="https://justice-index.org" className="text-sm font-bold tracking-wider text-white/90 hover:text-emerald-400 transition-colors">
          JUSTICE INDEX
        </a>
        <button
          className="md:hidden text-white/70"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <div
          className={`${
            open ? "flex" : "hidden"
          } md:flex gap-6 absolute md:static top-full left-0 w-full md:w-auto bg-slate-950/95 md:bg-transparent px-6 py-4 md:p-0 flex-col md:flex-row`}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://samecrimedifferenttime.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-emerald-400/70 hover:text-emerald-400 transition-colors font-medium"
          >
            Sentencing ↗
          </a>
          <a
            href="https://samestopdifferentoutcome.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-emerald-400/70 hover:text-emerald-400 transition-colors font-medium"
          >
            Traffic Stops ↗
          </a>
          <a
            href="https://instagram.com/justiceindex"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-emerald-400/70 hover:text-emerald-400 transition-colors font-medium"
          >
            Instagram ↗
          </a>
        </div>
      </div>
    </nav>
  );
}
