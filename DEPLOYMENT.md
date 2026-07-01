# Deploying Pathway to Scripture on GoDaddy

This guide covers two common GoDaddy hosting setups for a Node.js / Express application.

---

## Option A – GoDaddy cPanel Hosting with Node.js App Manager

GoDaddy's cPanel plans include a **Node.js App Manager** (Software → Setup Node.js App).

### 1. Upload the application

Use File Manager or SFTP to upload the repository to a directory **outside** `public_html`, e.g.:

```
/home/<cpanel_username>/pathwaytoscripture/
```

### 2. Configure the Node.js App in cPanel

| Setting | Value |
|---------|-------|
| Node.js version | 20.x (or latest LTS) |
| Application mode | Production |
| Application root | `/home/<cpanel_username>/pathwaytoscripture` |
| Application URL | `pathwaytoscripture.org` |
| Application startup file | `server.js` |

Click **Run NPM Install** after saving.

### 3. Set environment variables

In cPanel → Node.js App → Environment Variables, add every variable listed in `.env.production.example`.

Alternatively, create a `.env` file in the application root:

```bash
cp .env.production.example .env
nano .env    # fill in real values
```

### 4. Configure the data directory

Create a directory outside the web root for the SQLite database and session files:

```bash
mkdir -p ~/pathwaytoscripture_data
```

Set `APP_DATA_DIR=/home/<cpanel_username>/pathwaytoscripture_data` in `.env`.

### 5. Seed the database (first deploy only)

```bash
npm run seed
```

### 6. Place `.htaccess` in `public_html`

The included `.htaccess` file proxies all requests from Apache to the Node.js server.  Copy it to `public_html`:

```bash
cp .htaccess ~/public_html/.htaccess
```

### 7. Start the app

cPanel's Node.js App Manager will start and restart the application automatically.

---

## Option B – GoDaddy VPS / Dedicated Server

### 1. SSH into the server and install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

### 2. Clone / upload the repository

```bash
cd /var/www
git clone https://github.com/dqikfox/pathwaytoscripture.git
cd pathwaytoscripture
npm install --omit=dev
```

### 3. Configure the environment

```bash
cp .env.production.example .env
nano .env   # fill in real values
```

### 4. Seed the database

```bash
npm run seed
```

### 5. Start with PM2

```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup   # follow the printed command
```

### 6. Configure Nginx (recommended reverse proxy)

```nginx
server {
    listen 80;
    server_name pathwaytoscripture.org www.pathwaytoscripture.org;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pathwaytoscripture.org www.pathwaytoscripture.org;

    ssl_certificate     /etc/letsencrypt/live/pathwaytoscripture.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pathwaytoscripture.org/privkey.pem;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Install a free SSL certificate with Certbot:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d pathwaytoscripture.org -d www.pathwaytoscripture.org
```

---

## DNS Configuration (GoDaddy Domain Manager)

Point your domain to your GoDaddy hosting:

| Type | Name | Value |
|------|------|-------|
| A | @ | *(your server IP)* |
| A | www | *(your server IP)* |

---

## Stripe Webhook

After deployment, register the webhook endpoint in the [Stripe Dashboard](https://dashboard.stripe.com/webhooks):

- Endpoint URL: `https://pathwaytoscripture.org/bookings/webhook`
- Events to listen for: `payment_intent.succeeded`

Copy the **Signing Secret** and add it as `STRIPE_WEBHOOK_SECRET` in `.env`.
