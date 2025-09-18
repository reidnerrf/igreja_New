const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = require('./app');
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http, { cors: { origin: '*'} });
const paymentsWebhook = require('./routes/payments-webhook');
const PORT = process.env.PORT || 3001;

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/connectfe', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));
// Socket authentication
io.use((socket, next) => {
  try {
    const auth = socket.handshake.auth || {};
    let token = auth.token || '';
    if (typeof token === 'string' && token.startsWith('Bearer ')) {
      token = token.replace('Bearer ', '');
    }
    if (!token) return next(new Error('Unauthorized'));
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    socket.user = { userId: decoded.userId, userType: decoded.userType };
    return next();
  } catch (e) {
    return next(new Error('Unauthorized'));
  }
});

// Socket.IO Chat
const ChatMessage = require('./models/Chat');
app.set('io', io);
io.on('connection', (socket) => {
  socket.on('join', (room) => {
    socket.join(room);
  });
  socket.on('message', async ({ room, userId, text }) => {
    const senderId = socket.user?.userId || userId;
    const msg = await ChatMessage.create({ room, sender: senderId, text });
    io.to(room).emit('message', { id: msg._id, room, sender: senderId, text, createdAt: msg.createdAt });
  });
});

http.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
