const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http, { cors: { origin: '*'} });
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
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

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/connectfe', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

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

// Socket.IO Chat
const ChatMessage = require('./models/Chat');
app.set('io', io);
io.on('connection', (socket) => {
  socket.on('join', (room) => {
    socket.join(room);
  });
  socket.on('message', async ({ room, userId, text }) => {
    const msg = await ChatMessage.create({ room, sender: userId, text });
    io.to(room).emit('message', { id: msg._id, room, sender: userId, text, createdAt: msg.createdAt });
  });
});

http.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
