'use strict';

const express = require('express');

const router = express.Router();

router.get('/terms', (_req, res) => {
  res.render('legal-page', {
    title: 'Terms of Use',
    heading: 'Terms of Use',
    updatedAt: '30 June 2026',
    sections: [
      {
        title: 'Use of Our Services',
        body: 'By using this website, you agree to use it lawfully and respectfully. You are responsible for maintaining the confidentiality of your account details and for all activities under your account.',
      },
      {
        title: 'Orders and Payments',
        body: 'All prices are listed in AUD unless otherwise stated. Payments must be completed before order fulfillment. We reserve the right to cancel or refuse orders where fraud, error, or policy breaches are detected.',
      },
      {
        title: 'Content and Intellectual Property',
        body: 'All site content, including text, graphics, and materials, remains the property of Pathway to Scripture or its licensors unless otherwise indicated. You may not reproduce or redistribute content without permission.',
      },
      {
        title: 'Limitation of Liability',
        body: 'To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of this website or products purchased through it.',
      },
    ],
  });
});

router.get('/privacy', (_req, res) => {
  res.render('legal-page', {
    title: 'Privacy Policy',
    heading: 'Privacy Policy',
    updatedAt: '30 June 2026',
    sections: [
      {
        title: 'Information We Collect',
        body: 'We collect personal information needed to provide services, including account details, booking information, and purchase details. Payment card data is processed by our payment providers and not stored directly by us.',
      },
      {
        title: 'How We Use Information',
        body: 'We use personal information to process orders, communicate with you, improve our services, and meet legal obligations. We do not sell your personal data.',
      },
      {
        title: 'Data Storage and Security',
        body: 'We implement reasonable technical and organizational safeguards to protect your information. While no method is perfectly secure, we work to prevent unauthorized access and misuse.',
      },
      {
        title: 'Your Rights',
        body: 'You may request access to, correction of, or deletion of your personal information, subject to legal and operational requirements. Contact us through our support channels for assistance.',
      },
    ],
  });
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
