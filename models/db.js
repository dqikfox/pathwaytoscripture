'use strict';

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DATA_DIR = process.env.APP_DATA_DIR
  ? path.resolve(process.env.APP_DATA_DIR)
  : path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = process.env.SQLITE_DB_PATH
  ? path.resolve(process.env.SQLITE_DB_PATH)
  : path.join(DATA_DIR, 'pathwaytoscripture.db');

if (process.env.NODE_ENV === 'production' && !process.env.SQLITE_DB_PATH && !process.env.APP_DATA_DIR) {
  console.warn('[database] Using default local SQLite storage in production. Configure SQLITE_DB_PATH or APP_DATA_DIR for durable hosting.');
}

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Schema ──────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name    TEXT NOT NULL,
    last_name     TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone         TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    suburb        TEXT,
    state         TEXT,
    postcode      TEXT,
    country       TEXT DEFAULT 'Australia',
    role          TEXT NOT NULL DEFAULT 'customer',
    account_balance REAL NOT NULL DEFAULT 0,
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bible_sessions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    title         TEXT NOT NULL,
    description   TEXT,
    facilitator   TEXT,
    session_date  TEXT NOT NULL,
    session_time  TEXT NOT NULL,
    duration_mins INTEGER NOT NULL DEFAULT 90,
    location      TEXT,
    online_link   TEXT,
    price_cents   INTEGER NOT NULL DEFAULT 9900,
    capacity      INTEGER NOT NULL DEFAULT 20,
    spots_taken   INTEGER NOT NULL DEFAULT 0,
    is_active     INTEGER NOT NULL DEFAULT 1,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL REFERENCES users(id),
    session_id      INTEGER NOT NULL REFERENCES bible_sessions(id),
    status          TEXT NOT NULL DEFAULT 'pending',
    payment_status  TEXT NOT NULL DEFAULT 'unpaid',
    amount_cents    INTEGER NOT NULL,
    stripe_payment_intent_id TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, session_id)
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL REFERENCES users(id),
    booking_id      INTEGER REFERENCES bookings(id),
    type            TEXT NOT NULL,
    amount_cents    INTEGER NOT NULL,
    description     TEXT,
    stripe_payment_intent_id TEXT,
    status          TEXT NOT NULL DEFAULT 'completed',
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id                       INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id                  INTEGER REFERENCES users(id),
    customer_name            TEXT NOT NULL,
    customer_email           TEXT NOT NULL,
    customer_phone           TEXT,
    address_line1            TEXT,
    address_line2            TEXT,
    suburb                   TEXT,
    state                    TEXT,
    postcode                 TEXT,
    country                  TEXT DEFAULT 'Australia',
    payment_method           TEXT NOT NULL,
    payment_status           TEXT NOT NULL DEFAULT 'pending',
    fulfillment_status       TEXT NOT NULL DEFAULT 'processing',
    currency                 TEXT NOT NULL DEFAULT 'aud',
    subtotal_cents           INTEGER NOT NULL,
    tax_cents                INTEGER NOT NULL DEFAULT 0,
    shipping_cents           INTEGER NOT NULL DEFAULT 0,
    total_cents              INTEGER NOT NULL,
    stripe_checkout_session_id TEXT UNIQUE,
    terms_version            TEXT NOT NULL,
    terms_accepted_at        TEXT NOT NULL,
    notes                    TEXT,
    created_at               TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at               TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id                       INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id                 INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id               TEXT NOT NULL,
    sku                      TEXT,
    product_name             TEXT NOT NULL,
    unit_price_cents         INTEGER NOT NULL,
    quantity                 INTEGER NOT NULL,
    line_total_cents         INTEGER NOT NULL
  );
