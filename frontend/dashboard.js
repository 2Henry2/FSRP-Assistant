// ==================== TAB NAVIGATION ====================
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const tab = item.dataset.tab;
    switchTab(tab);
    
    // Update active state
    document.querySelectorAll('.nav-item').forEach(i => {
      i.classList.remove('active');
    });
    item.classList.add('active');
  });
});

function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  const activeTab = document.getElementById(`${tabName}-tab`);
  if (activeTab) {
    activeTab.classList.add('active');
    
    // Load data when tab is opened
    if (tabName === 'players') {
      loadPlayers();
    } else if (tabName === 'logs') {
      loadLogs();
    }
  }
}

// ==================== USER INFO ====================
async function loadUserInfo() {
  try {
    const response = await fetch('/api/user');
    if (!response.ok) throw new Error('Failed to load user');
    
    const user = await response.json();
    document.getElementById('userName').textContent = user.username;
    
    // Discord CDN avatar URL
    const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    document.getElementById('userAvatar').src = avatarUrl;
    document.getElementById('userAvatar').onerror = () => {
      document.getElementById('userAvatar').src = 'https://via.placeholder.com/40';
    };
  } catch (error) {
    console.error('Error loading user:', error);
    document.getElementById('userName').textContent = 'User';
  }
}

// ==================== SERVER DATA ====================
async function loadServerData() {
  try {
    const response = await fetch('/api/server/status');
    const data = await response.json();
    
    if (data.error) {
      document.getElementById('serverStatus').textContent = '🔴 Offline';
    } else {
      document.getElementById('serverStatus').textContent = data.online ? '🟢 Online' : '🔴 Offline';
      document.getElementById('playersOnline').textContent = 
        `${data.players || 0}/${data.maxPlayers || 128}`;
      document.getElementById('uptime').textContent = 
        formatUptime(data.uptime || 0);
      document.getElementById('version').textContent = data.version || 'N/A';
    }
    
    // Load recent activity
    loadRecentActivity();
  } catch (error) {
    console.error('Error loading server data:', error);
    document.getElementById('serverStatus').textContent = '❌ Error';
  }
}

async function loadRecentActivity() {
  try {
    const response = await fetch('/api/logs');
    const logs = await response.json();
    
    const activityList = document.getElementById('recentActivity');
    activityList.innerHTML = '';
    
    logs.slice(0, 5).forEach(log => {
      const item = document.createElement('div');
      item.className = 'activity-item';
      item.innerHTML = `
        <strong>${new Date(log.timestamp).toLocaleTimeString()}</strong><br>
        ${log.message}
      `;
      activityList.appendChild(item);
    });
    
    if (logs.length === 0) {
      activityList.innerHTML = '<p class="no-data">No recent activity</p>';
    }
  } catch (error) {
    console.error('Error loading activity:', error);
  }
}

