#!/usr/bin/env python3
"""
📢 PUBLISH ALL PRODUCTS TO STOREFRONT
Makes all products visible on the frontend
"""

import requests
import json
import time

def publish_all_products():
    """Publish all products to storefront"""
    store_domain = "r1s7fa-eb.myshopify.com"
    admin_api_key = "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"
    base_url = f"https://{store_domain}/admin/api/2024-01"
    
    headers = {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": admin_api_key
    }
    
    print("📢 Publishing all products to storefront...")
    
    # Get all products
    response = requests.get(f"{base_url}/products.json?limit=250", headers=headers)
    
    if response.status_code != 200:
        print(f"❌ Failed to get products: {response.text}")
        return
    
    products = response.json()["products"]
    print(f"📦 Found {len(products)} products to publish")
    
    published_count = 0
    
    for product in products:
        product_id = product["id"]
        product_title = product["title"]
        
        # Check if already published
        if product.get("published_at"):
            print(f"✅ Already published: {product_title}")
            continue
        
        # Publish product
        publish_data = {
            "product": {
                "id": product_id,
                "published": True,
                "published_scope": "web"
            }
        }
        
        response = requests.put(
            f"{base_url}/products/{product_id}.json",
            headers=headers,
            json=publish_data
        )
        
        if response.status_code == 200:
            print(f"📢 Published: {product_title}")
            published_count += 1
        else:
            print(f"❌ Failed to publish: {product_title}")
        
        # Rate limiting
        time.sleep(0.5)
    
    print(f"\n🎉 Published {published_count} products to storefront!")
    print("✅ Products should now be visible on the frontend!")

if __name__ == "__main__":
    publish_all_products()