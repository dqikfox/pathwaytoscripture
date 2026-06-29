'use strict';

const express = require('express');
const { sessionQueries } = require('../models/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// ─── GET /sessions ────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  const sessions = sessionQueries.allActive.all();
  res.render('sessions', {
    title: 'Bible Study Sessions',
    sessions,
    user: req.session.user || null,
  });
});

// ─── GET /sessions/:id ────────────────────────────────────────────────────────
router.get('/:id', requireAuth, (req, res) => {
  const session = sessionQueries.findById.get(req.params.id);
  if (!session || !session.is_active) {
    return res.status(404).render('error', {
      title: 'Session Not Found',
      message: 'This session could not be found.',
      user: req.session.user || null,
    });
  }
  res.render('session-detail', {
    title: session.title,
    session,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    user: req.session.user || null,
  });
});

module.exports = router;
