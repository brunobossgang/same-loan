import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Justice Index | Same Loan, Different Rate — Racial Disparities in Mortgage Lending",
  description:
    "Millions of mortgage applications expose stark racial disparities in interest rates and lending. Same income. Same loan. Different rate.",
  openGraph: {
    title: "Justice Index | Same Loan, Different Rate",
    description:
      "Black and Hispanic borrowers pay higher mortgage rates than White borrowers with the same income and loan characteristics. The data is clear.",
    url: "https://sameloandifferentrate.org",
    type: "website",
    images: [
      {
        url: "https://sameloandifferentrate.org/og.png",
        width: 1200,
        height: 630,
        alt: "Same Loan, Different Rate — +0.192pp higher rates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Same Loan, Different Rate | Justice Index",
    description:
      "Hispanic borrowers pay +0.192pp higher mortgage rates, Black +0.161pp. 15.3M loans, 51 states, HMDA/CFPB data.",
    images: ["https://sameloandifferentrate.org/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
