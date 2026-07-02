'use strict';

const express = require('express');
const Stripe = require('stripe');
const { requireAuth } = require('../middleware/auth');
const { userQueries, orderQueries, orderItemQueries } = require('../models/db');

const router = express.Router();
const TERMS_VERSION = '2026-06-30-v1';

const PRODUCTS = [
  {
    id: 'catholic-study-bible',
    name: 'Catholic Study Bible',
    description: 'Comprehensive Catholic edition for study groups and personal reflection.',
    price_cents: 4990,
    image: '/images/retro-cathedral-window.svg',
    category: 'Books',
  },
  {
    id: 'olive-wood-rosary',
    name: 'Olive Wood Rosary Beads',
    description: 'Traditional rosary beads crafted in olive wood style for daily prayer.',
    price_cents: 1990,
    image: '/images/retro-rosary.svg',
    category: 'Prayer',
  },
  {
    id: 'pocket-prayer-book',
    name: 'Pocket Prayer Book',
    description: 'Compact Catholic prayers for home, travel, and parish use.',
    price_cents: 1490,
    image: '/images/retro-sacred-heart.svg',
    category: 'Devotionals',
  },
  {
    id: 'saint-joseph-journal',
    name: 'St Joseph Reflection Journal',
    description: 'Guided journaling pages for scripture, gratitude, and prayer intentions.',
    price_cents: 1290,
    image: '/images/retro-cathedral-window.svg',
    category: 'Journals',
  },
];

function getStripe() {
  return Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
}

function getBaseUrl(req) {
  const fromEnv = process.env.BASE_URL;
  if (fromEnv && fromEnv.trim()) return fromEnv.replace(/\/$/, '');
  return `${req.protocol}://${req.get('host')}`;
}

function getCatalogMap() {
  return new Map(PRODUCTS.map(p => [p.id, p]));
}

function getCart(req) {
  if (!Array.isArray(req.session.cart)) req.session.cart = [];
  return req.session.cart;
}

function getCartItems(req) {
  const catalog = getCatalogMap();
  const cart = getCart(req);
  return cart
    .map(item => {
      const product = catalog.get(item.product_id);
      if (!product) return null;
      const quantity = Math.min(Math.max(parseInt(item.quantity, 10) || 1, 1), 10);
      return {
        product_id: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
        unit_price_cents: product.price_cents,
        quantity,
        line_total_cents: product.price_cents * quantity,
      };
    })
    .filter(Boolean);
}

function getCartSummary(req) {
  const items = getCartItems(req);
  const subtotal_cents = items.reduce((sum, i) => sum + i.line_total_cents, 0);
  const tax_cents = 0; // prices are tax-inclusive placeholders
  const shipping_cents = 0;
  return {
    items,
    subtotal_cents,
    tax_cents,
    shipping_cents,
    total_cents: subtotal_cents + tax_cents + shipping_cents,
    item_count: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}

function buildCheckoutCustomer(req) {
  const user = req.session.userId ? userQueries.findById.get(req.session.userId) : null;
  return {
    customer_name: user ? `${user.first_name} ${user.last_name}` : '',
    customer_email: user ? user.email : '',
    customer_phone: user ? (user.phone || '') : '',
    address_line1: user ? (user.address_line1 || '') : '',
    address_line2: user ? (user.address_line2 || '') : '',
    suburb: user ? (user.suburb || '') : '',
    state: user ? (user.state || '') : '',
    postcode: user ? (user.postcode || '') : '',
    country: user ? (user.country || 'Australia') : 'Australia',
  };
}

function createOrderWithItems(order, items) {
  const result = orderQueries.create.run(order);
  const orderId = result.lastInsertRowid;

  items.forEach(item => {
    orderItemQueries.create.run({
      order_id: orderId,
      product_id: item.product_id,
      sku: item.product_id,
      product_name: item.name,
      unit_price_cents: item.unit_price_cents,
      quantity: item.quantity,
      line_total_cents: item.line_total_cents,
    });
  });

  return orderId;
}

router.get('/', (req, res) => {
  const bitcoinAddress = process.env.BITCOIN_ADDRESS || '';
  const bitcoinPaymentLink = process.env.BITCOIN_PAYMENT_LINK || '';
  const canceled = req.query.canceled === '1';

  res.render('products', {
    title: 'Catholic Store',
    products: PRODUCTS,
    cartSummary: getCartSummary(req),
    bitcoinAddress,
    bitcoinPaymentLink,
    canceled,
    flash: req.session.flash || null,
    user: req.session.user || null,
  });

  delete req.session.flash;
});

router.post('/cart/add', (req, res) => {
  const productId = String(req.body.product_id || '').trim();
  const qtyRaw = Number.parseInt(req.body.quantity, 10);
  const quantity = Number.isNaN(qtyRaw) ? 1 : Math.min(Math.max(qtyRaw, 1), 10);

  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) {
    req.session.flash = { type: 'danger', msg: 'Selected product was not found.' };
    return res.redirect('/products');
  }

  const cart = getCart(req);
  const existing = cart.find(item => item.product_id === productId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, 10);
  } else {
    cart.push({ product_id: productId, quantity });
  }

  req.session.flash = { type: 'success', msg: `${product.name} added to cart.` };
  return res.redirect('/products');
});

