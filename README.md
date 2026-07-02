# Pathway to Scripture (Static Site)

A simplified static HTML version of the Pathway to Scripture website.

## Structure

- `godaddy-html/` — Output directory containing the complete static website.
- `base.html` — Master template for the static pages.
- `build.py` — Rebuilds the deploy ZIP from `godaddy-html/`.
- `godaddy-html-deploy.zip` — Deploy package for GoDaddy hosting.

## Deploy

1. In the GoDaddy Node.js Hosting File Manager, click **"Disconnect from Git and switch back to zip upload"**.
2. Upload `godaddy-html-deploy.zip`.
3. The live site will update to the static version immediately.

## Contact

Gabby Haddad — info@pathwaytoscripture.org
