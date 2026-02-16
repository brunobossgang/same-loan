"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Section from "./Section";
import data from "@/data/precomputed";

export default function IncomeAnalysis() {
  const statesWithBrackets = data.summary.states.filter((s) => {
    const st = data.by_state[s as keyof typeof data.by_state];
    return st.income_brackets && (st.income_brackets as unknown as Array<Record<string, unknown>>).length > 0;
  });

  const [selectedState, setSelectedState] = useState<string>(statesWithBrackets[0] || data.summary.states[0]);
  const stateData = data.by_state[selectedState as keyof typeof data.by_state];
  const brackets = (stateData?.income_brackets || []) as unknown as Array<Record<string, unknown>>;

  return (
    <Section id="income" dark={false}>
      <h2 className="text-3xl font-bold md:text-4xl">Same Income, Different Rate</h2>
      <p className="mt-4 text-white/60 max-w-2xl">
        &ldquo;Maybe they have lower incomes.&rdquo; No. Even within the same income bracket,
        the rate spread gap persists. This chart shows the average spread above benchmark
        by race, at each income level.
      </p>

      <div className="mt-6">
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="bg-slate-800 text-white border border-white/10 rounded-lg px-4 py-2 text-sm"
        >
          {statesWithBrackets.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-8 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={brackets as Array<Record<string, unknown>>}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="bracket" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} unit="pp" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: 8 }}
              formatter={(value) => [`${value}pp`, "Rate Spread"]}
            />
            <Legend />
            <Bar dataKey="white" fill="#94a3b8" name="White" radius={[4, 4, 0, 0]} />
            <Bar dataKey="black" fill="#10b981" name="Black" radius={[4, 4, 0, 0]} />
            <Bar dataKey="hispanic" fill="#f59e0b" name="Hispanic" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
        <p className="text-emerald-400 font-semibold">Key Finding</p>
        <p className="mt-2 text-white/70">
          The income explanation doesn&apos;t hold up. At every income level, minority borrowers
          tend to pay higher rate spreads. The gap often <em>widens</em> at higher incomes,
          suggesting the disparity isn&apos;t about ability to pay.
        </p>
      </div>
    </Section>
  );
}
