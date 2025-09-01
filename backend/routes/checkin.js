const express = require('express');
const QRCode = require('qrcode');
const CheckIn = require('../models/CheckIn');
const Event = require('../models/Event');
const User = require('../models/User');
const Badge = require('../models/Badge');
const { authenticateToken, requireChurch } = require('../middleware/auth');

const router = express.Router();

// Gerar QR code para evento
router.post('/generate-qr/:eventId', authenticateToken, requireChurch, async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Verificar se o evento pertence à igreja
    const event = await Event.findOne({
      _id: eventId,
      church: req.user.userId
    });
    
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    
    // Gerar dados únicos para o QR
    const qrData = {
      eventId: eventId,
      churchId: req.user.userId,
      timestamp: Date.now(),
      type: 'checkin'
    };
    
    // Gerar QR code
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 300,
      margin: 2,
      color: {
        dark: '#667eea',
        light: '#ffffff'
      }
    });
    
    res.json({
      success: true,
      qrCode,
      event: {
        id: event._id,
        title: event.title,
        date: event.date,
        time: event.time
      },
      qrData
    });
    
  } catch (error) {
    console.error('Erro ao gerar QR code:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Fazer check-in via QR code
router.post('/qr-checkin', authenticateToken, async (req, res) => {
  try {
    const { qrData, location, metadata } = req.body;
    
    if (!qrData) {
      return res.status(400).json({ error: 'Dados do QR code são obrigatórios' });
    }
    
    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (error) {
      return res.status(400).json({ error: 'QR code inválido' });
    }
    
    // Verificar se o QR é válido
    if (parsedData.type !== 'checkin' || !parsedData.eventId || !parsedData.churchId) {
      return res.status(400).json({ error: 'QR code inválido' });
    }
    
    // Verificar se o evento existe e está ativo
    const event = await Event.findById(parsedData.eventId);
    if (!event || event.status !== 'published') {
      return res.status(400).json({ error: 'Evento não encontrado ou inativo' });
    }
    
    // Verificar se já fez check-in
    const existingCheckIn = await CheckIn.findOne({
      user: req.user.userId,
      event: parsedData.eventId
    });
    
    if (existingCheckIn) {
      if (existingCheckIn.status === 'checked_in') {
        return res.status(400).json({ error: 'Você já está no evento' });
      } else if (existingCheckIn.status === 'checked_out') {
        // Reativar check-in
        existingCheckIn.status = 'checked_in';
        existingCheckIn.checkInTime = new Date();
        existingCheckIn.checkOutTime = null;
        existingCheckIn.points += 5; // Pontos por reentrada
        
        await existingCheckIn.save();
        
        return res.json({
          success: true,
          message: 'Check-in reativado com sucesso!',
          checkIn: existingCheckIn,
          points: existingCheckIn.points
        });
      }
    }
    
    // Criar novo check-in
    const checkIn = new CheckIn({
      user: req.user.userId,
      event: parsedData.eventId,
      church: parsedData.churchId,
      method: 'qr',
      location,
      metadata,
      points: 0 // Será calculado pelo middleware
    });
    
    await checkIn.save();
    
    // Verificar e atribuir badges
    const badges = await checkForBadges(req.user.userId, checkIn);
    
    // Atualizar pontos do usuário
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { 'gamification.points': checkIn.points }
    });
    
    // Enviar notificação push se disponível
    if (req.user.expoPushToken) {
      try {
        const { Expo } = require('expo-server-sdk');
        const expo = new Expo();
        
        const message = {
          to: req.user.expoPushToken,
          sound: 'default',
          title: '✅ Check-in realizado!',
          body: `Você ganhou ${checkIn.points} pontos!`,
          data: { 
            type: 'checkin_success',
            eventId: parsedData.eventId,
            points: checkIn.points
          }
        };
        
        await expo.sendPushNotificationsAsync([message]);
      } catch (error) {
        console.warn('Erro ao enviar push notification:', error);
      }
    }
    
    res.json({
      success: true,
      message: 'Check-in realizado com sucesso!',
      checkIn,
      points: checkIn.points,
      badges: badges.length > 0 ? badges : null
    });
    
  } catch (error) {
    console.error('Erro no check-in:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Fazer check-out
router.post('/checkout/:eventId', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const checkIn = await CheckIn.findOne({
      user: req.user.userId,
      event: eventId,
      status: 'checked_in'
    });
    
    if (!checkIn) {
      return res.status(404).json({ error: 'Check-in não encontrado' });
    }
    
    await checkIn.checkOut();
    
    // Atualizar pontos do usuário
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { 'gamification.points': checkIn.points }
    });
    
    res.json({
      success: true,
      message: 'Check-out realizado com sucesso!',
      checkIn,
      duration: checkIn.getDuration(),
      totalPoints: checkIn.points
    });
    
  } catch (error) {
    console.error('Erro no check-out:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar check-ins do usuário
router.get('/my-checkins', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const checkIns = await CheckIn.find({ user: req.user.userId })
      .populate('event', 'title date time location')
      .populate('church', 'name profileImage')
      .populate('badges.badge', 'name icon description')
      .sort({ checkInTime: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await CheckIn.countDocuments({ user: req.user.userId });
    
    res.json({
      success: true,
      checkIns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Erro ao listar check-ins:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar check-ins de um evento (para igreja)
router.get('/event/:eventId', authenticateToken, requireChurch, async (req, res) => {
  try {
    const { eventId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    // Verificar se o evento pertence à igreja
    const event = await Event.findOne({
      _id: eventId,
      church: req.user.userId
    });
    
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    
    const checkIns = await CheckIn.find({ event: eventId })
      .populate('user', 'name profileImage')
      .populate('badges.badge', 'name icon description')
      .sort({ checkInTime: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await CheckIn.countDocuments({ event: eventId });
    
    // Estatísticas do evento
    const stats = await CheckIn.aggregate([
      { $match: { event: event._id } },
      {
        $group: {
          _id: null,
          totalCheckIns: { $sum: 1 },
          totalPoints: { $sum: '$points' },
          activeCheckIns: {
            $sum: { $cond: [{ $eq: ['$status', 'checked_in'] }, 1, 0] }
          }
        }
      }
    ]);
    
    res.json({
      success: true,
      checkIns,
      stats: stats[0] || {
        totalCheckIns: 0,
        totalPoints: 0,
        activeCheckIns: 0
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Erro ao listar check-ins do evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar status do check-in
router.get('/status/:eventId', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const checkIn = await CheckIn.findOne({
      user: req.user.userId,
      event: eventId
    });
    
    if (!checkIn) {
      return res.json({
        success: true,
        checkedIn: false,
        status: 'not_checked_in'
      });
    }
    
    res.json({
      success: true,
      checkedIn: true,
      status: checkIn.status,
      checkInTime: checkIn.checkInTime,
      checkOutTime: checkIn.checkOutTime,
      points: checkIn.points,
      duration: checkIn.getDuration()
    });
    
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Função para verificar e atribuir badges
async function checkForBadges(userId, checkIn) {
  const earnedBadges = [];
  
  try {
    // Badge: Primeiro Check-in
    const firstCheckInBadge = await Badge.findOne({ id: 'first_checkin' });
    if (firstCheckInBadge && firstCheckInBadge.isActive) {
      const totalCheckIns = await CheckIn.countDocuments({ user: userId });
      if (totalCheckIns === 1) {
        earnedBadges.push(firstCheckInBadge);
        checkIn.badges.push({
          badge: firstCheckInBadge._id,
          earnedAt: new Date()
        });
      }
    }
    
    // Badge: Check-in na Igreja
    const churchCheckInBadge = await Badge.findOne({ id: 'church_checkin' });
    if (churchCheckInBadge && churchCheckInBadge.isActive) {
      const churchCheckIns = await CheckIn.countDocuments({
        user: userId,
        church: checkIn.church
      });
      if (churchCheckIns === 1) {
        earnedBadges.push(churchCheckInBadge);
        checkIn.badges.push({
          badge: churchCheckInBadge._id,
          earnedAt: new Date()
        });
      }
    }
    
    // Badge: Frequente (5 check-ins)
    const frequentBadge = await Badge.findOne({ id: 'frequent_attendee' });
    if (frequentBadge && frequentBadge.isActive) {
      const totalCheckIns = await CheckIn.countDocuments({ user: userId });
      if (totalCheckIns === 5) {
        earnedBadges.push(frequentBadge);
        checkIn.badges.push({
          badge: frequentBadge._id,
          earnedAt: new Date()
        });
      }
    }
    
    // Badge: Primeiro no Evento
    const firstEventBadge = await Badge.findOne({ id: 'first_event' });
    if (firstEventBadge && firstEventBadge.isActive) {
      const eventCheckIns = await CheckIn.countDocuments({
        event: checkIn.event
      });
      if (eventCheckIns === 1) {
        earnedBadges.push(firstEventBadge);
        checkIn.badges.push({
          badge: firstEventBadge._id,
          earnedAt: new Date()
        });
      }
    }
    
    // Salvar check-in com badges
    if (earnedBadges.length > 0) {
      await checkIn.save();
    }
    
  } catch (error) {
    console.error('Erro ao verificar badges:', error);
  }
  
  return earnedBadges;
}

module.exports = router;