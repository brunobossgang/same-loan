"use client";

import Section from "./Section";

export default function About() {
  return (
    <Section id="about">
      <h2 className="text-3xl font-bold md:text-4xl">About This Project</h2>

      <div className="mt-8 space-y-6 text-white/60">
        <div>
          <h3 className="text-lg font-semibold text-white/80">Data Source</h3>
          <p className="mt-2">
            This project uses data from the{" "}
            <a
              href="https://ffiec.cfpb.gov/data-publication/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline"
            >
              Home Mortgage Disclosure Act (HMDA)
            </a>
            , administered by the Consumer Financial Protection Bureau (CFPB).
            HMDA requires most mortgage lenders to report detailed data about each
            application, including the borrower&apos;s race, income, loan terms, and
            the interest rate charged.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white/80">Methodology</h3>
          <p className="mt-2">
            We analyze originated mortgage loans (home purchase and refinance) for
            primary residences across all 50 states and DC, spanning 2018–2023. Rate
            spreads (above the benchmark APOR rate) are compared by race, stratified
            by income bracket, loan type (conventional, FHA, VA, USDA), and state.
            Hispanic ethnicity is identified via HMDA&apos;s derived_ethnicity field.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white/80">Limitations</h3>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>HMDA does not include credit scores (the strongest predictor of rates)</li>
            <li>Unobserved factors (down payment source, reserves, employment history) may differ</li>
            <li>Rate differences shrink but persist after controlling for available factors</li>
            <li>This is observational data — we document disparities, not prove discrimination</li>
          </ul>
        </div>
      </div>

      {/* Cross-link banner */}
      <div className="mt-12 bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border border-emerald-500/20 rounded-2xl p-6">
        <p className="text-sm font-medium uppercase tracking-wider text-emerald-400/80 mb-2">
          Justice Index · Three Investigations
        </p>
        <p className="text-white/70">
          Bias doesn&apos;t stop at lending. It follows people from the traffic stop
          to the courtroom to the bank.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="https://samestopdifferentoutcome.org"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors"
          >
            Same Stop, Different Outcome → Traffic Stops
          </a>
          <a
            href="https://samecrimedifferenttime.org"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors"
          >
            Same Crime, Different Time → Federal Sentencing
          </a>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/30">
        <div className="flex flex-wrap justify-center gap-4 mb-3">
          <a href="https://justice-index.org" className="hover:text-white/50 transition">Justice Index</a>
          <a href="https://samestopdifferentoutcome.org" className="hover:text-white/50 transition">Same Stop</a>
          <a href="https://samecrimedifferenttime.org" className="hover:text-white/50 transition">Same Crime</a>
          <a href="https://github.com/brunobossgang/same-loan" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition">GitHub</a>
          <a href="https://instagram.com/justiceindex" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition">Instagram</a>
        </div>
        <p>© 2026 Justice Index</p>
      </div>
    </Section>
  );
}
