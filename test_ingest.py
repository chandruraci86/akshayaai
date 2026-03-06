import requests
import json

base_url = "http://127.0.0.1:8000/api"
file_path = "SAMPLE _DATA.xlsx"

print(f"Uploading {file_path} to {base_url}/ingest...")

with open(file_path, "rb") as f:
    response = requests.post(f"{base_url}/ingest", files={"file": f})

print(f"Status: {response.status_code}")
print("Response:", json.dumps(response.json(), indent=2))
