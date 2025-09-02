#!/usr/bin/env python3
"""
🔥 ULTIMATE SHOPIFY OG STORE AUTOMATION SCRIPT
Automatically creates products, collections, and store setup from image directory
"""

import os
import requests
import json
import time
from typing import Dict, List, Optional
from pathlib import Path
import base64

class ShopifyOGAutomation:
    def __init__(self):
        self.store_domain = "r1s7fa-eb.myshopify.com"
        self.admin_api_key = "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"
        self.api_secret = "61c8a6e596648536c90ee664e6a255b2"
        self.base_url = f"https://{self.store_domain}/admin/api/2024-01"
        
        # Authentication headers
        self.headers = {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": self.admin_api_key
        }
        
        # OG product templates based on category
        self.og_templates = {
            "teeshirt": {
                "product_type": "T-Shirts",
                "base_price": 899,
                "description_template": "Premium OG {title} - Theater-grade print quality. Built for soldiers of the tribe. Scene code: {scene_code}",
                "tags": ["og", "rebel", "tshirt", "cotton", "premium"],
                "vendor": "DVV Entertainment"
            },
            "hoodies": {
                "product_type": "Hoodies", 
                "base_price": 1899,
                "description_template": "OG {title} Hoodie - Armor for midnight battles. Premium cotton blend. Scene code: {scene_code}",
                "tags": ["og", "hoodie", "premium", "cotton", "armor"],
                "vendor": "DVV Entertainment"
            },
            "hats": {
                "product_type": "Hats",
                "base_price": 699,
                "description_template": "OG {title} Cap - Every detail matters. Premium embroidered design. Scene code: {scene_code}",
                "tags": ["og", "cap", "hat", "embroidered", "accessories"],
                "vendor": "DVV Entertainment"
            },
            "posters": {
                "product_type": "Posters",
                "base_price": 399,
                "description_template": "OG {title} Poster - Scenes captured in blood & fire. Museum-quality print. Scene code: {scene_code}",
                "tags": ["og", "poster", "art", "print", "scene"],
                "vendor": "DVV Entertainment"
            },
            "sweatshirts": {
                "product_type": "Sweatshirts",
                "base_price": 1599,
                "description_template": "OG {title} Sweatshirt - Built for battle. Premium fleece construction. Scene code: {scene_code}",
                "tags": ["og", "sweatshirt", "fleece", "premium", "battle"],
                "vendor": "DVV Entertainment"
            },
            "slippers": {
                "product_type": "Slippers",
                "base_price": 599,
                "description_template": "OG {title} Slippers - Comfort for warriors at rest. Scene code: {scene_code}",
                "tags": ["og", "slippers", "comfort", "home", "accessories"],
                "vendor": "DVV Entertainment"
            }
        }
        
        # OG Collections to create
        self.og_collections = {
            "rebellion-core": {
                "title": "Rebellion Core",
                "description": "Essential pieces for every soldier. Built for daily battles.",
                "handle": "rebellion-core"
            },
            "rebel-drops": {
                "title": "Rebel Drops", 
                "description": "Limited time drops. Get them before they vault.",
                "handle": "rebel-drops"
            },
            "vault-exclusive": {
                "title": "Vault Exclusive",
                "description": "Not for the weak. Unlock if you dare. (బలహీనులకు కాదు)",
                "handle": "vault-exclusive"
            },
            "fan-arsenal": {
                "title": "Fan Arsenal",
                "description": "Battle-tested favorites. Proven in the field.",
                "handle": "fan-arsenal"
            }
        }

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Optional[Dict]:
        """Make authenticated request to Shopify Admin API"""
        url = f"{self.base_url}{endpoint}"
        
        try:
            if method == "GET":
                response = requests.get(url, headers=self.headers)
            elif method == "POST":
                response = requests.post(url, headers=self.headers, json=data)
            elif method == "PUT":
                response = requests.put(url, headers=self.headers, json=data)
            
            if response.status_code in [200, 201]:
                return response.json()
            else:
                print(f"❌ API Error {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Request failed: {str(e)}")
            return None

    def update_store_settings(self):
        """Update store name and settings for OG branding"""
        print("🏪 Updating store settings...")
        
        shop_data = {
            "shop": {
                "name": "OG - DVV Entertainment",
                "description": "Official OG Film Merchandise - Cinematic drops. Theater-grade prints. Built for the tribe.",
                "email": "contact@ogstore.com"
            }
        }
        
        result = self.make_request("PUT", "/shop.json", shop_data)
        if result:
            print("✅ Store settings updated successfully")
        return result

    def create_collections(self):
        """Create OG collections"""
        print("📚 Creating OG collections...")
        
        created_collections = {}
        
        for handle, collection_data in self.og_collections.items():
            collection = {
                "custom_collection": {
                    "title": collection_data["title"],
                    "handle": handle,
                    "body_html": f"<p>{collection_data['description']}</p>",
                    "published_scope": "web"
                }
            }
            
            result = self.make_request("POST", "/custom_collections.json", collection)
            if result:
                collection_id = result["custom_collection"]["id"]
                created_collections[handle] = collection_id
                print(f"✅ Created collection: {collection_data['title']}")
                
        return created_collections

    def generate_product_title(self, filename: str, category: str) -> str:
        """Generate OG-themed product title from filename"""
        # Remove file extension and clean up
        name = Path(filename).stem
        name = name.replace("_", " ").replace("-", " ").title()
        
        # Add OG prefix based on category
        if category in ["teeshirt"]:
            return f"OG {name} Rebel Tee"
        elif category in ["hoodies"]:
            return f"OG {name} Battle Hoodie"
        elif category in ["hats"]:
            return f"OG {name} Tactical Cap"
        elif category in ["posters"]:
            return f"OG {name} Scene Poster"
        else:
            return f"OG {name}"

    def generate_scene_code(self, index: int) -> str:
        """Generate scene code for products"""
        return f"OG-{index:03d}"

    def assign_og_tags(self, category: str, index: int) -> List[str]:
        """Assign OG tags based on category and product"""
        base_tags = self.og_templates.get(category, {}).get("tags", ["og"])
        
        # Add OG-specific tags
        og_tags = []
        
        # Assign rank based on index (for variety)
        rank_cycle = ["common", "rebel", "captain", "vault"]
        rank = rank_cycle[index % len(rank_cycle)]
        og_tags.append(f"og-rank-{rank}")
        
        # Limited edition (every 3rd product)
        if index % 3 == 0:
            og_tags.append("og-limited-true")
        else:
            og_tags.append("og-limited-false")
            
        # Scene code
        scene_code = self.generate_scene_code(index)
        og_tags.append(f"og-scene-{scene_code.lower()}")
        
        # Drop end (random future dates)
        drop_days = [7, 14, 21, 30]
        drop_day = drop_days[index % len(drop_days)]
        og_tags.append(f"og-drop-end-{drop_day}days")
        
        return base_tags + og_tags

    def create_product_from_image(self, image_path: str, category: str, index: int) -> Optional[Dict]:
        """Create a product from image file"""
        filename = os.path.basename(image_path)
        
        # Generate product data
        title = self.generate_product_title(filename, category)
        scene_code = self.generate_scene_code(index)
        
        template = self.og_templates.get(category, self.og_templates["teeshirt"])
        
        description = template["description_template"].format(
            title=title,
            scene_code=scene_code
        )
        
        # OG-themed description with Telugu accents
        full_description = f"""
        <h2>🔥 {title}</h2>
        
        <p>This isn't just merch — it's a callsign.</p>
        
        <p>{description}</p>
        
        <p><strong>Built for the tribe:</strong></p>
        <ul>
        <li>Premium materials, battle-tested quality</li>
        <li>Theater-grade prints that won't fade</li>
        <li>Designed for soldiers of the OG army</li>
        </ul>
        
        <p><em>Scene Code: {scene_code}</em></p>
        <p><em>నీ రక్తం OG కోసం (Your blood is for OG)</em></p>
        
        <p>"Every fan is a soldier. Every soldier needs their uniform."</p>
        """
        
        tags = self.assign_og_tags(category, index)
        
        product_data = {
            "product": {
                "title": title,
                "body_html": full_description,
                "vendor": template["vendor"],
                "product_type": template["product_type"],
                "tags": ", ".join(tags),
                "variants": [
                    {
                        "price": str(template["base_price"]),
                        "inventory_quantity": 100,
                        "inventory_management": "shopify"
                    }
                ],
                "status": "active"
            }
        }
        
        return self.make_request("POST", "/products.json", product_data)

    def process_product_directory(self, directory_path: str):
        """Process entire product directory and create all products"""
        print(f"🚀 Processing product directory: {directory_path}")
        
        if not os.path.exists(directory_path):
            print(f"❌ Directory not found: {directory_path}")
            return
        
        created_products = []
        product_index = 1
        
        # Walk through directory structure
        for root, dirs, files in os.walk(directory_path):
            # Skip root directory
            if root == directory_path:
                continue
                
            # Get category from folder name
            category = os.path.basename(root).lower()
            
            # Process image files in this category
            image_files = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))]
            
            print(f"\n📁 Processing category: {category} ({len(image_files)} images)")
            
            for image_file in image_files:
                image_path = os.path.join(root, image_file)
                
                print(f"   Creating product from: {image_file}")
                
                product = self.create_product_from_image(image_path, category, product_index)
                
                if product:
                    created_products.append(product)
                    print(f"   ✅ Created: {product['product']['title']}")
                else:
                    print(f"   ❌ Failed to create product from: {image_file}")
                
                product_index += 1
                
                # Rate limiting - don't overwhelm Shopify API
                time.sleep(1)
        
        print(f"\n🎉 Successfully created {len(created_products)} products!")
        return created_products

    def run_complete_setup(self, product_directory: str):
        """Run complete OG store setup"""
        print("🔥 STARTING COMPLETE OG STORE AUTOMATION")
        print("=" * 60)
        
        # Step 1: Update store settings
        self.update_store_settings()
        
        # Step 2: Create collections
        collections = self.create_collections()
        
        # Step 3: Process all products
        products = self.process_product_directory(product_directory)
        
        print("\n" + "=" * 60)
        print("🎉 OG STORE AUTOMATION COMPLETE!")
        print(f"✅ Store updated with OG branding")
        print(f"✅ {len(collections)} collections created")
        print(f"✅ {len(products) if products else 0} products created")
        print("✅ All products have OG tags and metadata")
        print("=" * 60)
        
        return {
            "collections": collections,
            "products": products
        }

def main():
    """Main execution function"""
    automation = ShopifyOGAutomation()
    
    # Your product directory path
    PRODUCT_DIRECTORY = "/app/PRODUCTS"
    
    # Run the complete automation
    automation.run_complete_setup(PRODUCT_DIRECTORY)

if __name__ == "__main__":
    main()