router.post('/cart/update', (req, res) => {
  const productId = String(req.body.product_id || '').trim();
  const qtyRaw = Number.parseInt(req.body.quantity, 10);
  const quantity = Number.isNaN(qtyRaw) ? 1 : Math.min(Math.max(qtyRaw, 1), 10);

  const cart = getCart(req);
  const line = cart.find(item => item.product_id === productId);
  if (line) line.quantity = quantity;

  return res.redirect('/products/cart');
});

router.post('/cart/remove', (req, res) => {
  const productId = String(req.body.product_id || '').trim();
  req.session.cart = getCart(req).filter(item => item.product_id !== productId);
  return res.redirect('/products/cart');
});

router.get('/cart', (req, res) => {
  const cartSummary = getCartSummary(req);
  res.render('cart', {
    title: 'Your Cart',
    cartSummary,
    user: req.session.user || null,
    flash: req.session.flash || null,
  });
  delete req.session.flash;
});

router.get('/checkout', requireAuth, (req, res) => {
  const cartSummary = getCartSummary(req);
  if (cartSummary.items.length === 0) {
    req.session.flash = { type: 'warning', msg: 'Your cart is empty.' };
    return res.redirect('/products');
  }

  res.render('checkout', {
    title: 'Checkout',
    cartSummary,
    checkoutCustomer: buildCheckoutCustomer(req),
    bitcoinAddress: process.env.BITCOIN_ADDRESS || '',
    bitcoinPaymentLink: process.env.BITCOIN_PAYMENT_LINK || '',
    termsVersion: TERMS_VERSION,
    user: req.session.user || null,
    flash: req.session.flash || null,
  });
  delete req.session.flash;
});

router.post('/checkout/card', requireAuth, async (req, res) => {
  const cartSummary = getCartSummary(req);
  if (cartSummary.items.length === 0) {
    req.session.flash = { type: 'warning', msg: 'Your cart is empty.' };
    return res.redirect('/products');
  }

  if (!req.body.accept_terms) {
    req.session.flash = { type: 'danger', msg: 'You must accept the Terms of Use and policy pages before checkout.' };
    return res.redirect('/products/checkout');
  }

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('YOUR_STRIPE')) {
    req.session.flash = { type: 'danger', msg: 'Stripe is not configured yet. Add your Stripe keys in .env.' };
    return res.redirect('/products/checkout');
  }

  try {
    const stripe = getStripe();
    const baseUrl = getBaseUrl(req);

    const customer = {
      customer_name: String(req.body.customer_name || '').trim(),
      customer_email: String(req.body.customer_email || '').trim(),
      customer_phone: String(req.body.customer_phone || '').trim(),
      address_line1: String(req.body.address_line1 || '').trim(),
      address_line2: String(req.body.address_line2 || '').trim(),
      suburb: String(req.body.suburb || '').trim(),
      state: String(req.body.state || '').trim(),
      postcode: String(req.body.postcode || '').trim(),
      country: String(req.body.country || 'Australia').trim(),
    };

    if (!customer.customer_name || !customer.customer_email || !customer.address_line1) {
      req.session.flash = { type: 'danger', msg: 'Name, email, and address are required.' };
      return res.redirect('/products/checkout');
    }

    req.session.checkoutCustomer = customer;

    const lineItems = cartSummary.items.map(item => ({
      quantity: item.quantity,
      price_data: {
        currency: 'aud',
        unit_amount: item.unit_price_cents,
        product_data: {
          name: item.name,
          images: [`${baseUrl}${item.image}`],
        },
      },
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      metadata: {
        source: 'store-cart',
        user_id: String(req.session.userId),
        terms_version: TERMS_VERSION,
      },
      success_url: `${baseUrl}/products/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/products?canceled=1`,
      customer_email: customer.customer_email,
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
    });

    return res.redirect(303, session.url);
  } catch (err) {
    console.error('Product checkout error:', err);
    req.session.flash = { type: 'danger', msg: 'Could not start checkout. Please try again.' };
    return res.redirect('/products/checkout');
  }
});

