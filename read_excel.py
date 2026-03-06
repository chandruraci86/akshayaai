import pandas as pd
import json

df_dict = pd.read_excel('SAMPLE _DATA.xlsx', sheet_name=None, header=1)

for sheet_name, df in df_dict.items():
    print(f"\n--- Sheet: {sheet_name} ---")
    print("Columns:", list(df.columns)[:20]) # Print first 20 columns
    print("First row data:")
    if not df.empty:
        print(df.head(1).to_json(orient="records", indent=2))
