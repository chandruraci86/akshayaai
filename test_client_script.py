import traceback
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

try:
    with open('SAMPLE _DATA.xlsx', 'rb') as f:
        response = client.post('/api/ingest', files={'file': f})
    
    print("Status:", response.status_code)
    print("Response data:", response.text)
except Exception as e:
    traceback.print_exc()
