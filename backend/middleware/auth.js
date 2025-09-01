const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware para autenticar token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.user = {
      userId: user._id,
      userType: user.userType,
      isPremium: user.isPremiumActive(),
      user: user
    };

    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware para verificar se é igreja
const requireChurch = (req, res, next) => {
  if (req.user.userType !== 'church') {
    return res.status(403).json({ error: 'Acesso restrito a igrejas' });
  }
  next();
};

// Middleware para verificar se é usuário
const requireUser = (req, res, next) => {
  if (req.user.userType !== 'user') {
    return res.status(403).json({ error: 'Acesso restrito a usuários' });
  }
  next();
};

// Middleware para verificar premium
const requirePremium = (req, res, next) => {
  if (!req.user.isPremium) {
    return res.status(403).json({ 
      error: 'Recurso premium requerido',
      code: 'PREMIUM_REQUIRED'
    });
  }
  next();
};

// Middleware opcional para premium (não bloqueia, mas adiciona flag)
const checkPremium = (req, res, next) => {
  req.user.hasPremiumAccess = req.user.isPremium;
  next();
};

// Middleware para verificar se é dono do recurso
const requireOwnership = (Model, resourceField = 'church') => {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params.id);
      
      if (!resource) {
        return res.status(404).json({ error: 'Recurso não encontrado' });
      }

      const ownerId = resourceField.includes('.') 
        ? resourceField.split('.').reduce((obj, key) => obj[key], resource)
        : resource[resourceField];

      if (ownerId.toString() !== req.user.userId) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Erro na verificação de propriedade:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };
};

// Middleware para rate limiting específico
const createRateLimit = (windowMs, max, message) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = req.user.userId;
    const now = Date.now();
    
    if (!requests.has(key)) {
      requests.set(key, []);
    }
    
    const userRequests = requests.get(key);
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= max) {
      return res.status(429).json({ error: message });
    }
    
    validRequests.push(now);
    requests.set(key, validRequests);
    
    next();
  };
};

// Middleware para rate limiting baseado no plano do usuário
const rateLimitByPlan = (plansLimits) => {
  return (req, res, next) => {
    const userPlan = req.user.userType === 'church' ? req.user.user.plan : null;
    const limitConfig = plansLimits[userPlan] || plansLimits['default'];

    if (!limitConfig) {
      return next();
    }

    const { windowMs, max, message } = limitConfig;

    const key = req.user.userId;
    const now = Date.now();

    if (!rateLimitByPlan.requests) {
      rateLimitByPlan.requests = new Map();
    }

    if (!rateLimitByPlan.requests.has(key)) {
      rateLimitByPlan.requests.set(key, []);
    }

    const userRequests = rateLimitByPlan.requests.get(key);
    const validRequests = userRequests.filter(time => now - time < windowMs);

    if (validRequests.length >= max) {
      return res.status(429).json({ error: message || 'Limite de requisições excedido' });
    }

    validRequests.push(now);
    rateLimitByPlan.requests.set(key, validRequests);

    next();
  };
};

module.exports = {
  authenticateToken,
  requireChurch,
  requireUser,
  requirePremium,
  checkPremium,
  requireOwnership,
  createRateLimit,
  rateLimitByPlan
};
