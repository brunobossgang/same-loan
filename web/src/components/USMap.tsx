"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "./Section";
import data from "@/data/precomputed";

type ViewMode = "bw" | "hw";

const STATE_ABBREVS: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA",
  Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA",
  Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD",
  Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO",
  Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND",
  Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI",
  "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT",
  Vermont: "VT", Virginia: "VA", Washington: "WA", "Washington DC": "DC",
  "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
};

const STATE_POSITIONS: Record<string, { row: number; col: number }> = {
  Alaska: { row: 0, col: 0 }, Maine: { row: 0, col: 11 },
  Washington: { row: 1, col: 0 }, Montana: { row: 1, col: 2 }, "North Dakota": { row: 1, col: 4 },
  Minnesota: { row: 1, col: 5 }, Wisconsin: { row: 1, col: 6 }, Michigan: { row: 1, col: 8 },
  "New York": { row: 1, col: 9 }, Vermont: { row: 1, col: 10 }, "New Hampshire": { row: 1, col: 11 },
  Oregon: { row: 2, col: 0 }, Idaho: { row: 2, col: 1 }, Wyoming: { row: 2, col: 2 },
  "South Dakota": { row: 2, col: 4 }, Iowa: { row: 2, col: 5 }, Illinois: { row: 2, col: 6 },
  Indiana: { row: 2, col: 7 }, Ohio: { row: 2, col: 8 }, Pennsylvania: { row: 2, col: 9 },
  Massachusetts: { row: 2, col: 10 }, "Rhode Island": { row: 2, col: 11 },
  Nevada: { row: 3, col: 0 }, Utah: { row: 3, col: 1 }, Colorado: { row: 3, col: 2 },
  Nebraska: { row: 3, col: 3 }, Kansas: { row: 3, col: 4 }, Missouri: { row: 3, col: 5 },
  Kentucky: { row: 3, col: 6 }, "West Virginia": { row: 3, col: 7 }, Virginia: { row: 3, col: 8 },
  "New Jersey": { row: 3, col: 9 }, Connecticut: { row: 3, col: 10 }, "Washington DC": { row: 3, col: 11 },
  California: { row: 4, col: 0 }, Arizona: { row: 4, col: 1 }, "New Mexico": { row: 4, col: 2 },
  Oklahoma: { row: 4, col: 4 }, Arkansas: { row: 4, col: 5 }, Tennessee: { row: 4, col: 6 },
  "North Carolina": { row: 4, col: 8 }, Maryland: { row: 4, col: 9 }, Delaware: { row: 4, col: 10 },
  Hawaii: { row: 5, col: 0 }, Texas: { row: 5, col: 3 }, Louisiana: { row: 5, col: 5 },
  Mississippi: { row: 5, col: 6 }, Alabama: { row: 5, col: 7 }, Georgia: { row: 5, col: 8 },
  "South Carolina": { row: 5, col: 9 }, Florida: { row: 6, col: 9 },
};

function getGap(stateName: string, mode: ViewMode): number | null {
  const st = data.by_state[stateName as keyof typeof data.by_state] as Record<string, unknown> | undefined;
  if (!st) return null;
  const val = mode === "bw" ? st.rate_gap_bw : st.rate_gap_hw;
  return typeof val === "number" ? val : null;
}

function getStateData(stateName: string) {
  return data.by_state[stateName as keyof typeof data.by_state] as Record<string, unknown> | undefined;
}

function getColor(gap: number | null): string {
  if (gap === null) return "#1e293b";
  // Gap is in percentage points (e.g., 0.2 = 0.2pp)
  // Negative/zero = green, high = red
  if (gap <= 0) return "#34d399";     // emerald-400
  if (gap <= 0.05) return "#6ee7b7";  // emerald-300
  if (gap <= 0.1) return "#a7f3d0";   // emerald-200
  if (gap <= 0.15) return "#fde68a";  // amber-200
  if (gap <= 0.2) return "#fbbf24";   // amber-400
  if (gap <= 0.3) return "#f97316";   // orange-500
  return "#ef4444";                    // red-500
}

function formatGap(gap: number | null): string {
  if (gap === null) return "N/A";
  const sign = gap >= 0 ? "+" : "";
  return `${sign}${(gap * 100).toFixed(0)} bps`;
}

