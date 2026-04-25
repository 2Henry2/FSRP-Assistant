const express = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: 'env.txt' });

const app = express();

// ==================== MIDDLEWARE ====================
app.use(express.static('frontend'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// ==================== ROUTES ====================
app.use('/auth', require('./backend/routes/auth'));
app.use('/api', require('./backend/routes/api'));

// Serve appropriate page based on auth status
app.get('/', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'frontend/dashboard.html'));
  } else {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
  }
});

// Serve dashboard page
app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'frontend/dashboard.html'));
  } else {
    res.redirect('/');
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚔 ERLC Bot Dashboard`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Visit the dashboard at http://localhost:${PORT}`);
  console.log(`\n`);
});
