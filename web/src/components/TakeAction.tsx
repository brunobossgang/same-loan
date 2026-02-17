"use client";

import { useState } from "react";
import Section from "./Section";

const SHARE_URL = "https://sameloandifferentrate.org";
const SHARE_TEXT = "After controlling for income, LTV & DTI — Black borrowers still pay more. 15.3M mortgages exposed. sameloandifferentrate.org via @Justice_Index";

const orgs = [
  { name: "National Fair Housing Alliance", url: "https://nationalfairhousing.org" },
  { name: "CFPB - File a Complaint", url: "https://www.consumerfinance.gov/complaint/" },
  { name: "NAACP Legal Defense Fund", url: "https://www.naacpldf.org" },
  { name: "Center for Responsible Lending", url: "https://www.responsiblelending.org" },
];

export default function TakeAction() {
  const [copied, setCopied] = useState(false);

  const shareLinks = [
    { name: "𝕏", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}` },
    { name: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}` },
    { name: "LinkedIn", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}` },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(SHARE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section id="act" dark={false}>
      <h2 className="text-3xl font-bold md:text-4xl">Take Action</h2>
      <p className="mt-4 text-white/60 max-w-2xl">
        If you believe you&apos;ve been charged a higher rate because of your race,
        you have rights. Share this data, file complaints, and support fair lending.
      </p>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white/80">Share This</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {shareLinks.map((link) => (
            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg text-sm text-white/80 hover:text-white transition-colors">
              {link.name}
            </a>
          ))}
          <button onClick={copyLink}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg text-sm text-white/80 hover:text-white transition-colors">
            {copied ? "Copied! ✓" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Follow CTA */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white/80">Follow the Investigation</h3>
        <p className="mt-2 text-sm text-white/50">New data, updates, and analysis from Justice Index.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="https://x.com/Justice_Index" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg text-sm text-white/80 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            @Justice_Index on X
          </a>
          <a href="https://instagram.com/justiceindex" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-lg text-sm text-white/80 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            @justiceindex on Instagram
          </a>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white/80">Know Your Rights</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4">
            <p className="text-white/90 font-medium">Shop Multiple Lenders</p>
            <p className="text-sm text-white/50 mt-1">Getting 3+ quotes can save you thousands. Rates vary dramatically between lenders.</p>
          </div>
          <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4">
            <p className="text-white/90 font-medium">Request Your Loan Estimate</p>
            <p className="text-sm text-white/50 mt-1">Lenders must provide a standardized Loan Estimate within 3 days. Compare them.</p>
          </div>
          <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4">
            <p className="text-white/90 font-medium">File a Complaint</p>
            <p className="text-sm text-white/50 mt-1">The CFPB investigates lending discrimination. You can file online in minutes.</p>
          </div>
          <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4">
            <p className="text-white/90 font-medium">Check for Fair Lending Violations</p>
            <p className="text-sm text-white/50 mt-1">HUD enforces the Fair Housing Act. Contact your local fair housing center.</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white/80">Support These Organizations</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {orgs.map((org) => (
            <a key={org.name} href={org.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-slate-800/50 border border-white/5 rounded-xl p-4 hover:border-emerald-500/30 transition-colors">
              <span className="text-white/90 font-medium">{org.name}</span>
              <span className="text-white/30 ml-auto">→</span>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
