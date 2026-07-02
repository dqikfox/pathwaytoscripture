'use strict';

const express = require('express');

const router = express.Router();

router.get('/terms', (_req, res) => {
  res.render('terms', { title: 'Terms & Conditions' });
});

router.get('/privacy', (_req, res) => {
  // NOTE: Assumes a 'privacy.ejs' view exists.
  res.render('privacy', { title: 'Privacy Policy' });
});

router.get('/refunds', (_req, res) => {
  res.render('legal-page', {
    title: 'Refund Policy',
    heading: 'Refund Policy',
    updatedAt: '30 June 2026',
    sections: [
      {
        title: 'Physical Products',
        body: 'Requests for refunds on physical goods must be made within 14 days of delivery. Items must be unused and in original condition unless faulty or damaged on arrival.',
      },
      {
        title: 'Digital Products and Event Access',
        body: 'Digital downloads and access rights are generally non-refundable once delivered, except where required by consumer law or where access fails due to a verified service error.',
      },
      {
        title: 'How to Request a Refund',
        body: 'Contact support with your order number, reason for request, and relevant details. Approved refunds are returned to the original payment method where possible.',
      },
      {
        title: 'Processing Times',
        body: 'Approved refunds are typically processed within 5 to 10 business days, depending on your payment provider and financial institution.',
      },
    ],
  });
});

router.get('/shipping', (_req, res) => {
  res.render('legal-page', {
    title: 'Shipping Policy',
    heading: 'Shipping Policy',
    updatedAt: '30 June 2026',
    sections: [
      {
        title: 'Processing Time',
        body: 'Orders are usually processed within 1 to 3 business days after successful payment confirmation. Delays may occur during major holidays or high-demand periods.',
      },
      {
        title: 'Delivery',
        body: 'Shipping timelines vary by destination and carrier. Delivery estimates are provided as guidance and are not guaranteed in all circumstances.',
      },
      {
        title: 'Tracking and Notifications',
        body: 'Where available, tracking details are sent by email once your order has been dispatched. You are responsible for ensuring your delivery information is accurate.',
      },
      {
        title: 'Lost or Damaged Parcels',
        body: 'If your order is lost or arrives damaged, contact support promptly so we can investigate and provide a suitable resolution.',
      },
    ],
  });
});

module.exports = router;
