#!/usr/bin/env python3
"""Download HMDA 2018-2021 data and merge with existing 2022-2023 slims."""
import subprocess, os, csv, gc, random

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

STATES = [
    "AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN",
    "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH",
    "NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT",
    "VA","VT","WA","WV","WI","WY"
]

KEEP_COLS = [
    'activity_year','state_code','derived_race','derived_sex','derived_ethnicity',
    'interest_rate','rate_spread','income','loan_amount','loan_to_value_ratio',
    'debt_to_income_ratio','loan_type','loan_purpose','occupancy_type',
    'property_value','applicant_age','applicant_credit_score_type',
    'lien_status','conforming_loan_limit','total_units'
]

NEW_YEARS = [2018, 2019, 2020, 2021]

def download_state_year(state, year):
    url = f"https://ffiec.cfpb.gov/v2/data-browser-api/view/csv?years={year}&states={state}&actions_taken=1"
    outpath = os.path.join(DATA_DIR, f"{state}_{year}_raw.csv")
    
    if os.path.exists(outpath) and os.path.getsize(outpath) > 1000:
        return outpath
    
    result = subprocess.run(
        ["curl", "-sL", "-o", outpath, url],
        timeout=600, capture_output=True
    )
    
    if os.path.exists(outpath) and os.path.getsize(outpath) > 500:
        return outpath
    return None

def process_raw(path):
    """Read raw CSV, filter, return rows."""
    rows = []
    header = None
    with open(path, 'r') as f:
        reader = csv.DictReader(f)
        if header is None:
            header = [c for c in KEEP_COLS if c in reader.fieldnames]
        
        for row in reader:
            if row.get('loan_purpose') not in ('1', '31', '32'):
                continue
            if row.get('occupancy_type') != '1':
                continue
            
            race = row.get('derived_race', '')
            ethnicity = row.get('derived_ethnicity', '')
            if race not in ('White', 'Black or African American', 'Asian', 'Joint', 'Race Not Available') \
               and ethnicity not in ('Hispanic or Latino', 'Not Hispanic or Latino'):
                continue
            
            rate = row.get('interest_rate', 'Exempt')
            if rate in ('Exempt', 'NA', '', 'N/A'):
                continue
            try:
                float(rate)
            except:
                continue
            
            slim_row = {c: row.get(c, '') for c in header}
            rows.append(slim_row)
    
    return rows, header

def process_state(state):
    """Download new years, merge with existing slim."""
    existing_slim = os.path.join(DATA_DIR, f"{state}_slim.csv")
    merged_path = os.path.join(DATA_DIR, f"{state}_slim_merged.csv")
    
    # Check if already merged
    if os.path.exists(merged_path) and os.path.getsize(merged_path) > 1000:
        lines = sum(1 for _ in open(merged_path)) - 1
        print(f"  {state}: already merged ({lines} rows)")
        return True
    
    # Read existing 2022-2023 data
    existing_rows = []
    header = None
    if os.path.exists(existing_slim):
        with open(existing_slim, 'r') as f:
            reader = csv.DictReader(f)
            header = reader.fieldnames
            for row in reader:
                existing_rows.append(row)
        print(f"  {state}: {len(existing_rows)} existing rows from 2022-2023")
    
    # Download new years
    new_rows = []
    for year in NEW_YEARS:
        print(f"  {state} {year}: downloading...")
        path = download_state_year(state, year)
        if not path:
            print(f"  {state} {year}: download failed")
            continue
        
        rows, hdr = process_raw(path)
        if header is None:
            header = hdr
        new_rows.extend(rows)
        print(f"  {state} {year}: {len(rows)} rows")
        
        # Clean up raw
        os.remove(path)
    
    all_rows = existing_rows + new_rows
    if not all_rows:
        print(f"  {state}: no data")
        return False
    
    total = len(all_rows)
    # Sample if too large (more generous: 500K for 6 years)
    if total > 500000:
        random.seed(42)
        all_rows = random.sample(all_rows, 500000)
    
    # Write merged
    with open(merged_path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=header)
        writer.writeheader()
        writer.writerows(all_rows)
    
    print(f"  {state}: {total} total -> {len(all_rows)} merged")
    del all_rows, existing_rows, new_rows
    gc.collect()
    return True

print("=== Downloading HMDA 2018-2021 and merging ===")
for state in sorted(STATES):
    print(f"\n--- {state} ---")
    process_state(state)

print("\n=== Done ===")
merged = [f for f in os.listdir(DATA_DIR) if f.endswith('_slim_merged.csv')]
print(f"States with merged data: {len(merged)}")
