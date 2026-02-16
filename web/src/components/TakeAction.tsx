"use client";

import { useState } from "react";
import Section from "./Section";

const SHARE_URL = "https://sameloandifferentrate.org";
const SHARE_TEXT = "Same income. Same loan. Different rate. Black and Hispanic borrowers pay more for mortgages — and the data proves it.";

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
