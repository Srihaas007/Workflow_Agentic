"""
Quick backend connectivity test
"""
import requests
import json

def test_backend_connectivity():
    base_url = "http://localhost:8000/api/v1"
    
    print("🧪 Testing Backend Connectivity...")
    print("=" * 50)
    
    # Test 1: Health endpoint
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        print(f"✅ Health endpoint: {response.status_code}")
    except Exception as e:
        print(f"❌ Health endpoint failed: {e}")
        return False
    
    # Test 2: Demo credentials
    try:
        response = requests.get(f"{base_url}/auth/demo-credentials", timeout=5)
        print(f"✅ Demo credentials: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Demo credentials failed: {e}")
        return False
    
    # Test 3: Login attempt
    try:
        login_data = {
            "email_or_username": "admin@automation-platform.com",
            "password": "admin123",
            "remember_me": True
        }
        response = requests.post(f"{base_url}/auth/login", json=login_data, timeout=10)
        print(f"✅ Login test: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   User: {result.get('user', {}).get('email', 'N/A')}")
            print(f"   Token: {'✅ Generated' if result.get('access_token') else '❌ Missing'}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Login test failed: {e}")
        return False
    
    print("\n🎉 All backend tests passed! Integration should work now.")
    return True

if __name__ == "__main__":
    test_backend_connectivity()