# GoDaddy Node.js Hosting Guide

This repository is ready for GoDaddy Node.js Hosting and expects the platform to:

- upload a single ZIP archive
- run `npm install`
- start the app with `npm start`
- inject the runtime `PORT`

## Pre-deployment checklist

1. Prepare production environment variables:
   - `NODE_ENV=production`
   - `BASE_URL=https://your-domain.example`
   - `SESSION_SECRET=<long random value>`
   - `SESSION_STORE=sqlite` only when you have verified durable writable storage; use `memory` for non-durable previews
   - `TRUST_PROXY=1`
   - `APP_DATA_DIR=<durable writable path>`
   - `SQLITE_DB_PATH=/persistent/data/pathwaytoscripture.db` (optional example)
   - `ADMIN_CODE=<secret admin registration code>`
   - `STRIPE_SECRET_KEY=<live or test secret key>`
   - `STRIPE_PUBLISHABLE_KEY=<live or test publishable key>`
   - `STRIPE_WEBHOOK_SECRET=<Stripe webhook secret>`
   - `BITCOIN_PAYMENT_LINK` / `BITCOIN_ADDRESS` only if Bitcoin checkout is enabled
   - `AUTO_ADMIN_EMAILS` only if you intentionally want email-based bootstrap admins
2. Create the deploy ZIP from the repository root.
3. Exclude local-only files:
   - `node_modules/`
   - `.env`
   - `data/`
   - `*.db`
   - `*.db-shm`
   - `*.db-wal`

## Launch-readiness review

### Launch-ready

- public site rendering
- account registration and login
- session browsing and booking
- Stripe webhook endpoint
- customer dashboard
- admin session management
- order review and fulfillment status updates

### Requires production configuration

- Stripe live keys and webhook secret
- production domain and SSL
- writable SQLite/session storage path
- admin bootstrap rules (`ADMIN_CODE`, optional `AUTO_ADMIN_EMAILS`)

### Requires business confirmation before go-live

- product catalogue content and pricing
- Bitcoin checkout enablement
- legal policy wording
- contact email ownership
- seeded sample sessions versus real sessions

### Current platform risk

- If GoDaddy Node.js Hosting only offers ephemeral local storage, SQLite data and SQLite-backed sessions are not durable enough for production.
- In that case, use `SESSION_STORE=memory` only for non-durable previews and move production to a VPS or migrate persistence before launch.

## Deployment steps

1. Upload the ZIP to GoDaddy Node.js Hosting.
2. Wait for dependency installation and preview deployment to complete.
3. Open the preview URL and confirm `/healthz` returns a 200 response.
4. If the database is empty, run `npm run seed` with an explicit `SEED_ADMIN_PASSWORD`.
5. Publish the app.
6. Attach the apex domain and `www` domain in GoDaddy.
7. Update Stripe webhook configuration to the production URL.

## Acceptance checks

- Home, About, Contact, and legal pages render correctly
- Register and login flows work
- Session checkout succeeds and appears in the dashboard
- Product checkout succeeds when Stripe is enabled
- Admin login can manage sessions, bookings, customers, and orders
- App restart does not lose the SQLite database or session store unexpectedly

## Security notes

- In production the app now refuses to boot without `SESSION_SECRET`.
- Hard-coded auto-admin emails have been removed; use `AUTO_ADMIN_EMAILS` only when needed.
- Keep seed credentials out of source control and set `SEED_ADMIN_PASSWORD` explicitly for production seeding.
