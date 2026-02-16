#!/usr/bin/env python3
"""Build precomputed.ts from all HMDA slim CSVs."""
import os, json, csv, gc
from collections import defaultdict

DATA_DIR = "data"

STATE_NAMES = {
    "AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California",
    "CO":"Colorado","CT":"Connecticut","DC":"Washington DC","DE":"Delaware","FL":"Florida",
    "GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana",
    "IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine",
    "MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi",
    "MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire",
    "NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota",
    "OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island",
    "SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah",
    "VA":"Virginia","VT":"Vermont","WA":"Washington","WV":"West Virginia","WI":"Wisconsin",
    "WY":"Wyoming"
}

RACE_MAP = {
    'White': 'white',
    'Black or African American': 'black',
    'Hispanic or Latino': 'hispanic',
    'Asian': 'asian',
}

LT_NAMES = {'1':'Conventional','2':'FHA','3':'VA','4':'USDA'}

def process_state(state_code):
    slim_path = os.path.join(DATA_DIR, f"{state_code}_slim.csv")
    if not os.path.exists(slim_path):
        return None
    
    # Collect by race
    rates_by_race = defaultdict(list)
    spreads_by_race = defaultdict(list)
    income_by_race = defaultdict(list)
    loan_amt_by_race = defaultdict(list)
    
    # By race and loan type
    rates_by_race_lt = defaultdict(list)
    spreads_by_race_lt = defaultdict(list)
    
    # By race and income bracket
    spreads_by_race_income = defaultdict(list)
    
    # By year
    rates_by_race_year = defaultdict(list)
    
    total = 0
    
    with open(slim_path) as f:
        for row in csv.DictReader(f):
            raw_race = row.get('derived_race', '')
            race = RACE_MAP.get(raw_race)
            if not race:
                continue
            
            rate_str = row.get('interest_rate', '')
            spread_str = row.get('rate_spread', '')
            income_str = row.get('income', '')
            loan_str = row.get('loan_amount', '')
            lt = row.get('loan_type', '')
            year_str = row.get('activity_year', '')
            
            try:
                rate = float(rate_str)
            except:
                continue
            
            total += 1
            rates_by_race[race].append(rate)
            
            # Rate spread
            try:
                spread = float(spread_str)
                spreads_by_race[race].append(spread)
                if lt in LT_NAMES:
                    spreads_by_race_lt[(race, lt)].append(spread)
                
                # Income bracket
                try:
                    inc = int(income_str)
                    if inc < 50: bracket = '<50K'
                    elif inc < 100: bracket = '50-100K'
                    elif inc < 150: bracket = '100-150K'
                    else: bracket = '150K+'
                    spreads_by_race_income[(race, bracket)].append(spread)
                except:
                    pass
            except:
                pass
            
            # Income and loan amount
            try:
                income_by_race[race].append(int(income_str))
            except:
                pass
            try:
                loan_amt_by_race[race].append(float(loan_str))
            except:
                pass
            
            # Yearly
            try:
                year = int(year_str)
                rates_by_race_year[(race, year)].append(rate)
            except:
                pass
    
    if total < 100:
        return None
    
    def avg(lst):
        return round(sum(lst) / len(lst), 3) if lst else None
    
    # Average rates
    avg_rates = {}
    for race in ['white', 'black', 'hispanic', 'asian']:
        if rates_by_race[race]:
            avg_rates[race] = avg(rates_by_race[race])
    
    # Average spreads
    avg_spreads = {}
    for race in ['white', 'black', 'hispanic', 'asian']:
        if spreads_by_race[race]:
            avg_spreads[race] = avg(spreads_by_race[race])
    
    # Rate gaps
    w_spread = avg_spreads.get('white', 0)
    rate_gap_bw = round(avg_spreads.get('black', 0) - w_spread, 3) if 'black' in avg_spreads else 0
    rate_gap_hw = round(avg_spreads.get('hispanic', 0) - w_spread, 3) if 'hispanic' in avg_spreads else 0
    
    # Average income and loan amount
    avg_income = {r: avg(v) for r, v in income_by_race.items() if v}
    avg_loan = {r: avg(v) for r, v in loan_amt_by_race.items() if v}
    
    # By loan type (spreads)
    loan_type_spreads = {}
    for lt_code, lt_name in LT_NAMES.items():
        lt_data = {}
        for race in ['white', 'black', 'hispanic']:
            vals = spreads_by_race_lt.get((race, lt_code), [])
            if len(vals) > 50:
                lt_data[race] = avg(vals)
        if lt_data:
            loan_type_spreads[lt_name] = lt_data
    
    # By income bracket (spreads)
    income_brackets = []
    for bracket in ['<50K', '50-100K', '100-150K', '150K+']:
        row_data = {"bracket": bracket}
        has_data = False
        for race in ['white', 'black', 'hispanic']:
            vals = spreads_by_race_income.get((race, bracket), [])
            if len(vals) > 30:
                row_data[race] = avg(vals)
                has_data = True
        if has_data:
            income_brackets.append(row_data)
    
    # Counts by race
    counts = {r: len(v) for r, v in rates_by_race.items() if v}
    
    return {
        "total_loans": total,
        "avg_rates": avg_rates,
        "avg_spreads": avg_spreads,
        "rate_gap_bw": rate_gap_bw,
        "rate_gap_hw": rate_gap_hw,
        "avg_income": avg_income,
        "avg_loan_amount": avg_loan,
        "loan_type_spreads": loan_type_spreads,
        "income_brackets": income_brackets,
        "counts": counts,
    }


