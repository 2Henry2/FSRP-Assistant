const express = require('express');
const router = express.Router();
const axios = require('axios');

const DISCORD_API = 'https://discord.com/api/v10';

// ==================== DISCORD LOGIN ====================
router.get('/discord', (req, res) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI);
  const scope = 'identify email';
  
  const authUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  res.redirect(authUrl);
});

// ==================== DISCORD CALLBACK ====================
router.get('/discord/callback', async (req, res) => {
  const { code, error } = req.query;
  
  if (error) {
    return res.redirect('/?error=auth_cancelled');
  }
  
  if (!code) {
    return res.redirect('/?error=no_code');
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(`${DISCORD_API}/oauth2/token`, {
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
      scope: 'identify email'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token } = tokenResponse.data;

    // Get user data
    const userResponse = await axios.get(`${DISCORD_API}/users/@me`, {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const userData = userResponse.data;

    // Store user in session
    req.session.user = {
      id: userData.id,
      username: userData.username,
      avatar: userData.avatar,
      email: userData.email,
      discriminator: userData.discriminator,
      role: 'user' // Default role
    };

    console.log(`✅ User logged in: ${userData.username}#${userData.discriminator}`);
    res.redirect('/dashboard');
  } catch (error) {
    console.error('❌ Auth error:', error.response?.data || error.message);
    res.redirect('/?error=auth_failed');
  }
});

// ==================== LOGOUT ====================
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.redirect('/');
  });
});

module.exports = router;
