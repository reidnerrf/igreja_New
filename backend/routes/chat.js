const express = require('express');
const ChatMessage = require('../models/Chat');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/history', authenticateToken, async (req, res) => {
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

