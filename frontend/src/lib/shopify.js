// Shopify Storefront API client
const SHOPIFY_DOMAIN = process.env.REACT_APP_SHOPIFY_DOMAIN || 'your-shop.myshopify.com';
const SHOPIFY_STOREFRONT_TOKEN = process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN || '';

const SHOPIFY_ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

// GraphQL queries
const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          tags
          productType
        }
      }
    }
  }
`;

const PRODUCT_QUERY = `
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
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
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
      tags
      productType
      vendor
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Shopify API client
class ShopifyAPI {
  constructor() {
    this.endpoint = SHOPIFY_ENDPOINT;
    this.token = SHOPIFY_STOREFRONT_TOKEN;
  }

  async request(query, variables = {}) {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': this.token,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { data, errors } = await response.json();

      if (errors) {
        throw new Error(errors[0].message);
      }

      return data;
    } catch (error) {
      console.error('Shopify API Error:', error);
      throw error;
    }
  }

  // Get all products
  async getProducts(first = 20) {
    const data = await this.request(PRODUCTS_QUERY, { first });
    return data.products.edges.map(edge => this.transformProduct(edge.node));
  }

  // Get single product by handle
  async getProduct(handle) {
    const data = await this.request(PRODUCT_QUERY, { handle });
    return this.transformProduct(data.productByHandle);
  }

  // Create cart
  async createCart(lines = []) {
    const data = await this.request(CART_CREATE_MUTATION, {
      input: { lines }
    });
    
    if (data.cartCreate.userErrors.length > 0) {
      throw new Error(data.cartCreate.userErrors[0].message);
    }
    
    return data.cartCreate.cart;
  }

  // Transform Shopify product to our format
  transformProduct(shopifyProduct) {
    if (!shopifyProduct) return null;

    return {
      id: shopifyProduct.id,
      name: shopifyProduct.title,
      handle: shopifyProduct.handle,
      description: shopifyProduct.description,
      category: shopifyProduct.productType || 'General',
      price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
      originalPrice: null, // Could be calculated from compareAtPrice
      badges: this.getBadges(shopifyProduct),
      images: shopifyProduct.images.edges.map(edge => edge.node.url),
      variants: shopifyProduct.variants.edges.map(edge => ({
        id: edge.node.id,
        title: edge.node.title,
        price: parseFloat(edge.node.price.amount),
        available: edge.node.availableForSale,
        options: edge.node.selectedOptions
      })),
      tags: shopifyProduct.tags || [],
      vendor: shopifyProduct.vendor
    };
  }

  // Generate badges based on Shopify data
  getBadges(product) {
    const badges = [];
    
    if (product.tags.includes('new')) badges.push('NEW');
    if (product.tags.includes('bestseller')) badges.push('BEST SELLER');
    if (product.tags.includes('sale')) badges.push('SALE');
    
    return badges;
  }
}

// Export singleton instance
export const shopify = new ShopifyAPI();

// Helper functions for mock data fallback
export const useMockDataIfShopifyUnavailable = async (shopifyFunction, mockData) => {
  try {
    if (!SHOPIFY_STOREFRONT_TOKEN) {
      console.log('Using mock data - Shopify not configured');
      return mockData;
    }
    return await shopifyFunction();
  } catch (error) {
    console.warn('Shopify API failed, using mock data:', error.message);
    return mockData;
  }
};

export default shopify;