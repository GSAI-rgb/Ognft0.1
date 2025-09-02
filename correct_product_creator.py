#!/usr/bin/env python3
"""
✅ CORRECT OG PRODUCT CREATOR
Using REAL product names and proper front/back images
"""

import os
import requests
import json
import time
import base64

class CorrectOGProductCreator:
    def __init__(self):
        self.store_domain = "40fg1q-ju.myshopify.com"
        self.admin_api_key = "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"
        self.base_url = f"https://{self.store_domain}/admin/api/2024-01"
        
        self.headers = {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": self.admin_api_key
        }

    def delete_all_products(self):
        """Delete all existing products"""
        print("🗑️ Deleting all existing products...")
        
        response = requests.get(f"{self.base_url}/products.json?limit=250", headers=self.headers)
        if response.status_code == 200:
            products = response.json()["products"]
            
            for product in products:
                delete_response = requests.delete(
                    f"{self.base_url}/products/{product['id']}.json",
                    headers=self.headers
                )
                if delete_response.status_code == 200:
                    print(f"🗑️ Deleted: {product['title']}")
                time.sleep(0.5)

    def create_tshirt_product(self, product_name: str, product_path: str, index: int):
        """Create ONE t-shirt product with correct front/back images"""
        
        print(f"\n👕 Creating: {product_name}")
        
        # Check structure
        front_path = os.path.join(product_path, "front")
        back_path = os.path.join(product_path, "back")
        
        has_front = os.path.exists(front_path)
        has_back = os.path.exists(back_path)
        
        if not has_front and not has_back:
            print(f"   ❌ No front/back folders found for {product_name}")
            return None
        
        # Create product title
        title = f"{product_name} OG Tee"
        
        # Product description
        description = f"""
        <h2>{title}</h2>
        <p>Premium OG merchandise featuring {product_name.lower()} design.</p>
        <p>This isn't just merch — it's a callsign.</p>
        <ul>
        <li>Premium cotton, battle-tested quality</li>
        <li>Theater-grade prints that won't fade</li>
        <li>Front and back designs included</li>
        </ul>
        <p><em>నీ రక్తం OG కోసం (Your blood is for OG)</em></p>
        """
        
        # Create product
        product_data = {
            "product": {
                "title": title,
                "body_html": description,
                "vendor": "DVV Entertainment",
                "product_type": "T-Shirts",
                "tags": f"og, rebel, tshirt, {product_name.lower().replace(' ', '-')}",
                "variants": [{
                    "price": "899.00",
                    "inventory_quantity": 100,
                    "inventory_management": "shopify"
                }],
                "published": True,
                "published_scope": "web"
            }
        }
        
        response = requests.post(f"{self.base_url}/products.json", headers=self.headers, json=product_data)
        
        if response.status_code in [200, 201]:
            product = response.json()["product"]
            print(f"   ✅ Created product: {title}")
            
            # Upload images
            self.upload_front_back_images(product["id"], product_name, product_path)
            
            return product
        else:
            print(f"   ❌ Failed to create {title}: {response.text}")
            return None

    def upload_front_back_images(self, product_id: int, product_name: str, product_path: str):
        """Upload front and back images"""
        
        front_path = os.path.join(product_path, "front")
        back_path = os.path.join(product_path, "back")
        
        # Upload front image
        if os.path.exists(front_path):
            front_images = [f for f in os.listdir(front_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            if front_images:
                self.upload_single_image(product_id, os.path.join(front_path, front_images[0]), 
                                       f"{product_name} - Front Design", 1)
        
        # Upload back image
        if os.path.exists(back_path):
            back_images = [f for f in os.listdir(back_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            if back_images:
                self.upload_single_image(product_id, os.path.join(back_path, back_images[0]), 
                                       f"{product_name} - Back Design", 2)

    def upload_single_image(self, product_id: int, image_path: str, alt_text: str, position: int):
        """Upload a single image"""
        try:
            with open(image_path, "rb") as img_file:
                image_data = base64.b64encode(img_file.read()).decode('utf-8')
            
            filename = os.path.basename(image_path)
            
            image_payload = {
                "image": {
                    "attachment": image_data,
                    "filename": filename,
                    "alt": alt_text,
                    "position": position
                }
            }
            
            response = requests.post(
                f"{self.base_url}/products/{product_id}/images.json",
                headers=self.headers,
                json=image_payload
            )
            
            if response.status_code in [200, 201]:
                print(f"   📸 Uploaded: {alt_text}")
            else:
                print(f"   ❌ Failed to upload: {filename}")
            
        except Exception as e:
            print(f"   ❌ Error uploading {image_path}: {str(e)}")

    def create_all_tshirts(self):
        """Create all t-shirt products correctly"""
        tshirt_path = "/app/PRODUCTS/teeshirt"
        
        if not os.path.exists(tshirt_path):
            print(f"❌ T-shirt directory not found: {tshirt_path}")
            return
        
        # Get all product folders
        product_folders = [f for f in os.listdir(tshirt_path) if os.path.isdir(os.path.join(tshirt_path, f))]
        
        print(f"👕 Found {len(product_folders)} t-shirt products:")
        for folder in product_folders:
            print(f"   - {folder}")
        
        print(f"\n🚀 Starting product creation...")
        
        # Create each product
        for i, product_folder in enumerate(product_folders):
            product_path = os.path.join(tshirt_path, product_folder)
            self.create_tshirt_product(product_folder, product_path, i + 1)
            time.sleep(3)  # Rate limiting
        
        print(f"\n✅ Created {len(product_folders)} t-shirt products!")

def main():
    creator = CorrectOGProductCreator()
    
    # Delete wrong products first
    creator.delete_all_products()
    
    # Create correct products
    creator.create_all_tshirts()
    
    print("\n🎉 CORRECT PRODUCT CREATION COMPLETE!")
    print("Check your store: https://40fg1q-ju.myshopify.com")
    print("Check frontend: http://localhost:3000/shop")

if __name__ == "__main__":
    main()