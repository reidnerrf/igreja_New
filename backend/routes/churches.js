const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const churches = await User.find({ userType: 'church' }).limit(100);
    res.json(churches);
  } catch (error) {
    console.error('Erro ao listar igrejas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Seguir igreja
router.post('/:id/follow', authenticateToken, async (req, res) => {
  try {
    const churchId = req.params.id;
    await User.findByIdAndUpdate(req.user.userId, { $addToSet: { followedChurches: churchId } });
    await User.findByIdAndUpdate(churchId, { $addToSet: { followers: req.user.userId } });
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao seguir igreja:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deixar de seguir
router.delete('/:id/follow', authenticateToken, async (req, res) => {
  try {
    const churchId = req.params.id;
    await User.findByIdAndUpdate(req.user.userId, { $pull: { followedChurches: churchId } });
    await User.findByIdAndUpdate(churchId, { $pull: { followers: req.user.userId } });
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao deixar de seguir igreja:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

