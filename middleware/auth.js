'use strict';

/**
 * Middleware: require an authenticated session.
 */
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect('/login');
}

/**
 * Middleware: require admin role.
 */
function requireAdmin(req, res, next) {
  if (req.session && req.session.userRole === 'admin') {
    return next();
  }
  res.status(403).render('error', {
    title: 'Access Denied',
    message: 'You do not have permission to view this page.',
    user: req.session.user || null,
  });
}

module.exports = { requireAuth, requireAdmin };
