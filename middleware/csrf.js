'use strict';

const crypto = require('crypto');

const TOKEN_LENGTH = 32; // bytes → 64 hex chars

/**
 * Generate (or retrieve) a CSRF token for this session.
 */
function getCsrfToken(req) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(TOKEN_LENGTH).toString('hex');
  }
  return req.session.csrfToken;
}

/**
 * Middleware: inject csrfToken into res.locals so all views can use it.
 */
function csrfLocals(req, res, next) {
  if (req.session) {
    res.locals.csrfToken = getCsrfToken(req);
  }
  next();
}

/**
 * Middleware: validate CSRF token on state-changing requests.
 * Skips GET, HEAD, OPTIONS.
 * Skips the Stripe webhook endpoint (uses Stripe signature instead).
 * Also skips requests whose Content-Type is application/json (API calls
 * that use SameSite cookies or explicit CORS controls).
 */
function csrfProtection(req, res, next) {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) return next();

  // Stripe webhook: validated by Stripe signature, not CSRF token
  if (req.path === '/webhook' && req.baseUrl === '/bookings') return next();

  // JSON API endpoints (payment-intent, confirm): protected by same-site session cookie
  const ct = req.headers['content-type'] || '';
  if (ct.includes('application/json')) return next();

  const submitted = req.body && req.body._csrf;
  const expected = req.session && req.session.csrfToken;

  if (!submitted || !expected || submitted !== expected) {
    return res.status(403).render('error', {
      title: 'Forbidden',
      message: 'Your form submission could not be verified. Please go back and try again.',
    });
  }

  next();
}

module.exports = { csrfLocals, csrfProtection };