export default function USMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<ViewMode>("bw");

  const cellW = 58;
  const cellH = 50;
  const padding = 3;
  const rectW = cellW - padding * 2;
  const rectH = cellH - padding * 2;

  const activeState = selected || hovered;
  const activeData = activeState ? getStateData(activeState) : null;
  const activeGapBW = activeState ? getGap(activeState, "bw") : null;
  const activeGapHW = activeState ? getGap(activeState, "hw") : null;

  return (
    <Section id="map" dark={false}>
      <h2 className="text-3xl font-bold md:text-4xl text-white">
        State-by-State Lending Gaps
      </h2>
      <p className="mt-4 text-white/60 max-w-2xl">
        Mortgage rate disparities exist in every state. This map shows the average rate spread gap —
        how much more borrowers of color pay compared to white borrowers, even for the same loan.
      </p>

      {/* Toggle */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => setMode("bw")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === "bw"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-white/5 text-white/50 border border-white/10 hover:text-white/70"
          }`}
        >
          Black–White Gap
        </button>
        <button
          onClick={() => setMode("hw")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === "hw"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-white/5 text-white/50 border border-white/10 hover:text-white/70"
          }`}
        >
          Hispanic–White Gap
        </button>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <svg
          viewBox={`0 0 ${12 * cellW} ${7 * cellH}`}
          className="w-full max-w-3xl"
        >
          {Object.entries(STATE_POSITIONS).map(([state, pos]) => {
            const gap = getGap(state, mode);
            const hasData = getStateData(state) !== undefined;
            const x = pos.col * cellW + padding;
            const y = pos.row * cellH + padding;
            const isActive = activeState === state;
            const abbrev = STATE_ABBREVS[state] || state.slice(0, 2).toUpperCase();

            return (
              <g
                key={state}
                onMouseEnter={() => setHovered(state)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(selected === state ? null : state)}
                style={{ cursor: hasData ? "pointer" : "default" }}
              >
                <rect
                  x={x}
                  y={y}
                  width={rectW}
                  height={rectH}
                  rx={6}
                  fill={getColor(gap)}
                  opacity={hasData ? (isActive ? 1 : 0.75) : 0.15}
                  stroke={isActive ? "#fff" : "transparent"}
                  strokeWidth={2}
                  className="transition-all duration-200"
                />
                <text
                  x={x + rectW / 2}
                  y={y + rectH / 2 - (gap !== null ? 4 : 0)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={hasData && gap !== null && gap > 0.15 ? "#000" : hasData ? "#1e293b" : "#475569"}
                  fontSize={11}
                  fontWeight="bold"
                >
                  {abbrev}
                </text>
                {gap !== null && (
                  <text
                    x={x + rectW / 2}
                    y={y + rectH / 2 + 11}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={gap > 0.15 ? "#000" : "#1e293b"}
                    fontSize={8}
                    opacity={0.7}
                  >
                    {gap >= 0 ? "+" : ""}{(gap * 100).toFixed(0)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-white/60">
          <span className="text-white/40 mr-1">Rate gap (bps):</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: "#34d399" }} /> ≤0</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: "#a7f3d0" }} /> 1–10</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: "#fde68a" }} /> 11–15</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: "#fbbf24" }} /> 16–20</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: "#f97316" }} /> 21–30</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: "#ef4444" }} /> &gt;30</span>
        </div>

        {/* State detail tooltip */}
        <AnimatePresence>
          {activeState && activeData && (
            <motion.div
              key={activeState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-6 bg-slate-800 border border-white/10 rounded-xl p-5 text-center min-w-[280px]"
            >
              <h3 className="text-lg font-bold text-white">{activeState}</h3>
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-emerald-400 font-bold text-lg">
                    {formatGap(activeGapBW)}
                  </div>
                  <div className="text-white/40 text-xs">Black–White Gap</div>
                </div>
                <div>
                  <div className="text-amber-400 font-bold text-lg">
                    {formatGap(activeGapHW)}
                  </div>
                  <div className="text-white/40 text-xs">Hispanic–White Gap</div>
                </div>
                <div>
                  <div className="text-white/90 font-bold text-lg">
                    {(activeData.total_loans as number) >= 1_000_000
                      ? ((activeData.total_loans as number) / 1_000_000).toFixed(1) + "M"
                      : ((activeData.total_loans as number) / 1_000).toFixed(0) + "K"}
                  </div>
                  <div className="text-white/40 text-xs">Total Loans</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
