'use strict';

/**
 * PM2 ecosystem config for Pathway to Scripture.
 * Usage (on VPS / GoDaddy Managed Server):
 *   npm install -g pm2
 *   pm2 start ecosystem.config.js --env production
 *   pm2 save
 *   pm2 startup   # follow the printed command to enable auto-restart
 */
module.exports = {
  apps: [
    {
      name: 'pathwaytoscripture',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
