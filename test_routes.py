"""
Test all available routes on the backend server
"""
import requests

def test_all_routes():
    base_urls = [
        "http://localhost:8000",
        "http://localhost:8000/api/v1", 
        "http://localhost:8000/auth",
        "http://localhost:8000/api/v1/auth"
    ]
    
    endpoints = [
        "/health",
        "/auth/demo-credentials", 
        "/auth/login",
        "/demo-credentials",
        "/login"
    ]
    
    print("🧪 Testing all possible route combinations...")
    print("=" * 60)
    
    for base in base_urls:
        print(f"\n📍 Testing base URL: {base}")
        for endpoint in endpoints:
            url = base + endpoint
            try:
                response = requests.get(url, timeout=3)
                status = "✅" if response.status_code < 400 else "❌"
                print(f"  {status} {response.status_code} - {url}")
                if response.status_code == 200 and endpoint in ["/health", "/demo-credentials"]:
                    print(f"      Response: {response.json()}")
            except requests.exceptions.Timeout:
                print(f"  ⏱️ TIMEOUT - {url}")
            except requests.exceptions.ConnectionError:
                print(f"  🔌 NO CONNECTION - {url}")
            except Exception as e:
                print(f"  ❌ ERROR - {url}: {e}")

if __name__ == "__main__":
    test_all_routes()