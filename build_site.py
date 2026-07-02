#!/usr/bin/env python3
"""Rebuild the static Pathway to Scripture site from templates and content."""
import json, os, shutil, zipfile
from pathlib import Path

BASE = Path(__file__).resolve().parent
OUT = BASE / "godaddy-html"
CSS_SRC = BASE / "public" / "css"
IMG_SRC = BASE / "public" / "images"

# Clean and recreate output
if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir(parents=True)

# Copy assets
shutil.copytree(CSS_SRC, OUT / "css", dirs_exist_ok=True)
shutil.copytree(IMG_SRC, OUT / "images", dirs_exist_ok=True)

# Base HTML template
BASE_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{{META}}">
  <title>{{TITLE}} – Pathway to Scripture</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Open+Sans:wght@300;400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
  <style>
    :root { --font-display: 'Cinzel', 'Playfair Display', serif; --font-body: 'Open Sans', sans-serif; }
    body { font-family: var(--font-body); }
    h1, h2, h3, h4, h5, .navbar-brand, .section-title, .display-font { font-family: var(--font-display); }
    .navbar-dark.bg-navy { background: var(--pts-navy) !important; }
    .footer-dark { background: #132a42 !important; color: #e8dcc3; }
    .footer-dark a { color: var(--pts-gold-light); text-decoration: none; }
    .footer-dark a:hover { color: #fff; text-decoration: underline; }
    .social-btn { display:inline-flex; align-items:center; gap:.4rem; padding:.45rem .9rem; border-radius:999px; font-size:.9rem; font-weight:600; transition:.2s; }
    .social-instagram { background:#e1306c; color:#fff; }
    .social-gofundme { background:#00b964; color:#fff; }
    .social-btn:hover { filter:brightness(1.1); color:#fff; }
    .legal-page { max-width:820px; }
    .legal-page h2 { margin-top:2rem; color:var(--pts-navy); border-bottom:2px solid var(--pts-gold); padding-bottom:.4rem; }
  </style>
</head>
<body class="d-flex flex-column min-vh-100">
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-navy shadow-sm">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="/index.html">
          <img src="/images/pw2s-logo.png" alt="Pathway to Scripture" height="42">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li class="nav-item"><a class="nav-link" href="/index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="/about.html">About</a></li>
            <li class="nav-item"><a class="nav-link" href="/sessions.html">Sessions</a></li>
            <li class="nav-item"><a class="nav-link" href="/products.html">Store</a></li>
            <li class="nav-item"><a class="nav-link" href="/contact.html">Contact</a></li>
            <li class="nav-item ms-lg-3 mt-2 mt-lg-0">
              <a class="social-btn social-gofundme" href="https://gofund.me/6cf919b9e" target="_blank" rel="noopener">
                <i class="bi bi-heart-fill"></i> Support Us
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <main class="flex-grow-1">
    {{CONTENT}}
  </main>

  <footer class="footer-dark py-5">
    <div class="container">
      <div class="row gy-4">
        <div class="col-md-4 text-center text-md-start">
          <img src="/images/pw2s-logo.png" alt="Pathway to Scripture" height="50" class="mb-3">
          <p class="small mb-0">Guided Catholic Bible study for modern believers.</p>
        </div>
        <div class="col-md-4 text-center">
          <h5 class="text-white mb-3">Connect</h5>
          <div class="d-flex justify-content-center gap-2 flex-wrap">
            <a class="social-btn social-instagram" href="https://instagram.com/Haddadempire" target="_blank" rel="noopener"><i class="bi bi-instagram"></i> Haddadempire</a>
            <a class="social-btn social-instagram" href="https://instagram.com/pathway2scripture" target="_blank" rel="noopener"><i class="bi bi-instagram"></i> pathway2scripture</a>
            <a class="social-btn social-gofundme" href="https://gofund.me/6cf919b9e" target="_blank" rel="noopener"><i class="bi bi-heart-fill"></i> GoFundMe</a>
          </div>
        </div>
        <div class="col-md-4 text-center text-md-end">
          <h5 class="text-white mb-3">Contact</h5>
          <p class="small mb-1"><i class="bi bi-envelope"></i> <a href="mailto:info@pathwaytoscripture.org">info@pathwaytoscripture.org</a></p>
          <p class="small mb-1"><i class="bi bi-telephone"></i> 0493 993 301</p>
          <p class="small mb-0">Gabby Haddad</p>
        </div>
      </div>
      <hr class="border-secondary my-4">
      <div class="text-center small">
        <p class="mb-2">&copy; 2026 Pathway to Scripture. All Rights Reserved.</p>
        <ul class="list-inline mb-0">
          <li class="list-inline-item"><a href="/terms.html">Terms &amp; Conditions</a></li>
          <li class="list-inline-item">&middot;</li>
          <li class="list-inline-item"><a href="/privacy.html">Privacy Policy</a></li>
          <li class="list-inline-item">&middot;</li>
          <li class="list-inline-item"><a href="/refunds.html">Refund Policy</a></li>
        </ul>
      </div>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
"""

# Page definitions
PAGES = {
    "index.html": {
        "title": "Catholic Bible Studies",
        "meta": "Join Pathway to Scripture for guided Catholic Bible study sessions. Scripture, prayer, and fellowship for modern believers.",
    },
    "about.html": {
        "title": "About Us",
        "meta": "Learn about Pathway to Scripture, a Catholic Bible study community founded by Gabby Haddad.",
    },
    "contact.html": {
        "title": "Contact",
        "meta": "Contact Pathway to Scripture. Email info@pathwaytoscripture.org or call 0493 993 301.",
    },
    "sessions.html": {
        "title": "Sessions",
        "meta": "Browse upcoming Catholic Bible study sessions at Pathway to Scripture.",
    },
    "products.html": {
        "title": "Store",
        "meta": "Support Pathway to Scripture and explore resources from our store.",
    },
    "login.html": {
        "title": "Sign In",
        "meta": "Sign in to your Pathway to Scripture account.",
    },
    "register.html": {
        "title": "Register",
        "meta": "Create a Pathway to Scripture account.",
    },
    "dashboard.html": {
        "title": "Dashboard",
        "meta": "Member dashboard for Pathway to Scripture.",
    },
    "admin.html": {
        "title": "Admin",
        "meta": "Admin area for Pathway to Scripture.",
    },
    "terms.html": {
        "title": "Terms & Conditions",
        "meta": "Terms and Conditions for Pathway to Scripture.",
    },
    "privacy.html": {
        "title": "Privacy Policy",
        "meta": "Privacy Policy for Pathway to Scripture.",
    },
    "refunds.html": {
        "title": "Refund Policy",
        "meta": "Refund Policy for Pathway to Scripture.",
    },
}

# Content fragments (kept short for maintainability)
CONTENT = {
    "index.html": """<!-- Hero Section -->
<section class="hero-section text-white d-flex align-items-center">
  <div class="container position-relative hero-shell py-5">
    <div class="row align-items-center g-5">
      <div class="col-lg-8 text-center text-lg-start">
        <div class="hero-kicker-wrap mb-3 d-inline-flex">
          <span class="hero-kicker">Catholic Bible Study</span>
          <span class="hero-kicker-divider" aria-hidden="true"></span>
          <span class="hero-kicker-sub">Scripture, prayer, and fellowship</span>
        </div>
        <h1 class="display-4 display-font mb-3">Welcome to Pathway to Scripture</h1>
        <img src="/images/pw2s-logo.png" alt="Pathway to Scripture" class="hero-logo d-block mx-auto mx-lg-0 mb-3" />
        <p class="slogan mb-3 fst-italic text-warning fs-5">Modern study. Ancient wisdom.</p>
        <p class="lead mb-4 hero-copy">Join our guided Catholic Bible study sessions and deepen your understanding of God's Word in a warm, welcoming community.</p>
        <div class="d-flex gap-3 justify-content-center justify-content-lg-start flex-wrap mb-4">
          <a href="/sessions.html" class="btn btn-warning btn-lg fw-semibold"><i class="bi bi-book-half"></i> View Sessions</a>
          <a href="/contact.html" class="btn btn-outline-light btn-lg"><i class="bi bi-envelope"></i> Get in Touch</a>
        </div>
        <div class="hero-badges d-flex justify-content-center justify-content-lg-start flex-wrap gap-2">
          <span class="badge hero-pill">Sacred Heart</span>
          <span class="badge hero-pill">Rosary</span>
          <span class="badge hero-pill">Cathedral Light</span>
        </div>
      </div>
    </div>
    <div class="row g-3 hero-icons mt-5">
      <div class="col-md-4"><div class="hero-icon-card"><img src="/images/retro-sacred-heart.svg" alt="Sacred Heart" class="hero-icon-image"><div><h3 class="hero-icon-title mb-1">Sacred Heart</h3><p class="hero-icon-copy mb-0">Christ's love at the centre of the journey.</p></div></div></div>
      <div class="col-md-4"><div class="hero-icon-card"><img src="/images/retro-rosary.svg" alt="Rosary" class="hero-icon-image"><div><h3 class="hero-icon-title mb-1">Rosary Devotion</h3><p class="hero-icon-copy mb-0">Prayerful rhythm and Marian contemplation.</p></div></div></div>
      <div class="col-md-4"><div class="hero-icon-card"><img src="/images/retro-cathedral-window.svg" alt="Cathedral window" class="hero-icon-image"><div><h3 class="hero-icon-title mb-1">Cathedral Light</h3><p class="hero-icon-copy mb-0">Scripture reflected in stained-glass splendour.</p></div></div></div>
    </div>
  </div>
</section>
<section class="py-5"><div class="container"><div class="row justify-content-center"><div class="col-lg-8 text-center">
  <h2 class="section-title mb-4">Our Mission</h2>
  <p class="lead text-muted">At Pathway to Scripture, we offer a Bible study experience that is modern in its approach yet deeply rooted in timeless Christian tradition.</p>
  <p class="text-muted">We combine solid biblical teaching with accessible, real-world application — helping believers not only understand Scripture, but live it out with confidence, purpose, and faith.</p>
  <p class="fw-semibold text-primary mt-3">Our mission is simple: to guide every believer into deeper understanding, stronger spiritual growth, and a confident walk in the Word of God.</p>
</div></div></div></section>
<section class="py-5 bg-light"><div class="container"><div class="row text-center gy-4">
  <div class="col-md-4"><div class="feature-icon mb-3"><i class="bi bi-book text-primary fs-1"></i></div><h4>Deep Scripture Study</h4><p class="text-muted">Explore the Old and New Testaments with knowledgeable Catholic facilitators.</p></div>
  <div class="col-md-4"><div class="feature-icon mb-3"><i class="bi bi-people text-primary fs-1"></i></div><h4>Community & Fellowship</h4><p class="text-muted">Connect with fellow believers in a supportive group environment.</p></div>
  <div class="col-md-4"><div class="feature-icon mb-3"><i class="bi bi-calendar-check text-primary fs-1"></i></div><h4>Flexible Scheduling</h4><p class="text-muted">Book sessions that suit your schedule and secure your spot online.</p></div>
</div></div></section>
<section class="py-5"><div class="container"><div class="row justify-content-center"><div class="col-lg-8 text-center">
  <h2 class="section-title mb-4">Support Our Mission</h2>
  <p class="lead text-muted">Pathway to Scripture is a faith-led initiative. Your support helps us create study materials, host sessions, and reach more people with the Word of God.</p>
  <a href="https://gofund.me/6cf919b9e" target="_blank" rel="noopener" class="btn btn-success btn-lg fw-semibold"><i class="bi bi-heart-fill"></i> Donate via GoFundMe</a>
</div></div></div></section>""",

    "about.html": """<section class="py-5"><div class="container"><div class="row justify-content-center"><div class="col-lg-8">
  <h1 class="section-title mb-4">About Pathway to Scripture</h1>
  <p class="lead">Pathway to Scripture is a Catholic Bible study community created to help believers of every background grow closer to God through Scripture.</p>
  <p>Founded by Gabby Haddad, our sessions blend faithful Catholic teaching with practical, everyday application. Whether you are new to the Bible or have studied it for years, you will find a welcoming place here.</p>
  <p>We believe that understanding Scripture is not just an academic exercise — it is a pathway to a deeper relationship with Jesus Christ, enriched by prayer, tradition, and the community of believers.</p>
  <h2 class="mt-4">What We Offer</h2>
  <ul>
    <li>Guided group Bible study sessions</li>
    <li>Catholic teaching rooted in Sacred Tradition and Scripture</li>
    <li>Opportunities for prayer, fellowship, and personal growth</li>
    <li>Resources and materials to support your faith journey</li>
  </ul>
</div></div></div></section>""",

    "contact.html": """<section class="py-5"><div class="container"><div class="row justify-content-center"><div class="col-lg-8">
  <h1 class="section-title mb-4">Contact Us</h1>
  <p class="lead">We would love to hear from you. Reach out to learn more about our Bible study sessions, events, or partnership opportunities.</p>
  <div class="card shadow-sm border-0 my-4">
    <div class="card-body p-4">
      <h5 class="card-title">Gabby Haddad</h5>
      <p class="mb-1"><i class="bi bi-envelope text-primary"></i> <a href="mailto:info@pathwaytoscripture.org">info@pathwaytoscripture.org</a></p>
      <p class="mb-1"><i class="bi bi-telephone text-primary"></i> 0493 993 301</p>
      <p class="mb-0"><i class="bi bi-instagram text-primary"></i> <a href="https://instagram.com/pathway2scripture" target="_blank" rel="noopener">@pathway2scripture</a></p>
    </div>
  </div>
  <p class="text-muted small">We aim to respond to all enquiries within 48 hours.</p>
</div></div></div></section>""",

    "sessions.html": """<section class="py-5"><div class="container"><div class="row justify-content-center"><div class="col-lg-8 text-center">
  <h1 class="section-title mb-4">Upcoming Sessions</h1>
  <p class="lead text-muted">Our session booking system is being refreshed. Check back soon for upcoming Bible study dates, or contact Gabby directly to reserve your place.</p>
  <a href="/contact.html" class="btn btn-primary btn-lg mt-3"><i class="bi bi-envelope"></i> Contact Gabby</a>
</div></div></div></section>""",

    "products.html": """<section class="py-5"><div class="container"><div class="row justify-content-center"><div class="col-lg-8 text-center">
  <h1 class="section-title mb-4">Store</h1>
  <p class="lead text-muted">Our store is currently being updated with new resources. In the meantime, you can support our mission through the GoFundMe link below.</p>
  <a href="https://gofund.me/6cf919b9e" target="_blank" rel="noopener" class="btn btn-success btn-lg mt-3"><i class="bi bi-heart-fill"></i> Support via GoFundMe</a>
</div></div></div></section>""",

    "login.html": """<section class="py-5"><div class="container"><div class="row justify-content-center"><div class="col-md-6 text-center">
  <h1 class="section-title mb-4">Sign In</h1>
  <p class="text-muted">The member sign-in area is temporarily unavailable while we refresh the site. Please check back soon.</p>
  <a href="/index.html" class="btn btn-outline-primary">Return Home</a>
</div></div></div></section>""",

    "register.html": """<section class="py-5"><div class="container"><div class="row justify-content-center"><div class="col-md-6 text-center">
  <h1 class="section-title mb-4">Create Account</h1>
  <p class="text-muted">Registration is temporarily paused while we refresh the site. Contact Gabby to express interest in upcoming sessions.</p>
  <a href="/contact.html" class="btn btn-outline-primary">Contact Us</a>
</div></div></div></section>""",

    "dashboard.html": """<section class="py-5"><div class="container"><div class="row justify-content-center"><div class="col-md-8 text-center">
  <h1 class="section-title mb-4">Member Dashboard</h1>
  <p class="text-muted">The member dashboard is temporarily unavailable while we refresh the platform. Thank you for your patience.</p>
  <a href="/index.html" class="btn btn-outline-primary">Return Home</a>
</div></div></div></section>""",

    "admin.html": """<section class="py-5"><div class="container"><div class="row justify-content-center"><div class="col-md-8 text-center">
  <h1 class="section-title mb-4">Admin Area</h1>
  <p class="text-muted">The admin area is temporarily unavailable while we refresh the platform. Thank you for your patience.</p>
  <a href="/index.html" class="btn btn-outline-primary">Return Home</a>
</div></div></div></section>""",

    "terms.html": """<section class="py-5"><div class="container legal-page mx-auto">
<h1 class="section-title mb-4">Terms &amp; Conditions</h1>
<p class="text-muted"><strong>Last updated:</strong> 3 July 2026</p>
<p>Welcome to Pathway to Scripture. These Terms and Conditions govern your use of our website and services. By accessing or using this website, you agree to be bound by these terms.</p>
<h2>1. Use of the Website</h2><p>You agree to use this website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website.</p>
<h2>2. Intellectual Property</h2><p>All content, including text, images, logos, and graphics, is the property of Pathway to Scripture or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or modify content without prior written permission.</p>
<h2>3. Bookings and Payments</h2><p>Sessions, products, and donations are offered subject to availability. Payment processing is handled by secure third-party providers. All sales are final unless otherwise stated.</p>
<h2>4. Donations</h2><p>Donations made through GoFundMe or other linked platforms are governed by the terms of those platforms. Pathway to Scripture appreciates your support and uses donations to further our mission.</p>
<h2>5. Limitation of Liability</h2><p>Pathway to Scripture is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the website or participation in our sessions.</p>
<h2>6. Changes to Terms</h2><p>We may update these Terms from time to time. Continued use of the website after changes constitutes acceptance of the revised Terms.</p>
<h2>7. Contact</h2><p>For questions about these Terms, contact Gabby Haddad at <a href="mailto:info@pathwaytoscripture.org">info@pathwaytoscripture.org</a> or 0493 993 301.</p>
</div></section>""",

    "privacy.html": """<section class="py-5"><div class="container legal-page mx-auto">
<h1 class="section-title mb-4">Privacy Policy</h1>
<p class="text-muted"><strong>Last updated:</strong> 3 July 2026</p>
<p>Pathway to Scripture respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.</p>
<h2>1. Information We Collect</h2><p>We may collect personal information such as your name, email address, phone number, and payment details when you register, book a session, make a donation, or contact us.</p>
<h2>2. How We Use Your Information</h2><p>We use your information to provide our services, communicate with you, process bookings and donations, and improve our website and offerings.</p>
<h2>3. Sharing of Information</h2><p>We do not sell your personal information. We may share information with trusted third-party service providers who assist us in operating the website, processing payments, or delivering services.</p>
<h2>4. Security</h2><p>We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet is completely secure.</p>
<h2>5. Your Rights</h2><p>You have the right to access, correct, or delete your personal information. To make a request, contact us at <a href="mailto:info@pathwaytoscripture.org">info@pathwaytoscripture.org</a>.</p>
<h2>6. Changes to This Policy</h2><p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</p>
<h2>7. Contact</h2><p>For privacy questions, contact Gabby Haddad at <a href="mailto:info@pathwaytoscripture.org">info@pathwaytoscripture.org</a> or 0493 993 301.</p>
</div></section>""",

    "refunds.html": """<section class="py-5"><div class="container legal-page mx-auto">
<h1 class="section-title mb-4">Refund Policy</h1>
<p class="text-muted"><strong>Last updated:</strong> 3 July 2026</p>
<p>Thank you for supporting Pathway to Scripture. Please review our refund policy below.</p>
<h2>1. Session Bookings</h2><p>Refunds for session bookings may be available if requested at least 48 hours before the scheduled session. Requests made within 48 hours are generally not refundable.</p>
<h2>2. Donations</h2><p>Donations made via GoFundMe or other platforms are governed by the refund policies of those platforms. Pathway to Scripture does not process direct refunds for third-party donations.</p>
<h2>3. Digital Products and Resources</h2><p>Due to the nature of digital products, all sales are final unless the product is defective or not as described. Contact us within 7 days of purchase if you believe there is an issue.</p>
<h2>4. Contact</h2><p>For refund enquiries, contact Gabby Haddad at <a href="mailto:info@pathwaytoscripture.org">info@pathwaytoscripture.org</a> or 0493 993 301.</p>
</div></section>""",
}

# Generate pages
for fname, meta in PAGES.items():
    html = (BASE_TEMPLATE
            .replace("{{TITLE}}", meta["title"])
            .replace("{{META}}", meta["meta"])
            .replace("{{CONTENT}}", CONTENT[fname]))
    (OUT / fname).write_text(html, encoding="utf-8")

# Create ZIP
ZIP = BASE / "godaddy-html-deploy.zip"
if ZIP.exists():
    ZIP.unlink()
with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
    for fpath in OUT.rglob("*"):
        if fpath.is_file():
            zf.write(fpath, fpath.relative_to(OUT))

# Save metadata for future editing
(BASE / "static_pages.json").write_text(
    json.dumps({k: {"title": v["title"], "meta": v["meta"]} for k, v in PAGES.items()}, indent=2),
    encoding="utf-8")

print(f"Built {len(PAGES)} pages in {OUT}")
print(f"Created {ZIP} ({ZIP.stat().st_size / 1024 / 1024:.2f} MB)")
