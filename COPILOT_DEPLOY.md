# Deploy Pathway to Scripture via GitHub Copilot CLI

Run from: `C:\project\pathwaytoscripture`
Artifact: `godaddy-html-deploy.zip` (5.2 MB static HTML site)

## What Copilot CLI should do

1. Open a browser and navigate to GoDaddy Web Hosting dashboard.
2. Sign in using credentials the user provides at the prompt.
3. Locate the Node.js Hosting app named `pathwaytoscripture`.
4. In the app’s File Manager, click **"Disconnect from Git and switch back to zip upload"**.
5. Upload `C:\project\pathwaytoscripture\godaddy-html-deploy.zip`.
6. Wait for deployment to complete.
7. Verify `https://pathwaytoscripture.org/` serves the new static site:
   - New logo (`images/pw2s-logo.png`) visible.
   - Watermark background (`images/watermark.png`) visible.
   - `/terms.html` contains Gaby's Terms & Conditions text.
   - `/privacy.html` contains the Privacy Policy.
   - Contact email is `info@pathwaytoscripture.org`.

## Important constraints

- Do NOT guess passwords. Ask the user for the GoDaddy password once at the start, or ask them to complete sign-in manually and then continue.
- The target app is Git-connected and read-only; disconnecting Git is mandatory before uploading the ZIP.
- If the beta PaaS console (`host.beta.godaddy.com`) redirects to SSO, switch to the standard GoDaddy products dashboard (`host.godaddy.com/hosting`) and navigate from there.
- Do not create duplicate Chrome processes or copy Chrome profiles.
- Report success/failure with the exact final live-site URLs.

## Manual fallback if automation fails

1. Sign in at https://host.godaddy.com/hosting
2. Click **Manage my Node.js Apps**.
3. Select the `pathwaytoscripture` app.
4. In the File Manager, click **Disconnect from Git and switch back to zip upload**.
5. Upload `C:\project\pathwaytoscripture\godaddy-html-deploy.zip`.
6. Wait for the deploy to finish, then visit https://pathwaytoscripture.org/.
