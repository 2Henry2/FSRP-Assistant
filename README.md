# 🚔 ERLC Bot Dashboard

A professional Discord bot dashboard for managing ERLC (Emergency Response Liberty County) servers with real-time moderation and server control.

## ✨ Features

- **Discord OAuth Login** - Secure authentication with Discord
- **Real-time Server Status** - Live player count, uptime, and server status
- **Player Management** - Warn, kick, and ban players directly from dashboard
- **Command Execution** - Execute server commands through web interface
- **Activity Logs** - Track all server events and moderation actions
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Theme** - Eye-friendly Discord-inspired UI

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 14+ and npm
- ERLC API Key (get from ERLC server settings)
- Discord Bot Application (create at [Discord Developer Portal](https://discord.com/developers/applications))

### 1. Clone & Install

```bash
git clone https://github.com/2Henry2/FSRP-Assistant.git
cd FSRP-Assistant
npm install
```

### 2. Configure Environment

Create a `.env` file or update `env.txt`:

```env
DISCORD_CLIENT_ID=your_app_id
DISCORD_CLIENT_SECRET=your_app_secret
DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback
BOT_TOKEN=your_bot_token
ERLC_API_KEY=your_erlc_api_key
ERLC_SERVER_ID=your_erlc_server_id
SESSION_SECRET=your_random_secret_key
PORT=3000
NODE_ENV=development
```

### 3. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

Visit: `http://localhost:3000`

## 📁 Project Structure

```
FSRP-Assistant/
├── frontend/              # UI Files
│   ├── index.html        # Login page
│   ├── dashboard.html    # Main dashboard
│   ├── styles.css        # Styling
│   ├── dashboard.css     # Dashboard styles
│   └── dashboard.js      # Frontend logic
├── backend/              # Server Logic
│   ├── routes/
│   │   ├── auth.js       # Discord OAuth
│   │   └── api.js        # API endpoints
│   └── middleware/
│       └── auth.js       # Auth protection
├── server.js             # Express server
├── package.json          # Dependencies
└── env.txt              # Environment variables
```

## 🔌 API Endpoints

### Authentication
- `GET /auth/discord` - Start Discord login
- `GET /auth/discord/callback` - OAuth callback
- `GET /auth/logout` - Logout user

### Dashboard Data
- `GET /api/user` - Get current user info
- `GET /api/server/status` - Get server status
- `GET /api/players/online` - Get online players
- `GET /api/logs` - Get activity logs
- `POST /api/command/execute` - Execute server command

## 🔒 Security

- All API routes require Discord authentication
- Admin commands need additional verification
- Sessions are encrypted and secure
- CSRF protection included
- Sensitive data (API keys) stored in environment variables

## 🚀 Deployment

### Using Heroku

```bash
heroku create your-app-name
heroku config:set DISCORD_CLIENT_ID=xxx
heroku config:set DISCORD_CLIENT_SECRET=xxx
# ... set all env vars
git push heroku main
```

### Using Railway

Railway automatically deploys from GitHub. Just connect your repo and set environment variables in Railway dashboard.

## 📝 Development Roadmap

- [ ] SQLite database for permanent logs
- [ ] WebSocket for real-time updates
- [ ] User role/permission system
- [ ] Ban appeals system
- [ ] Detailed moderation history per player
- [ ] Email notifications for events
- [ ] Advanced analytics and statistics
- [ ] Multi-server support

## 🤝 Contributing

Feel free to open issues and submit pull requests!

## 📞 Support

For issues or questions, create a GitHub issue or contact the maintainers.

## 📄 License

ISC License - See LICENSE file

---

**Made with ❤️ for ERLC Community**
