/**
 * Secure Order Validation & Price Integrity Endpoint
 * POST /api/order-validate
 * 
 * Prevents:
 * - Client-side price tampering / parameter manipulation
 * - Fake coupon injection
 * - Unauthorized delivery fee overrides
 */

// Authoritative Server-Side Product Price Registry
const SERVER_CATALOGUE = {
  'yacon-probiotic-immune-boost': { name: 'Yacon Probiotic Immune Boost', basePrice: 450 },
  'yacon-probiotic-syrup-kefir': { name: 'Yacon Probiotic Syrup Kefir', basePrice: 650 },
  'chia-yoghurt': { name: 'Chia Yoghurt', basePrice: 380 },
  'chia-seeds': { name: 'Chia Seeds', basePrice: 300 },
  'chia-oil': { name: 'Chia Oil', basePrice: 850 },
  'chia-uji': { name: 'Chia Uji Porridge Flour', basePrice: 420 },
  'hibiscus-herbal-blend': { name: 'Hibiscus Herbal Blend Teabags', basePrice: 450 },
  'hibiscus-dried-flowers': { name: 'Hibiscus Dried Flowers', basePrice: 350 },
  'hibiscus-powder': { name: 'Hibiscus Powder', basePrice: 400 },
  'granola': { name: 'Granola (Contains groundnuts)', basePrice: 500 },
  'yacon-inulin-capsules': { name: 'Yacon Inulin Capsules', basePrice: 1200 }
};

const VERIFIED_DELIVERY_FEES = {
  'nairobi': 350,
  'central': 250,
  'other': 450
};

export async function onRequestPost(context) {
  const { request } = context;

  try {
    const body = await request.json();
    const { items, deliveryZone, customerPhone } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Cart is empty' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Recalculate Subtotal using Server-Side Catalog only
    let verifiedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = SERVER_CATALOGUE[item.id];
      if (!product) {
        return new Response(JSON.stringify({ success: false, error: `Invalid product ID: ${item.id}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const quantity = Math.max(1, Math.min(99, parseInt(item.quantity) || 1));
      const lineTotal = product.basePrice * quantity;
      verifiedSubtotal += lineTotal;

      verifiedItems.push({
        id: item.id,
        name: product.name,
        unitPrice: product.basePrice,
        quantity,
        lineTotal
      });
    }

    // 2. Validate Delivery Fee
    const zoneKey = VERIFIED_DELIVERY_FEES[deliveryZone] ? deliveryZone : 'other';
    const deliveryFee = VERIFIED_DELIVERY_FEES[zoneKey];
    const verifiedGrandTotal = verifiedSubtotal + deliveryFee;

    // 3. Generate Secure Order Reference
    const timestamp = Date.now();
    const orderId = `AFY-${Math.floor(100000 + Math.random() * 900000)}`;

    return new Response(JSON.stringify({
      success: true,
      orderId,
      timestamp,
      verifiedItems,
      subtotal: verifiedSubtotal,
      deliveryFee,
      grandTotal: verifiedGrandTotal,
      currency: 'KES',
      paybill: '247247',
      accountNumber: 'AFYALISHE'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: 'Order validation error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
