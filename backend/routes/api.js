const express = require('express');
const router = express.Router();
const axios = require('axios');
const { requireAuth } = require('../middleware/auth');

// ==================== AUTH MIDDLEWARE ====================
router.use(requireAuth);

// ==================== USER ENDPOINT ====================
router.get('/user', (req, res) => {
  res.json(req.session.user);
});

// ==================== SERVER STATUS ====================
router.get('/server/status', async (req, res) => {
  try {
    if (!process.env.ERLC_API_KEY || !process.env.ERLC_SERVER_ID) {
      return res.json({
        error: 'ERLC API not configured',
        online: false,
        players: 0,
        maxPlayers: 128,
        uptime: 0,
        version: 'N/A'
      });
    }

    const response = await axios.get(
      `https://api.erlc.io/server/${process.env.ERLC_SERVER_ID}`,
      { 
        headers: { 'Authorization': process.env.ERLC_API_KEY },
        timeout: 5000
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Server status error:', error.message);
    res.json({
      error: 'Failed to fetch server status',
      online: false,
      players: 0,
      maxPlayers: 128,
      uptime: 0
    });
  }
});

// ==================== ONLINE PLAYERS ====================
router.get('/players/online', async (req, res) => {
  try {
    if (!process.env.ERLC_API_KEY || !process.env.ERLC_SERVER_ID) {
      return res.json([]);
    }

    const response = await axios.get(
      `https://api.erlc.io/server/${process.env.ERLC_SERVER_ID}/players`,
      { 
        headers: { 'Authorization': process.env.ERLC_API_KEY },
        timeout: 5000
      }
    );
    
    res.json(response.data || []);
  } catch (error) {
    console.error('Players fetch error:', error.message);
    res.json([]);
  }
});

// ==================== ACTIVITY LOGS ====================
router.get('/logs', async (req, res) => {
  try {
    // Mock logs - replace with database later
    const mockLogs = [
      { timestamp: new Date(), message: '👥 Player John joined the server', type: 'join' },
      { timestamp: new Date(Date.now() - 60000), message: '⚠️ Player Spam warned for spam', type: 'warning' },
      { timestamp: new Date(Date.now() - 120000), message: '👥 Player Mike joined the server', type: 'join' },
      { timestamp: new Date(Date.now() - 180000), message: '👢 Player Hacker kicked for hacking', type: 'leave' },
      { timestamp: new Date(Date.now() - 240000), message: '��� Server started', type: 'info' }
    ];
    
    res.json(mockLogs);
  } catch (error) {
    console.error('Logs error:', error.message);
    res.json([]);
  }
});

// ==================== EXECUTE COMMAND ====================
router.post('/command/execute', async (req, res) => {
  try {
    const { command } = req.body;
    
    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }

    if (!process.env.ERLC_API_KEY || !process.env.ERLC_SERVER_ID) {
      return res.status(500).json({ 
        error: 'ERLC API not configured',
        success: false 
      });
    }

    // Execute command via ERLC API
    const response = await axios.post(
      `https://api.erlc.io/server/${process.env.ERLC_SERVER_ID}/command`,
      { command },
      { 
        headers: { 'Authorization': process.env.ERLC_API_KEY },
        timeout: 5000
      }
    );
    
    console.log(`⚡ Command executed: ${command}`);
    res.json({ success: true, result: response.data });
  } catch (error) {
    console.error('Command execution error:', error.message);
    res.status(500).json({ 
      error: 'Failed to execute command',
      success: false 
    });
  }
});

// ==================== PLAYER ACTIONS ====================
router.post('/player/warn', async (req, res) => {
  try {
    const { playerId, reason } = req.body;
    
    if (!playerId) {
      return res.status(400).json({ error: 'Player ID required' });
    }

    const command = reason ? `/warn ${playerId} ${reason}` : `/warn ${playerId}`;
    
    const response = await axios.post(
      `https://api.erlc.io/server/${process.env.ERLC_SERVER_ID}/command`,
      { command },
      { headers: { 'Authorization': process.env.ERLC_API_KEY } }
    );
    
    console.log(`⚠️ Player ${playerId} warned`);
    res.json({ success: true, message: 'Player warned' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to warn player' });
  }
});

router.post('/player/kick', async (req, res) => {
  try {
    const { playerId, reason } = req.body;
    
    if (!playerId) {
      return res.status(400).json({ error: 'Player ID required' });
    }

    const command = reason ? `/kick ${playerId} ${reason}` : `/kick ${playerId}`;
    
    const response = await axios.post(
      `https://api.erlc.io/server/${process.env.ERLC_SERVER_ID}/command`,
      { command },
      { headers: { 'Authorization': process.env.ERLC_API_KEY } }
    );
    
    console.log(`👢 Player ${playerId} kicked`);
    res.json({ success: true, message: 'Player kicked' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to kick player' });
  }
});

router.post('/player/ban', async (req, res) => {
  try {
    const { playerId, reason } = req.body;
    
    if (!playerId) {
      return res.status(400).json({ error: 'Player ID required' });
    }

    const command = reason ? `/ban ${playerId} ${reason}` : `/ban ${playerId}`;
    
    const response = await axios.post(
      `https://api.erlc.io/server/${process.env.ERLC_SERVER_ID}/command`,
      { command },
      { headers: { 'Authorization': process.env.ERLC_API_KEY } }
    );
    
    console.log(`🚫 Player ${playerId} banned`);
    res.json({ success: true, message: 'Player banned' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to ban player' });
  }
});

module.exports = router;