router.post('/checkout/bitcoin', requireAuth, (req, res) => {
  const cartSummary = getCartSummary(req);
  if (cartSummary.items.length === 0) {
    req.session.flash = { type: 'warning', msg: 'Your cart is empty.' };
    return res.redirect('/products');
  }

  if (!req.body.accept_terms) {
    req.session.flash = { type: 'danger', msg: 'You must accept the Terms of Use and policy pages before checkout.' };
    return res.redirect('/products/checkout');
  }

  const customer = {
    customer_name: String(req.body.customer_name || '').trim(),
    customer_email: String(req.body.customer_email || '').trim(),
    customer_phone: String(req.body.customer_phone || '').trim(),
    address_line1: String(req.body.address_line1 || '').trim(),
    address_line2: String(req.body.address_line2 || '').trim(),
    suburb: String(req.body.suburb || '').trim(),
    state: String(req.body.state || '').trim(),
    postcode: String(req.body.postcode || '').trim(),
    country: String(req.body.country || 'Australia').trim(),
  };

  if (!customer.customer_name || !customer.customer_email || !customer.address_line1) {
    req.session.flash = { type: 'danger', msg: 'Name, email, and address are required.' };
    return res.redirect('/products/checkout');
  }

  const orderId = createOrderWithItems({
    user_id: req.session.userId,
    ...customer,
    payment_method: 'bitcoin',
    payment_status: 'awaiting_payment',
    fulfillment_status: 'processing',
    currency: 'aud',
    subtotal_cents: cartSummary.subtotal_cents,
    tax_cents: cartSummary.tax_cents,
    shipping_cents: cartSummary.shipping_cents,
    total_cents: cartSummary.total_cents,
    stripe_checkout_session_id: null,
    terms_version: TERMS_VERSION,
    terms_accepted_at: new Date().toISOString(),
    notes: 'Awaiting manual bitcoin confirmation',
  }, cartSummary.items);

  req.session.cart = [];
  return res.redirect(`/products/bitcoin/${orderId}`);
});

router.get('/success', async (req, res) => {
  const sessionId = String(req.query.session_id || '').trim();
  if (!sessionId) return res.redirect('/products');

  try {
    const stripe = getStripe();
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    if (checkoutSession.payment_status !== 'paid') {
      req.session.flash = { type: 'warning', msg: 'Payment is still processing. Please refresh shortly.' };
      return res.redirect('/products');
    }

    let order = orderQueries.findByStripeSession.get(checkoutSession.id);
    if (!order) {
      const customer = req.session.checkoutCustomer || buildCheckoutCustomer(req);
      const cartSummary = getCartSummary(req);

      if (cartSummary.items.length === 0) {
        req.session.flash = { type: 'warning', msg: 'Could not resolve cart items for the completed checkout.' };
        return res.redirect('/products');
      }

      const orderId = createOrderWithItems({
        user_id: req.session.userId,
        ...customer,
        payment_method: 'card',
        payment_status: 'paid',
        fulfillment_status: 'processing',
        currency: 'aud',
        subtotal_cents: cartSummary.subtotal_cents,
        tax_cents: cartSummary.tax_cents,
        shipping_cents: cartSummary.shipping_cents,
        total_cents: cartSummary.total_cents,
        stripe_checkout_session_id: checkoutSession.id,
        terms_version: TERMS_VERSION,
        terms_accepted_at: new Date().toISOString(),
        notes: null,
      }, cartSummary.items);

      order = orderQueries.findById.get(orderId);
      req.session.cart = [];
      delete req.session.checkoutCustomer;
    }

    const items = orderItemQueries.byOrder.all(order.id);

    res.render('order-success', {
      title: 'Payment Successful',
      order,
      items,
      user: req.session.user || null,
    });
  } catch (err) {
    console.error('Checkout success retrieval error:', err);
    req.session.flash = { type: 'danger', msg: 'Could not verify checkout session.' };
    return res.redirect('/products');
  }
});

router.get('/bitcoin/:orderId', requireAuth, (req, res) => {
  const order = orderQueries.findById.get(req.params.orderId);
  if (!order || order.user_id !== req.session.userId) return res.redirect('/products');

  const items = orderItemQueries.byOrder.all(order.id);

  res.render('bitcoin-checkout', {
    title: 'Bitcoin Checkout',
    order,
    items,
    bitcoinAddress: process.env.BITCOIN_ADDRESS || '',
    bitcoinPaymentLink: process.env.BITCOIN_PAYMENT_LINK || '',
    user: req.session.user || null,
  });
});

router.get('/orders/:orderId', requireAuth, (req, res) => {
  const order = orderQueries.findById.get(req.params.orderId);
  if (!order || order.user_id !== req.session.userId) return res.redirect('/dashboard');

  const items = orderItemQueries.byOrder.all(order.id);
  res.render('order-detail', {
    title: `Order #${order.id}`,
    order,
    items,
    user: req.session.user || null,
  });
});

module.exports = router;
