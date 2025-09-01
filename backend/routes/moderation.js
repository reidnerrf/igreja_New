const express = require('express');
const router = express.Router();
const moderationService = require('../services/moderationService');
const { getCache, setCache } = require('../services/cacheService');
const Post = require('../models/Post');
const Prayer = require('../models/Prayer');
const ChatMessage = require('../models/Chat');

// Middleware de autenticação
const { authenticateToken } = require('../middleware/auth');

// Middleware para administradores/igreja
const requireModerator = (req, res, next) => {
  if (req.user.userType !== 'church' && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Acesso negado. Apenas moderadores podem acessar.' });
  }
  next();
};

// Moderar conteúdo único
router.post('/classify', authenticateToken, requireModerator, async (req, res) => {
  try {
    const { text, type = 'general' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Texto é obrigatório' });
    }

    // Criar chave de cache baseada no texto e tipo
    const cacheKey = `moderation:classify:${type}:${Buffer.from(text).toString('base64').substring(0, 50)}`;
    const cachedResult = await getCache(cacheKey);
    if (cachedResult) {
      return res.json({
        success: true,
        result: cachedResult,
        type,
        cached: true
      });
    }

    const result = moderationService.classifyContent(text);

    // Cachear resultado por 30 minutos
    await setCache(cacheKey, result, 1800);

    res.json({
      success: true,
      result,
      type,
      cached: false
    });
  } catch (error) {
    console.error('Erro na moderação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Moderar conteúdo em lote
router.post('/classify-batch', authenticateToken, requireModerator, async (req, res) => {
  try {
    const { contents } = req.body;

    if (!Array.isArray(contents)) {
      return res.status(400).json({ error: 'Conteúdo deve ser um array' });
    }

    const results = moderationService.moderateBatch(contents);
    const stats = moderationService.getModerationStats(results);

    res.json({
      success: true,
      results,
      stats
    });
  } catch (error) {
    console.error('Erro na moderação em lote:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter estatísticas de moderação
router.get('/stats', authenticateToken, requireModerator, async (req, res) => {
  try {
    const { period = '7d' } = req.query;

    // Buscar conteúdo recente para análise
    const recentContent = await getRecentContent(period);

    if (recentContent.length === 0) {
      return res.json({
        success: true,
        stats: {
          total: 0,
          toxic: 0,
          spam: 0,
          needsModeration: 0,
          averageToxicityScore: 0,
          averageSpamScore: 0
        },
        period
      });
    }

    const results = moderationService.moderateBatch(recentContent);
    const stats = moderationService.getModerationStats(results);

    res.json({
      success: true,
      stats,
      period,
      sampleSize: recentContent.length
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Moderar post específico
router.post('/posts/:postId', authenticateToken, requireModerator, async (req, res) => {
  try {
    const { postId } = req.params;
    const { action, reason } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    // Classificar conteúdo
    const classification = moderationService.classifyContent(post.content);

    // Aplicar ação de moderação
    const moderationResult = await applyModerationAction(post, action, reason, req.user.id);

    res.json({
      success: true,
      post: post._id,
      classification,
      action,
      moderationResult
    });
  } catch (error) {
    console.error('Erro na moderação do post:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Moderar oração específica
router.post('/prayers/:prayerId', authenticateToken, requireModerator, async (req, res) => {
  try {
    const { prayerId } = req.params;
    const { action, reason } = req.body;

    const prayer = await Prayer.findById(prayerId);
    if (!prayer) {
      return res.status(404).json({ error: 'Oração não encontrada' });
    }

    // Classificar conteúdo
    const classification = moderationService.classifyContent(prayer.content);

    // Aplicar ação de moderação
    const moderationResult = await applyModerationAction(prayer, action, reason, req.user.id);

    res.json({
      success: true,
      prayer: prayer._id,
      classification,
      action,
      moderationResult
    });
  } catch (error) {
    console.error('Erro na moderação da oração:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter fila de moderação pendente
router.get('/queue', authenticateToken, requireModerator, async (req, res) => {
  try {
    const { page = 1, limit = 20, type = 'all' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Filtrar por tipo se especificado
    if (type === 'posts') {
      query = { model: 'Post' };
    } else if (type === 'prayers') {
      query = { model: 'Prayer' };
    }

    // Buscar conteúdo que precisa de moderação
    const pendingContent = await getPendingModeration(query, skip, limit);

    // Classificar conteúdo pendente
    const classifiedContent = pendingContent.map(item => ({
      id: item._id,
      type: item.constructor.modelName.toLowerCase(),
      content: item.content || item.title,
      author: item.author || item.user,
      createdAt: item.createdAt,
      classification: moderationService.classifyContent(item.content || item.title)
    }));

    res.json({
      success: true,
      queue: classifiedContent,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await getPendingModerationCount(query)
      }
    });
  } catch (error) {
    console.error('Erro ao obter fila de moderação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Funções auxiliares
async function getRecentContent(period) {
  const now = new Date();
  let startDate;

  switch (period) {
    case '1h':
      startDate = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case '24h':
    case '1d':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  const [posts, prayers, messages] = await Promise.all([
    Post.find({ createdAt: { $gte: startDate } }).select('content author createdAt').limit(100),
    Prayer.find({ createdAt: { $gte: startDate } }).select('content author createdAt').limit(100),
    ChatMessage.find({ createdAt: { $gte: startDate } }).select('text sender createdAt').limit(100)
  ]);

  return [
    ...posts.map(p => ({ id: p._id, text: p.content, type: 'post' })),
    ...prayers.map(p => ({ id: p._id, text: p.content, type: 'prayer' })),
    ...messages.map(m => ({ id: m._id, text: m.text, type: 'message' }))
  ];
}

async function getPendingModeration(query, skip, limit) {
  // Por enquanto, buscar conteúdo recente não moderado
  // Em produção, teria uma flag específica para moderação pendente
  const [posts, prayers] = await Promise.all([
    Post.find({ ...query, moderatedAt: null })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Prayer.find({ ...query, moderatedAt: null })
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
  ]);

  return [...posts, ...prayers];
}

async function getPendingModerationCount(query) {
  const [postsCount, prayersCount] = await Promise.all([
    Post.countDocuments({ ...query, moderatedAt: null }),
    Prayer.countDocuments({ ...query, moderatedAt: null })
  ]);

  return postsCount + prayersCount;
}

async function applyModerationAction(content, action, reason, moderatorId) {
  const now = new Date();

  switch (action) {
    case 'approve':
      content.status = 'approved';
      content.moderatedBy = moderatorId;
      content.moderatedAt = now;
      break;

    case 'reject':
      content.status = 'rejected';
      content.moderatedBy = moderatorId;
      content.moderatedAt = now;
      content.moderationNote = reason;
      break;

    case 'flag':
      content.status = 'flagged';
      content.moderatedBy = moderatorId;
      content.moderatedAt = now;
      content.moderationNote = reason;
      break;

    default:
      throw new Error('Ação de moderação inválida');
  }

  await content.save();

  return {
    action,
    status: content.status,
    moderatedAt: content.moderatedAt,
    moderator: moderatorId
  };
}

module.exports = router;
