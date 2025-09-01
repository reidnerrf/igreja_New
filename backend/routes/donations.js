const express = require('express');
const { Donation, DonationCampaign } = require('../models/Donation');
const User = require('../models/User');
const { authenticateToken, requireChurch } = require('../middleware/auth');

const router = express.Router();

// Listar doações com filtro por período
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { period = 'all', campaign, church, donor, page = 1, limit = 20 } = req.query;
    const query = {};
    if (church) query.church = church;
    if (donor) query.donor = donor;

    if (campaign) query.campaign = campaign;

    if (period !== 'all') {
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
      query.createdAt = { $gte: from };
    }

    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Donation.countDocuments(query);
    res.json({ success: true, donations, pagination: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (error) {
    console.error('Erro ao listar doações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// helper slug
function slugify(text) {
  return String(text || '')
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-').toLowerCase();
}

// Criar campanha
router.post('/campaigns', authenticateToken, requireChurch, async (req, res) => {
  try {
    const baseSlug = slugify(req.body.title);
    let slug = baseSlug;
    let i = 1;
    while (await DonationCampaign.findOne({ slug })) {
      slug = `${baseSlug}-${i++}`;
    }
    // Se a campanha contém imagens, elas devem ser enviadas via /api/upload/donation primeiro
    // e as URLs das imagens devem ser incluídas em req.body.images
    const campaignData = {
      ...req.body,
      church: req.user.userId,
      slug
    };

    // Validar se as imagens são URLs válidas (devem começar com /uploads/)
    if (req.body.images && Array.isArray(req.body.images)) {
      const validImages = req.body.images.filter(img => 
        typeof img === 'string' && img.startsWith('/uploads/')
      );
      campaignData.images = validImages;
    }

    const campaign = await DonationCampaign.create(campaignData);
    res.status(201).json({ success: true, campaign });
  } catch (error) {
    console.error('Erro ao criar campanha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar campanhas
router.get('/campaigns', authenticateToken, async (req, res) => {
  try {
    const { church, status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (church) query.church = church;
    if (status) query.status = status;
    const campaigns = await DonationCampaign.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    const total = await DonationCampaign.countDocuments(query);
    res.json({ success: true, campaigns, pagination: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (error) {
    console.error('Erro ao listar campanhas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter campanha por ID
router.get('/campaigns/:id', authenticateToken, async (req, res) => {
  try {
    const campaign = await DonationCampaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada' });
    res.json({ success: true, campaign });
  } catch (error) {
    console.error('Erro ao obter campanha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Página pública por slug
router.get('/public/:slug', async (req, res) => {
  try {
    const campaign = await DonationCampaign.findOne({ slug: req.params.slug, status: { $in: ['active','completed'] } });
    if (!campaign) return res.status(404).send('Campanha não encontrada');
    res.send(`<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${campaign.title}</title></head><body><div style="max-width:680px;margin:40px auto;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu;line-height:1.5;padding:0 16px"><h1>${campaign.title}</h1><p>${campaign.description || ''}</p><p><strong>Meta:</strong> R$ ${campaign.goal?.toLocaleString?.()}</p><p><strong>Arrecadado:</strong> R$ ${campaign.raised?.toLocaleString?.()}</p><p><img alt="QR" src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${req.protocol}://${req.get('host')}/api/donations/public/${campaign.slug}`)}"/></p><p><small>Compartilhe este link: ${req.protocol}://${req.get('host')}/api/donations/public/${campaign.slug}</small></p></div></body></html>`);
  } catch (error) {
    console.error('Erro ao gerar página pública:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Atualizar campanha
router.put('/campaigns/:id', authenticateToken, requireChurch, async (req, res) => {
  try {
    const campaign = await DonationCampaign.findOne({ _id: req.params.id, church: req.user.userId });
    if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada' });
    const updateData = { ...req.body };
    
    // Validar imagens se fornecidas
    if (req.body.images && Array.isArray(req.body.images)) {
      const validImages = req.body.images.filter(img => 
        typeof img === 'string' && img.startsWith('/uploads/')
      );
      updateData.images = validImages;
    }
    
    Object.assign(campaign, updateData);
    await campaign.save();
    res.json({ success: true, campaign });
  } catch (error) {
    console.error('Erro ao atualizar campanha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Excluir campanha
router.delete('/campaigns/:id', authenticateToken, requireChurch, async (req, res) => {
  try {
    const campaign = await DonationCampaign.findOne({ _id: req.params.id, church: req.user.userId });
    if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada' });
    await DonationCampaign.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Campanha removida' });
  } catch (error) {
    console.error('Erro ao excluir campanha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar doação (processamento simplificado)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const donation = await Donation.create({ ...req.body, donor: req.user.userId });
    // Atualizar estatísticas da igreja
    await User.findByIdAndUpdate(donation.church, { $inc: { 'stats.totalDonations': 1 } });
    res.status(201).json({ success: true, donation });
  } catch (error) {
    console.error('Erro ao criar doação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Processar doação (simulado)
router.post('/:id/process', authenticateToken, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Doação não encontrada' });
    donation.status = 'completed';
    donation.processedAt = new Date();
    donation.paymentData = { ...(donation.paymentData || {}), ...req.body };
    await donation.save();
    res.json({ success: true, donation });
  } catch (error) {
    console.error('Erro ao processar doação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

