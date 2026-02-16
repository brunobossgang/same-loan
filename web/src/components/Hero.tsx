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

  // ~5.8M originated loans/year, avg racial rate gap costs ~$15K over 30yr
  // That's ~$2,760 per second in excess costs to minority borrowers
  const excessCost = seconds * 2760;

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

        <div className="mt-6 text-5xl font-black md:text-7xl">
          <span className="text-emerald-500">
            <AnimatedCounter target={0.069} suffix="pp" decimals={3} />
          </span>
          <span className="text-white/40 text-3xl md:text-5xl ml-3">higher spread</span>
        </div>

        <p className="mt-4 text-lg text-white/50">
          Above benchmark. On a $300K loan, that&apos;s{" "}
          <span className="text-emerald-400 font-semibold">thousands more</span> over the life of the mortgage.
        </p>

        <p className="mt-2 text-sm text-white/40">
          Worst states: Wisconsin (+0.39pp), Rhode Island (+0.30pp), Pennsylvania (+0.30pp), Maryland (+0.32pp)
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/40 text-sm">
          <div>
            <span className="block text-2xl font-bold text-white/80">5.2M</span>
            loans analyzed
          </div>
          <div>
            <span className="block text-2xl font-bold text-white/80">51</span>
            states + DC
          </div>
          <div>
            <span className="block text-2xl font-bold text-white/80">2022–2023</span>
            HMDA · CFPB
          </div>
        </div>

        <CostTicker />

        <motion.div
          className="mt-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <a href="#rates" className="text-white/30 text-3xl">↓</a>
        </motion.div>
      </motion.div>
    </section>
  );
}
