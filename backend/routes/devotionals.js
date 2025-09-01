const express = require('express');

const router = express.Router();

// Conteúdo simples de evangelho do dia (mock)
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0,10);
    res.json({
      date: today,
      gospel: 'João 3:16',
      text: 'Porque Deus amou o mundo de tal maneira...',
      reflection: 'Reflexão: O amor de Deus nos convida a amar como Ele amou.'
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter devocional' });
  }
});

module.exports = router;

