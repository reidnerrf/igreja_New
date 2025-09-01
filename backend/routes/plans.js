const express = require('express');
const router = express.Router();
const { authenticateToken, requireChurch } = require('../middleware/auth');
const ChurchPlan = require('../models/ChurchPlan');
const ChurchSubscription = require('../models/ChurchSubscription');
const User = require('../models/User');

// @route   GET /api/plans
// @desc    Listar todos os planos disponíveis
// @access  Public
router.get('/', async (req, res) => {
  try {
    const plans = await ChurchPlan.getActivePlans();
    res.json(plans);
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// @route   GET /api/plans/:slug
// @desc    Obter detalhes de um plano específico
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const plan = await ChurchPlan.getBySlug(req.params.slug);
    if (!plan) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }
    res.json(plan);
  } catch (error) {
    console.error('Erro ao buscar plano:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// @route   POST /api/plans/subscribe
// @desc    Criar assinatura para um plano
// @access  Private (Church only)
router.post('/subscribe', authenticateToken, requireChurch, async (req, res) => {
  try {
    const { planSlug, billingCycle, paymentMethod } = req.body;

    // Verificar se o plano existe
    const plan = await ChurchPlan.getBySlug(planSlug);
    if (!plan) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    // Verificar se a igreja já tem uma assinatura ativa
    const existingSubscription = await ChurchSubscription.getChurchSubscription(req.user._id);
    if (existingSubscription) {
      return res.status(400).json({ error: 'Igreja já possui uma assinatura ativa' });
    }

    // Calcular datas
    const now = new Date();
    const currentPeriodEnd = billingCycle === 'yearly'
      ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
      : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Criar assinatura
    const subscription = new ChurchSubscription({
      church: req.user._id,
      plan: plan._id,
      billingCycle,
      currentPeriodStart: now,
      currentPeriodEnd,
      status: 'trial',
      trialEnd: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 dias trial
      paymentMethod: {
        type: paymentMethod
      },
      limits: plan.getLimits()
    });

    await subscription.save();

    // Atualizar usuário
    await User.findByIdAndUpdate(req.user._id, {
      churchSubscription: subscription._id,
      churchPlan: plan._id
    });

    // Popular dados para resposta
    await subscription.populate('plan');

    res.status(201).json({
      message: 'Assinatura criada com sucesso',
      subscription
    });
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// @route   GET /api/plans/subscription/status
// @desc    Obter status da assinatura da igreja
// @access  Private (Church only)
router.get('/subscription/status', authenticateToken, requireChurch, async (req, res) => {
  try {
    const subscription = await ChurchSubscription.getChurchSubscription(req.user._id)
      .populate('plan');

    if (!subscription) {
      return res.json({ status: 'no_subscription' });
    }

    res.json({
      subscription,
      isActive: subscription.isActive(),
      daysUntilExpiry: subscription.status === 'trial'
        ? Math.ceil((subscription.trialEnd - new Date()) / (1000 * 60 * 60 * 24))
        : Math.ceil((subscription.currentPeriodEnd - new Date()) / (1000 * 60 * 60 * 24))
    });
  } catch (error) {
    console.error('Erro ao buscar status da assinatura:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/plans/subscription/:id
// @desc    Atualizar assinatura (upgrade/downgrade)
// @access  Private (Church only)
router.put('/subscription/:id', authenticateToken, requireChurch, async (req, res) => {
  try {
    const { planSlug, billingCycle } = req.body;

    const subscription = await ChurchSubscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }

    // Verificar se pertence à igreja
    if (subscription.church.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Se mudou o plano
    if (planSlug) {
      const newPlan = await ChurchPlan.getBySlug(planSlug);
      if (!newPlan) {
        return res.status(404).json({ error: 'Novo plano não encontrado' });
      }

      subscription.plan = newPlan._id;
      subscription.limits = newPlan.getLimits();

      // Atualizar usuário
      await User.findByIdAndUpdate(req.user._id, {
        churchPlan: newPlan._id
      });
    }

    // Se mudou o ciclo de cobrança
    if (billingCycle) {
      subscription.billingCycle = billingCycle;
    }

    await subscription.save();
    await subscription.populate('plan');

    res.json({
      message: 'Assinatura atualizada com sucesso',
      subscription
    });
  } catch (error) {
    console.error('Erro ao atualizar assinatura:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// @route   DELETE /api/plans/subscription/:id
// @desc    Cancelar assinatura
// @access  Private (Church only)
router.delete('/subscription/:id', authenticateToken, requireChurch, async (req, res) => {
  try {
    const subscription = await ChurchSubscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }

    // Verificar se pertence à igreja
    if (subscription.church.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await subscription.cancel();
    await subscription.populate('plan');

    res.json({
      message: 'Assinatura cancelada com sucesso',
      subscription
    });
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// @route   POST /api/plans/subscription/:id/renew
// @desc    Renovar assinatura
// @access  Private (Church only)
router.post('/subscription/:id/renew', authenticateToken, requireChurch, async (req, res) => {
  try {
    const subscription = await ChurchSubscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Assinatura não encontrada' });
    }

    // Verificar se pertence à igreja
    if (subscription.church.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await subscription.renew();
    await subscription.populate('plan');

    res.json({
      message: 'Assinatura renovada com sucesso',
      subscription
    });
  } catch (error) {
    console.error('Erro ao renovar assinatura:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
