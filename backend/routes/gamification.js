const express = require('express');
const router = express.Router();
const { Expo } = require('expo-server-sdk');
const expo = new Expo();
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');

// Get current user's gamification status
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('gamification');
    res.json({ success: true, gamification: user.gamification || { points: 0, badges: [], history: [] } });
  } catch (error) {
    console.error('Gamification get error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Award points to current user
router.post('/me/points', authenticateToken, async (req, res) => {
  try {
    const { points = 0, type = 'generic', context = null } = req.body || {};
    const user = await User.findById(req.user.userId);
    if (!user.gamification) user.gamification = { points: 0, badges: [], history: [] };
    user.gamification.points = (user.gamification.points || 0) + Number(points);
    user.gamification.history.push({ type, points: Number(points), context, createdAt: new Date() });
    await user.save();
    res.json({ success: true, gamification: user.gamification });
  } catch (error) {
    console.error('Gamification award points error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Award a badge to current user
router.post('/me/badges', authenticateToken, async (req, res) => {
  try {
    const { id, name, icon = null } = req.body || {};
    if (!id || !name) return res.status(400).json({ error: 'id e name são obrigatórios' });
    const user = await User.findById(req.user.userId);
    if (!user.gamification) user.gamification = { points: 0, badges: [], history: [] };
    const already = (user.gamification.badges || []).some((b) => b.id === id);
    if (!already) {
      user.gamification.badges.push({ id, name, icon, earnedAt: new Date() });
      await user.save();

      // Enviar push se usuário tiver expoPushToken válido
      if (user.expoPushToken && Expo.isExpoPushToken(user.expoPushToken)) {
        try {
          await expo.sendPushNotificationsAsync([
            {
              to: user.expoPushToken,
              sound: 'default',
              title: '🏅 Nova conquista!',
              body: `Você desbloqueou: ${name}`,
              data: { type: 'badge_unlocked', badgeId: id, name },
            },
          ]);
        } catch (e) {
          console.error('Erro push badge:', e);
        }
      }
    }
    res.json({ success: true, gamification: user.gamification });
  } catch (error) {
    console.error('Gamification award badge error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

