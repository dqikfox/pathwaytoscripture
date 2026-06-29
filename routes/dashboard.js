'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { userQueries, bookingQueries, transactionQueries } = require('../models/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const SALT_ROUNDS = 12;

// All dashboard routes require authentication
router.use(requireAuth);

// ─── GET /dashboard ───────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  const user = userQueries.findById.get(req.session.userId);
  const bookings = bookingQueries.byUser.all(user.id);
  const transactions = transactionQueries.byUser.all(user.id);

  res.render('dashboard', {
    title: 'My Dashboard',
    pageUser: user,
    bookings,
    transactions,
    user: req.session.user || null,
    flash: req.session.flash || null,
  });
  delete req.session.flash;
});

// ─── GET /dashboard/profile ───────────────────────────────────────────────────
router.get('/profile', (req, res) => {
  const user = userQueries.findById.get(req.session.userId);
  res.render('profile', {
    title: 'My Profile',
    pageUser: user,
    errors: [],
    user: req.session.user || null,
    flash: req.session.flash || null,
  });
  delete req.session.flash;
});

// ─── POST /dashboard/profile ──────────────────────────────────────────────────
router.post('/profile', [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('phone').trim().optional({ checkFalsy: true }),
  body('address_line1').trim().optional({ checkFalsy: true }),
  body('suburb').trim().optional({ checkFalsy: true }),
  body('state').trim().optional({ checkFalsy: true }),
  body('postcode').trim().optional({ checkFalsy: true }),
], (req, res) => {
  const errors = validationResult(req);
  const dbUser = userQueries.findById.get(req.session.userId);

  if (!errors.isEmpty()) {
    return res.render('profile', {
      title: 'My Profile',
      pageUser: { ...dbUser, ...req.body },
      errors: errors.array(),
      user: req.session.user || null,
      flash: null,
    });
  }

  const { first_name, last_name, phone, address_line1, address_line2,
          suburb, state, postcode } = req.body;

  userQueries.updateProfile.run({
    id: req.session.userId,
    first_name, last_name, phone: phone || null,
    address_line1: address_line1 || null,
    address_line2: address_line2 || null,
    suburb: suburb || null,
    state: state || null,
    postcode: postcode || null,
  });

  // Update session name
  req.session.user.name = `${first_name} ${last_name}`;

  req.session.flash = { type: 'success', msg: 'Profile updated successfully.' };
  res.redirect('/dashboard/profile');
});

// ─── POST /dashboard/change-password ─────────────────────────────────────────
router.post('/change-password', [
  body('current_password').notEmpty().withMessage('Current password is required'),
  body('new_password').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  body('new_password_confirm').custom((val, { req }) => {
    if (val !== req.body.new_password) throw new Error('Passwords do not match');
    return true;
  }),
], async (req, res) => {
  const errors = validationResult(req);
  const dbUser = userQueries.findById.get(req.session.userId);

  if (!errors.isEmpty()) {
    req.session.flash = { type: 'danger', msg: errors.array()[0].msg };
    return res.redirect('/dashboard/profile');
  }

  const match = await bcrypt.compare(req.body.current_password, dbUser.password_hash);
  if (!match) {
    req.session.flash = { type: 'danger', msg: 'Current password is incorrect.' };
    return res.redirect('/dashboard/profile');
  }

  const newHash = await bcrypt.hash(req.body.new_password, SALT_ROUNDS);
  require('../models/db').db.prepare(
    `UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(newHash, req.session.userId);

  req.session.flash = { type: 'success', msg: 'Password changed successfully.' };
  res.redirect('/dashboard/profile');
});

module.exports = router;
