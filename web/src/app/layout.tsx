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
