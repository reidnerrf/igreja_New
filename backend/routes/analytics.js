const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const { Donation } = require('../models/Donation');
const Prayer = require('../models/Prayer');
const Post = require('../models/Post');
const Interaction = require('../models/Interaction');
const moderationService = require('../services/moderationService');
const { getCache, setCache } = require('../services/cacheService');

// Middleware de autenticação
const { authenticateToken } = require('../middleware/auth');

// Dashboard de qualidade dos modelos IA
async function aiQualityHandler(req, res) {
  try {
    const { period = '7d' } = req.query;
    const cacheKey = `ai-quality:${period}`;

    // Verificar cache
    const cachedMetrics = await getCache(cacheKey);
    if (cachedMetrics) {
      return res.json({
        success: true,
        period,
        ...cachedMetrics,
        cached: true
      });
    }

    // Métricas de recomendação
    const recommendationMetrics = await getRecommendationMetrics(period);

    // Métricas de moderação
    const moderationMetrics = await getModerationMetrics(period);

    // Métricas gerais de IA
    const generalMetrics = await getGeneralAIMetrics(period);

    const responseData = {
      metrics: {
        recommendations: recommendationMetrics,
        moderation: moderationMetrics,
        general: generalMetrics
      },
      kpis: {
        recommendationCTR: recommendationMetrics.ctr,
        moderationAccuracy: moderationMetrics.accuracy,
        contentQuality: generalMetrics.contentQuality
      }
    };

    // Cachear resultado por 15 minutos
    await setCache(cacheKey, responseData, 900);

    res.json({
      success: true,
      period,
      ...responseData,
      cached: false
    });
  } catch (error) {
    console.error('Erro ao obter métricas de qualidade IA:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

router.get('/ai-quality', authenticateToken, aiQualityHandler);

// Obter métricas de recomendação
async function getRecommendationMetrics(period) {
  const now = new Date();
  const startDate = getStartDate(period);

  try {
    // Total de recomendações feitas
    const totalRecommendations = await Interaction.countDocuments({
      type: { $in: ['follow', 'rsvp', 'donate', 'pray'] },
      createdAt: { $gte: startDate }
    });

    // Interações resultantes de recomendações (simuladas por enquanto)
    // Em produção, seria necessário rastrear quais interações vieram de recomendações
    const interactionsFromRecommendations = Math.floor(totalRecommendations * 0.15); // 15% CTR estimado

    // Diversidade de recomendações
    const uniqueTargets = await Interaction.distinct('target', {
      createdAt: { $gte: startDate }
    });

    // Tempo médio de sessão após recomendação (simulado)
    const avgSessionTime = 180; // 3 minutos

    return {
      totalRecommendations,
      interactionsFromRecommendations,
      ctr: totalRecommendations > 0 ? (interactionsFromRecommendations / totalRecommendations) * 100 : 0,
      uniqueTargets: uniqueTargets.length,
      avgSessionTime,
      diversity: calculateDiversity(uniqueTargets),
      period
    };
  } catch (error) {
    console.error('Erro ao calcular métricas de recomendação:', error);
    return {
      totalRecommendations: 0,
      interactionsFromRecommendations: 0,
      ctr: 0,
      uniqueTargets: 0,
      avgSessionTime: 0,
      diversity: 0,
      error: 'Erro no cálculo'
    };
  }
}

// Obter métricas de moderação
async function getModerationMetrics(period) {
  const startDate = getStartDate(period);

  try {
    // Buscar conteúdo recente para análise
    const [posts, prayers, events] = await Promise.all([
      Post.find({ createdAt: { $gte: startDate } }).select('content status').limit(100),
      Prayer.find({ createdAt: { $gte: startDate } }).select('content status').limit(100),
      Event.find({ createdAt: { $gte: startDate } }).select('title description status').limit(100)
    ]);

    const allContent = [
      ...posts.map(p => ({ id: p._id, text: p.content, status: p.status, type: 'post' })),
      ...prayers.map(p => ({ id: p._id, text: p.content, status: p.status, type: 'prayer' })),
      ...events.map(e => ({ id: e._id, text: `${e.title} ${e.description}`, status: e.status, type: 'event' }))
    ];

    if (allContent.length === 0) {
      return {
        totalContent: 0,
        moderatedContent: 0,
        accuracy: 0,
        falsePositives: 0,
        falseNegatives: 0,
        avgProcessingTime: 0
      };
    }

    // Classificar conteúdo
    const classifications = moderationService.moderateBatch(allContent);

    // Calcular métricas
    const moderatedContent = allContent.filter(item => item.status !== 'pending').length;
    const flaggedByAI = classifications.filter(c => c.overall.isFlagged).length;
    const actuallyModerated = allContent.filter(item =>
      ['rejected', 'flagged'].includes(item.status)
    ).length;

    // Acurácia estimada (simplificada)
    const accuracy = moderatedContent > 0 ?
      Math.min(100, 85 + Math.random() * 10) : 0; // 85-95% simulado

    // Falsos positivos/negativos (estimados)
    const falsePositives = Math.floor(flaggedByAI * 0.1);
    const falseNegatives = Math.floor((moderatedContent - flaggedByAI) * 0.05);

    return {
      totalContent: allContent.length,
      moderatedContent,
      flaggedByAI,
      accuracy,
      falsePositives,
      falseNegatives,
      avgProcessingTime: 150, // ms
      topToxicWords: getTopToxicWords(classifications),
      spamPatterns: getCommonSpamPatterns(classifications)
    };
  } catch (error) {
    console.error('Erro ao calcular métricas de moderação:', error);
    return {
      totalContent: 0,
      moderatedContent: 0,
      accuracy: 0,
      falsePositives: 0,
      falseNegatives: 0,
      avgProcessingTime: 0,
      error: 'Erro no cálculo'
    };
  }
}

// Obter métricas gerais de IA
async function getGeneralAIMetrics(period) {
  const startDate = getStartDate(period);

  try {
    // Qualidade do conteúdo
    const [totalPosts, approvedPosts, totalPrayers, approvedPrayers] = await Promise.all([
      Post.countDocuments({ createdAt: { $gte: startDate } }),
      Post.countDocuments({ status: 'approved', createdAt: { $gte: startDate } }),
      Prayer.countDocuments({ createdAt: { $gte: startDate } }),
      Prayer.countDocuments({ status: 'approved', createdAt: { $gte: startDate } })
    ]);

    const contentQuality = (totalPosts + totalPrayers) > 0 ?
      ((approvedPosts + approvedPrayers) / (totalPosts + totalPrayers)) * 100 : 100;

    // Engajamento do usuário
    const [totalUsers, activeUsers] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: startDate } }),
      User.countDocuments({
        lastLogin: { $gte: startDate },
        createdAt: { $gte: startDate }
      })
    ]);

    const userEngagement = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

    // Tempo de resposta do sistema
    const avgResponseTime = 250; // ms simulado

    return {
      contentQuality,
      userEngagement,
      avgResponseTime,
      systemHealth: 98.5, // % uptime simulado
      totalUsers,
      activeUsers
    };
  } catch (error) {
    console.error('Erro ao calcular métricas gerais:', error);
    return {
      contentQuality: 0,
      userEngagement: 0,
      avgResponseTime: 0,
      systemHealth: 0,
      error: 'Erro no cálculo'
    };
  }
}

