#!/usr/bin/env python3
"""
Publish products to Online Store sales channel for Storefront API visibility
"""

import requests
import json
import os
import time
from dotenv import load_dotenv

# Load backend .env
load_dotenv('/app/backend/.env')

store_domain = os.getenv('SHOPIFY_STORE_DOMAIN')
admin_api_key = os.getenv('SHOPIFY_ADMIN_API_KEY')

if not all([store_domain, admin_api_key]):
    print("❌ Missing Shopify Admin API credentials")
    exit(1)

base_url = f"https://{store_domain}/admin/api/2024-01"
headers = {
    'X-Shopify-Access-Token': admin_api_key,
    'Content-Type': 'application/json'
}

print("🔍 Getting sales channels...")

# Get sales channels
try:
    response = requests.get(f"{base_url}/sales_channels.json", headers=headers)
    if response.status_code == 200:
        sales_channels = response.json().get('sales_channels', [])
        print(f"Found {len(sales_channels)} sales channels:")
        
        online_store_channel = None
        for channel in sales_channels:
            print(f"  - {channel['name']} (ID: {channel['id']})")
            if 'online store' in channel['name'].lower():
                online_store_channel = channel
        
        if not online_store_channel:
            print("❌ Online Store sales channel not found")
            exit(1)
            
        print(f"\n✅ Using Online Store channel: {online_store_channel['name']} (ID: {online_store_channel['id']})")
        
    else:
        print(f"❌ Failed to get sales channels: {response.text}")
        exit(1)
        
except Exception as e:
    print(f"❌ Error getting sales channels: {str(e)}")
    exit(1)

print("\n📦 Getting products...")

# Get all products
try:
    response = requests.get(f"{base_url}/products.json?limit=250", headers=headers)
    if response.status_code == 200:
        products = response.json().get('products', [])
        print(f"Found {len(products)} products")
        
        published_count = 0
        
        for product in products:
            product_id = product['id']
            title = product['title']
            
            # Check if product is already published to Online Store
            pub_response = requests.get(
                f"{base_url}/products/{product_id}/publications.json",
                headers=headers
            )
            
            if pub_response.status_code == 200:
                publications = pub_response.json().get('publications', [])
                
                # Check if already published to Online Store
                already_published = any(
                    pub.get('sales_channel_id') == online_store_channel['id'] 
                    for pub in publications
                )
                
                if not already_published:
                    # Publish to Online Store
                    publish_payload = {
                        "publication": {
                            "sales_channel_id": online_store_channel['id'],
                            "published": True
                        }
                    }
                    
                    publish_response = requests.post(
                        f"{base_url}/products/{product_id}/publications.json",
                        headers=headers,
                        json=publish_payload
                    )
                    
                    if publish_response.status_code == 201:
                        published_count += 1
                        print(f"✅ Published to Online Store: {title}")
                    else:
                        print(f"❌ Failed to publish {title}: {publish_response.text}")
                else:
                    print(f"✓ Already published: {title}")
            else:
                print(f"❌ Failed to check publications for {title}: {pub_response.text}")
            
            time.sleep(0.2)  # Rate limiting
        
        print(f"\n🎉 Published {published_count} products to Online Store sales channel")
        
    else:
        print(f"❌ Failed to get products: {response.text}")
        
except Exception as e:
    print(f"❌ Error: {str(e)}")

print("\n🔍 Testing Storefront API after publishing...")

# Test Storefront API
storefront_token = os.getenv('SHOPIFY_STOREFRONT_API_TOKEN')
if storefront_token:
    graphql_url = f"https://{store_domain}/api/2024-01/graphql.json"
    
    query = """
    {
        products(first: 5) {
            edges {
                node {
                    id
                    title
                    handle
                }
            }
        }
    }
    """
    
    storefront_headers = {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefront_token
    }
    
    try:
        response = requests.post(
            graphql_url,
            json={'query': query},
            headers=storefront_headers,
            timeout=15
        )
        
        if response.status_code == 200:
            data = response.json()
            products = data.get('data', {}).get('products', {}).get('edges', [])
            print(f"✅ Storefront API now shows {len(products)} products")
            
            for product_edge in products:
                product = product_edge['node']
                print(f"  - {product.get('title', 'Unknown')}")
        else:
            print(f"❌ Storefront API test failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Storefront API test error: {str(e)}")

print("\n🚀 Publication to Online Store complete!")