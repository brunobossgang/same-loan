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
          const bwGap = (st?.rate_gap_bw as number) || 0;
          const hwGap = (st?.rate_gap_hw as number) || 0;
          const loans = st?.total_loans || 0;

          return (
            <div
              key={state}
              className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{state}</h3>
                <span className="text-xs text-white/30">#{i + 1}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-black ${bwGap > 0 ? "text-emerald-500" : "text-blue-400"}`}>
                    {bwGap > 0 ? "+" : ""}{bwGap.toFixed(3)}pp
                  </span>
                  <span className="text-xs text-white/40">B/W</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl font-black ${hwGap > 0 ? "text-amber-500" : "text-blue-400"}`}>
                    {hwGap > 0 ? "+" : ""}{hwGap.toFixed(3)}pp
                  </span>
                  <span className="text-xs text-white/40">H/W</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-white/40">
                {loans.toLocaleString()} loans
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