// ==================== PLAYERS ====================
async function loadPlayers() {
  try {
    const response = await fetch('/api/players/online');
    const players = await response.json();
    
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    if (Array.isArray(players) && players.length > 0) {
      players.forEach(player => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
          <div class="player-info">
            <p class="player-name">${player.username || player.name || 'Unknown'}</p>
            <p class="player-rank">${player.job || player.role || 'Civilian'}</p>
          </div>
          <div class="player-actions">
            <button class="action-btn warn-btn" onclick="warnPlayer('${player.id || player.userId}')">⚠️ Warn</button>
            <button class="action-btn kick-btn" onclick="kickPlayer('${player.id || player.userId}')">👢 Kick</button>
          </div>
        `;
        playersList.appendChild(card);
      });
    } else {
      playersList.innerHTML = '<p class="no-data">No players online</p>';
    }
  } catch (error) {
    console.error('Error loading players:', error);
    document.getElementById('playersList').innerHTML = 
      '<p class="error">Failed to load players</p>';
  }
}

// Player search
document.getElementById('playerSearch')?.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  document.querySelectorAll('.player-card').forEach(card => {
    const playerName = card.querySelector('.player-name').textContent.toLowerCase();
    card.style.display = playerName.includes(searchTerm) ? 'flex' : 'none';
  });
});

async function warnPlayer(playerId) {
  if (!confirm('Are you sure you want to warn this player?')) return;
  
  try {
    const response = await fetch('/api/command/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: `/warn ${playerId}` })
    });
    
    const result = await response.json();
    if (result.success) {
      alert('✅ Player warned successfully');
      loadPlayers();
    } else {
      alert('❌ Failed to warn player');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error warning player');
  }
}

async function kickPlayer(playerId) {
  if (!confirm('Are you sure you want to kick this player?')) return;
  
  try {
    const response = await fetch('/api/command/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: `/kick ${playerId}` })
    });
    
    const result = await response.json();
    if (result.success) {
      alert('✅ Player kicked successfully');
      loadPlayers();
    } else {
      alert('❌ Failed to kick player');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error kicking player');
  }
}

// ==================== COMMANDS ====================
// Quick commands
document.querySelectorAll('.cmd-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const cmd = btn.dataset.cmd;
    let command = '';
    
    switch(cmd) {
      case 'restart':
        if (!confirm('Restart the server?')) return;
        command = '/restart';
        break;
      case 'stop':
        if (!confirm('Stop the server? This will disconnect all players!')) return;
        command = '/stop';
        break;
      case 'broadcast':
        command = `/broadcast ${prompt('Enter broadcast message:')}`;
        if (!command.includes('undefined')) await executeCommand(command);
        return;
    }
    
    if (command) await executeCommand(command);
  });
});

// Execute custom command
document.getElementById('executeBtn')?.addEventListener('click', async () => {
  const command = document.getElementById('commandInput')?.value;
  if (!command) {
    alert('Please enter a command');
    return;
  }
  await executeCommand(command);
});

async function executeCommand(command) {
  try {
    document.getElementById('commandOutput').style.display = 'block';
    document.getElementById('commandResult').textContent = 'Executing...';
    
    const response = await fetch('/api/command/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command })
    });
    
    const result = await response.json();
    document.getElementById('commandResult').textContent = 
      JSON.stringify(result, null, 2);
    
    if (response.ok) {
      document.getElementById('commandInput').value = '';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('commandResult').textContent = 
      `Error: ${error.message}`;
  }
}

// ==================== LOGS ====================
async function loadLogs() {
  try {
    const response = await fetch('/api/logs');
    const logs = await response.json();
    
    const logsList = document.getElementById('logsList');
    logsList.innerHTML = '';
    
    logs.forEach(log => {
      const entry = document.createElement('div');
      let logType = 'log-info';
      
      if (log.type === 'join') logType = 'log-join';
      else if (log.type === 'leave') logType = 'log-leave';
      else if (log.type === 'warn' || log.type === 'warning') logType = 'log-warning';
      
      entry.className = `log-entry ${logType}`;
      entry.innerHTML = `
        <span class="log-time">${new Date(log.timestamp).toLocaleTimeString()}</span>
        <span class="log-message">${log.message}</span>
      `;
      logsList.appendChild(entry);
    });
    
    if (logs.length === 0) {
      logsList.innerHTML = '<p class="no-data">No logs available</p>';
    }
  } catch (error) {
    console.error('Error loading logs:', error);
    document.getElementById('logsList').innerHTML = 
      '<p class="error">Failed to load logs</p>';
  }
}

// ==================== REFRESH ====================
document.getElementById('refreshBtn')?.addEventListener('click', () => {
  loadServerData();
  loadPlayers();
});

document.getElementById('logsRefreshBtn')?.addEventListener('click', () => {
  loadLogs();
});

// ==================== SETTINGS ====================
document.querySelector('.save-btn')?.addEventListener('click', () => {
  alert('✅ Settings saved! (This is a demo - implement real saving in backend)');
});

// ==================== UTILITY FUNCTIONS ====================
function formatUptime(seconds) {
  if (!seconds) return '0d 0h';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return `${days}d ${hours}h`;
}

// ==================== AUTO-REFRESH ====================
// Refresh server data every 30 seconds
setInterval(() => {
  if (document.getElementById('overview-tab')?.classList.contains('active')) {
    loadServerData();
  }
}, 30000);

// ==================== PAGE LOAD ====================
document.addEventListener('DOMContentLoaded', () => {
  loadUserInfo();
  loadServerData();
  loadPlayers();
  loadLogs();
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    loadServerData();
  }
});
