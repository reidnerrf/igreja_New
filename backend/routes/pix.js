const express = require('express');
const { Donation } = require('../models/Donation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Geração de payload PIX (mock)
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { amount, church, campaign, message } = req.body;
    const txid = `TX${Date.now()}`;
    const payload = `00020126580014BR.GOV.BCB.PIX01${(church||'pix').length}${church||'pix'}5204000053039865802BR5909IGREJA6009CIDADE6207${txid}6304ABCD`;
    // opcional: criar donation pendente
    const donation = await Donation.create({ donor: req.user.userId, church, campaign, amount, method: 'pix', status: 'pending', paymentData: { pixCode: payload, transactionId: txid }, message });
    res.json({ success: true, txid, payload, donationId: donation._id });
  } catch (error) {
    console.error('PIX generate error:', error);
    res.status(500).json({ error: 'Erro ao gerar PIX' });
  }
});

// Status do pagamento (mock polling)
router.get('/status/:txid', authenticateToken, async (req, res) => {
  try {
    const donation = await Donation.findOne({ 'paymentData.transactionId': req.params.txid });
    if (!donation) return res.status(404).json({ error: 'Transação não encontrada' });
    // Simular aprovação automática após 5s
    const approved = (Date.now() - new Date(donation.createdAt).getTime()) > 5000;
    if (approved && donation.status !== 'completed') {
      donation.status = 'completed';
      donation.processedAt = new Date();
      await donation.save();
    }
    res.json({ success: true, status: donation.status });
  } catch (error) {
    console.error('PIX status error:', error);
    res.status(500).json({ error: 'Erro ao consultar status' });
  }
});

module.exports = router;

