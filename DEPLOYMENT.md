# 🚀 Deployment Guide

## Quick Deployment to Railway

### Step 1: Push to GitHub
```bash
git add .
git commit -m "ERLC Dashboard ready for deployment"
git push origin main
```

### Step 2: Create Railway Account
1. Visit https://railway.app
2. Click "Login with GitHub"
3. Authorize Railway

### Step 3: Deploy Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `2Henry2/FSRP-Assistant`
4. Railway starts building automatically!

### Step 4: Add Environment Variables
In Railway Dashboard, go to "Variables" and add:

```
DISCORD_CLIENT_ID = 1317514046005575781
DISCORD_CLIENT_SECRET = dEUXzwyK1i-E3lOQ_YmUWCQXrZnIyoYF
DISCORD_REDIRECT_URI = https://your-railway-app.railway.app/auth/discord/callback
ERLC_API_KEY = NCKAWfMcwNmtcEnPiBVB-NZrhVBsmyYjTGWsmPrFvzuVOkBMMKhcVvnJavPOr
ERLC_SERVER_ID = your_erlc_server_id
SESSION_SECRET = super_secret_random_string_123
BOT_TOKEN = your_bot_token
NODE_ENV = production
```

### Step 5: Update Discord OAuth
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click your application
3. Go to OAuth2 → Redirects
4. Replace with: `https://your-railway-app.railway.app/auth/discord/callback`
5. Save

### Step 6: Done! 🎉
Your dashboard is now live!

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Or start normally
npm start

# Visit http://localhost:3000
```

---

## Alternative Hosting Options

### Heroku
```bash
heroku create your-app-name
heroku config:set DISCORD_CLIENT_ID=xxx
heroku config:set DISCORD_CLIENT_SECRET=xxx
# ... set all env vars
git push heroku main
```

### DigitalOcean App Platform
1. Connect GitHub repo
2. Set environment variables
3. Deploy

### Self-hosted VPS
```bash
git clone https://github.com/2Henry2/FSRP-Assistant.git
cd FSRP-Assistant
npm install
npm start
```

---

## Troubleshooting

### OAuth Not Working
- Check DISCORD_REDIRECT_URI matches exactly
- Verify Discord app OAuth2 redirect URLs are correct
- Clear browser cookies and try again

### ERLC API Not Responding
- Verify ERLC_API_KEY is correct
- Check ERLC_SERVER_ID is correct
- Ensure server is running

### Dashboard Not Loading
- Check server is running: `npm start`
- Check port 3000 is available
- Check browser console for errors

---

## Custom Domain (Optional)

On Railway, you can add a custom domain for $2-3/month:

1. Go to Railway Project Settings
2. Click "Custom Domain"
3. Add your domain
4. Update DNS records as shown

---

**Your dashboard is ready! 🚀**
