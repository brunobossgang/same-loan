"use client";

import Section from "./Section";
import data from "@/data/precomputed";

export default function StateCards() {
  const states = data.summary.states;
  // Sort by B/W gap (worst first)
  const sorted = [...states].sort((a, b) => {
    const aGap = (data.by_state[a as keyof typeof data.by_state]?.rate_gap_bw as number) || 0;
    const bGap = (data.by_state[b as keyof typeof data.by_state]?.rate_gap_bw as number) || 0;
    return bGap - aGap;
  });

  return (
    <Section id="states">
      <h2 className="text-3xl font-bold md:text-4xl">State Rankings</h2>
      <p className="mt-4 text-white/60 max-w-2xl">
        Where are the biggest lending gaps? States ranked by the Black-White rate spread
        difference. Positive = Black borrowers pay more above benchmark.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.slice(0, 15).map((state, i) => {
          const st = data.by_state[state as keyof typeof data.by_state];
          const gap = (st?.rate_gap_bw as number) || 0;
          const loans = st?.total_loans || 0;
          const isPositive = gap > 0;

          return (
            <div
              key={state}
              className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{state}</h3>
                <span className="text-xs text-white/30">#{i + 1}</span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-2xl font-black ${isPositive ? "text-emerald-500" : "text-blue-400"}`}>
                  {gap > 0 ? "+" : ""}{gap.toFixed(3)}pp
                </span>
                <span className="text-xs text-white/40">B/W gap</span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-white/40">
                <span>{loans.toLocaleString()} loans</span>
                <span>
                  {st?.avg_rates?.white ? `W:${(st.avg_rates.white as number).toFixed(2)}%` : ""}
                  {st?.avg_rates?.black ? ` B:${(st.avg_rates.black as number).toFixed(2)}%` : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
