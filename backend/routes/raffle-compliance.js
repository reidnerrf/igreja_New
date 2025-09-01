const express = require('express');
const router = express.Router();
const Raffle = require('../models/Raffle');
const { authenticateToken, requireChurch } = require('../middleware/auth');

// ==================== ROTAS DE COMPLIANCE PARA RIFAS ====================

// Obter status de compliance da rifa
router.get('/:id/compliance', authenticateToken, async (req, res) => {
  try {
    const raffle = await Raffle.findById(req.params.id);

    if (!raffle) {
      return res.status(404).json({ error: 'Rifa não encontrada' });
    }

    // Verificar se usuário tem permissão (dono da rifa ou admin)
    if (raffle.church.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    res.json({
      success: true,
      compliance: raffle.compliance,
      complianceHistory: raffle.complianceHistory,
      status: raffle.compliance?.audit?.complianceStatus || 'pending'
    });
  } catch (error) {
    console.error('Erro ao buscar compliance:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar compliance da rifa
router.put('/:id/compliance', authenticateToken, requireChurch, async (req, res) => {
  try {
    const raffle = await Raffle.findOne({
      _id: req.params.id,
      church: req.user.userId
    });

    if (!raffle) {
      return res.status(404).json({ error: 'Rifa não encontrada' });
    }

    const { compliance, action = 'updated' } = req.body;

    // Validate compliance updates (example: check maxPrizeValue does not exceed limits)
    if (compliance && compliance.localRegulations && compliance.localRegulations.maxPrizeValue) {
      if (raffle.prizeValue > compliance.localRegulations.maxPrizeValue) {
        return res.status(400).json({ error: 'Valor do prêmio excede o limite máximo permitido pela regulamentação local.' });
      }
    }

    // Atualizar dados de compliance
    if (compliance) {
      raffle.compliance = { ...raffle.compliance, ...compliance };
    }

    // Adicionar ao histórico
    raffle.complianceHistory.push({
      action,
      performedBy: req.user.userId,
      details: `Compliance ${action} por ${req.user.name}`,
      timestamp: new Date()
    });

    await raffle.save();

    res.json({
      success: true,
      message: 'Compliance atualizado com sucesso',
      compliance: raffle.compliance,
      complianceHistory: raffle.complianceHistory
    });
  } catch (error) {
    console.error('Erro ao atualizar compliance:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Registrar auditoria da rifa
router.post('/:id/audit', authenticateToken, async (req, res) => {
  try {
    const raffle = await Raffle.findById(req.params.id);

    if (!raffle) {
      return res.status(404).json({ error: 'Rifa não encontrada' });
    }

    // Verificar se usuário tem permissão (dono da rifa ou auditor)
    if (raffle.church.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const {
      auditor,
      auditReport,
      complianceStatus,
      notes,
      documents = []
    } = req.body;

    // Atualizar dados da auditoria
    raffle.compliance.audit = {
      ...raffle.compliance.audit,
      auditor,
      auditReport,
      auditDate: new Date(),
      complianceStatus,
      notes
    };

    // Adicionar ao histórico
    raffle.complianceHistory.push({
      action: 'audited',
      performedBy: req.user.userId,
      details: `Auditoria realizada - Status: ${complianceStatus}`,
      documents,
      timestamp: new Date()
    });

    await raffle.save();

    res.json({
      success: true,
      message: 'Auditoria registrada com sucesso',
      audit: raffle.compliance.audit,
      complianceHistory: raffle.complianceHistory
    });
  } catch (error) {
    console.error('Erro ao registrar auditoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Sortear vencedor com compliance
router.post('/:id/draw-compliant', authenticateToken, requireChurch, async (req, res) => {
  try {
    const raffle = await Raffle.findOne({
      _id: req.params.id,
      church: req.user.userId
    });

    if (!raffle) {
      return res.status(404).json({ error: 'Rifa não encontrada' });
    }

    if (raffle.status !== 'active' && raffle.status !== 'sold_out') {
      return res.status(400).json({ error: 'Rifa não pode ser sorteada' });
    }

    // Verificar compliance antes do sorteio
    const complianceStatus = raffle.compliance?.audit?.complianceStatus;
    if (complianceStatus !== 'approved') {
      return res.status(400).json({
        error: 'Rifa deve estar em compliance aprovada para realizar sorteio',
        complianceStatus
      });
    }

    const { witnesses = [], videoRecording, publicAnnouncement } = req.body;

    // Registrar testemunhas
    if (witnesses.length > 0) {
      raffle.compliance.transparency.witnesses = witnesses;
    }

    // Registrar gravação em vídeo
    if (videoRecording) {
      raffle.compliance.transparency.videoRecording = videoRecording;
    }

    // Registrar anúncio público
    if (publicAnnouncement) {
      raffle.compliance.transparency.publicAnnouncement = {
        ...raffle.compliance.transparency.publicAnnouncement,
        ...publicAnnouncement,
        date: new Date()
      };
    }

    // Realizar sorteio
    const winner = raffle.drawWinner();

    // Adicionar ao histórico de compliance
    raffle.complianceHistory.push({
      action: 'drawn',
      performedBy: req.user.userId,
      details: `Sorteio realizado com compliance - Vencedor: ${winner.ticket}`,
      timestamp: new Date()
    });

    await raffle.save();
    await raffle.populate('winner.user', 'name profileImage');

    // Emitir evento ao vivo
    try {
      const io = req.app.get('io');
      io && io.to(`raffle:${raffle._id}`).emit('raffle_drawn', {
        raffleId: raffle._id,
        winner: raffle.winner,
        compliance: raffle.compliance
      });
    } catch (e) { console.warn('emit raffle_drawn failed', e?.message); }

    res.json({
      success: true,
      message: 'Sorteio realizado com sucesso e compliance registrado',
      winner: raffle.winner,
      compliance: raffle.compliance,
      complianceHistory: raffle.complianceHistory
    });
  } catch (error) {
    console.error('Erro ao sortear com compliance:', error);
    res.status(500).json({ error: error.message || 'Erro interno do servidor' });
  }
});

// Validar compliance da rifa
router.post('/:id/validate-compliance', authenticateToken, requireChurch, async (req, res) => {
  try {
    const raffle = await Raffle.findOne({
      _id: req.params.id,
      church: req.user.userId
    });

    if (!raffle) {
      return res.status(404).json({ error: 'Rifa não encontrada' });
    }

    // Validações de compliance
    const validations = {
      localRegulations: {
        hasState: !!raffle.compliance?.localRegulations?.state,
        hasCity: !!raffle.compliance?.localRegulations?.city,
        hasRegulationNumber: !!raffle.compliance?.localRegulations?.regulationNumber,
        hasAuthority: !!raffle.compliance?.localRegulations?.authority,
        hasComplianceDocument: !!raffle.compliance?.localRegulations?.complianceDocument,
        prizeWithinLimit: !raffle.compliance?.localRegulations?.maxPrizeValue ||
                         raffle.prizeValue <= raffle.compliance.localRegulations.maxPrizeValue
      },
      transparency: {
        hasDrawMethod: !!raffle.compliance?.transparency?.drawMethod,
        hasWitnesses: raffle.compliance?.transparency?.witnesses?.length > 0,
        hasPublicAnnouncement: !!raffle.compliance?.transparency?.publicAnnouncement?.method
      },
      audit: {
        hasAuditor: !!raffle.compliance?.audit?.auditor,
        hasAuditReport: !!raffle.compliance?.audit?.auditReport,
        isApproved: raffle.compliance?.audit?.complianceStatus === 'approved'
      },
      limits: {
        withinMaxRevenue: !raffle.compliance?.limits?.maxRevenue ||
                         raffle.stats.totalRevenue <= raffle.compliance.limits.maxRevenue,
        withinGeographicRestriction: !raffle.compliance?.limits?.geographicRestriction ||
                                    checkGeographicRestriction(raffle, raffle.compliance.limits.geographicRestriction)
      },
      documents: {
        regulationApproval: raffle.compliance?.requiredDocuments?.regulationApproval,
        taxDeclaration: raffle.compliance?.requiredDocuments?.taxDeclaration,
        insurancePolicy: raffle.compliance?.requiredDocuments?.insurancePolicy,
        notaryDeed: raffle.compliance?.requiredDocuments?.notaryDeed
      }
    };

    // Calcular score de compliance
    const calculateComplianceScore = (validations) => {
      let totalChecks = 0;
      let passedChecks = 0;

      const countValidations = (obj) => {
        for (const key in obj) {
          if (typeof obj[key] === 'object') {
            countValidations(obj[key]);
          } else {
            totalChecks++;
            if (obj[key]) passedChecks++;
          }
        }
      };

      countValidations(validations);
      return { score: Math.round((passedChecks / totalChecks) * 100), passedChecks, totalChecks };
    };

    const complianceScore = calculateComplianceScore(validations);

    // Determinar status baseado no score
    let recommendedStatus = 'pending';
    if (complianceScore.score >= 90) {
      recommendedStatus = 'approved';
    } else if (complianceScore.score >= 70) {
      recommendedStatus = 'under_review';
    } else {
      recommendedStatus = 'rejected';
    }

    // Adicionar ao histórico
    raffle.complianceHistory.push({
      action: 'validated',
      performedBy: req.user.userId,
      details: `Validação de compliance realizada - Score: ${complianceScore.score}%`,
      timestamp: new Date()
    });

    await raffle.save();

    res.json({
      success: true,
      message: 'Validação de compliance realizada',
      validations,
      complianceScore,
      recommendedStatus,
      currentStatus: raffle.compliance?.audit?.complianceStatus || 'pending',
      compliance: raffle.compliance,
      complianceHistory: raffle.complianceHistory
    });
  } catch (error) {
    console.error('Erro ao validar compliance:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Função auxiliar para verificar restrições geográficas
function checkGeographicRestriction(raffle, restriction) {
  if (!restriction.allowedStates || restriction.allowedStates.length === 0) {
    return true; // Sem restrição
  }

  const raffleState = raffle.compliance?.localRegulations?.state;
  const raffleCity = raffle.compliance?.localRegulations?.city;

  if (restriction.allowedStates && !restriction.allowedStates.includes(raffleState)) {
    return false;
  }

  if (restriction.allowedCities && !restriction.allowedCities.includes(raffleCity)) {
    return false;
  }

  return true;
}

module.exports = router;
