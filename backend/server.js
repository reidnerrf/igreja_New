const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(http, { cors: { origin: '*'} });
const PORT = process.env.PORT || 3001;

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/connectfe', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));
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
