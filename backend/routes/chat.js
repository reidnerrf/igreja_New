const express = require('express');
const ChatMessage = require('../models/Chat');
const { authenticateToken, createRateLimit } = require('../middleware/auth');

const router = express.Router();

// Limitar histórico por usuário: 60 req a cada 15 min
const historyRateLimit = createRateLimit(15 * 60 * 1000, 60, 'Muitas requisições ao histórico');

router.get('/history', authenticateToken, historyRateLimit, async (req, res) => {
  try {
    const { room, limit = 50, before } = req.query;
    if (!room) return res.status(400).json({ error: 'room obrigatório' });
    const query = { room };
    if (before) query.createdAt = { $lt: new Date(before) };
    const messages = await ChatMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    res.json(messages.reverse());
  } catch (error) {
    console.error('Erro history chat:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

