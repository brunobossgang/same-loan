#!/usr/bin/env python3
"""Download HMDA data for all states, 2018-2023, and process into analysis-ready format."""
import subprocess, os, csv, json, gc
import random

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

# All 50 states + DC
STATES = [
    "AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN",
    "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH",
    "NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT",
    "VA","VT","WA","WV","WI","WY"
]

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

KEEP_COLS = [
    'activity_year','state_code','derived_race','derived_sex','derived_ethnicity',
    'interest_rate','rate_spread','income','loan_amount','loan_to_value_ratio',
    'debt_to_income_ratio','loan_type','loan_purpose','occupancy_type',
    'property_value','applicant_age','applicant_credit_score_type',
    'lien_status','conforming_loan_limit','total_units'
]

# Download years 2018-2023 (6 years spanning pre-COVID through post-COVID rate environment)
YEARS = [2018, 2019, 2020, 2021, 2022, 2023]

def download_state_year(state, year):
    """Download HMDA data for a state and year."""
    url = f"https://ffiec.cfpb.gov/v2/data-browser-api/view/csv?years={year}&states={state}&actions_taken=1"
    outpath = os.path.join(DATA_DIR, f"{state}_{year}_raw.csv")
    
    if os.path.exists(outpath) and os.path.getsize(outpath) > 1000:
        return outpath
    
    result = subprocess.run(
        ["curl", "-sL", "-o", outpath, url],
        timeout=120, capture_output=True
    )
    
    if os.path.exists(outpath) and os.path.getsize(outpath) > 500:
        return outpath
    return None

def process_state(state):
    """Download, combine years, slim, sample."""
    slim_path = os.path.join(DATA_DIR, f"{state}_slim.csv")
    if os.path.exists(slim_path) and os.path.getsize(slim_path) > 1000:
        lines = sum(1 for _ in open(slim_path)) - 1
        print(f"  {state}: already done ({lines} rows)")
        return True
    
    all_rows = []
    header = None
    
    for year in YEARS:
        print(f"  {state} {year}: downloading...")
        path = download_state_year(state, year)
        if not path:
            print(f"  {state} {year}: download failed")
            continue
        
        with open(path, 'r') as f:
            reader = csv.DictReader(f)
            if header is None:
                header = [c for c in KEEP_COLS if c in reader.fieldnames]
            
            for row in reader:
                # Filter: only conventional and FHA loans, primary residence, 1-unit
                # This gives us the cleanest comparison
                if row.get('loan_purpose') not in ('1', '31', '32'):  # home purchase or refi
                    continue
                if row.get('occupancy_type') != '1':  # primary residence
                    continue
                    
                # Keep all races — Hispanic is in derived_ethnicity, not derived_race
                race = row.get('derived_race', '')
                ethnicity = row.get('derived_ethnicity', '')
                if race not in ('White', 'Black or African American', 'Asian', 'Joint', 'Race Not Available') \
                   and ethnicity not in ('Hispanic or Latino', 'Not Hispanic or Latino'):
                    continue
                
                # Must have interest rate
                rate = row.get('interest_rate', 'Exempt')
                if rate in ('Exempt', 'NA', '', 'N/A'):
                    continue
                
                try:
                    float(rate)
                except:
                    continue
                
                slim_row = {c: row.get(c, '') for c in header}
                all_rows.append(slim_row)
        
        # Clean up raw file
        if os.path.exists(path):
            os.remove(path)
    
    if not all_rows:
        print(f"  {state}: no valid rows")
        return False
    
    # Sample if too large
    total = len(all_rows)
    if total > 200000:
        random.seed(42)
        all_rows = random.sample(all_rows, 200000)
    
    # Write slim
    with open(slim_path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=header)
        writer.writeheader()
        writer.writerows(all_rows)
    
    print(f"  {state}: {total} total -> {len(all_rows)} saved")
    del all_rows
    gc.collect()
    return True

print("=== Downloading HMDA data ===")
for state in sorted(STATES):
    name = STATE_NAMES.get(state, state)
    print(f"\n--- {state} ({name}) ---")
    process_state(state)

# Clean up test file
test_file = os.path.join(DATA_DIR, "test_vt.csv")
if os.path.exists(test_file):
    os.remove(test_file)

print("\n=== Done ===")
slims = [f for f in os.listdir(DATA_DIR) if f.endswith('_slim.csv')]
print(f"States with data: {len(slims)}")
