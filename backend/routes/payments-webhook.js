const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });

// Stripe webhook (needs raw body)
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) return res.status(503).send('Webhook não configurado');

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        // TODO: marcar doação/assinatura como paga
        break;
      case 'payment_intent.payment_failed':
        // TODO: notificar falha
        break;
      default:
        break;
    }
    res.json({ received: true });
  } catch (e) {
    res.status(500).send('Erro');
  }
});

module.exports = router;

