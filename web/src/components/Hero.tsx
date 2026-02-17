"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function AnimatedCounter({ target, duration = 2000, prefix = "", suffix = "", decimals = 0 }: { target: number; duration?: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <span ref={ref}>{prefix}{value.toFixed(decimals)}{suffix}</span>;
}

function CostTicker() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // ~2.5M loans/year, avg excess spread ~0.17pp on ~$300K = ~$510/yr extra
  // That's ~2.5M * $510 = $1.275B/yr excess → ~$40.4/sec
  // But lifetime (30yr): 0.17pp on $300K ≈ $15K → 2.5M * $15K = $37.5B/yr new burden
  // Per second: $37.5B / 31.5M seconds/yr ≈ $1,190/sec
  const excessCost = seconds * 1190;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3, duration: 1 }}
      className="mt-8 flex items-center justify-center gap-2 text-sm text-white/40"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span>
        Since you opened this page, racial rate gaps have cost minority borrowers approximately{" "}
        <span className="text-emerald-400 font-semibold">${excessCost.toLocaleString()}</span> in excess interest.
      </span>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-emerald-400/80">
          Millions of Mortgages Exposed
        </p>

        <h1 className="text-5xl font-extrabold leading-tight md:text-7xl lg:text-8xl">
          Same Loan.
          <br />
          <span className="text-emerald-500">Different Rate.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-white/60 md:text-xl">
          Same income. Same loan amount. Same neighborhood. The only difference?
        </p>

        <div className="mt-6 flex flex-wrap items-baseline justify-center gap-6">
          <div>
            <div className="text-5xl font-black md:text-7xl text-amber-500">
              <AnimatedCounter target={0.192} prefix="+" suffix="pp" decimals={3} />
            </div>
            <div className="text-sm text-amber-400/70 mt-1">Hispanic vs White</div>
          </div>
          <div>
            <div className="text-4xl font-black md:text-5xl text-emerald-500">
              <AnimatedCounter target={0.161} prefix="+" suffix="pp" decimals={3} />
            </div>
            <div className="text-sm text-emerald-400/70 mt-1">Black vs White</div>
          </div>
        </div>

        <p className="mt-4 text-lg text-white/50">
          Higher rate spread above benchmark. On a $300K loan, that&apos;s{" "}
          <span className="text-emerald-400 font-semibold">thousands more</span> over the life of the mortgage.
        </p>

        <p className="mt-2 text-sm text-white/40">
          Worst B/W states: Wisconsin (+0.40pp), Louisiana (+0.40pp), South Carolina (+0.37pp), Michigan (+0.36pp), Illinois (+0.35pp)
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/40 text-sm">
          <div>
            <span className="block text-2xl font-bold text-white/80">15.3M</span>
            loans analyzed
          </div>
          <div>
            <span className="block text-2xl font-bold text-white/80">51</span>
            states + DC
          </div>
          <div>
            <span className="block text-2xl font-bold text-white/80">2018–2023</span>
            HMDA · CFPB
          </div>
        </div>

        <CostTicker />

        <div className="mt-8">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("After controlling for income, LTV & DTI — Black borrowers still pay more. 15.3M mortgages exposed. sameloandifferentrate.org via @Justice_Index")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-5 py-2.5 text-sm font-medium text-white transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Share on X
          </a>
        </div>

        <motion.div
          className="mt-8"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <a href="#rates" className="text-white/30 text-3xl">↓</a>
        </motion.div>
      </motion.div>
    </section>
  );
}
