import requests
import json
import time

base_url = "http://127.0.0.1:8000/api"

print("1. Fetching all buckets...")
r_buckets = requests.get(f"{base_url}/buckets")
buckets = r_buckets.json()
print(f"Total Buckets: {len(buckets)}")
if len(buckets) > 0:
    print("Sample Bucket:", json.dumps(buckets[0], indent=2))
    
    bucket_id = buckets[0]["id"]
    print(f"\n2. Updating strategy for bucket {bucket_id} to Margin...")
    r_update = requests.put(f"{base_url}/buckets/{bucket_id}/strategy", json={"strategy": "Margin"})
    print("Update Response:", r_update.status_code, r_update.json())

print("\n3. Fetching Reorder Dashboard (Smart List)...")
r_dash = requests.get(f"{base_url}/reorder-dashboard")
print(f"Dashboard Items: {len(r_dash.json())}")
if len(r_dash.json()) > 0:
     print("Top Urgent Item:", json.dumps(r_dash.json()[0], indent=2))
