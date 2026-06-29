'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { userQueries } = require('../models/db');

const router = express.Router();
const SALT_ROUNDS = 12;
const ADMIN_CODE = process.env.ADMIN_CODE || '';

// ─── GET /register ────────────────────────────────────────────────────────────
router.get('/register', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('register', { title: 'Create Account', errors: [], old: {} });
});

// ─── POST /register ───────────────────────────────────────────────────────────
router.post('/register', [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('password_confirm').custom((val, { req }) => {
    if (val !== req.body.password) throw new Error('Passwords do not match');
    return true;
  }),
  body('phone').trim().optional({ checkFalsy: true }),
  body('address_line1').trim().optional({ checkFalsy: true }),
  body('suburb').trim().optional({ checkFalsy: true }),
  body('state').trim().optional({ checkFalsy: true }),
  body('postcode').trim().optional({ checkFalsy: true }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('register', {
      title: 'Create Account',
      errors: errors.array(),
      old: req.body,
    });
  }

  const { first_name, last_name, email, password, phone, address_line1,
          address_line2, suburb, state, postcode, admin_code } = req.body;

  // Check if email is already used
  const existing = userQueries.findByEmail.get(email);
  if (existing) {
    return res.render('register', {
      title: 'Create Account',
      errors: [{ msg: 'An account with that email already exists.' }],
      old: req.body,
    });
  }

  const role = (ADMIN_CODE && admin_code === ADMIN_CODE) ? 'admin' : 'customer';
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const result = userQueries.create.run({
      first_name, last_name, email, password_hash, phone: phone || null,
      address_line1: address_line1 || null,
      address_line2: address_line2 || null,
      suburb: suburb || null,
      state: state || null,
      postcode: postcode || null,
      country: 'Australia',
      role,
    });

    const user = userQueries.findById.get(result.lastInsertRowid);
    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.user = {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
    };

    res.redirect(role === 'admin' ? '/admin' : '/dashboard');
  } catch (err) {
    console.error(err);
    res.render('register', {
      title: 'Create Account',
      errors: [{ msg: 'Registration failed. Please try again.' }],
      old: req.body,
    });
  }
});

// ─── GET /login ───────────────────────────────────────────────────────────────
router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('login', { title: 'Sign In', errors: [], old: {} });
});

// ─── POST /login ──────────────────────────────────────────────────────────────
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('login', { title: 'Sign In', errors: errors.array(), old: req.body });
  }

  const { email, password } = req.body;
  const user = userQueries.findByEmail.get(email);

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.render('login', {
      title: 'Sign In',
      errors: [{ msg: 'Incorrect email or password.' }],
      old: req.body,
    });
  }

  req.session.userId = user.id;
  req.session.userRole = user.role;
  req.session.user = {
    id: user.id,
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    role: user.role,
  };

  const returnTo = req.session.returnTo || (user.role === 'admin' ? '/admin' : '/dashboard');
  delete req.session.returnTo;
  res.redirect(returnTo);
});

// ─── GET /logout ──────────────────────────────────────────────────────────────
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
