<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
# Pathway to Scripture

A Catholic Bible study booking and payment website built with Node.js, Express, SQLite and Stripe.

## Features

- **Customer Registration & Login** – customers register with full contact details (name, email, phone, address) and manage their account
- **Session Catalogue** – browse upcoming Bible study sessions with date, time, location, facilitator and availability
- **Online Booking & Payment** – secure Stripe payment ($99 inc. GST per session) with real-time payment form
- **Customer Dashboard** – view confirmed bookings, transaction history and account balance
- **Admin Panel** – manage sessions, view the full customer database, track all bookings and transactions
- **Australian Address Support** – state/postcode/suburb fields with all AU states

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Web framework | Express 4 |
| Database | SQLite (via better-sqlite3) |
| Templating | EJS |
| Styling | Bootstrap 5 + custom CSS |
| Payments | Stripe |
| Auth | express-session + bcrypt |

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

## Creating an Admin Account

During registration, enter the `ADMIN_CODE` value from your `.env` file in the hidden admin field, or run the seed script which creates an admin account automatically.

## Stripe Setup

1. Create a free account at [stripe.com](https://stripe.com)
2. Copy your API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. Paste into `.env`
4. For production, set up a webhook endpoint at `/bookings/webhook` pointing to your live domain, and add `STRIPE_WEBHOOK_SECRET` to `.env`

## Project Structure

```
├── server.js           # Express app entry point
├── seed.js             # Database seeder
├── models/
│   └── db.js           # SQLite schema + prepared queries
├── routes/
│   ├── auth.js         # Register / login / logout
│   ├── sessions.js     # Browse Bible study sessions
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

>>>>>>> copilot/pathwaytoscripture-site-development
