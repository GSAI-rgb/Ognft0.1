#!/usr/bin/env python3
"""
Complete Shopify Webhook and Storefront API Integration
Latest 2024 APIs with full webhook support
"""

import os
import json
import requests
from datetime import datetime

# Latest Shopify API configuration
SHOPIFY_STORE = os.getenv('SHOPIFY_STORE', '40fg1q-ju.myshopify.com')
SHOPIFY_ADMIN_TOKEN = os.getenv('SHOPIFY_ADMIN_TOKEN', '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')
SHOPIFY_STOREFRONT_TOKEN = os.getenv('SHOPIFY_STOREFRONT_TOKEN', 'bab636f906ac3a48b7ff915141b55e21')

# Latest API versions (2024)
ADMIN_API_VERSION = '2024-01'
STOREFRONT_API_VERSION = '2024-01'

class ShopifyIntegration:
    def __init__(self):
        self.admin_url = f"https://{SHOPIFY_STORE}/admin/api/{ADMIN_API_VERSION}"
        self.storefront_url = f"https://{SHOPIFY_STORE}/api/{STOREFRONT_API_VERSION}/graphql.json"
        self.headers_admin = {
            'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
            'Content-Type': 'application/json'
        }
        self.headers_storefront = {
            'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
            'Content-Type': 'application/json'
        }

    def setup_webhooks(self):
        """Setup all necessary webhooks for real-time updates"""
        webhooks = [
            {
                "webhook": {
                    "topic": "products/create",
                    "address": f"{os.getenv('REACT_APP_BACKEND_URL', 'https://storefront-migrate.preview.emergentagent.com')}/api/webhooks/products/create",
                    "format": "json"
                }
            },
            {
                "webhook": {
                    "topic": "products/update",
                    "address": f"{os.getenv('REACT_APP_BACKEND_URL', 'https://storefront-migrate.preview.emergentagent.com')}/api/webhooks/products/update",
                    "format": "json"
                }
            },
            {
                "webhook": {
                    "topic": "products/delete",
                    "address": f"{os.getenv('REACT_APP_BACKEND_URL', 'https://storefront-migrate.preview.emergentagent.com')}/api/webhooks/products/delete",
                    "format": "json"
                }
            },
            {
                "webhook": {
                    "topic": "orders/create",
                    "address": f"{os.getenv('REACT_APP_BACKEND_URL', 'https://storefront-migrate.preview.emergentagent.com')}/api/webhooks/orders/create",
                    "format": "json"
                }
            },
            {
                "webhook": {
                    "topic": "inventory_levels/update",
                    "address": f"{os.getenv('REACT_APP_BACKEND_URL', 'https://storefront-migrate.preview.emergentagent.com')}/api/webhooks/inventory/update",
                    "format": "json"
                }
            }
        ]

        created_webhooks = []
        for webhook_data in webhooks:
            try:
                response = requests.post(
                    f"{self.admin_url}/webhooks.json",
                    headers=self.headers_admin,
                    data=json.dumps(webhook_data)
                )
                if response.status_code == 201:
                    webhook_info = response.json()
                    created_webhooks.append(webhook_info['webhook'])
                    print(f"✅ Webhook created: {webhook_data['webhook']['topic']}")
                else:
                    print(f"❌ Failed to create webhook {webhook_data['webhook']['topic']}: {response.text}")
            except Exception as e:
                print(f"❌ Error creating webhook: {str(e)}")
        
        return created_webhooks

    def get_storefront_products(self):
        """Get all products using latest Storefront API"""
        query = """
        query getProducts($first: Int!) {
          products(first: $first) {
            edges {
              node {
                id
                handle
                title
                description
                productType
                vendor
                tags
                createdAt
                updatedAt
                availableForSale
                totalInventory
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                  maxVariantPrice {
                    amount
                    currencyCode
                  }
                }
                compareAtPriceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                  maxVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 10) {
                  edges {
                    node {
                      id
                      url
                      altText
                      width
                      height
                    }
                  }
                }
                variants(first: 50) {
                  edges {
                    node {
                      id
                      title
                      availableForSale
                      quantityAvailable
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      selectedOptions {
                        name
                        value
                      }
                      image {
                        id
                        url
                        altText
                      }
                    }
                  }
                }
                metafields(identifiers: [
                  {namespace: "ogfilm", key: "mood_code"},
                  {namespace: "ogfilm", key: "badges"},
                  {namespace: "ogfilm", key: "exclusive"},
                  {namespace: "ogfilm", key: "fan_level"}
                ]) {
                  key
                  value
                  type
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
        """
        
        try:
            response = requests.post(
                self.storefront_url,
                headers=self.headers_storefront,
                data=json.dumps({
                    'query': query,
                    'variables': {'first': 250}
                })
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'data' in data and 'products' in data['data']:
                    products = []
                    for edge in data['data']['products']['edges']:
                        product = self.format_product_for_frontend(edge['node'])
                        products.append(product)
                    return products
                else:
                    print(f"❌ Storefront API error: {data}")
                    return []
            else:
                print(f"❌ Storefront API failed: {response.status_code} - {response.text}")
                return []
                
        except Exception as e:
            print(f"❌ Storefront API error: {str(e)}")
            return []

    def format_product_for_frontend(self, shopify_product):
        """Format Shopify product for frontend compatibility"""
        # Extract price
        min_price = float(shopify_product['priceRange']['minVariantPrice']['amount'])
        max_price = float(shopify_product['priceRange']['maxVariantPrice']['amount'])
        
        # Extract compare at price
        compare_at_price = None
        if shopify_product['compareAtPriceRange']['minVariantPrice']:
            compare_at_price = float(shopify_product['compareAtPriceRange']['minVariantPrice']['amount'])
        
        # Extract images
        images = [edge['node']['url'] for edge in shopify_product['images']['edges']]
        
        # Extract variants
        variants = []
        for variant_edge in shopify_product['variants']['edges']:
            variant = variant_edge['node']
            variants.append({
                'id': variant['id'],
                'title': variant['title'],
                'price': float(variant['price']['amount']),
                'available': variant['availableForSale'],
                'quantity': variant['quantityAvailable'],
                'options': {opt['name']: opt['value'] for opt in variant['selectedOptions']}
            })
        
        # Extract metafields
        metafields = {}
        for metafield in shopify_product.get('metafields', []):
            if metafield:
                metafields[metafield['key']] = metafield['value']
        
        # Get badges from product type and metafields
        badges = []
        if shopify_product['productType'] == 'T-Shirt':
            badges.append('REBEL DROP')
        elif shopify_product['productType'] == 'Hoodie':
            badges.append('BEAST DROP')
        elif shopify_product['productType'] == 'Poster':
            badges.append('WAR POSTER')
        
        if min_price <= 999:
            badges.append('UNDER ₹999')
        
        if metafields.get('badges'):
            badges.extend(metafields['badges'].split(','))
        
        return {
            'id': int(shopify_product['id'].split('/')[-1]),
            'handle': shopify_product['handle'],
            'name': shopify_product['title'],
            'title': shopify_product['title'],
            'description': shopify_product['description'],
            'category': shopify_product['productType'],
            'product_type': shopify_product['productType'],
            'vendor': shopify_product['vendor'],
            'price': min_price,
            'compare_at_price': compare_at_price,
            'images': images,
            'featured_image': images[0] if images else None,
            'variants': variants,
            'badges': badges,
            'tags': shopify_product['tags'],
            'available': shopify_product['availableForSale'],
            'inventory': shopify_product['totalInventory'],
            'mood_code': metafields.get('mood_code', 'STORM'),
            'exclusive': metafields.get('exclusive', 'false') == 'true',
            'created_at': shopify_product['createdAt'],
            'updated_at': shopify_product['updatedAt'],
            'published': True,
            'status': 'active'
        }

    def sync_products_to_json(self):
        """Sync all Shopify products to JSON file"""
        print("🔄 Syncing products from Shopify...")
        products = self.get_storefront_products()
        
        if products:
            # Save to frontend public directory
            output_file = "/app/frontend/public/shopify_synced_products.json"
            with open(output_file, 'w') as f:
                json.dump(products, f, indent=2)
            
            print(f"✅ Synced {len(products)} products to {output_file}")
            return products
        else:
            print("❌ No products synced")
            return []

def main():
    """Main integration setup"""
    print("🔥 Setting up complete Shopify integration with latest APIs...")
    
    integration = ShopifyIntegration()
    
    # Setup webhooks
    print("\n📡 Setting up webhooks...")
    webhooks = integration.setup_webhooks()
    
    # Sync products
    print("\n📦 Syncing products...")
    products = integration.sync_products_to_json()
    
    print(f"\n✅ Integration complete!")
    print(f"  - Webhooks created: {len(webhooks)}")
    print(f"  - Products synced: {len(products)}")
    print(f"  - API version: {ADMIN_API_VERSION}")
    print(f"  - Store: {SHOPIFY_STORE}")

if __name__ == "__main__":
    main()