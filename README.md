# Pathway to Scripture (Static Site)

A simplified static HTML version of the Pathway to Scripture website.

## Structure

- `build_site.py` — Rebuilds `godaddy-html/`, `static_pages.json`, and `godaddy-html-deploy.zip`.
- `check_deploy.py` — Verifies page metadata, local asset references, sitemap, robots, manifest, and ZIP contents before deployment.
- `godaddy-html/` — Output directory containing the complete static website.
- `godaddy-html-deploy.zip` — Deploy package for GoDaddy hosting.

## Build and check

1. Run `npm run build`.
2. Run `npm run check:deploy`.

## Deploy

1. In the GoDaddy Node.js Hosting File Manager, click **"Disconnect from Git and switch back to zip upload"**.
2. Upload `godaddy-html-deploy.zip`.
3. The live site will update to the static version immediately.

## Contact

Gabby Haddad — info@pathwaytoscripture.org
