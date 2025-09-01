const express = require('express');
const { authenticateToken, requireChurch } = require('../middleware/auth');
const Transmission = require('../models/Transmission');

const router = express.Router();

// Lista mockada com filtros básicos por período e plataforma
router.get('/', async (req, res) => {
  try {
    const { period = 'all', platform, church, page = 1, limit = 20 } = req.query;
    const query = {};
    if (platform) query.platform = platform;
    if (church) {
      if (typeof church === 'string' && church.includes(',')) {
        query.church = { $in: church.split(',').map(id => id.trim()) };
      } else {
        query.church = church;
      }
    } else if (req.query.following === 'true' && req.headers.authorization) {
      try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const User = require('../models/User');
        const me = await User.findById(decoded.userId).select('followedChurches');
        if (me && me.followedChurches && me.followedChurches.length > 0) {
          query.church = { $in: me.followedChurches };
        }
      } catch (e) {}
    }
    if (period !== 'all') {
      const now = new Date();
      let from = new Date(0);
      if (period === 'today') from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      else if (period === 'week') {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        from = new Date(now.getFullYear(), now.getMonth(), diff);
      } else if (period === 'month') from = new Date(now.getFullYear(), now.getMonth(), 1);
      query.createdAt = { $gte: from };
    }
    const transmissions = await Transmission.find(query)
      .populate('church', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    const total = await Transmission.countDocuments(query);
    res.json({ success: true, transmissions, pagination: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (error) {
    console.error('Erro ao listar transmissões:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/', authenticateToken, requireChurch, async (req, res) => {
  try {
    const transmission = await Transmission.create({ ...req.body, church: req.user.userId });
    await transmission.populate('church', 'name profileImage');
    res.status(201).json({ success: true, transmission });
  } catch (error) {
    console.error('Erro ao criar transmissão:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

