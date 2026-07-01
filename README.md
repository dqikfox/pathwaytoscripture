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
- `STRIPE_SECRET_KEY` – your Stripe secret key (`sk_test_...` or `sk_live_...`)
- `STRIPE_PUBLISHABLE_KEY` – your Stripe publishable key (`pk_test_...`)
- `BASE_URL` – the URL of your site (e.g. `https://pathwaytoscripture.org`)
- `ADMIN_CODE` – a secret code used during registration to create admin accounts
- `BITCOIN_PAYMENT_LINK` – optional hosted Bitcoin checkout URL
- `BITCOIN_ADDRESS` – optional wallet address shown on the products page

### 3. Seed the database (optional)

Creates the admin account and three sample Bible study sessions:

```bash
npm run seed
```

Default admin credentials (change in `.env` before running seed):

- **Email:** `admin@pathwaytoscripture.org`
- **Password:** `$@Religion3`

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

## GoDaddy VPS Deployment

This app is designed to run on a Node.js VPS, not on a site-builder-only plan.

### Recommended production stack

- GoDaddy VPS running Ubuntu
- Node.js 18+ with `npm install --production`
- PM2 to keep the app running
- Nginx as a reverse proxy on ports 80/443
- Let's Encrypt SSL for `https://pathwaytoscripture.org`

### Environment values for production

- `NODE_ENV=production`
- `PORT=3000`
- `BASE_URL=https://pathwaytoscripture.org`
- `SESSION_SECRET` set to a long random value
- `APP_DATA_DIR=/var/lib/pathwaytoscripture` or another writable path
- `SQLITE_DB_PATH=/var/lib/pathwaytoscripture/pathwaytoscripture.db` if you want to pin the database file

### Cutover checklist

1. Provision the VPS.
2. Install Node.js, npm, and PM2.
3. Upload or clone this repository on the server.
4. Create the writable data directory and set the env vars above.
5. Run `npm install` and `npm run seed` once if you need the initial data.
6. Start the app with PM2 using `npm start`.
7. Put Nginx in front of the app and map `pathwaytoscripture.org` and `www.pathwaytoscripture.org` to `127.0.0.1:3000`.
8. Install SSL and enable auto-renew.
9. Update Stripe live webhook URLs to the production domain.
10. Verify home page, login, bookings, products, checkout, and admin access.

### GoDaddy hosting note

If your GoDaddy plan is a website builder or managed site plan, it will not run this Express app directly. You need a VPS or another Node-capable host.

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
