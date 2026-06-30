'use strict';

const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  userQueries,
  sessionQueries,
  bookingQueries,
  transactionQueries,
  orderQueries,
  orderItemQueries,
} = require('../models/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(requireAdmin);

// ─── GET /admin ───────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  const customerCount = userQueries.count.get().count;
  const upcomingCount = sessionQueries.upcomingCount.get().count;
  const totalRevenue = bookingQueries.totalRevenue.get().total;
  const recentBookings = bookingQueries.all.all().slice(0, 10);

  res.render('admin/dashboard', {
    title: 'Admin Dashboard',
    customerCount,
    upcomingCount,
    totalRevenueCents: totalRevenue,
    recentBookings,
    user: req.session.user || null,
    flash: req.session.flash || null,
  });
  delete req.session.flash;
});

// ─── GET /admin/sessions ──────────────────────────────────────────────────────
router.get('/sessions', (req, res) => {
  const sessions = sessionQueries.all.all();
  res.render('admin/sessions', {
    title: 'Manage Sessions',
    sessions,
    user: req.session.user || null,
    flash: req.session.flash || null,
  });
  delete req.session.flash;
});

// ─── GET /admin/sessions/new ──────────────────────────────────────────────────
router.get('/sessions/new', (req, res) => {
  res.render('admin/session-form', {
    title: 'Create Session',
    session: null,
    errors: [],
    user: req.session.user || null,
  });
});

// ─── POST /admin/sessions ─────────────────────────────────────────────────────
router.post('/sessions', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('session_date').notEmpty().withMessage('Date is required'),
  body('session_time').notEmpty().withMessage('Time is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive number'),
  body('price_dollars').isFloat({ min: 0 }).withMessage('Price must be a number'),
  body('duration_mins').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin/session-form', {
      title: 'Create Session',
      session: req.body,
      errors: errors.array(),
      user: req.session.user || null,
    });
  }

  const { title, description, facilitator, session_date, session_time,
          duration_mins, location, online_link, price_dollars, capacity } = req.body;

  sessionQueries.create.run({
    title, description: description || null, facilitator: facilitator || null,
    session_date, session_time,
    duration_mins: parseInt(duration_mins, 10),
    location: location || null, online_link: online_link || null,
    price_cents: Math.round(parseFloat(price_dollars) * 100),
    capacity: parseInt(capacity, 10),
  });

  req.session.flash = { type: 'success', msg: 'Session created successfully.' };
  res.redirect('/admin/sessions');
});

// ─── GET /admin/sessions/:id/edit ─────────────────────────────────────────────
router.get('/sessions/:id/edit', (req, res) => {
  const session = sessionQueries.findById.get(req.params.id);
  if (!session) return res.redirect('/admin/sessions');

  res.render('admin/session-form', {
    title: 'Edit Session',
    session: { ...session, price_dollars: (session.price_cents / 100).toFixed(2) },
    errors: [],
    user: req.session.user || null,
  });
});

// ─── POST /admin/sessions/:id/edit ────────────────────────────────────────────
router.post('/sessions/:id/edit', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('session_date').notEmpty().withMessage('Date is required'),
  body('session_time').notEmpty().withMessage('Time is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive number'),
  body('price_dollars').isFloat({ min: 0 }).withMessage('Price must be a number'),
  body('duration_mins').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin/session-form', {
      title: 'Edit Session',
      session: { ...req.body, id: req.params.id },
      errors: errors.array(),
      user: req.session.user || null,
    });
  }

  const { title, description, facilitator, session_date, session_time,
          duration_mins, location, online_link, price_dollars, capacity, is_active } = req.body;

  sessionQueries.update.run({
    id: req.params.id,
    title, description: description || null, facilitator: facilitator || null,
    session_date, session_time,
    duration_mins: parseInt(duration_mins, 10),
    location: location || null, online_link: online_link || null,
    price_cents: Math.round(parseFloat(price_dollars) * 100),
    capacity: parseInt(capacity, 10),
    is_active: is_active ? 1 : 0,
  });

  req.session.flash = { type: 'success', msg: 'Session updated.' };
  res.redirect('/admin/sessions');
});

// ─── POST /admin/sessions/:id/delete ──────────────────────────────────────────
router.post('/sessions/:id/delete', (req, res) => {
  sessionQueries.delete.run(req.params.id);
  req.session.flash = { type: 'success', msg: 'Session deleted.' };
  res.redirect('/admin/sessions');
});

// ─── GET /admin/customers ─────────────────────────────────────────────────────
router.get('/customers', (req, res) => {
  const customers = userQueries.all.all();
  res.render('admin/customers', {
    title: 'Customer Database',
    customers,
    user: req.session.user || null,
  });
});

// ─── GET /admin/customers/:id ─────────────────────────────────────────────────
router.get('/customers/:id', (req, res) => {
  const customer = userQueries.findById.get(req.params.id);
  if (!customer) return res.redirect('/admin/customers');

  const bookings = bookingQueries.byUser.all(customer.id);
  const transactions = transactionQueries.byUser.all(customer.id);

  res.render('admin/customer-detail', {
    title: `${customer.first_name} ${customer.last_name}`,
    customer,
    bookings,
    transactions,
    user: req.session.user || null,
  });
});

// ─── GET /admin/bookings ──────────────────────────────────────────────────────
router.get('/bookings', (req, res) => {
  const bookings = bookingQueries.all.all();
  res.render('admin/bookings', {
    title: 'All Bookings',
    bookings,
    user: req.session.user || null,
  });
});

// ─── GET /admin/transactions ──────────────────────────────────────────────────
router.get('/transactions', (req, res) => {
  const transactions = transactionQueries.all.all();
  res.render('admin/transactions', {
    title: 'Transaction History',
    transactions,
    user: req.session.user || null,
  });
});

// ─── GET /admin/orders ───────────────────────────────────────────────────────
router.get('/orders', (req, res) => {
  const orders = orderQueries.all.all();
  res.render('admin/orders', {
    title: 'Orders',
    orders,
    user: req.session.user || null,
    flash: req.session.flash || null,
  });
  delete req.session.flash;
});

// ─── GET /admin/orders/:id ───────────────────────────────────────────────────
router.get('/orders/:id', (req, res) => {
  const order = orderQueries.findById.get(req.params.id);
  if (!order) return res.redirect('/admin/orders');

  const items = orderItemQueries.byOrder.all(order.id);
  res.render('admin/order-detail', {
    title: `Order #${order.id}`,
    order,
    items,
    user: req.session.user || null,
    flash: req.session.flash || null,
  });
  delete req.session.flash;
});

// ─── POST /admin/orders/:id/status ───────────────────────────────────────────
router.post('/orders/:id/status', [
  body('payment_status').isIn(['pending', 'paid', 'failed', 'awaiting_payment']).withMessage('Invalid payment status'),
  body('fulfillment_status').isIn(['processing', 'fulfilled', 'cancelled']).withMessage('Invalid fulfillment status'),
], (req, res) => {
  const order = orderQueries.findById.get(req.params.id);
  if (!order) return res.redirect('/admin/orders');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.flash = { type: 'danger', msg: errors.array()[0].msg };
    return res.redirect(`/admin/orders/${req.params.id}`);
  }

  orderQueries.updateStatuses.run({
    id: req.params.id,
    payment_status: req.body.payment_status,
    fulfillment_status: req.body.fulfillment_status,
  });

  req.session.flash = { type: 'success', msg: 'Order status updated.' };
  return res.redirect(`/admin/orders/${req.params.id}`);
});

module.exports = router;
