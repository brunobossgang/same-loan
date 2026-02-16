"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Section from "./Section";
import data from "@/data/precomputed";

const RACE_COLORS: Record<string, string> = {
  white: "#94a3b8",
  black: "#10b981",
  hispanic: "#f59e0b",
  asian: "#22d3ee",
};

export default function RateComparison() {
  const states = data.summary.states;
  const [selectedState, setSelectedState] = useState<string>(states[0]);
  const stateData = data.by_state[selectedState as keyof typeof data.by_state];

  const spreadData = Object.entries(stateData?.avg_spreads || {}).map(([race, spread]) => ({
    race: race.charAt(0).toUpperCase() + race.slice(1),
    spread: spread as number,
    fill: RACE_COLORS[race] || "#a78bfa",
  }));

  const bwGap = stateData?.rate_gap_bw || 0;
  const hwGap = stateData?.rate_gap_hw || 0;

  return (
    <Section id="rates" dark={false}>
      <h2 className="text-3xl font-bold md:text-4xl">The Rate Gap</h2>
      <p className="mt-4 text-white/60 max-w-2xl">
        Rate spread measures how much above the benchmark rate (APOR) a borrower pays.
        Higher spread = worse deal. Even after accounting for market conditions and loan terms,
        the gaps persist.
      </p>

      <div className="mt-6">
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="bg-slate-800 text-white border border-white/10 rounded-lg px-4 py-2 text-sm"
        >
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-8 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={spreadData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} unit="pp" />
            <YAxis type="category" dataKey="race" tick={{ fill: "#94a3b8", fontSize: 12 }} width={80} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: 8 }}
              formatter={(value) => [`${value}pp above benchmark`, "Rate Spread"]}
            />
            <Bar dataKey="spread" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] flex items-center gap-3 bg-slate-800/50 rounded-xl p-4">
          <span className="text-3xl font-black text-emerald-500">{bwGap > 0 ? "+" : ""}{(bwGap as number).toFixed(3)}pp</span>
          <span className="text-white/70 text-sm">
            <span className="text-emerald-400 font-semibold">Black</span> vs White spread gap in {selectedState}
          </span>
        </div>
        <div className="flex-1 min-w-[200px] flex items-center gap-3 bg-slate-800/50 rounded-xl p-4">
          <span className="text-3xl font-black text-amber-500">{hwGap > 0 ? "+" : ""}{(hwGap as number).toFixed(3)}pp</span>
          <span className="text-white/70 text-sm">
            <span className="text-amber-400 font-semibold">Hispanic</span> vs White spread gap in {selectedState}
          </span>
        </div>
      </div>
    </Section>
  );
}
