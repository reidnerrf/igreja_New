const express = require('express');
const router = express.Router();
const { authenticateToken, requireChurch } = require('../middleware/auth');
const PremiumFeature = require('../models/PremiumFeature');
const User = require('../models/User');

// @route   GET /api/premium/features
// @desc    Listar recursos premium disponíveis
// @access  Public
router.get('/features', async (req, res) => {
  try {
    const features = await PremiumFeature.getActiveFeatures();
    res.json(features);
  } catch (error) {
    console.error('Erro ao buscar recursos premium:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// @route   GET /api/premium/features/:slug
// @desc    Obter detalhes de um recurso premium
// @access  Public
router.get('/features/:slug', async (req, res) => {
  try {
    const feature = await PremiumFeature.getBySlug(req.params.slug);
    if (!feature) {
      return res.status(404).json({ error: 'Recurso premium não encontrado' });
    }
    res.json(feature);
  } catch (error) {
    console.error('Erro ao buscar recurso premium:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// @route   POST /api/premium/subscribe
// @desc    Assinar premium
// @access  Private
router.post('/subscribe', authenticateToken, async (req, res) => {
  try {
    const { plan, billingCycle, paymentMethod, features } = req.body;

    // Verificar se já é premium
    if (req.user.isPremiumActive()) {
      return res.status(400).json({ error: 'Usuário já possui assinatura premium ativa' });
    }

    // Calcular data de expiração
    const now = new Date();
    const expiresAt = billingCycle === 'yearly'
      ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Buscar features selecionadas
    let selectedFeatures = [];
    if (features && features.length > 0) {
      selectedFeatures = await PremiumFeature.find({
        slug: { $in: features },
        isActive: true
      });
    }

    // Atualizar usuário
    const updateData = {
      isPremium: true,
      premiumExpiresAt: expiresAt,
      premiumFeatures: selectedFeatures.map(f => f._id),
      premiumSubscription: {
        plan,
        billingCycle,
        autoRenew: true,
        paymentMethod
      }
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).populate('premiumFeatures');

    res.json({
      message: 'Assinatura premium ativada com sucesso',
      user: updatedUser,
      expiresAt
    });
  } catch (error) {
    console.error('Erro ao assinar premium:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// @route   GET /api/premium/status
// @desc    Verificar status premium do usuário
// @access  Private
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('premiumFeatures');

    res.json({
      isPremium: user.isPremiumActive(),
      expiresAt: user.premiumExpiresAt,
      features: user.premiumFeatures,
      subscription: user.premiumSubscription,
      daysUntilExpiry: user.premiumExpiresAt
        ? Math.ceil((user.premiumExpiresAt - new Date()) / (1000 * 60 * 60 * 24))
        : null
    });
  } catch (error) {
    console.error('Erro ao verificar status premium:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/premium/renew
// @desc    Renovar assinatura premium
// @access  Private
router.put('/renew', authenticateToken, async (req, res) => {
  try {
    const { billingCycle } = req.body;

    if (!req.user.isPremiumActive()) {
      return res.status(400).json({ error: 'Usuário não possui assinatura premium ativa' });
    }

    const now = new Date();
    const expiresAt = billingCycle === 'yearly'
      ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        premiumExpiresAt: expiresAt,
        'premiumSubscription.billingCycle': billingCycle
      },
      { new: true }
    ).populate('premiumFeatures');

    res.json({
      message: 'Assinatura premium renovada com sucesso',
      user: updatedUser,
      expiresAt
    });
  } catch (error) {
    console.error('Erro ao renovar assinatura premium:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// @route   DELETE /api/premium/cancel
// @desc    Cancelar assinatura premium
// @access  Private
router.delete('/cancel', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isPremiumActive()) {
      return res.status(400).json({ error: 'Usuário não possui assinatura premium ativa' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        isPremium: false,
        premiumExpiresAt: null,
        premiumFeatures: [],
        premiumSubscription: null
      },
      { new: true }
    );

    res.json({
      message: 'Assinatura premium cancelada com sucesso',
      user: updatedUser
    });
  } catch (error) {
    console.error('Erro ao cancelar assinatura premium:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// @route   GET /api/premium/features/category/:category
// @desc    Listar recursos premium por categoria
// @access  Public
router.get('/features/category/:category', async (req, res) => {
  try {
    const features = await PremiumFeature.getByCategory(req.params.category);
    res.json(features);
  } catch (error) {
    console.error('Erro ao buscar recursos por categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// @route   POST /api/premium/features
// @desc    Adicionar features à assinatura premium (admin)
// @access  Private (Admin)
router.post('/features', authenticateToken, async (req, res) => {
  try {
    // TODO: Verificar se é admin
    const { name, slug, description, category, price, features } = req.body;

    const premiumFeature = new PremiumFeature({
      name,
      slug,
      description,
      category,
      price,
      features
    });

    await premiumFeature.save();

    res.status(201).json({
      message: 'Recurso premium criado com sucesso',
      feature: premiumFeature
    });
  } catch (error) {
    console.error('Erro ao criar recurso premium:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/premium/features/:id
// @desc    Atualizar recurso premium (admin)
// @access  Private (Admin)
router.put('/features/:id', authenticateToken, async (req, res) => {
  try {
    // TODO: Verificar se é admin
    const updates = req.body;

    const feature = await PremiumFeature.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!feature) {
      return res.status(404).json({ error: 'Recurso premium não encontrado' });
    }

    res.json({
      message: 'Recurso premium atualizado com sucesso',
      feature
    });
  } catch (error) {
    console.error('Erro ao atualizar recurso premium:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
