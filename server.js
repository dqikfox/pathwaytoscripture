'use strict';

require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const { csrfLocals, csrfProtection } = require('./middleware/csrf');

// Ensure data directory exists for session store
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const app = express();
const PORT = process.env.PORT || 3000;

// ─── View engine ──────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Rate limiters ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});

// Apply rate limiting to auth endpoints
app.use('/login', authLimiter);
app.use('/register', authLimiter);

// Apply rate limiting to password change
const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many password change attempts, please try again later.',
});
app.use('/dashboard/change-password', passwordLimiter);

// ─── Middleware ───────────────────────────────────────────────────────────────
// Raw body needed by Stripe webhook – must be registered before urlencoded parser
app.use('/bookings/webhook', express.raw({ type: 'application/json' }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  store: new SQLiteStore({ db: 'sessions.db', dir: DATA_DIR }),
  secret: process.env.SESSION_SECRET || 'default_dev_secret_change_me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

// CSRF token injection (must come after session)
app.use(csrfLocals);

// CSRF validation on all state-changing routes (POST/PUT/DELETE)
app.use(csrfProtection);

// Make session user available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/', require('./routes/auth'));
app.use('/sessions', require('./routes/sessions'));
app.use('/bookings', require('./routes/bookings'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/admin', require('./routes/admin'));

// Home page
app.get('/', (req, res) => {
  const { sessionQueries } = require('./models/db');
  const upcomingSessions = sessionQueries.allActive.all().slice(0, 3);
  res.render('index', {
    title: 'Pathway to Scripture – Catholic Bible Studies',
    upcomingSessions,
  });
});

// About page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

// Contact page
app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us',
    flash: req.session.flash || null,
  });
  delete req.session.flash;
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The page you are looking for could not be found.',
  });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Server Error',
    message: 'An unexpected error occurred. Please try again later.',
  });
});

app.listen(PORT, () => {
  console.log(`Pathway to Scripture running on http://localhost:${PORT}`);
});

module.exports = app;
