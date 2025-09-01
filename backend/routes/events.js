const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const { authenticateToken, requireChurch } = require('../middleware/auth');
const { Expo } = require('expo-server-sdk');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validações
const validateEvent = [
  body('title').trim().isLength({ min: 3 }).withMessage('Título deve ter pelo menos 3 caracteres'),
  body('date').isISO8601().withMessage('Data inválida'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Horário inválido'),
];

// Listar eventos
router.get('/', async (req, res) => {
  try {
    const { 
      church, 
      category, 
      date, 
      period,
      status = 'published',
      page = 1, 
      limit = 20,
      lat,
      lng,
      radius = 10 // km
    } = req.query;

    let query = { status };
    
    // Filtrar por igreja (suporta CSV) ou por seguidas
    if (church) {
      if (typeof church === 'string' && church.includes(',')) {
        const ids = church.split(',').map(id => id.trim());
        query.church = { $in: ids };
      } else {
        query.church = church;
      }
    } else if (req.query.following === 'true' && req.headers.authorization) {
      try {
        // quando autenticado, usar igrejas seguidas
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const me = await User.findById(decoded.userId).select('followedChurches');
        if (me && me.followedChurches && me.followedChurches.length > 0) {
          query.church = { $in: me.followedChurches };
        }
      } catch (e) {}
    }
    
    // Filtrar por categoria
    if (category) {
      query.category = category;
    }
    
    // Filtrar por data/período
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    } else if (period && ['today','week','month'].includes(period)) {
      const now = new Date();
      let from = new Date(0);
      if (period === 'today') {
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (period === 'week') {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        from = new Date(now.getFullYear(), now.getMonth(), diff);
      } else if (period === 'month') {
        from = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      query.date = { $gte: from };
    }
    
    // Filtrar por localização
    if (lat && lng) {
      const churches = await User.find({
        userType: 'church',
        'churchData.location': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: radius * 1000 // converter para metros
          }
        }
      });
      
      const churchIds = churches.map(church => church._id);
      query.church = { $in: churchIds };
    }

    const events = await Event.find(query)
      .populate('church', 'name profileImage churchData')
      .sort({ date: 1, time: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar evento por ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('church', 'name profileImage churchData')
      .populate('attendees.user', 'name profileImage');

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.json({ success: true, event });
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar evento
router.post('/', authenticateToken, requireChurch, validateEvent, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Se o evento contém imagens, elas devem ser enviadas via /api/upload/event primeiro
    // e as URLs das imagens devem ser incluídas em req.body.images
    const eventData = {
      ...req.body,
      church: req.user.userId
    };

    // Validar se as imagens são URLs válidas (devem começar com /uploads/)
    if (req.body.images && Array.isArray(req.body.images)) {
      const validImages = req.body.images.filter(img => 
        typeof img === 'string' && img.startsWith('/uploads/')
      );
      eventData.images = validImages;
    }

    const event = new Event(eventData);
    await event.save();

    await event.populate('church', 'name profileImage churchData');

    // Incrementar contador de eventos da igreja
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { 'stats.totalEvents': 1 }
    });

    // Enviar push para seguidores da igreja
    try {
      const churchUser = await User.findById(req.user.userId).select('followers');
      const followers = await User.find({ _id: { $in: churchUser.followers }, expoPushToken: { $ne: null } }).select('expoPushToken');
      const tokens = followers.map(f => f.expoPushToken);
      if (tokens.length > 0) {
        const { Expo } = require('expo-server-sdk');
        const expo = new Expo();
        const messages = tokens.filter(t => Expo.isExpoPushToken(t)).map(t => ({
          to: t,
          sound: 'default',
          title: 'Novo evento',
          body: event.title,
          data: { type: 'event', eventId: event._id.toString() }
        }));
        const chunks = expo.chunkPushNotifications(messages);
        for (const chunk of chunks) { await expo.sendPushNotificationsAsync(chunk); }
      }
    } catch (e) { console.warn('Push seguidores (event) falhou:', e.message); }

    res.status(201).json({ success: true, event });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar evento
router.put('/:id', authenticateToken, requireChurch, validateEvent, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.findOne({
      _id: req.params.id,
      church: req.user.userId
    });

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    const updateData = { ...req.body };
    
    // Validar imagens se fornecidas
    if (req.body.images && Array.isArray(req.body.images)) {
      const validImages = req.body.images.filter(img => 
        typeof img === 'string' && img.startsWith('/uploads/')
      );
      updateData.images = validImages;
    }
    
    Object.assign(event, updateData);
    await event.save();

    await event.populate('church', 'name profileImage churchData');

    res.json({ success: true, event });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar evento
router.delete('/:id', authenticateToken, requireChurch, async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      church: req.user.userId
    });

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Decrementar contador de eventos da igreja
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { 'stats.totalEvents': -1 }
    });

    res.json({ success: true, message: 'Evento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Confirmar presença
router.post('/:id/attend', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    // Verificar se já confirmou presença
    const existingAttendee = event.attendees.find(
      attendee => attendee.user.toString() === req.user.userId
    );

    if (existingAttendee) {
      return res.status(400).json({ error: 'Presença já confirmada' });
    }

    // Verificar limite de participantes
    if (event.maxAttendees && event.getAttendeesCount() >= event.maxAttendees) {
      return res.status(400).json({ error: 'Evento lotado' });
    }

    // Adicionar participante
    event.attendees.push({
      user: req.user.userId,
      status: 'confirmed'
    });

    await event.save();

    // Gamificação: award points and first check-in badge
    try {
      const me = await User.findById(req.user.userId);
      if (me) {
        if (!me.gamification) me.gamification = { points: 0, badges: [], history: [] };
        me.gamification.points = (me.gamification.points || 0) + 5;
        me.gamification.history.push({ type: 'event_attendance', points: 5, context: event.title, createdAt: new Date() });
        const hasBadge = (me.gamification.badges || []).some(b => b.id === 'first_checkin');
        if (!hasBadge) {
          me.gamification.badges.push({ id: 'first_checkin', name: 'Primeiro Check-in', icon: 'qr-code', earnedAt: new Date() });
          if (me.expoPushToken && Expo.isExpoPushToken(me.expoPushToken)) {
            const expo = new Expo();
            await expo.sendPushNotificationsAsync([
              { to: me.expoPushToken, sound: 'default', title: '🏅 Nova conquista!', body: 'Você fez seu primeiro check-in!', data: { type: 'badge_unlocked', badgeId: 'first_checkin' } }
            ]);
          }
        }
        await me.save();
      }
    } catch (e) { console.warn('Gamificação check-in falhou:', e.message); }

    res.json({ 
      success: true, 
      message: 'Presença confirmada',
      attendeesCount: event.getAttendeesCount()
    });
  } catch (error) {
    console.error('Erro ao confirmar presença:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Cancelar presença
router.delete('/:id/attend', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    // Remover participante
    event.attendees = event.attendees.filter(
      attendee => attendee.user.toString() !== req.user.userId
    );

    await event.save();

    res.json({ 
      success: true, 
      message: 'Presença cancelada',
      attendeesCount: event.getAttendeesCount()
    });
  } catch (error) {
    console.error('Erro ao cancelar presença:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter participantes do evento
router.get('/:id/attendees', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('attendees.user', 'name profileImage');

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    // Verificar se é a igreja dona do evento
    if (event.church.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json({ 
      success: true, 
      attendees: event.attendees,
      total: event.getAttendeesCount()
    });
  } catch (error) {
    console.error('Erro ao buscar participantes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;