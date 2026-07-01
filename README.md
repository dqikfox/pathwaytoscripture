# Pathway to Scripture

A Catholic Bible study booking and payment website built with Node.js, Express, SQLite and Stripe.

## Features

- **Customer Registration & Login** – customers register with full contact details (name, email, phone, address) and manage their account
- **Session Catalogue** – browse upcoming Bible study sessions with date, time, location, facilitator and availability
- **Online Booking & Payment** – secure Stripe payment ($99 inc. GST per session) with real-time payment form
- **Products Store** – browse Catholic products, add to cart, and complete a unified checkout
- **Checkout Methods** – Stripe card checkout and configurable Bitcoin checkout flow
- **Legal Checkout Consent** – terms, privacy, refund, and shipping policies are linked and required during checkout
- **Customer Dashboard** – view confirmed bookings, transaction history and account balance
- **Admin Panel** – manage sessions, view the full customer database, track bookings/transactions, and manage store orders
- **Australian Address Support** – state/postcode/suburb fields with all AU states

## Tech Stack

| Layer         | Technology                  |
| ------------- | --------------------------- |
| Runtime       | Node.js 18+                 |
| Web framework | Express 4                   |
| Database      | SQLite (via better-sqlite3) |
| Templating    | EJS                         |
| Styling       | Bootstrap 5 + custom CSS    |
| Payments      | Stripe                      |
| Auth          | express-session + bcrypt    |

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set:

- `SESSION_SECRET` – a long random string
- `TRUST_PROXY=1` when running behind GoDaddy or another reverse proxy
- `SESSION_STORE=sqlite` for normal deployments or `memory` for stateless previews
- `STRIPE_SECRET_KEY` – your Stripe secret key (`sk_test_...` or `sk_live_...`)
- `STRIPE_PUBLISHABLE_KEY` – your Stripe publishable key (`pk_test_...`)
- `BASE_URL` – the URL of your site (e.g. `https://pathwaytoscripture.org`)
- `ADMIN_CODE` – a secret code used during registration to create admin accounts
- `AUTO_ADMIN_EMAILS` – optional comma-separated bootstrap admin emails
- `BITCOIN_PAYMENT_LINK` – optional hosted Bitcoin checkout URL
- `BITCOIN_ADDRESS` – optional wallet address shown on the products page

### 3. Seed the database (optional)

Creates the admin account and three sample Bible study sessions:

```bash
npm run seed
```

Default admin credentials (change in `.env` before running seed):

- **Email:** `admin@pathwaytoscripture.org`
- **Password:** `ChangeMe123!`

### 4. Start the server

```bash
npm start
```

Visit `http://localhost:3000`

## Stripe Setup

1. Create a free account at [stripe.com](https://stripe.com)
2. Copy your API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. Paste into `.env`
4. For production, set up a webhook endpoint at `/bookings/webhook` pointing to your live domain, and add `STRIPE_WEBHOOK_SECRET` to `.env`

## GoDaddy Node.js Hosting Deployment

This repository is compatible with GoDaddy Node.js Hosting (PaaS beta). The platform installs dependencies for you and launches the app with `npm start`, so this repository only needs a valid `package.json`, a working `start` script, and runtime configuration through environment variables.

### Platform expectations

- Node.js 18+
- `package.json` in the repository root
- `npm start` must launch the app
- The app must bind to `process.env.PORT`
- Upload a single app as a ZIP file without `node_modules/`

### Environment values for production

- `NODE_ENV=production`
- `PORT` supplied by GoDaddy at runtime
- `BASE_URL=https://pathwaytoscripture.org`
- `SESSION_SECRET` set to a long random value
- `SESSION_STORE=sqlite` only if your hosting provides durable writable storage; otherwise use `memory` for previews only
- `TRUST_PROXY=1`
- `APP_DATA_DIR=<durable writable path>` when local SQLite/session files must persist
- `SQLITE_DB_PATH=<durable writable path>/pathwaytoscripture.db` if you want to pin the database file
- `AUTO_ADMIN_EMAILS` only if you intentionally want bootstrap admin emails
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` only when running the seed script

### Deployment flow

1. Create a deploy ZIP from the repository root and exclude `node_modules`, `.env`, `data`, and local database files.
2. Upload the ZIP to GoDaddy Node.js Hosting.
3. Set the production environment variables in the GoDaddy dashboard.
4. Publish the preview deployment once the app boots successfully.
5. Connect the production domain and `www` alias in the GoDaddy UI.
6. If you need starter data, run `npm run seed` with explicit `SEED_ADMIN_PASSWORD` before launch.
7. Update Stripe webhook URLs to `https://your-domain.example/bookings/webhook`.
8. Verify `/healthz`, home page, login, bookings, products, checkout, and admin access.

### Important storage warning

This app stores business data in SQLite and, by default, stores sessions on SQLite-backed local disk. If your GoDaddy Node.js Hosting environment does not provide durable writable storage across restarts and redeploys, use a VPS instead or plan a follow-up migration away from local SQLite before production launch.

### GoDaddy hosting note

This Express app will not run on GoDaddy Website Builder or static-only hosting. Use GoDaddy Node.js Hosting or another Node-capable environment.

See [`docs/godaddy-nodejs-hosting.md`](docs/godaddy-nodejs-hosting.md) for the full deployment checklist and launch-readiness review.

## Project Structure

```text
├── server.js           # Express app entry point
├── seed.js             # Database seeder
├── models/
│   └── db.js           # SQLite schema + prepared queries
├── routes/
│   ├── auth.js         # Register / login / logout
│   ├── sessions.js     # Browse Bible study sessions
│   ├── products.js     # Store, cart, and checkout
│   ├── legal.js        # Terms/privacy/refunds/shipping pages
│   ├── bookings.js     # Stripe payment + booking confirmation
│   ├── dashboard.js    # Customer dashboard & profile
│   └── admin.js        # Admin panel
├── middleware/
│   └── auth.js         # requireAuth / requireAdmin middleware
├── views/
│   ├── partials/       # header, footer, flash, errors
│   ├── admin/          # Admin panel templates
│   └── *.ejs           # Page templates
└── public/
    ├── css/style.css
    └── js/main.js
```

## Customer Data Collected

At registration, the following information is captured and stored:

- First name, last name
- Email address
- Phone number
- Street address (line 1 & 2), suburb, state, postcode
- Booking history and payment transactions
- Account balance
