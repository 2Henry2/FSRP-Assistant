// ==================== AUTH MIDDLEWARE ====================
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Unauthorized - Please login first' });
  }
  next();
};

// ==================== ROLE CHECK (Future Use) ====================
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (req.session.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
    }
    
    next();
  };
};

// ==================== RATE LIMITER (Future Use) ====================
const rateLimit = (maxRequests = 100, windowMs = 60000) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const userId = req.session.user?.id || req.ip;
    const now = Date.now();
    
    if (!requests.has(userId)) {
      requests.set(userId, []);
    }
    
    const userRequests = requests.get(userId);
    const recentRequests = userRequests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    
    recentRequests.push(now);
    requests.set(userId, recentRequests);
    next();
  };
};

module.exports = { 
  requireAuth, 
  requireRole, 
  rateLimit 
};
