"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import Section from "./Section";
import data from "@/data/precomputed";

const RACE_COLORS: Record<string, string> = {
  white: "#94a3b8",
  black: "#10b981",
  hispanic: "#f59e0b",
  asian: "#22d3ee",
};

const RACE_LABELS: Record<string, string> = {
  white: "White",
  black: "Black",
  hispanic: "Hispanic",
  asian: "Asian",
};

export default function Trends() {
  const yearly = data.yearly_spreads;
  const years = Object.keys(yearly).sort();

  const chartData = years.map((year) => ({
    year,
    ...yearly[year as keyof typeof yearly],
  }));

  return (
    <Section id="trends" dark>
      <h2 className="text-3xl font-bold md:text-4xl">6-Year Trends</h2>
      <p className="mt-4 max-w-2xl text-white/60">
        How the rate spread gap changed from 2018 to 2023. Rate spread measures
        how much above the benchmark rate borrowers pay — higher means a worse
        deal. The racial gap persists through booms, COVID, and rate hikes.
      </p>

      <div className="mt-10 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              unit="pp"
              domain={[0, "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "none",
                borderRadius: 8,
              }}
              formatter={(value: number | undefined) => [`${(value ?? 0).toFixed(3)}pp`, ""]}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Legend
              formatter={(value: string) => (
                <span style={{ color: "#e2e8f0", fontSize: 13 }}>
                  {RACE_LABELS[value] || value}
                </span>
              )}
            />

            {/* Annotations */}
            <ReferenceLine
              x="2020"
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeOpacity={0.6}
              label={{
                value: "COVID-19",
                position: "top",
                fill: "#ef4444",
                fontSize: 11,
              }}
            />
            <ReferenceLine
              x="2022"
              stroke="#a78bfa"
              strokeDasharray="4 4"
              strokeOpacity={0.6}
              label={{
                value: "Rate hikes",
                position: "top",
                fill: "#a78bfa",
                fontSize: 11,
              }}
            />

            {(["black", "hispanic", "white", "asian"] as const).map((race) => (
              <Line
                key={race}
                type="monotone"
                dataKey={race}
                name={race}
                stroke={RACE_COLORS[race]}
                strokeWidth={2.5}
                dot={{ r: 4, fill: RACE_COLORS[race] }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-800/50 p-4">
          <p className="text-2xl font-black text-emerald-500">2020</p>
          <p className="mt-1 text-sm text-white/60">
            COVID-19 drove rates down across the board, but minorities still
            paid more above benchmark.
          </p>
        </div>
        <div className="rounded-xl bg-slate-800/50 p-4">
          <p className="text-2xl font-black text-purple-400">2022–23</p>
          <p className="mt-1 text-sm text-white/60">
            Fed rate hikes pushed spreads up again. The gap between Black and
            White borrowers fluctuated but never closed.
          </p>
        </div>
        <div className="rounded-xl bg-slate-800/50 p-4">
          <p className="text-2xl font-black text-cyan-400">Persistent</p>
          <p className="mt-1 text-sm text-white/60">
            Across all 6 years, Black and Hispanic borrowers consistently paid
            higher rate spreads than White and Asian borrowers.
          </p>
        </div>
      </div>
    </Section>
  );
}
