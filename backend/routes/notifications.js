const express = require('express');
const { Expo } = require('expo-server-sdk');
const { authenticateToken } = require('../middleware/auth');
const Notification = require('../models/Notification');
const User = require('../models/User');

const router = express.Router();
const expo = new Expo();

router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { tokens = [], title, body, data, persistForUserId } = req.body;
    const messages = [];
    for (const pushToken of tokens) {
      if (!Expo.isExpoPushToken(pushToken)) continue;
      messages.push({ to: pushToken, sound: 'default', title, body, data });
    }
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }
    if (persistForUserId) {
      try { await Notification.create({ user: persistForUserId, title, body, data }); } catch {}
    }
    res.json({ success: true, tickets });
  } catch (error) {
    console.error('Erro envio push:', error);
    res.status(500).json({ error: 'Falha ao enviar push' });
  }
});

// Listar notificações do usuário atual
router.get('/', authenticateToken, async (req, res) => {
  try {
    const list = await Notification.find({ user: req.user.userId }).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, notifications: list });
  } catch (error) {
    console.error('Erro listar notificações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Marcar como lida
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findOne({ _id: id, user: req.user.userId });
    if (!notif) return res.status(404).json({ error: 'Notificação não encontrada' });
    notif.readAt = new Date();
    await notif.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Erro marcar notificação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Configurações e quiet hours
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const { quietHours = { enabled: false, start: '22:00', end: '07:00' }, ...rest } = req.body || {};
    await User.findByIdAndUpdate(req.user.userId, {
      $set: {
        'notificationSettings.quietHours': quietHours,
        'notificationSettings.events': rest.events ?? true,
        'notificationSettings.prayers': rest.prayers ?? true,
        'notificationSettings.donations': rest.donations ?? true,
        'notificationSettings.announcements': rest.announcements ?? true,
        'notificationSettings.dailyDevotional': rest.dailyDevotional ?? true,
        'notificationSettings.devotionalTime': rest.devotionalTime ?? { hour: 7, minute: 0 },
      }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Erro atualizar settings:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


module.exports = router;

