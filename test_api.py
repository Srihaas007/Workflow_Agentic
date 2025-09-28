"""
Test script to debug the authentication API
"""
import requests
import json

API_BASE = "http://localhost:8000/api/v1"

def test_health():
    """Test the health endpoint"""
    try:
        response = requests.get(f"{API_BASE}/health")
        print(f"Health endpoint: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except Exception as e:
        print(f"Health endpoint failed: {e}")
        return False

def test_demo_credentials():
    """Test the demo credentials endpoint"""
    try:
        response = requests.get(f"{API_BASE}/auth/demo-credentials")
        print(f"Demo credentials endpoint: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except Exception as e:
        print(f"Demo credentials endpoint failed: {e}")
        return False

def test_login():
    """Test the login endpoint"""
    try:
        credentials = {
            "email_or_username": "admin@automation-platform.com",
            "password": "admin123",
            "remember_me": True
        }
        
        response = requests.post(
            f"{API_BASE}/auth/login", 
            json=credentials,
            headers={"Content-Type": "application/json"}
        )
        print(f"Login endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"Login successful!")
            print(f"Response: {response.json()}")
        else:
            print(f"Login failed: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Login endpoint failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Backend API Endpoints...")
    print("=" * 50)
    
    print("\n1. Testing Health Endpoint...")
    health_ok = test_health()
    
    print("\n2. Testing Demo Credentials Endpoint...")
    demo_ok = test_demo_credentials()
    
    print("\n3. Testing Login Endpoint...")
    login_ok = test_login()
    
    print("\n" + "=" * 50)
    print(f"Results:")
    print(f"Health: {'✅' if health_ok else '❌'}")
    print(f"Demo Credentials: {'✅' if demo_ok else '❌'}")
    print(f"Login: {'✅' if login_ok else '❌'}")