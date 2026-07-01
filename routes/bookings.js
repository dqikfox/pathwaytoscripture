'use strict';

const express = require('express');
const Stripe = require('stripe');
const { sessionQueries, bookingQueries, confirmBookingPaid } = require('../models/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function getStripe() {
  return Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
}

// ─── POST /bookings/create-payment-intent ─────────────────────────────────────
// Called via AJAX to create a Stripe PaymentIntent for a session booking.
router.post('/create-payment-intent', requireAuth, async (req, res) => {
  const { session_id } = req.body;
  if (!session_id) return res.status(400).json({ error: 'session_id required' });

  const bibleSession = sessionQueries.findById.get(session_id);
  if (!bibleSession || !bibleSession.is_active) {
    return res.status(404).json({ error: 'Session not found' });
  }
  if (bibleSession.spots_taken >= bibleSession.capacity) {
    return res.status(409).json({ error: 'Session is fully booked' });
  }

  // Check for existing booking
  const existing = bookingQueries.findByUserAndSession.get(req.session.userId, session_id);
  if (existing && existing.payment_status === 'paid') {
    return res.status(409).json({ error: 'You are already booked for this session' });
  }

  try {
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: bibleSession.price_cents,
      currency: 'aud',
      metadata: {
        session_id: String(bibleSession.id),
        user_id: String(req.session.userId),
        session_title: bibleSession.title,
      },
      description: `Pathway to Scripture – ${bibleSession.title}`,
    });

    // Create a pending booking record
    let bookingId;
    if (existing) {
      bookingQueries.updateStatus.run({
        id: existing.id,
        status: 'pending',
        payment_status: 'unpaid',
      });
      bookingId = existing.id;
    } else {
      const result = bookingQueries.create.run({
        user_id: req.session.userId,
        session_id: bibleSession.id,
        amount_cents: bibleSession.price_cents,
        stripe_payment_intent_id: paymentIntent.id,
      });
      bookingId = result.lastInsertRowid;
    }

    res.json({
      clientSecret: paymentIntent.client_secret,
      bookingId,
      amount: bibleSession.price_cents,
    });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Payment initialisation failed' });
  }
});

// ─── GET /bookings/confirm ────────────────────────────────────────────────────
// Stripe redirects here after payment with query params:
// ?payment_intent=pi_xxx&booking_id=123&redirect_status=succeeded
router.get('/confirm', requireAuth, async (req, res) => {
  const payment_intent_id = req.query.payment_intent;
  const booking_id = req.query.booking_id;
  const redirect_status = req.query.redirect_status;

  if (!payment_intent_id || !booking_id) return res.redirect('/sessions');

  if (redirect_status !== 'succeeded') {
    req.session.flash = { type: 'danger', msg: 'Payment was not completed. Please try again.' };
    return res.redirect('/sessions');
  }

  try {
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    const booking = bookingQueries.findById.get(booking_id);
    if (!booking || booking.user_id !== req.session.userId) return res.redirect('/dashboard');

    if (paymentIntent.status === 'succeeded' &&
        booking.stripe_payment_intent_id === payment_intent_id &&
        paymentIntent.amount === booking.amount_cents) {
      confirmBookingPaid(booking.id, req.session.userId, booking.amount_cents, payment_intent_id);
    }
    return res.redirect(`/bookings/success/${booking.id}`);
  } catch (err) {
    console.error('Confirm booking error:', err);
    return res.redirect('/sessions');
  }
});

// ─── POST /bookings/confirm ───────────────────────────────────────────────────
// Called after successful Stripe payment to mark booking as confirmed.
router.post('/confirm', requireAuth, async (req, res) => {
  const { payment_intent_id, booking_id } = req.body;
  if (!payment_intent_id || !booking_id) {
    return res.redirect('/sessions');
  }

  try {
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    if (paymentIntent.status !== 'succeeded') {
      req.session.flash = { type: 'danger', msg: 'Payment was not successful. Please try again.' };
      return res.redirect(`/sessions`);
    }

    const booking = bookingQueries.findById.get(booking_id);
    if (!booking || booking.user_id !== req.session.userId) {
      return res.redirect('/dashboard');
    }

    if (booking.payment_status !== 'paid') {
      confirmBookingPaid(booking.id, req.session.userId, booking.amount_cents, payment_intent_id);
    }

    res.redirect(`/bookings/success/${booking.id}`);
  } catch (err) {
    console.error('Confirm booking error:', err);
    res.redirect('/sessions');
  }
});

// ─── GET /bookings/success/:id ────────────────────────────────────────────────
router.get('/success/:id', requireAuth, (req, res) => {
  const booking = bookingQueries.byUser
    .all(req.session.userId)
    .find(b => b.id === Number(req.params.id));

  if (!booking) return res.redirect('/dashboard');

  res.render('booking-success', {
    title: 'Booking Confirmed!',
    booking,
    user: req.session.user || null,
  });
});

// ─── Stripe webhook (raw body required) ──────────────────────────────────────
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('STRIPE_WEBHOOK_SECRET not set – webhook endpoint inactive');
    return res.status(200).json({ received: true });
  }

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send('Webhook Error: invalid signature');
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const booking = bookingQueries.findByPaymentIntent.get(pi.id);
    if (booking && booking.payment_status !== 'paid') {
      confirmBookingPaid(booking.id, booking.user_id, pi.amount, pi.id);
    }
  }

  res.json({ received: true });
});

module.exports = router;
