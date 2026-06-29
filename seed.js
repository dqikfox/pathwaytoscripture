#!/usr/bin/env node
'use strict';

/**
 * Seed script – run once to populate sample Bible study sessions.
 * Usage: node seed.js
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const { userQueries, sessionQueries } = require('./models/db');

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@pathwaytoscripture.org';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';

async function seed() {
  // ── Admin account ──────────────────────────────────────────────────
  const existing = userQueries.findByEmail.get(ADMIN_EMAIL);
  if (!existing) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    userQueries.create.run({
      first_name: 'Admin',
      last_name: 'User',
      email: ADMIN_EMAIL,
      password_hash: hash,
      phone: null,
      address_line1: null,
      address_line2: null,
      suburb: null,
      state: null,
      postcode: null,
      country: 'Australia',
      role: 'admin',
    });
    console.log(`✓ Admin account created: ${ADMIN_EMAIL} (password set from SEED_ADMIN_PASSWORD env var)`);
  } else {
    console.log(`  Admin account already exists: ${ADMIN_EMAIL}`);
  }

  // ── Sample sessions ────────────────────────────────────────────────
  const sampleSessions = [
    {
      title: 'Introduction to the Gospel of John',
      description:
        'Explore the unique theological depth of the fourth gospel. ' +
        'This session covers the prologue (John 1:1-18), the seven "signs", and ' +
        'the "I am" sayings of Jesus. No prior Bible study experience required.',
      facilitator: "Fr. Michael O'Brien",
      session_date: '2026-08-10',
      session_time: '10:00',
      duration_mins: 90,
      location: "St Mary's Parish Hall, 45 Church St, Sydney NSW 2000",
      online_link: null,
      price_cents: 9900,
      capacity: 20,
    },
    {
      title: 'The Psalms: Israel\'s Prayerbook',
      description:
        'A journey through the Book of Psalms – poetry, lament, praise, and prophecy. ' +
        'Learn how Jesus and the early Church used the Psalms, and how they continue ' +
        'to nourish Catholic prayer and liturgy today.',
      facilitator: "Sr. Therese Murphy OP",
      session_date: '2026-08-24',
      session_time: '18:30',
      duration_mins: 90,
      location: "St Mary's Parish Hall, 45 Church St, Sydney NSW 2000",
      online_link: 'https://zoom.us/j/example',
      price_cents: 9900,
      capacity: 25,
    },
    {
      title: "St Paul's Letter to the Romans",
      description:
        'A study of Romans – arguably the most theologically rich letter in the New Testament. ' +
        'Topics include justification by faith, the role of the Law, and the mystery of ' +
        "God's plan for Israel and the Gentiles.",
      facilitator: "Fr. Michael O'Brien",
      session_date: '2026-09-07',
      session_time: '10:00',
      duration_mins: 90,
      location: "St Mary's Parish Hall, 45 Church St, Sydney NSW 2000",
      online_link: null,
      price_cents: 9900,
      capacity: 20,
    },
  ];

  const existingSessions = sessionQueries.all.all();
  if (existingSessions.length === 0) {
    sampleSessions.forEach(s => {
      sessionQueries.create.run(s);
      console.log(`✓ Session created: ${s.title}`);
    });
  } else {
    console.log(`  ${existingSessions.length} session(s) already exist – skipping session seed`);
  }

  console.log('\nSeed complete. You can now start the server with: npm start');
}

seed().catch(console.error);
