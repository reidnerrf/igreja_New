const express = require('express');
const router = express.Router();
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });

// Create PaymentIntent for card/Apple Pay/Google Pay via Stripe
router.post('/intent', async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) return res.status(503).json({ error: 'Stripe não configurado' });
    const { amount, currency = 'brl', description } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Valor inválido' });

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      description,
      automatic_payment_methods: { enabled: true }
    });
    res.json({ clientSecret: intent.client_secret });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Stripe intent error:', e);
    res.status(500).json({ error: 'Erro ao criar pagamento' });
  }
});

module.exports = router;

