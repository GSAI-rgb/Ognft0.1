#!/usr/bin/env python3
"""
🖼️ SHOPIFY IMAGE UPLOAD AUTOMATION
Automatically uploads product images to Shopify products
"""

import os
import requests
import json
import base64
from typing import Optional, Dict, List

class ShopifyImageUploader:
    def __init__(self):
        self.store_domain = "40fg1q-ju.myshopify.com"
        self.admin_api_key = "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"
        self.base_url = f"https://{self.store_domain}/admin/api/2024-01"
        
        self.headers = {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": self.admin_api_key
        }

    def get_products(self) -> List[Dict]:
        """Get all products from store"""
        url = f"{self.base_url}/products.json?limit=250"
        response = requests.get(url, headers=self.headers)
        
        if response.status_code == 200:
            return response.json()["products"]
        return []

    def upload_image_to_product(self, product_id: int, image_path: str) -> Optional[Dict]:
        """Upload image to specific product"""
        if not os.path.exists(image_path):
            print(f"❌ Image not found: {image_path}")
            return None
        
        # Read and encode image
        with open(image_path, "rb") as image_file:
            image_data = base64.b64encode(image_file.read()).decode('utf-8')
        
        # Get filename for alt text
        filename = os.path.basename(image_path)
        alt_text = os.path.splitext(filename)[0].replace("_", " ").title()
        
        image_payload = {
            "image": {
                "attachment": image_data,
                "filename": filename,
                "alt": f"OG {alt_text}"
            }
        }
        
        url = f"{self.base_url}/products/{product_id}/images.json"
        response = requests.post(url, headers=self.headers, json=image_payload)
        
        if response.status_code in [200, 201]:
            print(f"✅ Uploaded image to product {product_id}: {filename}")
            return response.json()
        else:
            print(f"❌ Failed to upload {filename}: {response.text}")
            return None

    def match_and_upload_images(self, image_directory: str):
        """Match products with images and upload"""
        print("🖼️ Starting image upload process...")
        
        products = self.get_products()
        print(f"📦 Found {len(products)} products in store")
        
        upload_count = 0
        
        # Walk through image directory
        for root, dirs, files in os.walk(image_directory):
            category = os.path.basename(root).lower()
            
            for image_file in files:
                if not image_file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
                    continue
                
                image_path = os.path.join(root, image_file)
                image_name = os.path.splitext(image_file)[0].lower()
                
                # Find matching product
                matching_product = None
                for product in products:
                    product_title_clean = product['title'].lower().replace("og ", "").replace(" ", "")
                    image_name_clean = image_name.replace("_", "").replace("-", "")
                    
                    if image_name_clean in product_title_clean or product_title_clean in image_name_clean:
                        matching_product = product
                        break
                
                if matching_product:
                    # Check if product already has images
                    if len(matching_product.get('images', [])) == 0:
                        result = self.upload_image_to_product(matching_product['id'], image_path)
                        if result:
                            upload_count += 1
                    else:
                        print(f"⚠️ Product already has images: {matching_product['title']}")
                else:
                    print(f"🔍 No matching product found for: {image_file}")
        
        print(f"\n🎉 Upload complete! {upload_count} images uploaded successfully")

def main():
    uploader = ShopifyImageUploader()
    
    # Set your image directory path here
    IMAGE_DIRECTORY = "/path/to/your/images"
    
    # Uncomment to run
    # uploader.match_and_upload_images(IMAGE_DIRECTORY)
    
    print("🚨 UPDATE REQUIRED:")
    print("Set your image directory path in IMAGE_DIRECTORY variable")
    print("Then uncomment the uploader.match_and_upload_images() line")

if __name__ == "__main__":
    main()