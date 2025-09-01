const express = require('express');
const Prayer = require('../models/Prayer');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const prayers = await Prayer.find().sort({ createdAt: -1 });
    res.json(prayers);
  } catch (error) {
    console.error('Erro ao listar orações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const prayer = await Prayer.create({ ...req.body, user: req.user.userId });
    res.status(201).json(prayer);
  } catch (error) {
    console.error('Erro ao criar oração:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body; // praying | answered
    const prayer = await Prayer.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(prayer);
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