`);

// ─── User queries ─────────────────────────────────────────────────────────────

const userQueries = {
  create: db.prepare(`
    INSERT INTO users (first_name, last_name, email, password_hash, phone,
      address_line1, address_line2, suburb, state, postcode, country, role)
    VALUES (@first_name, @last_name, @email, @password_hash, @phone,
      @address_line1, @address_line2, @suburb, @state, @postcode, @country, @role)
  `),

  findByEmail: db.prepare(`SELECT * FROM users WHERE email = ?`),

  findById: db.prepare(`SELECT * FROM users WHERE id = ?`),

  updateProfile: db.prepare(`
    UPDATE users SET
      first_name = @first_name, last_name = @last_name, phone = @phone,
      address_line1 = @address_line1, address_line2 = @address_line2,
      suburb = @suburb, state = @state, postcode = @postcode,
      updated_at = datetime('now')
    WHERE id = @id
  `),

  updateBalance: db.prepare(`
    UPDATE users SET account_balance = account_balance + @delta,
      updated_at = datetime('now')
    WHERE id = @id
  `),

  updateRole: db.prepare(`
    UPDATE users SET role = @role, updated_at = datetime('now')
    WHERE id = @id
  `),

  updatePassword: db.prepare(`
    UPDATE users SET password_hash = @password_hash, updated_at = datetime('now')
    WHERE id = @id
  `),

  all: db.prepare(`SELECT id, first_name, last_name, email, phone, suburb, state,
    role, account_balance, created_at FROM users ORDER BY created_at DESC`),

  count: db.prepare(`SELECT COUNT(*) as count FROM users WHERE role = 'customer'`),
};

// ─── Session queries ──────────────────────────────────────────────────────────

const sessionQueries = {
  create: db.prepare(`
    INSERT INTO bible_sessions (title, description, facilitator, session_date,
      session_time, duration_mins, location, online_link, price_cents, capacity)
    VALUES (@title, @description, @facilitator, @session_date, @session_time,
      @duration_mins, @location, @online_link, @price_cents, @capacity)
  `),

  findById: db.prepare(`SELECT * FROM bible_sessions WHERE id = ?`),

  allActive: db.prepare(`
    SELECT * FROM bible_sessions
    WHERE is_active = 1
    ORDER BY session_date ASC, session_time ASC
  `),

  all: db.prepare(`SELECT * FROM bible_sessions ORDER BY session_date ASC, session_time ASC`),

  incrementSpots: db.prepare(`
    UPDATE bible_sessions SET spots_taken = spots_taken + 1 WHERE id = ?
  `),

  decrementSpots: db.prepare(`
    UPDATE bible_sessions SET spots_taken = spots_taken - 1 WHERE id = ? AND spots_taken > 0
  `),

  update: db.prepare(`
    UPDATE bible_sessions SET
      title = @title, description = @description, facilitator = @facilitator,
      session_date = @session_date, session_time = @session_time,
      duration_mins = @duration_mins, location = @location,
      online_link = @online_link, price_cents = @price_cents,
      capacity = @capacity, is_active = @is_active
    WHERE id = @id
  `),

  delete: db.prepare(`DELETE FROM bible_sessions WHERE id = ?`),

  upcomingCount: db.prepare(`
    SELECT COUNT(*) as count FROM bible_sessions
    WHERE is_active = 1 AND session_date >= date('now')
  `),
};

// ─── Booking queries ──────────────────────────────────────────────────────────

const bookingQueries = {
  create: db.prepare(`
    INSERT INTO bookings (user_id, session_id, amount_cents, stripe_payment_intent_id)
    VALUES (@user_id, @session_id, @amount_cents, @stripe_payment_intent_id)
  `),

  findById: db.prepare(`SELECT * FROM bookings WHERE id = ?`),

  findByPaymentIntent: db.prepare(`
    SELECT * FROM bookings WHERE stripe_payment_intent_id = ?
  `),

  findByUserAndSession: db.prepare(`
    SELECT * FROM bookings WHERE user_id = ? AND session_id = ?
  `),

  updateStatus: db.prepare(`
    UPDATE bookings SET status = @status, payment_status = @payment_status,
      updated_at = datetime('now')
    WHERE id = @id
  `),

  byUser: db.prepare(`
    SELECT b.*, s.title, s.session_date, s.session_time, s.location,
      s.duration_mins, s.facilitator
    FROM bookings b
    JOIN bible_sessions s ON s.id = b.session_id
    WHERE b.user_id = ?
    ORDER BY s.session_date DESC
  `),

  all: db.prepare(`
    SELECT b.*, u.first_name, u.last_name, u.email,
      s.title, s.session_date, s.session_time
    FROM bookings b
    JOIN users u ON u.id = b.user_id
    JOIN bible_sessions s ON s.id = b.session_id
    ORDER BY b.created_at DESC
  `),

  totalRevenue: db.prepare(`
    SELECT COALESCE(SUM(amount_cents), 0) as total
    FROM bookings WHERE payment_status = 'paid'
  `),
};

// ─── Transaction queries ──────────────────────────────────────────────────────

const transactionQueries = {
  create: db.prepare(`
    INSERT INTO transactions (user_id, booking_id, type, amount_cents,
      description, stripe_payment_intent_id, status)
    VALUES (@user_id, @booking_id, @type, @amount_cents,
      @description, @stripe_payment_intent_id, @status)
  `),

  byUser: db.prepare(`
    SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC
  `),

  all: db.prepare(`
    SELECT t.*, u.first_name, u.last_name, u.email
    FROM transactions t
    JOIN users u ON u.id = t.user_id
    ORDER BY t.created_at DESC
    LIMIT 100
  `),
};

// ─── Order queries ───────────────────────────────────────────────────────────

const orderQueries = {
  create: db.prepare(`
    INSERT INTO orders (
      user_id, customer_name, customer_email, customer_phone,
      address_line1, address_line2, suburb, state, postcode, country,
      payment_method, payment_status, fulfillment_status, currency,
      subtotal_cents, tax_cents, shipping_cents, total_cents,
      stripe_checkout_session_id, terms_version, terms_accepted_at, notes
    ) VALUES (
      @user_id, @customer_name, @customer_email, @customer_phone,
      @address_line1, @address_line2, @suburb, @state, @postcode, @country,
      @payment_method, @payment_status, @fulfillment_status, @currency,
      @subtotal_cents, @tax_cents, @shipping_cents, @total_cents,
      @stripe_checkout_session_id, @terms_version, @terms_accepted_at, @notes
    )
  `),

  findById: db.prepare(`SELECT * FROM orders WHERE id = ?`),

  findByStripeSession: db.prepare(`
    SELECT * FROM orders WHERE stripe_checkout_session_id = ?
  `),

  byUser: db.prepare(`
    SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
  `),

  all: db.prepare(`
    SELECT o.*, u.first_name, u.last_name
    FROM orders o
    LEFT JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC
    LIMIT 200
  `),

  updateStatuses: db.prepare(`
    UPDATE orders SET
      payment_status = @payment_status,
      fulfillment_status = @fulfillment_status,
      updated_at = datetime('now')
    WHERE id = @id
  `),
};

const orderItemQueries = {
  create: db.prepare(`
    INSERT INTO order_items (
      order_id, product_id, sku, product_name,
      unit_price_cents, quantity, line_total_cents
    ) VALUES (
      @order_id, @product_id, @sku, @product_name,
      @unit_price_cents, @quantity, @line_total_cents
    )
  `),

  byOrder: db.prepare(`
    SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC
  `),
};

// ─── Compound operations ──────────────────────────────────────────────────────

/**
 * Confirm a booking as paid (runs in a transaction).
 */
const confirmBookingPaid = db.transaction((bookingId, userId, amountCents, paymentIntentId) => {
  bookingQueries.updateStatus.run({
    id: bookingId,
    status: 'confirmed',
    payment_status: 'paid',
  });

  const booking = bookingQueries.findById.get(bookingId);
  sessionQueries.incrementSpots.run(booking.session_id);

  transactionQueries.create.run({
    user_id: userId,
    booking_id: bookingId,
    type: 'payment',
    amount_cents: amountCents,
    description: 'Bible study session booking',
    stripe_payment_intent_id: paymentIntentId,
    status: 'completed',
  });
});

module.exports = {
  db,
  userQueries,
  sessionQueries,
  bookingQueries,
  transactionQueries,
  orderQueries,
  orderItemQueries,
  confirmBookingPaid,
};
