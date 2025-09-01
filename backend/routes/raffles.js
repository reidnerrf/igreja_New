const express = require('express');
const { Raffle } = require('../models/Raffle');
const User = require('../models/User');
const { authenticateToken, requireChurch, requirePremium, rateLimitByPlan } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validações
const validateRaffle = [
  body('title').trim().isLength({ min: 3 }).withMessage('Título deve ter pelo menos 3 caracteres'),
  body('prize').trim().isLength({ min: 3 }).withMessage('Prêmio deve ter pelo menos 3 caracteres'),
  body('ticketPrice').isFloat({ min: 0.01 }).withMessage('Preço deve ser maior que 0'),
  body('totalTickets').isInt({ min: 1 }).withMessage('Quantidade de bilhetes deve ser maior que 0'),
  body('endDate').isISO8601().withMessage('Data de encerramento inválida'),
];

// Listar rifas
router.get('/', async (req, res) => {
  try {
    const { 
      church, 
      status = 'active',
      page = 1, 
      limit = 20,
      userLocation
    } = req.query;

    let query = { status, isPublic: true };
    
    // Filtrar por igreja
    if (church) {
      query.church = church;
    }

    const raffles = await Raffle.find(query)
      .populate('church', 'name profileImage churchData')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Raffle.countDocuments(query);

    // Adicionar números disponíveis para cada rifa
    const rafflesWithAvailability = raffles.map(raffle => ({
      ...raffle.toObject(),
      availableNumbers: raffle.getAvailableNumbers().length,
      soldPercentage: (raffle.soldTickets / raffle.totalTickets) * 100
    }));

    res.json({
      success: true,
      raffles: rafflesWithAvailability,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar rifas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar rifa por ID
router.get('/:id', async (req, res) => {
  try {
    const raffle = await Raffle.findById(req.params.id)
      .populate('church', 'name profileImage churchData')
      .populate('tickets.buyer', 'name profileImage');

    if (!raffle) {
      return res.status(404).json({ error: 'Rifa não encontrada' });
    }

    const raffleData = {
      ...raffle.toObject(),
      availableNumbers: raffle.getAvailableNumbers(),
      soldNumbers: raffle.tickets
        .filter(ticket => ticket.paymentStatus === 'completed')
        .map(ticket => ticket.number)
    };

    res.json({ success: true, raffle: raffleData });
  } catch (error) {
    console.error('Erro ao buscar rifa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar rifa (Premium)
router.post('/', authenticateToken, requireChurch, requirePremium, validateRaffle, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Se a rifa contém imagem do prêmio, ela deve ser enviada via /api/upload/raffle-prize primeiro
    // e a URL da imagem deve ser incluída em req.body.prizeImage
    const raffleData = {
      ...req.body,
      church: req.user.userId
    };

    // Validar se a imagem do prêmio é uma URL válida (deve começar com /uploads/)
    if (req.body.prizeImage && typeof req.body.prizeImage === 'string') {
      if (!req.body.prizeImage.startsWith('/uploads/')) {
        return res.status(400).json({ error: 'Imagem do prêmio deve ser uma URL válida de upload' });
      }
      raffleData.prizeImage = req.body.prizeImage;
    }

    const raffle = new Raffle(raffleData);
    await raffle.save();

    await raffle.populate('church', 'name profileImage churchData');

    res.status(201).json({ success: true, raffle });
  } catch (error) {
    console.error('Erro ao criar rifa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Comprar bilhetes
router.post('/:id/buy', authenticateToken, async (req, res) => {
  try {
    const { ticketNumbers, paymentData } = req.body;
    
    if (!Array.isArray(ticketNumbers) || ticketNumbers.length === 0) {
      return res.status(400).json({ error: 'Números de bilhetes inválidos' });
    }

    const raffle = await Raffle.findById(req.params.id);
    
    if (!raffle) {
      return res.status(404).json({ error: 'Rifa não encontrada' });
    }

    if (raffle.status !== 'active') {
      return res.status(400).json({ error: 'Rifa não está ativa' });
    }

    if (new Date() > raffle.endDate) {
      return res.status(400).json({ error: 'Rifa já encerrada' });
    }

    // Verificar se números estão disponíveis
    for (const number of ticketNumbers) {
      if (!raffle.isNumberAvailable(number)) {
        return res.status(400).json({ 
          error: `Número ${number} não está disponível` 
        });
      }
    }

    // Verificar limite por usuário
    if (raffle.maxTicketsPerUser) {
      const userTickets = raffle.tickets.filter(
        ticket => ticket.buyer.toString() === req.user.userId && 
                 ticket.paymentStatus === 'completed'
      ).length;
      
      if (userTickets + ticketNumbers.length > raffle.maxTicketsPerUser) {
        return res.status(400).json({ 
          error: `Limite de ${raffle.maxTicketsPerUser} bilhetes por usuário` 
        });
      }
    }

    // Adicionar bilhetes
    const newTickets = ticketNumbers.map(number => ({
      number,
      buyer: req.user.userId,
      paymentMethod: paymentData.method,
      paymentStatus: 'pending',
      transactionId: paymentData.transactionId || null
    }));

    raffle.tickets.push(...newTickets);
    await raffle.save();

    // Simular processamento de pagamento
    // Em produção, integrar com gateway real
    setTimeout(async () => {
      try {
        const updatedRaffle = await Raffle.findById(req.params.id);
        newTickets.forEach(ticket => {
          const raffleTicket = updatedRaffle.tickets.find(
            t => t.number === ticket.number && t.buyer.toString() === req.user.userId
          );
          if (raffleTicket) {
            raffleTicket.paymentStatus = 'completed';
          }
        });
        await updatedRaffle.save();
      } catch (error) {
        console.error('Erro ao processar pagamento:', error);
      }
    }, 2000);

    res.json({ 
      success: true, 
      message: 'Bilhetes adicionados com sucesso',
      tickets: newTickets,
      totalAmount: ticketNumbers.length * raffle.ticketPrice
    });
  } catch (error) {
    console.error('Erro ao comprar bilhetes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Sortear vencedor
router.post('/:id/draw', authenticateToken, requireChurch, async (req, res) => {
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

    const winner = raffle.drawWinner();
    await raffle.save();

    await raffle.populate('winner.user', 'name profileImage');

    // Emitir evento ao vivo
    try {
      const io = req.app.get('io');
      io && io.to(`raffle:${raffle._id}`).emit('raffle_drawn', { raffleId: raffle._id, winner: raffle.winner });
    } catch (e) { console.warn('emit raffle_drawn failed', e?.message); }

    res.json({ 
      success: true, 
      message: 'Sorteio realizado com sucesso',
      winner: raffle.winner
    });
  } catch (error) {
    console.error('Erro ao sortear:', error);
    res.status(500).json({ error: error.message || 'Erro interno do servidor' });
  }
});

// Obter bilhetes do usuário
router.get('/user/tickets', authenticateToken, async (req, res) => {
  try {
    const raffles = await Raffle.find({
      'tickets.buyer': req.user.userId,
      'tickets.paymentStatus': 'completed'
    })
    .populate('church', 'name profileImage')
    .sort({ createdAt: -1 });

    const userTickets = raffles.map(raffle => {
      const userRaffleTickets = raffle.tickets.filter(
        ticket => ticket.buyer.toString() === req.user.userId && 
                 ticket.paymentStatus === 'completed'
      );

      return {
        raffle: {
          id: raffle._id,
          title: raffle.title,
          prize: raffle.prize,
          prizeImage: raffle.prizeImage,
          church: raffle.church,
          status: raffle.status,
          endDate: raffle.endDate,
          winner: raffle.winner
        },
        tickets: userRaffleTickets,
        totalSpent: userRaffleTickets.length * raffle.ticketPrice,
        isWinner: raffle.winner?.user?.toString() === req.user.userId
      };
    });

    res.json({ success: true, tickets: userTickets });
  } catch (error) {
    console.error('Erro ao buscar bilhetes do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;