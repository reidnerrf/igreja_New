const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

const allowedOrigins = (process.env.CORS_ORIGINS || '*')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static('uploads'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP por janela
});
app.use('/api/', limiter);

// Importar rotas
const authRoutes = require('./routes/auth');
const churchRoutes = require('./routes/churches');
const eventRoutes = require('./routes/events');
const transmissionRoutes = require('./routes/transmissions');
const donationRoutes = require('./routes/donations');
const raffleRoutes = require('./routes/raffles');
const prayerRoutes = require('./routes/prayers');
const postRoutes = require('./routes/posts');
const notificationRoutes = require('./routes/notifications');
const uploadRoutes = require('./routes/upload');
const analyticsRoutes = require('./routes/analytics');
const gamificationRoutes = require('./routes/gamification');
const devotionalsRoutes = require('./routes/devotionals');
const chatRoutes = require('./routes/chat');
const pixRoutes = require('./routes/pix');
const eventsIcsRoutes = require('./routes/events-ics');
const recommendationsRoutes = require('./routes/recommendations');
const moderationRoutes = require('./routes/moderation');
const plansRoutes = require('./routes/plans');
const raffleComplianceRoutes = require('./routes/raffle-compliance');
let premiumRoutes;
try { premiumRoutes = require('./routes/premium'); } catch (_) { premiumRoutes = express.Router(); }

// Usar rotas
app.use('/api/auth', authRoutes);
app.use('/api/churches', churchRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/transmissions', transmissionRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/raffles', raffleRoutes);
app.use('/api/prayers', prayerRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/devotionals', devotionalsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/pix', pixRoutes);
app.use('/api/events-ics', eventsIcsRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/raffles', raffleComplianceRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo deu errado!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = app;

