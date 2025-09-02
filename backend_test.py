#!/usr/bin/env python3
"""
Backend API Testing Suite
Tests all backend endpoints and functionality for the OG merch application
"""

import requests
import json
import os
import sys
from datetime import datetime
import time

# Load environment variables
sys.path.append('/app/frontend')
from dotenv import load_dotenv

# Load frontend .env to get the backend URL
load_dotenv('/app/frontend/.env')
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL')

if not BACKEND_URL:
    print("❌ REACT_APP_BACKEND_URL not found in frontend/.env")
    sys.exit(1)

# Ensure API prefix
API_BASE_URL = f"{BACKEND_URL}/api"

print(f"🔗 Testing Backend API at: {API_BASE_URL}")
print("=" * 60)

class BackendTester:
    def __init__(self):
        self.passed_tests = 0
        self.failed_tests = 0
        self.test_results = []
        
    def log_result(self, test_name, success, message=""):
        status = "✅ PASS" if success else "❌ FAIL"
        result = f"{status}: {test_name}"
        if message:
            result += f" - {message}"
        print(result)
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat()
        })
        
        if success:
            self.passed_tests += 1
        else:
            self.failed_tests += 1
    
    def test_server_health(self):
        """Test basic server health and root endpoint"""
        try:
            response = requests.get(f"{API_BASE_URL}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("message") == "Hello World":
                    self.log_result("Server Health Check", True, "Root endpoint responding correctly")
                    return True
                else:
                    self.log_result("Server Health Check", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_result("Server Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_result("Server Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_environment_variables(self):
        """Test that environment variables are properly loaded"""
        try:
            # Check if we can access the backend (indirect test of env vars)
            response = requests.get(f"{API_BASE_URL}/", timeout=5)
            if response.status_code == 200:
                self.log_result("Environment Variables", True, "Backend accessible, env vars loaded")
                return True
            else:
                self.log_result("Environment Variables", False, "Backend not accessible")
                return False
        except Exception as e:
            self.log_result("Environment Variables", False, f"Error: {str(e)}")
            return False
    
    def test_cors_configuration(self):
        """Test CORS configuration"""
        try:
            # Make an OPTIONS request to check CORS headers
            response = requests.options(f"{API_BASE_URL}/", timeout=5)
            cors_headers = [
                'access-control-allow-origin',
                'access-control-allow-methods',
                'access-control-allow-headers'
            ]
            
            has_cors = any(header in response.headers for header in cors_headers)
            if has_cors or response.status_code in [200, 204]:
                self.log_result("CORS Configuration", True, "CORS headers present or OPTIONS allowed")
                return True
            else:
                self.log_result("CORS Configuration", False, "No CORS headers found")
                return False
        except Exception as e:
            self.log_result("CORS Configuration", False, f"Error: {str(e)}")
            return False
    
    def test_create_status_check(self):
        """Test POST /api/status endpoint"""
        try:
            test_data = {
                "client_name": "OG_Test_Client_" + str(int(time.time()))
            }
            
            response = requests.post(
                f"{API_BASE_URL}/status",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'client_name', 'timestamp']
                
                if all(field in data for field in required_fields):
                    if data['client_name'] == test_data['client_name']:
                        self.log_result("Create Status Check", True, f"Created status check with ID: {data['id']}")
                        return data['id']
                    else:
                        self.log_result("Create Status Check", False, "Client name mismatch")
                        return None
                else:
                    self.log_result("Create Status Check", False, f"Missing required fields: {required_fields}")
                    return None
            else:
                self.log_result("Create Status Check", False, f"HTTP {response.status_code}: {response.text}")
                return None
                
        except requests.exceptions.RequestException as e:
            self.log_result("Create Status Check", False, f"Request error: {str(e)}")
            return None
        except Exception as e:
            self.log_result("Create Status Check", False, f"Error: {str(e)}")
            return None
    
    def test_get_status_checks(self):
        """Test GET /api/status endpoint"""
        try:
            response = requests.get(f"{API_BASE_URL}/status", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Get Status Checks", True, f"Retrieved {len(data)} status checks")
                    return True
                else:
                    self.log_result("Get Status Checks", False, "Response is not a list")
                    return False
            else:
                self.log_result("Get Status Checks", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Get Status Checks", False, f"Request error: {str(e)}")
            return False
        except Exception as e:
            self.log_result("Get Status Checks", False, f"Error: {str(e)}")
            return False
    
    def test_mongodb_integration(self):
        """Test MongoDB integration by creating and retrieving data"""
        try:
            # Create a test status check
            test_client_name = f"MongoDB_Test_{int(time.time())}"
            create_data = {"client_name": test_client_name}
            
            create_response = requests.post(
                f"{API_BASE_URL}/status",
                json=create_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if create_response.status_code != 200:
                self.log_result("MongoDB Integration", False, "Failed to create test record")
                return False
            
            created_record = create_response.json()
            created_id = created_record.get('id')
            
            # Retrieve all status checks to verify our record exists
            get_response = requests.get(f"{API_BASE_URL}/status", timeout=10)
            
            if get_response.status_code != 200:
                self.log_result("MongoDB Integration", False, "Failed to retrieve records")
                return False
            
            all_records = get_response.json()
            
            # Check if our created record exists in the retrieved list
            found_record = None
            for record in all_records:
                if record.get('id') == created_id:
                    found_record = record
                    break
            
            if found_record and found_record.get('client_name') == test_client_name:
                self.log_result("MongoDB Integration", True, "Successfully created and retrieved record from MongoDB")
                return True
            else:
                self.log_result("MongoDB Integration", False, "Created record not found in database")
                return False
                
        except Exception as e:
            self.log_result("MongoDB Integration", False, f"Error: {str(e)}")
            return False
    
    def test_api_routes_accessibility(self):
        """Test that all defined API routes are accessible"""
        routes_to_test = [
            ("GET", "/", "Root endpoint"),
            ("GET", "/status", "Get status checks"),
            ("POST", "/status", "Create status check")
        ]
        
        all_accessible = True
        
        for method, path, description in routes_to_test:
            try:
                url = f"{API_BASE_URL}{path}"
                
                if method == "GET":
                    response = requests.get(url, timeout=5)
                elif method == "POST":
                    # For POST, send valid test data
                    test_data = {"client_name": "Route_Test_Client"}
                    response = requests.post(url, json=test_data, timeout=5)
                
                if response.status_code in [200, 201]:
                    print(f"  ✅ {method} {path} - {description}")
                else:
                    print(f"  ❌ {method} {path} - {description} (HTTP {response.status_code})")
                    all_accessible = False
                    
            except Exception as e:
                print(f"  ❌ {method} {path} - {description} (Error: {str(e)})")
                all_accessible = False
        
        self.log_result("API Routes Accessibility", all_accessible, "All defined routes tested")
        return all_accessible
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Backend API Tests...")
        print()
        
        # Test 1: Server Health
        print("1. Testing Server Health...")
        self.test_server_health()
        print()
        
        # Test 2: Environment Variables
        print("2. Testing Environment Variables...")
        self.test_environment_variables()
        print()
        
        # Test 3: CORS Configuration
        print("3. Testing CORS Configuration...")
        self.test_cors_configuration()
        print()
        
        # Test 4: API Routes Accessibility
        print("4. Testing API Routes Accessibility...")
        self.test_api_routes_accessibility()
        print()
        
        # Test 5: Create Status Check
        print("5. Testing Create Status Check...")
        self.test_create_status_check()
        print()
        
        # Test 6: Get Status Checks
        print("6. Testing Get Status Checks...")
        self.test_get_status_checks()
        print()
        
        # Test 7: MongoDB Integration
        print("7. Testing MongoDB Integration...")
        self.test_mongodb_integration()
        print()
        
        # Summary
        print("=" * 60)
        print("🏁 TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {self.passed_tests}")
        print(f"❌ Failed: {self.failed_tests}")
        print(f"📊 Total: {self.passed_tests + self.failed_tests}")
        
        if self.failed_tests == 0:
            print("\n🎉 ALL TESTS PASSED! Backend is working correctly.")
            return True
        else:
            print(f"\n⚠️  {self.failed_tests} test(s) failed. Please check the issues above.")
            return False

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    
    # Save test results to file
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'backend_url': API_BASE_URL,
            'passed_tests': tester.passed_tests,
            'failed_tests': tester.failed_tests,
            'overall_success': success,
            'test_results': tester.test_results
        }, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)