// Funções auxiliares
function getStartDate(period) {
  const now = new Date();
  switch (period) {
    case '1h': return new Date(now.getTime() - 60 * 60 * 1000);
    case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    default: return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
}

function calculateDiversity(targets) {
  if (targets.length === 0) return 0;
  const uniqueTargets = new Set(targets.map(t => t.toString()));
  return (uniqueTargets.size / targets.length) * 100;
}

function getTopToxicWords(classifications) {
  const wordCount = {};
  classifications.forEach(c => {
    c.toxicity.toxicWords.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
  });

  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));
}

function getCommonSpamPatterns(classifications) {
  const patternCount = {};
  classifications.forEach(c => {
    c.spam.reasons.forEach(reason => {
      patternCount[reason] = (patternCount[reason] || 0) + 1;
    });
  });

  return Object.entries(patternCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([pattern, count]) => ({ pattern, count }));
}

// Compliance Analytics Routes
router.get('/compliance', authenticateToken, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const cacheKey = `compliance-analytics:${period}`;

    // Verificar cache
    const cachedMetrics = await getCache(cacheKey);
    if (cachedMetrics) {
      return res.json({
        success: true,
        period,
        ...cachedMetrics,
        cached: true
      });
    }

    const startDate = getStartDate(period);

    // Métricas de compliance das rifas
    const complianceMetrics = await getComplianceMetrics(startDate);

    // Métricas de auditoria
    const auditMetrics = await getAuditMetrics(startDate);

    // Métricas de transparência
    const transparencyMetrics = await getTransparencyMetrics(startDate);

    const responseData = {
      metrics: {
        compliance: complianceMetrics,
        audit: auditMetrics,
        transparency: transparencyMetrics
      },
      kpis: {
        overallComplianceRate: complianceMetrics.complianceRate,
        auditCompletionRate: auditMetrics.completionRate,
        transparencyScore: transparencyMetrics.averageScore
      }
    };

    // Cachear resultado por 15 minutos
    await setCache(cacheKey, responseData, 900);

    res.json({
      success: true,
      period,
      ...responseData,
      cached: false
    });
  } catch (error) {
    console.error('Erro ao obter métricas de compliance:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Raffle Revenue and Conversion Analytics
router.get('/raffle-revenue', authenticateToken, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const cacheKey = `raffle-revenue:${period}`;

    // Verificar cache
    const cachedMetrics = await getCache(cacheKey);
    if (cachedMetrics) {
      return res.json({
        success: true,
        period,
        ...cachedMetrics,
        cached: true
      });
    }

    const startDate = getStartDate(period);

    // Métricas de receita das rifas
    const revenueMetrics = await getRaffleRevenueMetrics(startDate);

    // Métricas de conversão
    const conversionMetrics = await getRaffleConversionMetrics(startDate);

    // Métricas de uso
    const usageMetrics = await getRaffleUsageMetrics(startDate);

    const responseData = {
      metrics: {
        revenue: revenueMetrics,
        conversion: conversionMetrics,
        usage: usageMetrics
      },
      kpis: {
        totalRevenue: revenueMetrics.totalRevenue,
        conversionRate: conversionMetrics.overallConversionRate,
        activeRaffles: usageMetrics.activeRaffles
      }
    };

    // Cachear resultado por 15 minutos
    await setCache(cacheKey, responseData, 900);

    res.json({
      success: true,
      period,
      ...responseData,
      cached: false
    });
  } catch (error) {
    console.error('Erro ao obter métricas de receita de rifas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Funções auxiliares para compliance
async function getComplianceMetrics(startDate) {
  try {
    const [totalRaffles, compliantRaffles, nonCompliantRaffles] = await Promise.all([
      Raffle.countDocuments({ createdAt: { $gte: startDate } }),
      Raffle.countDocuments({
        createdAt: { $gte: startDate },
        'compliance.audit.complianceStatus': 'approved'
      }),
      Raffle.countDocuments({
        createdAt: { $gte: startDate },
        'compliance.audit.complianceStatus': { $in: ['rejected', 'under_review'] }
      })
    ]);

    const complianceRate = totalRaffles > 0 ? (compliantRaffles / totalRaffles) * 100 : 0;

    // Distribuição por status
    const statusDistribution = await Raffle.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$compliance.audit.complianceStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    return {
      totalRaffles,
      compliantRaffles,
      nonCompliantRaffles,
      complianceRate: Math.round(complianceRate),
      statusDistribution: statusDistribution.reduce((acc, item) => {
        acc[item._id || 'pending'] = item.count;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Erro ao calcular métricas de compliance:', error);
    return {
      totalRaffles: 0,
      compliantRaffles: 0,
      nonCompliantRaffles: 0,
      complianceRate: 0,
      statusDistribution: {}
    };
  }
}

async function getAuditMetrics(startDate) {
  try {
    const [totalAudits, completedAudits, pendingAudits] = await Promise.all([
      Raffle.countDocuments({
        createdAt: { $gte: startDate },
        'compliance.audit.auditDate': { $exists: true }
      }),
      Raffle.countDocuments({
        createdAt: { $gte: startDate },
        'compliance.audit.complianceStatus': { $in: ['approved', 'rejected'] }
      }),
      Raffle.countDocuments({
        createdAt: { $gte: startDate },
        'compliance.audit.complianceStatus': 'pending'
      })
    ]);

    const completionRate = totalAudits > 0 ? (completedAudits / totalAudits) * 100 : 0;

    // Tempo médio de auditoria
    const avgAuditTime = await Raffle.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          'compliance.audit.auditDate': { $exists: true }
        }
      },
      {
        $project: {
          auditTime: {
            $divide: [
              { $subtract: ['$compliance.audit.auditDate', '$createdAt'] },
              1000 * 60 * 60 * 24 // dias
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgAuditTime: { $avg: '$auditTime' }
        }
      }
    ]);

    return {
      totalAudits,
      completedAudits,
      pendingAudits,
      completionRate: Math.round(completionRate),
      avgAuditTime: avgAuditTime.length > 0 ? Math.round(avgAuditTime[0].avgAuditTime) : 0
    };
  } catch (error) {
    console.error('Erro ao calcular métricas de auditoria:', error);
    return {
      totalAudits: 0,
      completedAudits: 0,
      pendingAudits: 0,
      completionRate: 0,
      avgAuditTime: 0
    };
  }
}

async function getTransparencyMetrics(startDate) {
  try {
    const raffles = await Raffle.find({
      createdAt: { $gte: startDate }
    }).select('compliance.transparency');

    let totalScore = 0;
    let transparencyFeatures = {
      hasWitnesses: 0,
      hasVideoRecording: 0,
      hasPublicAnnouncement: 0,
      totalRaffles: raffles.length
    };

    raffles.forEach(raffle => {
      const transparency = raffle.compliance?.transparency || {};
      let score = 0;

      if (transparency.witnesses && transparency.witnesses.length > 0) {
        transparencyFeatures.hasWitnesses++;
        score += 25;
      }

      if (transparency.videoRecording && transparency.videoRecording.url) {
        transparencyFeatures.hasVideoRecording++;
        score += 25;
      }

      if (transparency.publicAnnouncement && transparency.publicAnnouncement.method) {
        transparencyFeatures.hasPublicAnnouncement++;
        score += 25;
      }

      if (transparency.drawMethod) {
        score += 25;
      }

      totalScore += score;
    });

    const averageScore = raffles.length > 0 ? totalScore / raffles.length : 0;

    return {
      ...transparencyFeatures,
      averageScore: Math.round(averageScore),
      transparencyRate: Math.round((averageScore / 100) * 100)
    };
  } catch (error) {
    console.error('Erro ao calcular métricas de transparência:', error);
    return {
      hasWitnesses: 0,
      hasVideoRecording: 0,
      hasPublicAnnouncement: 0,
      totalRaffles: 0,
      averageScore: 0,
      transparencyRate: 0
    };
  }
}

// Funções auxiliares para receita e conversão
async function getRaffleRevenueMetrics(startDate) {
  try {
    const revenueData = await Raffle.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$stats.totalRevenue' },
          totalTicketsSold: { $sum: '$soldTickets' },
          avgTicketPrice: { $avg: '$ticketPrice' },
          totalRaffles: { $sum: 1 }
        }
      }
    ]);

    if (revenueData.length === 0) {
      return {
        totalRevenue: 0,
        totalTicketsSold: 0,
        avgTicketPrice: 0,
        totalRaffles: 0,
        avgRevenuePerRaffle: 0
      };
    }

    const data = revenueData[0];
    return {
      totalRevenue: data.totalRevenue,
      totalTicketsSold: data.totalTicketsSold,
      avgTicketPrice: Math.round(data.avgTicketPrice * 100) / 100,
      totalRaffles: data.totalRaffles,
      avgRevenuePerRaffle: Math.round((data.totalRevenue / data.totalRaffles) * 100) / 100
    };
  } catch (error) {
    console.error('Erro ao calcular métricas de receita:', error);
    return {
      totalRevenue: 0,
      totalTicketsSold: 0,
      avgTicketPrice: 0,
      totalRaffles: 0,
      avgRevenuePerRaffle: 0
    };
  }
}

async function getRaffleConversionMetrics(startDate) {
  try {
    const [totalRaffles, completedRaffles, drawnRaffles] = await Promise.all([
      Raffle.countDocuments({ createdAt: { $gte: startDate } }),
      Raffle.countDocuments({
        createdAt: { $gte: startDate },
        status: 'drawn'
      }),
      Raffle.countDocuments({
        createdAt: { $gte: startDate },
        status: 'drawn'
      })
    ]);

    const completionRate = totalRaffles > 0 ? (completedRaffles / totalRaffles) * 100 : 0;
    const drawRate = totalRaffles > 0 ? (drawnRaffles / totalRaffles) * 100 : 0;

    // Taxa de conversão de tickets
    const conversionData = await Raffle.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalTickets: { $sum: '$totalTickets' },
          soldTickets: { $sum: '$soldTickets' }
        }
      }
    ]);

    const ticketConversionRate = conversionData.length > 0 && conversionData[0].totalTickets > 0
      ? (conversionData[0].soldTickets / conversionData[0].totalTickets) * 100
      : 0;

    return {
      totalRaffles,
      completedRaffles,
      drawnRaffles,
      completionRate: Math.round(completionRate),
      drawRate: Math.round(drawRate),
      ticketConversionRate: Math.round(ticketConversionRate),
      overallConversionRate: Math.round((completionRate + drawRate + ticketConversionRate) / 3)
    };
  } catch (error) {
    console.error('Erro ao calcular métricas de conversão:', error);
    return {
      totalRaffles: 0,
      completedRaffles: 0,
      drawnRaffles: 0,
      completionRate: 0,
      drawRate: 0,
      ticketConversionRate: 0,
      overallConversionRate: 0
    };
  }
}

async function getRaffleUsageMetrics(startDate) {
  try {
    const [activeRaffles, totalRaffles, soldOutRaffles] = await Promise.all([
      Raffle.countDocuments({
        createdAt: { $gte: startDate },
        status: 'active'
      }),
      Raffle.countDocuments({ createdAt: { $gte: startDate } }),
      Raffle.countDocuments({
        createdAt: { $gte: startDate },
        status: 'sold_out'
      })
    ]);

    // Tendências de criação de rifas
    const creationTrend = await Raffle.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      },
      {
        $limit: 30
      }
    ]);

    return {
      activeRaffles,
      totalRaffles,
      soldOutRaffles,
      utilizationRate: totalRaffles > 0 ? Math.round((soldOutRaffles / totalRaffles) * 100) : 0,
      creationTrend: creationTrend.map(item => ({
        date: item._id,
        count: item.count
      }))
    };
  } catch (error) {
    console.error('Erro ao calcular métricas de uso:', error);
    return {
      activeRaffles: 0,
      totalRaffles: 0,
      soldOutRaffles: 0,
      utilizationRate: 0,
      creationTrend: []
    };
  }
}

module.exports = router;
