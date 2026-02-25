# 🏦 Same Loan, Different Rate

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python&logoColor=white)](https://python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Live](https://img.shields.io/badge/Live-sameloandifferentrate.org-blue)](https://sameloandifferentrate.org)

**Do equally qualified borrowers get the same mortgage rate? An analysis of 1,892,859 mortgage applications reveals that Black and Hispanic applicants pay more — even after controlling for financial factors.**

🔗 **Live:** [sameloandifferentrate.org](https://sameloandifferentrate.org)

---

## Key Findings

After controlling for loan amount, income, loan-to-value ratio, property type, loan type, and lender:

- **Black applicants pay +7.1 basis points** more in interest (OLS, p < 0.001)
- **Hispanic applicants pay +9.7 basis points** more in interest (OLS, p < 0.001)
- Disparities persist across lenders, loan types, and geographies

## Data

- **Source:** [Home Mortgage Disclosure Act (HMDA)](https://www.consumerfinance.gov/data-research/hmda/) data via the Consumer Financial Protection Bureau (CFPB)
- **Scope:** 1,892,859 mortgage applications, 2018–2023 (6 years)
- **Unit of analysis:** Individual mortgage application

## Methodology

Ordinary Least Squares (OLS) regression on interest rate spread.

**Controls:**
- Loan amount
- Applicant income
- Loan-to-value ratio (LTV)
- Property type
- Loan type (conventional, FHA, VA, USDA)
- Lender (fixed effects)

**Limitations:** HMDA data does not include credit scores, which are a major factor in rate-setting. The observed disparity may partially reflect credit score differences correlated with race due to historical inequities. Results should be interpreted as documenting disparities in outcomes, not necessarily lender-level discrimination.

## Tech Stack

- **Frontend:** React / Next.js + Tailwind CSS, deployed on Vercel
- **Analysis:** Python (statsmodels, pandas)

## Part of the Justice Index Project

**[Justice Index](https://justice-index.org)** analyzes racial bias across American institutions. This is one of three live investigations:

| Investigation | Focus | Data |
|---|---|---|
| **[Same Crime, Different Time](https://samecrimedifferenttime.org)** | Federal sentencing | 1.3M cases |
| **[Same Stop, Different Outcome](https://samestopdifferentoutcome.org)** | Traffic policing | 8.6M stops |
| **[Same Loan, Different Rate](https://sameloandifferentrate.org)** | Mortgage lending | 1.9M applications |

## License

MIT — see [LICENSE](LICENSE).

## Author

**Bruno Beckman** · [justice-index.org](https://justice-index.org)
