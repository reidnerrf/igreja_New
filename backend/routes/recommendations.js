const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const { Donation } = require('../models/Donation');
const Prayer = require('../models/Prayer');
const Interaction = require('../models/Interaction');
const { getCache, setCache } = require('../services/cacheService');

// Middleware de autenticação
const { authenticateToken } = require('../middleware/auth');

// Obter recomendações para usuário
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `recommendations:${userId}`;
    const cachedRecommendations = await getCache(cacheKey);
    if (cachedRecommendations) {
      return res.json({
        success: true,
        recommendations: cachedRecommendations,
        cached: true
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Buscar igrejas similares baseadas em interações
    const recommendations = await getCollaborativeRecommendations(userId, user);

    // Cachear resultado
    await setCache(cacheKey, recommendations, 3600); // cache por 1 hora

    res.json({
      success: true,
      recommendations,
      cached: false
    });
  } catch (error) {
    console.error('Erro ao buscar recomendações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Função principal de recomendação colaborativa
async function getCollaborativeRecommendations(userId, user) {
  const recommendations = {
    churches: [],
    events: [],
    prayers: []
  };

  try {
    // 1. Encontrar usuários similares baseados em interações
    const similarUsers = await findSimilarUsers(userId);

    if (similarUsers.length === 0) {
      // Fallback: recomendações baseadas em preferências
      return await getContentBasedRecommendations(user);
    }

    // 2. Recomendar igrejas que usuários similares seguem/doam
    recommendations.churches = await getRecommendedChurches(similarUsers, userId);

    // 3. Recomendar eventos que usuários similares confirmaram presença
    recommendations.events = await getRecommendedEvents(similarUsers, userId);

    // 4. Recomendar orações similares
    recommendations.prayers = await getRecommendedPrayers(similarUsers, userId);

  } catch (error) {
    console.error('Erro no sistema de recomendações:', error);
  }

  return recommendations;
}

// Encontrar usuários similares baseados em interações
async function findSimilarUsers(userId) {
  try {
    // Buscar interações do usuário
    const userInteractions = await Interaction.find({ user: userId })
      .populate('target', 'userType denomination city')
      .limit(50);

    if (userInteractions.length === 0) {
      return [];
    }

    // Encontrar usuários que interagiram com os mesmos alvos
    const targetIds = userInteractions.map(i => i.target._id);

    const similarInteractions = await Interaction.find({
      target: { $in: targetIds },
      user: { $ne: userId }
    }).populate('user', 'userType denomination city');

    // Contar interações por usuário
    const userCounts = {};
    similarInteractions.forEach(interaction => {
      const userId = interaction.user._id.toString();
      if (!userCounts[userId]) {
        userCounts[userId] = {
          user: interaction.user,
          count: 0,
          commonTargets: new Set()
        };
      }
      userCounts[userId].count++;
      userCounts[userId].commonTargets.add(interaction.target._id.toString());
    });

    // Ordenar por similaridade (mais interações comuns)
    const similarUsers = Object.values(userCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(item => item.user);

    return similarUsers;
  } catch (error) {
    console.error('Erro ao encontrar usuários similares:', error);
    return [];
  }
}

// Recomendar igrejas baseadas em usuários similares
async function getRecommendedChurches(similarUsers, userId) {
  try {
    // Igrejas que usuários similares seguem/doam
    const similarUserIds = similarUsers.map(u => u._id);

    const churchInteractions = await Interaction.find({
      user: { $in: similarUserIds },
      type: { $in: ['follow', 'donate'] }
    }).populate('target', 'name churchData denomination city followers');

    // Contar recomendações por igreja
    const churchScores = {};
    churchInteractions.forEach(interaction => {
      const churchId = interaction.target._id.toString();
      if (!churchScores[churchId]) {
        churchScores[churchId] = {
          church: interaction.target,
          score: 0,
          interactions: 0
        };
      }
      churchScores[churchId].score += getInteractionWeight(interaction.type);
      churchScores[churchId].interactions++;
    });

    // Filtrar igrejas que o usuário já segue
    const userFollowedChurches = await User.findById(userId).select('followedChurches');
    const followedIds = userFollowedChurches.followedChurches.map(id => id.toString());

    const recommendations = Object.values(churchScores)
      .filter(item => !followedIds.includes(item.church._id.toString()))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => ({
        ...item.church.toObject(),
        recommendationScore: item.score,
        reason: `${item.interactions} usuários similares interagiram`
      }));

    return recommendations;
  } catch (error) {
    console.error('Erro ao recomendar igrejas:', error);
    return [];
  }
}

// Recomendar eventos baseadas em usuários similares
async function getRecommendedEvents(similarUsers, userId) {
  try {
    const similarUserIds = similarUsers.map(u => u._id);

    // Eventos que usuários similares confirmaram presença
    const eventAttendees = await Event.find({
      'attendees.user': { $in: similarUserIds },
      'attendees.status': 'confirmed',
      date: { $gte: new Date() } // Apenas eventos futuros
    }).populate('church', 'name churchData')
      .limit(20);

    // Contar confirmações por evento
    const eventScores = {};
    eventAttendees.forEach(event => {
      const eventId = event._id.toString();
      const similarAttendees = event.attendees.filter(attendee =>
        similarUserIds.includes(attendee.user.toString()) &&
        attendee.status === 'confirmed'
      ).length;

      if (similarAttendees > 0) {
        eventScores[eventId] = {
          event,
          score: similarAttendees,
          reason: `${similarAttendees} usuários similares confirmaram presença`
        };
      }
    });

    // Filtrar eventos que o usuário já confirmou
    const userEvents = await Event.find({
      'attendees.user': userId,
      'attendees.status': 'confirmed'
    }).select('_id');

    const confirmedEventIds = userEvents.map(e => e._id.toString());

    const recommendations = Object.values(eventScores)
      .filter(item => !confirmedEventIds.includes(item.event._id.toString()))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => ({
        ...item.event.toObject(),
        recommendationScore: item.score,
        reason: item.reason
      }));

    return recommendations;
  } catch (error) {
    console.error('Erro ao recomendar eventos:', error);
    return [];
  }
}

// Recomendar orações baseadas em usuários similares
async function getRecommendedPrayers(similarUsers, userId) {
  try {
    const similarUserIds = similarUsers.map(u => u._id);

    // Orações que usuários similares oraram
    const prayers = await Prayer.find({
      'prayers.user': { $in: similarUserIds },
      status: 'approved',
      visibility: { $ne: 'private' }
    }).populate('author', 'name')
      .populate('church', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Filtrar orações que o usuário já orou
    const userPrayers = await Prayer.find({
      'prayers.user': userId
    }).select('_id');

    const prayedIds = userPrayers.map(p => p._id.toString());

    const recommendations = prayers
      .filter(prayer => !prayedIds.includes(prayer._id.toString()))
      .slice(0, 5)
      .map(prayer => ({
        ...prayer.toObject(),
        recommendationScore: prayer.prayers.filter(p =>
          similarUserIds.includes(p.user.toString())
        ).length,
        reason: 'Usuários similares oraram por isso'
      }));

    return recommendations;
  } catch (error) {
    console.error('Erro ao recomendar orações:', error);
    return [];
  }
}

// Fallback: recomendações baseadas em conteúdo (preferências do usuário)
async function getContentBasedRecommendations(user) {
  const recommendations = {
    churches: [],
    events: [],
    prayers: []
  };

  try {
    // Recomendar igrejas da mesma denominação/cidade
    if (user.denomination || user.city) {
      const query = {};
      if (user.denomination) query['churchData.denomination'] = user.denomination;
      if (user.city) query.city = user.city;

      const churches = await User.find({
        userType: 'church',
        ...query
      }).limit(5);

      recommendations.churches = churches.map(church => ({
        ...church.toObject(),
        reason: 'Baseado em suas preferências'
      }));
    }

    // Recomendar eventos próximos
    const events = await Event.find({
      date: { $gte: new Date() },
      status: 'published'
    }).populate('church', 'name churchData')
      .sort({ date: 1 })
      .limit(5);

    recommendations.events = events.map(event => ({
      ...event.toObject(),
      reason: 'Eventos próximos'
    }));

    // Recomendar orações recentes
    const prayers = await Prayer.find({
      status: 'approved',
      visibility: { $ne: 'private' }
    }).populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    recommendations.prayers = prayers.map(prayer => ({
      ...prayer.toObject(),
      reason: 'Orações recentes da comunidade'
    }));

  } catch (error) {
    console.error('Erro nas recomendações baseadas em conteúdo:', error);
  }

  return recommendations;
}

// Peso das interações para scoring
function getInteractionWeight(type) {
  const weights = {
    'follow': 3,
    'donate': 5,
    'rsvp': 2,
    'pray': 4,
    'view': 1,
    'share': 2
  };
  return weights[type] || 1;
}

module.exports = router;
