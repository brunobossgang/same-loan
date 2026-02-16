"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Section from "./Section";

export default function Calculator() {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [baseRate, setBaseRate] = useState(6.5);
  const [spreadGap, setSpreadGap] = useState(0.3);

  const term = 30;
  const monthlyBase = (loanAmount * (baseRate / 100 / 12)) / (1 - Math.pow(1 + baseRate / 100 / 12, -term * 12));
  const higherRate = baseRate + spreadGap;
  const monthlyHigher = (loanAmount * (higherRate / 100 / 12)) / (1 - Math.pow(1 + higherRate / 100 / 12, -term * 12));
  const monthlyDiff = monthlyHigher - monthlyBase;
  const totalDiff = monthlyDiff * term * 12;

  return (
    <Section id="calculator">
      <h2 className="text-3xl font-bold md:text-4xl">The Cost of a Rate Gap</h2>
      <p className="mt-4 text-white/60 max-w-2xl">
        A fraction of a percent doesn&apos;t sound like much. But over 30 years, it adds up
        to tens of thousands of dollars. Adjust the numbers to see the real cost.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div>
          <label className="text-sm text-white/50 block mb-2">Loan Amount</label>
          <input
            type="range" min={100000} max={800000} step={10000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="text-xl font-bold mt-1">${(loanAmount / 1000).toFixed(0)}K</div>
        </div>
        <div>
          <label className="text-sm text-white/50 block mb-2">Base Rate (%)</label>
          <input
            type="range" min={3} max={9} step={0.125}
            value={baseRate}
            onChange={(e) => setBaseRate(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="text-xl font-bold mt-1">{baseRate.toFixed(3)}%</div>
        </div>
        <div>
          <label className="text-sm text-white/50 block mb-2">Rate Gap (pp)</label>
          <input
            type="range" min={0.05} max={1.0} step={0.05}
            value={spreadGap}
            onChange={(e) => setSpreadGap(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="text-xl font-bold mt-1">+{spreadGap.toFixed(2)}pp</div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <motion.div
          className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 text-center"
          style={{ borderTopColor: "#94a3b8", borderTopWidth: 3 }}
        >
          <p className="text-sm text-white/50">White Borrower</p>
          <p className="text-3xl font-bold mt-2">{baseRate.toFixed(3)}%</p>
          <p className="text-white/60 mt-1">${monthlyBase.toFixed(0)}/mo</p>
          <p className="text-sm text-white/40 mt-1">Total: ${(monthlyBase * 360).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
        </motion.div>

        <motion.div
          className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 text-center"
          style={{ borderTopColor: "#10b981", borderTopWidth: 3 }}
        >
          <p className="text-sm text-white/50">Black Borrower (same everything else)</p>
          <p className="text-3xl font-bold mt-2 text-emerald-500">{higherRate.toFixed(3)}%</p>
          <p className="text-white/60 mt-1">${monthlyHigher.toFixed(0)}/mo</p>
          <p className="text-sm text-white/40 mt-1">Total: ${(monthlyHigher * 360).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
        </motion.div>
      </div>

      <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
        <p className="text-white/70">Extra cost over 30 years:</p>
        <p className="text-4xl font-black text-emerald-500 mt-2">
          ${totalDiff.toLocaleString(undefined, {maximumFractionDigits: 0})}
        </p>
        <p className="text-white/50 mt-2 text-sm">
          That&apos;s ${monthlyDiff.toFixed(0)} more per month, every month, for 30 years.
        </p>
      </div>
    </Section>
  );
}
