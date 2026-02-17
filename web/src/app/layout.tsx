import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Justice Index | Same Loan, Different Rate — Racial Disparities in Mortgage Lending",
  description:
    "Analysis of 15.3 million mortgages reveals Black and Hispanic borrowers pay higher rates after controlling for income, LTV, and DTI.",
  metadataBase: new URL("https://sameloandifferentrate.org"),
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Bruno Beckman" }],
  openGraph: {
    title: "Same Loan, Different Rate: Racial Disparities in Mortgage Lending",
    description:
      "Analysis of 15.3 million mortgages reveals Black and Hispanic borrowers pay higher rates after controlling for income, LTV, and DTI.",
    url: "https://sameloandifferentrate.org",
    type: "article",
    publishedTime: "2026-02-17T00:00:00Z",
    authors: ["Bruno Beckman"],
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
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Article",
                headline: "Same Loan, Different Rate: Racial Disparities in Mortgage Lending",
                description:
                  "Analysis of 15.3 million mortgages reveals Black and Hispanic borrowers pay higher rates after controlling for income, LTV, and DTI.",
                author: { "@type": "Person", name: "Bruno Beckman" },
                datePublished: "2026-02-17",
                publisher: { "@type": "Organization", name: "Justice Index", url: "https://justice-index.org" },
                mainEntityOfPage: "https://sameloandifferentrate.org",
                image: "https://sameloandifferentrate.org/og.png",
              },
              {
                "@context": "https://schema.org",
                "@type": "Dataset",
                name: "HMDA Mortgage Records 2018-2023",
                description: "15,278,109 HMDA mortgage records from 2018-2023.",
                url: "https://sameloandifferentrate.org",
                creator: { "@type": "Person", name: "Bruno Beckman" },
              },
            ]),
          }}
        />
      </head>
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
