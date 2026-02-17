"use client";

import Section from "./Section";
import { regressionResults } from "@/data/precomputed";

const coefficients = regressionResults.coefficients;

type CoefData = { coef: number; ci_lower: number; ci_upper: number; p_value: number; significant: boolean };

function CoefRow({ name, data }: { name: string; data: CoefData }) {
  const color = data.coef > 0 ? "text-red-400" : "text-emerald-400";
  const sign = data.coef > 0 ? "+" : "";
  return (
    <tr className="border-b border-white/5">
      <td className="py-3 pr-4 font-medium text-white/80">{name}</td>
      <td className={`py-3 pr-4 font-mono font-bold ${color}`}>
        {sign}{(data.coef * 100).toFixed(1)} bps
      </td>
      <td className="py-3 pr-4 font-mono text-white/50 text-sm">
        ({(data.ci_lower * 100).toFixed(1)}, {(data.ci_upper * 100).toFixed(1)})
      </td>
      <td className="py-3 font-mono text-sm">
        {data.significant ? (
          <span className="text-red-400/80">p &lt; 0.001 ***</span>
        ) : (
          <span className="text-white/30">n.s.</span>
        )}
      </td>
    </tr>
  );
}

export default function Methodology() {
  return (
    <Section id="methodology">
      <h2 className="text-3xl font-bold md:text-4xl">
        Regression Analysis
      </h2>
      <p className="mt-4 text-lg text-white/60 max-w-3xl">
        After controlling for income, loan amount, loan-to-value ratio,
        debt-to-income ratio, loan type, occupancy type, state, and year —{" "}
        <span className="text-white/90 font-semibold">
          significant racial disparities persist.
        </span>
      </p>

      {/* Results table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full max-w-2xl text-left">
          <thead>
            <tr className="border-b border-white/10 text-sm text-white/40 uppercase tracking-wider">
              <th className="pb-3 pr-4">Race / Ethnicity</th>
              <th className="pb-3 pr-4">Rate Premium</th>
              <th className="pb-3 pr-4">95% CI</th>
              <th className="pb-3">Significance</th>
            </tr>
          </thead>
          <tbody>
            <CoefRow name="Black" data={coefficients["Black"]} />
            <CoefRow name="Hispanic" data={coefficients["Hispanic"]} />
            <CoefRow name="Asian" data={coefficients["Asian"]} />
            <CoefRow name="American Indian / Alaska Native" data={coefficients["American Indian / Alaska Native"]} />
            <CoefRow name="Native Hawaiian / Pacific Islander" data={coefficients["Native Hawaiian / Pacific Islander"]} />
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-sm text-white/30">
        Baseline: White non-Hispanic borrowers. &quot;bps&quot; = basis points (1 bps = 0.01 percentage points).
        OLS regression, N = {regressionResults.n.toLocaleString()}, R² = {regressionResults.r_squared}.
      </p>

      {/* Interpretation */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
          <div className="text-2xl font-bold text-red-400">+7.1 bps</div>
          <div className="mt-1 text-sm text-white/60">
            Black borrowers pay 7.1 basis points more than White borrowers
            <span className="text-white/40"> with the same income, loan size, LTV, DTI, loan type, state &amp; year</span>
          </div>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="text-2xl font-bold text-amber-400">+9.7 bps</div>
          <div className="mt-1 text-sm text-white/60">
            Hispanic borrowers pay 9.7 basis points more
            <span className="text-white/40"> with identical observable characteristics</span>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="text-2xl font-bold text-emerald-400">−13.1 bps</div>
          <div className="mt-1 text-sm text-white/60">
            Asian borrowers pay 13.1 basis points less
            <span className="text-white/40"> — the &quot;model minority&quot; pattern persists in lending</span>
          </div>
        </div>
      </div>

      {/* Limitations */}
      <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h3 className="text-lg font-semibold text-white/80">What We Can — and Can&apos;t — Control For</h3>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-emerald-400/80 mb-2">
              ✓ Controlled in this regression
            </h4>
            <ul className="space-y-1 text-sm text-white/50">
              <li>• Income</li>
              <li>• Loan amount</li>
              <li>• Loan-to-value ratio (LTV)</li>
              <li>• Debt-to-income ratio (DTI)</li>
              <li>• Loan type (Conventional, FHA, VA, USDA)</li>
              <li>• Occupancy type</li>
              <li>• State fixed effects (all 50 + DC)</li>
              <li>• Year fixed effects (2018–2023)</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-red-400/80 mb-2">
              ✗ Not available in HMDA data
            </h4>
            <ul className="space-y-1 text-sm text-white/50">
              <li>• <strong className="text-white/70">Credit scores</strong> — the strongest predictor of interest rates.
                HMDA does not collect credit scores to protect borrower privacy.</li>
              <li>• Down payment source &amp; reserves</li>
              <li>• Employment history &amp; job stability</li>
              <li>• Points/fees paid to buy down the rate</li>
            </ul>
            <p className="mt-3 text-xs text-white/30">
              If credit scores fully explained the gap, Black and Hispanic borrowers would
              need systematically lower scores <em>even at the same income, DTI, and LTV</em>.
              Research by the Federal Reserve and CFPB finds credit scores explain part —
              but not all — of the disparity.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
