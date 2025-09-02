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
            # Test CORS with Origin header (this is when CORS headers are sent)
            headers = {'Origin': 'https://example.com'}
            response = requests.get(f"{API_BASE_URL}/", headers=headers, timeout=5)
            
            cors_headers = [
                'access-control-allow-origin',
                'access-control-allow-credentials'
            ]
            
            found_headers = []
            for header in cors_headers:
                if header in response.headers:
                    found_headers.append(f"{header}: {response.headers[header]}")
            
            if found_headers:
                self.log_result("CORS Configuration", True, f"CORS headers found: {', '.join(found_headers)}")
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
    
    def test_shopify_environment_variables(self):
        """Test that Shopify environment variables are properly configured"""
        try:
            # Load backend .env file to check Shopify credentials
            load_dotenv('/app/backend/.env')
            
            required_shopify_vars = [
                'SHOPIFY_STORE_DOMAIN',
                'SHOPIFY_STOREFRONT_API_TOKEN',
                'SHOPIFY_STOREFRONT_API_VERSION',
                'SHOPIFY_ADMIN_API_KEY',
                'SHOPIFY_ADMIN_API_SECRET'
            ]
            
            missing_vars = []
            configured_vars = []
            
            for var in required_shopify_vars:
                value = os.getenv(var)
                if not value:
                    missing_vars.append(var)
                else:
                    # Mask sensitive tokens for logging
                    if 'TOKEN' in var or 'KEY' in var or 'SECRET' in var:
                        masked_value = f"{value[:8]}...{value[-4:]}" if len(value) > 12 else "***"
                        configured_vars.append(f"{var}={masked_value}")
                    else:
                        configured_vars.append(f"{var}={value}")
            
            if missing_vars:
                self.log_result("Shopify Environment Variables", False, f"Missing variables: {', '.join(missing_vars)}")
                return False
            else:
                self.log_result("Shopify Environment Variables", True, f"All Shopify vars configured: {', '.join(configured_vars)}")
                return True
                
        except Exception as e:
            self.log_result("Shopify Environment Variables", False, f"Error: {str(e)}")
            return False
    
    def test_shopify_storefront_api_connectivity(self):
        """Test direct connectivity to Shopify Storefront API"""
        try:
            # Load Shopify credentials
            load_dotenv('/app/backend/.env')
            
            store_domain = os.getenv('SHOPIFY_STORE_DOMAIN')
            access_token = os.getenv('SHOPIFY_STOREFRONT_API_TOKEN')
            api_version = os.getenv('SHOPIFY_STOREFRONT_API_VERSION')
            
            if not all([store_domain, access_token, api_version]):
                self.log_result("Shopify Storefront API Connectivity", False, "Missing Shopify credentials")
                return False
            
            # Test GraphQL query to fetch shop info and products
            graphql_url = f"https://{store_domain}/api/{api_version}/graphql.json"
            
            query = """
            {
                shop {
                    name
                    description
                }
                products(first: 5) {
                    edges {
                        node {
                            id
                            title
                            handle
                            availableForSale
                            priceRange {
                                minVariantPrice {
                                    amount
                                    currencyCode
                                }
                            }
                        }
                    }
                }
            }
            """
            
            headers = {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': access_token
            }
            
            response = requests.post(
                graphql_url,
                json={'query': query},
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if 'errors' in data:
                    self.log_result("Shopify Storefront API Connectivity", False, f"GraphQL errors: {data['errors']}")
                    return False
                
                shop_data = data.get('data', {}).get('shop', {})
                products_data = data.get('data', {}).get('products', {}).get('edges', [])
                
                shop_name = shop_data.get('name', 'Unknown')
                product_count = len(products_data)
                
                # Get first product details for verification
                first_product = None
                if products_data:
                    first_product = products_data[0]['node']
                    product_title = first_product.get('title', 'Unknown')
                    product_price = first_product.get('priceRange', {}).get('minVariantPrice', {}).get('amount', '0')
                    currency = first_product.get('priceRange', {}).get('minVariantPrice', {}).get('currencyCode', 'INR')
                
                if shop_name and product_count > 0:
                    message = f"Connected to '{shop_name}' store, found {product_count} products"
                    if first_product:
                        message += f". Sample: '{product_title}' - {product_price} {currency}"
                    self.log_result("Shopify Storefront API Connectivity", True, message)
                    return True
                else:
                    self.log_result("Shopify Storefront API Connectivity", False, "No shop data or products found")
                    return False
            else:
                self.log_result("Shopify Storefront API Connectivity", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Shopify Storefront API Connectivity", False, f"Error: {str(e)}")
            return False
    
    def test_og_products_availability(self):
        """Test that OG products are available through Shopify API"""
        try:
            # Load Shopify credentials
            load_dotenv('/app/backend/.env')
            
            store_domain = os.getenv('SHOPIFY_STORE_DOMAIN')
            access_token = os.getenv('SHOPIFY_STOREFRONT_API_TOKEN')
            api_version = os.getenv('SHOPIFY_STOREFRONT_API_VERSION')
            
            if not all([store_domain, access_token, api_version]):
                self.log_result("OG Products Availability", False, "Missing Shopify credentials")
                return False
            
            # Query for OG-themed products
            graphql_url = f"https://{store_domain}/api/{api_version}/graphql.json"
            
            query = """
            {
                products(first: 50, query: "tag:OG OR title:*OG* OR title:*Death* OR title:*War* OR title:*Rebel*") {
                    edges {
                        node {
                            id
                            title
                            handle
                            tags
                            availableForSale
                            priceRange {
                                minVariantPrice {
                                    amount
                                    currencyCode
                                }
                            }
                        }
                    }
                }
            }
            """
            
            headers = {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': access_token
            }
            
            response = requests.post(
                graphql_url,
                json={'query': query},
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if 'errors' in data:
                    self.log_result("OG Products Availability", False, f"GraphQL errors: {data['errors']}")
                    return False
                
                products = data.get('data', {}).get('products', {}).get('edges', [])
                
                og_products = []
                
                for product_edge in products:
                    product = product_edge['node']
                    title = product.get('title', '')
                    tags = product.get('tags', [])
                    available = product.get('availableForSale', False)
                    
                    # Check for OG-related content
                    is_og_product = (
                        'OG' in title or 
                        'Death' in title or 
                        'War' in title or 
                        'Rebel' in title or
                        'Stalker' in title or
                        'Machine' in title or
                        any('og' in tag.lower() for tag in tags)
                    )
                    
                    if is_og_product:
                        og_products.append({
                            'title': title,
                            'available': available,
                            'tags': tags
                        })
                
                if len(og_products) >= 10:  # Expecting at least 10 OG products out of 52
                    available_count = sum(1 for p in og_products if p['available'])
                    message = f"Found {len(og_products)} OG products, {available_count} available for sale"
                    
                    # Show sample products
                    sample_titles = [p['title'] for p in og_products[:5]]
                    message += f". Samples: {', '.join(sample_titles)}"
                    
                    self.log_result("OG Products Availability", True, message)
                    return True
                else:
                    # Show what products we did find for debugging
                    found_titles = [p['title'] for p in og_products]
                    self.log_result("OG Products Availability", False, f"Only found {len(og_products)} OG products (expected ≥10). Found: {', '.join(found_titles) if found_titles else 'None'}")
                    return False
            else:
                self.log_result("OG Products Availability", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("OG Products Availability", False, f"Error: {str(e)}")
            return False
    
    def test_backend_shopify_integration_health(self):
        """Test overall backend health with Shopify integration context"""
        try:
            # Check if backend can handle requests while Shopify integration is configured
            test_requests = [
                ("GET", "/", "Root endpoint with Shopify context"),
                ("GET", "/status", "Status endpoint with Shopify context"),
            ]
            
            all_healthy = True
            
            for method, path, description in test_requests:
                try:
                    url = f"{API_BASE_URL}{path}"
                    response = requests.get(url, timeout=10)
                    
                    if response.status_code == 200:
                        print(f"  ✅ {description}")
                    else:
                        print(f"  ❌ {description} (HTTP {response.status_code})")
                        all_healthy = False
                        
                except Exception as e:
                    print(f"  ❌ {description} (Error: {str(e)})")
                    all_healthy = False
            
            # Test that backend can create records while Shopify is configured
            test_data = {"client_name": f"Shopify_Integration_Test_{int(time.time())}"}
            response = requests.post(
                f"{API_BASE_URL}/status",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"  ✅ Database operations with Shopify integration")
            else:
                print(f"  ❌ Database operations with Shopify integration (HTTP {response.status_code})")
                all_healthy = False
            
            if all_healthy:
                self.log_result("Backend Shopify Integration Health", True, "Backend stable with Shopify integration")
                return True
            else:
                self.log_result("Backend Shopify Integration Health", False, "Backend issues detected with Shopify integration")
                return False
                
        except Exception as e:
            self.log_result("Backend Shopify Integration Health", False, f"Error: {str(e)}")
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
        """Run all backend tests including Shopify integration"""
        print("🚀 Starting Comprehensive Backend API Tests with Shopify Integration...")
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
        
        # Test 8: Shopify Environment Variables
        print("8. Testing Shopify Environment Variables...")
        self.test_shopify_environment_variables()
        print()
        
        # Test 9: Shopify Storefront API Connectivity
        print("9. Testing Shopify Storefront API Connectivity...")
        self.test_shopify_storefront_api_connectivity()
        print()
        
        # Test 10: OG Products Availability
        print("10. Testing OG Products Availability...")
        self.test_og_products_availability()
        print()
        
        # Test 11: Backend Shopify Integration Health
        print("11. Testing Backend Shopify Integration Health...")
        self.test_backend_shopify_integration_health()
        print()
        
        # Summary
        print("=" * 80)
        print("🏁 COMPREHENSIVE TEST SUMMARY - BACKEND + SHOPIFY INTEGRATION")
        print("=" * 80)
        print(f"✅ Passed: {self.passed_tests}")
        print(f"❌ Failed: {self.failed_tests}")
        print(f"📊 Total: {self.passed_tests + self.failed_tests}")
        
        if self.failed_tests == 0:
            print("\n🎉 ALL TESTS PASSED! Backend and Shopify integration working correctly.")
            print("🛍️ Store: 40fg1q-ju.myshopify.com is fully integrated and operational.")
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