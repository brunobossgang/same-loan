#!/usr/bin/env python3
"""OLS regression on HMDA data: rate_spread ~ race + controls."""

import glob
import json
import numpy as np
import pandas as pd
import statsmodels.api as sm
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"
OUT_JSON = Path(__file__).parent / "regression_results.json"

# Target ~2.5M rows: sample fraction per file
# 18M total rows, want ~2.5M → sample ~14%
SAMPLE_FRAC = 0.14
RANDOM_STATE = 42

def load_data():
    files = sorted(glob.glob(str(DATA_DIR / "*_slim_merged.csv")))
    chunks = []
    for f in files:
        df = pd.read_csv(f, dtype=str)
        df = df.sample(frac=SAMPLE_FRAC, random_state=RANDOM_STATE)
        chunks.append(df)
        print(f"  Loaded {Path(f).name}: {len(df)} rows (sampled)")
    return pd.concat(chunks, ignore_index=True)

def prep(df):
    # Convert numeric columns
    for col in ['rate_spread', 'income', 'loan_amount', 'loan_to_value_ratio']:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    # Filter to usable rows
    df = df.dropna(subset=['rate_spread', 'income', 'loan_amount'])
    df = df[df['rate_spread'] > -10]  # valid rate spreads
    df = df[df['income'] > 0]

    # Keep main race categories
    keep_races = ['White', 'Black or African American', 'Asian',
                  'Native Hawaiian or Other Pacific Islander',
                  'American Indian or Alaska Native']
    df = df[df['derived_race'].isin(keep_races)]

    # Ethnicity: simplify to Hispanic vs not
    df['hispanic'] = (df['derived_ethnicity'] == 'Hispanic or Latino').astype(int)

    # Race dummies (White = baseline)
    race_dummies = pd.get_dummies(df['derived_race'], prefix='race', drop_first=False)
    # Drop White as baseline
    baseline = 'race_White'
    race_cols = [c for c in race_dummies.columns if c != baseline]
    df = pd.concat([df, race_dummies[race_cols]], axis=1)

    # LTV: already numeric for most, coerce
    df['loan_to_value_ratio'] = pd.to_numeric(df['loan_to_value_ratio'], errors='coerce')

    # DTI: categorical ranges → midpoint
    dti_map = {
        '<20%': 15, '20%-<30%': 25, '30%-<36%': 33,
        '36': 36, '37': 37, '38': 38, '39': 39, '40': 40,
        '41': 41, '42': 42, '43': 43, '44': 44, '45': 45,
        '46': 46, '47': 47, '48': 48, '49': 49,
        '50%-60%': 55, '>60%': 65,
    }
    df['dti_numeric'] = df['debt_to_income_ratio'].map(dti_map)
    # Try direct numeric parse for any exact numbers
    mask = df['dti_numeric'].isna()
    df.loc[mask, 'dti_numeric'] = pd.to_numeric(df.loc[mask, 'debt_to_income_ratio'], errors='coerce')

    # Loan type, occupancy type dummies
    df['loan_type'] = df['loan_type'].astype(str)
    df['occupancy_type'] = df['occupancy_type'].astype(str)
    lt_dummies = pd.get_dummies(df['loan_type'], prefix='loantype', drop_first=True)
    ot_dummies = pd.get_dummies(df['occupancy_type'], prefix='occtype', drop_first=True)

    # Year dummies
    df['activity_year'] = df['activity_year'].astype(str)
    yr_dummies = pd.get_dummies(df['activity_year'], prefix='year', drop_first=True)

    # State dummies
    st_dummies = pd.get_dummies(df['state_code'], prefix='state', drop_first=True)

    # Build X matrix
    continuous = ['income', 'loan_amount', 'loan_to_value_ratio', 'dti_numeric']
    X_parts = [df[continuous + race_cols + ['hispanic']], lt_dummies, ot_dummies, yr_dummies, st_dummies]
    X = pd.concat(X_parts, axis=1).astype(float)
    y = df['rate_spread'].astype(float)

    # Drop rows with any NaN
    mask = X.notna().all(axis=1) & y.notna()
    X = X[mask]
    y = y[mask]

    X = sm.add_constant(X)
    return X, y, race_cols

def run():
    print("Loading data...")
    df = load_data()
    print(f"Total rows loaded: {len(df)}")

    print("Preparing features...")
    X, y, race_cols = prep(df)
    print(f"Regression sample size: {len(X)}")

    print("Running OLS (this may take a minute)...")
    model = sm.OLS(y, X).fit()
    print(model.summary().tables[0])

    # Extract key coefficients
    key_vars = race_cols + ['hispanic']
    results = {
        'n': int(model.nobs),
        'r_squared': round(model.rsquared, 4),
        'adj_r_squared': round(model.rsquared_adj, 4),
        'coefficients': {}
    }

    for var in key_vars:
        if var in model.params:
            ci = model.conf_int().loc[var]
            results['coefficients'][var] = {
                'coef': round(model.params[var], 4),
                'std_err': round(model.bse[var], 4),
                'p_value': round(model.pvalues[var], 6),
                'ci_lower': round(ci[0], 4),
                'ci_upper': round(ci[1], 4),
                'significant': bool(model.pvalues[var] < 0.001),
            }

    # Pretty names
    name_map = {
        'race_Black or African American': 'Black',
        'race_Asian': 'Asian',
        'race_Native Hawaiian or Other Pacific Islander': 'Native Hawaiian / Pacific Islander',
        'race_American Indian or Alaska Native': 'American Indian / Alaska Native',
        'hispanic': 'Hispanic',
    }
    results['named_coefficients'] = {}
    for k, v in results['coefficients'].items():
        results['named_coefficients'][name_map.get(k, k)] = v

    # Controls used
    results['controls'] = [
        'income', 'loan_amount', 'loan_to_value_ratio', 'debt_to_income_ratio',
        'loan_type', 'occupancy_type', 'activity_year', 'state'
    ]

    print("\n=== KEY RESULTS ===")
    for name, vals in results['named_coefficients'].items():
        sig = "***" if vals['p_value'] < 0.001 else "**" if vals['p_value'] < 0.01 else "*" if vals['p_value'] < 0.05 else ""
        print(f"  {name}: {vals['coef']:+.4f} ({vals['ci_lower']:.4f}, {vals['ci_upper']:.4f}) {sig}")
    print(f"  R² = {results['r_squared']}, N = {results['n']:,}")

    with open(OUT_JSON, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\nResults saved to {OUT_JSON}")

    return results

if __name__ == '__main__':
    run()