all_stats = {}
total_loans = 0
all_rates = defaultdict(list)
all_spreads = defaultdict(list)

for f in sorted(os.listdir(DATA_DIR)):
    if not f.endswith('_slim.csv'):
        continue
    sc = f.replace('_slim.csv', '')
    name = STATE_NAMES.get(sc, sc)
    
    print(f"Processing {sc} ({name})...")
    stats = process_state(sc)
    gc.collect()
    
    if stats and stats['total_loans'] > 100:
        all_stats[name] = stats
        total_loans += stats['total_loans']
        
        # Aggregate
        for race in ['white', 'black', 'hispanic', 'asian']:
            if race in stats['avg_rates']:
                all_rates[race].append(stats['avg_rates'][race])
            if race in stats['avg_spreads']:
                all_spreads[race].append(stats['avg_spreads'][race])
        
        gap = stats.get('rate_gap_bw', 0)
        print(f"  ✓ {name}: {stats['total_loans']:,} loans, B/W spread gap: {gap:+.3f}pp")
    else:
        print(f"  ✗ {name}: insufficient data")

# National averages
nat_rates = {r: round(sum(v)/len(v), 3) for r, v in all_rates.items() if v}
nat_spreads = {r: round(sum(v)/len(v), 3) for r, v in all_spreads.items() if v}

states_list = sorted(all_stats.keys())

precomputed = {
    "summary": {
        "total_loans": total_loans,
        "num_states": len(states_list),
        "states": states_list,
        "years": "2022-2023",
    },
    "avg_rates": nat_rates,
    "avg_spreads": nat_spreads,
    "by_state": all_stats,
}

# Save JSON
with open(os.path.join(DATA_DIR, "precomputed.json"), "w") as f:
    json.dump(precomputed, f, indent=2)

# Save TS
ts_path = os.path.join("web", "src", "data", "precomputed.ts")
with open(ts_path, "w") as f:
    f.write("const data = ")
    json.dump(precomputed, f)
    f.write(" as const;\n\nexport default data;\n")

print(f"\n=== {len(all_stats)} states, {total_loans:,} total loans ===")
print(f"National avg spreads: {nat_spreads}")
print(f"precomputed.ts: {os.path.getsize(ts_path)/1024:.0f}KB")
