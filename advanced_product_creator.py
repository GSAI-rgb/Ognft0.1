#!/usr/bin/env python3
"""
🔥 ADVANCED OG PRODUCT CREATOR
Handles color variants, front/back images, and complex folder structures
"""

import os
import requests
import json
import time
import base64
from typing import Dict, List, Optional

class AdvancedOGProductCreator:
    def __init__(self):
        self.store_domain = "40fg1q-ju.myshopify.com"
        self.admin_api_key = "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"
        self.base_url = f"https://{self.store_domain}/admin/api/2024-01"
        
        self.headers = {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": self.admin_api_key
        }

    def analyze_product_structure(self, product_path: str) -> Dict:
        """Analyze the folder structure of a product"""
        structure = {
            "product_name": os.path.basename(product_path),
            "has_colors": False,
            "has_front_back": False,
            "color_variants": [],
            "image_types": [],
            "all_images": []
        }
        
        # Check subfolders
        subfolders = [f for f in os.listdir(product_path) if os.path.isdir(os.path.join(product_path, f))]
        
        # Detect color variants
        color_names = ['blue', 'grey', 'gray', 'black', 'white', 'red', 'green', 'yellow']
        colors_found = [f for f in subfolders if f.lower() in color_names]
        
        # Detect front/back
        view_names = ['front', 'back']
        views_found = [f for f in subfolders if f.lower() in view_names]
        
        if colors_found:
            structure["has_colors"] = True
            structure["color_variants"] = colors_found
            
            # Get images for each color
            for color in colors_found:
                color_path = os.path.join(product_path, color)
                images = [f for f in os.listdir(color_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
                for img in images:
                    structure["all_images"].append({
                        "path": os.path.join(color_path, img),
                        "color": color,
                        "type": "color_variant"
                    })
        
        elif views_found:
            structure["has_front_back"] = True
            structure["image_types"] = views_found
            
            # Get images for each view
            for view in views_found:
                view_path = os.path.join(product_path, view)
                images = [f for f in os.listdir(view_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
                for img in images:
                    structure["all_images"].append({
                        "path": os.path.join(view_path, img),
                        "view": view,
                        "type": "front_back"
                    })
        
        else:
            # Direct images in product folder
            images = [f for f in os.listdir(product_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            for img in images:
                structure["all_images"].append({
                    "path": os.path.join(product_path, img),
                    "type": "direct"
                })
        
        return structure

    def create_advanced_product(self, category: str, product_structure: Dict, index: int) -> Optional[Dict]:
        """Create product with proper variants and images"""
        
        product_name = product_structure["product_name"]
        title = f"OG {product_name.replace('_', ' ').title()} Rebel Tee"
        
        # Base product data
        variants = []
        
        if product_structure["has_colors"]:
            # Create variants for each color
            for color in product_structure["color_variants"]:
                variants.append({
                    "option1": color.title(),
                    "price": "899.00",
                    "inventory_quantity": 100,
                    "inventory_management": "shopify"
                })
            
            # Product with color options
            product_data = {
                "product": {
                    "title": title,
                    "body_html": f"<p>OG {product_name} - Available in multiple colors. Built for the tribe.</p>",
                    "vendor": "DVV Entertainment",
                    "product_type": "T-Shirts",
                    "tags": f"og, rebel, tshirt, {product_name.lower().replace(' ', '-')}",
                    "options": [{"name": "Color", "values": [c.title() for c in product_structure["color_variants"]]}],
                    "variants": variants
                }
            }
        
        else:
            # Single variant
            variants.append({
                "price": "899.00",
                "inventory_quantity": 100,
                "inventory_management": "shopify"
            })
            
            product_data = {
                "product": {
                    "title": title,
                    "body_html": f"<p>OG {product_name} - Premium rebel tee. Built for the tribe.</p>",
                    "vendor": "DVV Entertainment", 
                    "product_type": "T-Shirts",
                    "tags": f"og, rebel, tshirt, {product_name.lower().replace(' ', '-')}",
                    "variants": variants
                }
            }
        
        # Create product
        response = requests.post(f"{self.base_url}/products.json", headers=self.headers, json=product_data)
        
        if response.status_code in [200, 201]:
            product = response.json()["product"]
            print(f"✅ Created: {title}")
            
            # Upload images
            self.upload_product_images(product["id"], product_structure)
            
            return product
        else:
            print(f"❌ Failed to create {title}: {response.text}")
            return None

    def upload_product_images(self, product_id: int, product_structure: Dict):
        """Upload all images for a product"""
        
        for i, image_info in enumerate(product_structure["all_images"]):
            try:
                # Read and encode image
                with open(image_info["path"], "rb") as img_file:
                    image_data = base64.b64encode(img_file.read()).decode('utf-8')
                
                filename = os.path.basename(image_info["path"])
                
                # Create alt text based on image type
                if image_info["type"] == "color_variant":
                    alt_text = f"OG {product_structure['product_name']} - {image_info['color'].title()}"
                elif image_info["type"] == "front_back":
                    alt_text = f"OG {product_structure['product_name']} - {image_info['view'].title()} View"
                else:
                    alt_text = f"OG {product_structure['product_name']}"
                
                image_payload = {
                    "image": {
                        "attachment": image_data,
                        "filename": filename,
                        "alt": alt_text,
                        "position": i + 1
                    }
                }
                
                response = requests.post(
                    f"{self.base_url}/products/{product_id}/images.json",
                    headers=self.headers,
                    json=image_payload
                )
                
                if response.status_code in [200, 201]:
                    print(f"   📸 Uploaded: {filename}")
                else:
                    print(f"   ❌ Failed to upload: {filename}")
                
                time.sleep(0.5)  # Rate limiting
                
            except Exception as e:
                print(f"   ❌ Error uploading {image_info['path']}: {str(e)}")

    def process_category(self, category_path: str):
        """Process all products in a category"""
        category_name = os.path.basename(category_path)
        print(f"\n🎯 Processing Category: {category_name.upper()}")
        
        # Get all product folders
        product_folders = [f for f in os.listdir(category_path) if os.path.isdir(os.path.join(category_path, f))]
        
        print(f"📦 Found {len(product_folders)} products")
        
        for i, product_folder in enumerate(product_folders):
            product_path = os.path.join(category_path, product_folder)
            
            print(f"\n📁 Analyzing: {product_folder}")
            
            # Analyze structure
            structure = self.analyze_product_structure(product_path)
            
            print(f"   🔍 Structure: {len(structure['all_images'])} images")
            if structure["has_colors"]:
                print(f"   🎨 Colors: {', '.join(structure['color_variants'])}")
            if structure["has_front_back"]:
                print(f"   👀 Views: {', '.join(structure['image_types'])}")
            
            # Create product
            self.create_advanced_product(category_name, structure, i + 1)
            
            time.sleep(2)  # Rate limiting

def main():
    creator = AdvancedOGProductCreator()
    
    # Process T-shirts first
    tshirt_path = "/app/PRODUCTS/teeshirt"
    if os.path.exists(tshirt_path):
        creator.process_category(tshirt_path)
    
    print(f"\n🎉 Advanced product creation complete!")

if __name__ == "__main__":
    main()