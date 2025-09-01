const mongoose = require('mongoose');

const raffleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prize: {
    type: String,
    required: true,
    trim: true
  },
  prizeImage: {
    type: String,
    default: null
  },
  prizeValue: {
    type: Number,
    default: 0
  },
  
  // Configurações da rifa
  ticketPrice: {
    type: Number,
    required: true,
    min: 0.01
  },
  totalTickets: {
    type: Number,
    required: true,
    min: 1
  },
  soldTickets: {
    type: Number,
    default: 0
  },
  
  // Números vendidos
  tickets: [{
    number: {
      type: Number,
      required: true
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    purchasedAt: {
      type: Date,
      default: Date.now
    },
    paymentMethod: {
      type: String,
      enum: ['pix', 'card', 'cash'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    transactionId: {
      type: String,
      default: null
    }
  }],
  
  // Datas
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  drawDate: {
    type: Date,
    default: null
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'sold_out', 'drawn', 'cancelled'],
    default: 'active'
  },
  
  // Resultado do sorteio
  winner: {
    ticket: {
      type: Number,
      default: null
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    drawnAt: {
      type: Date,
      default: null
    },
    claimed: {
      type: Boolean,
      default: false
    },
    claimedAt: {
      type: Date,
      default: null
    }
  },
  
  // Configurações avançadas
  maxTicketsPerUser: {
    type: Number,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },

  // Sistema de Compliance
  compliance: {
    // Normas locais
    localRegulations: {
      state: String, // Estado onde a rifa é realizada
      city: String,  // Cidade onde a rifa é realizada
      regulationNumber: String, // Número da regulamentação local
      authority: String, // Órgão responsável
      complianceDocument: String, // URL do documento de compliance
      maxPrizeValue: Number, // Valor máximo permitido por lei
      ageRestriction: { type: Number, default: 18 }, // Idade mínima
      taxRate: { type: Number, default: 0 }, // Taxa de imposto
      requiresNotary: { type: Boolean, default: false }, // Requer cartório
      requiresInsurance: { type: Boolean, default: false } // Requer seguro
    },

    // Transparência do sorteio
    transparency: {
      drawMethod: {
        type: String,
        enum: ['random', 'public_draw', 'notary_supervised'],
        default: 'random'
      },
      witnesses: [{
        name: String,
        document: String, // CPF/CNPJ
        role: String // testemunha, representante, etc.
      }],
      videoRecording: {
        url: String,
        required: { type: Boolean, default: false }
      },
      publicAnnouncement: {
        method: {
          type: String,
          enum: ['website', 'social_media', 'newspaper', 'radio'],
          default: 'website'
        },
        date: Date,
        proof: String // URL da prova
      }
    },

    // Auditoria
    audit: {
      auditor: {
        name: String,
        company: String,
        license: String
      },
      auditReport: String, // URL do relatório
      auditDate: Date,
      complianceStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'under_review'],
        default: 'pending'
      },
      notes: String
    },

    // Limites e validações
    limits: {
      maxTicketsPerPerson: { type: Number, default: 10 },
      maxRevenue: Number, // Receita máxima permitida
      minParticipants: { type: Number, default: 1 },
      geographicRestriction: {
        allowedStates: [String],
        allowedCities: [String]
      }
    },

    // Documentação obrigatória
    requiredDocuments: {
      regulationApproval: { type: Boolean, default: false },
      taxDeclaration: { type: Boolean, default: false },
      insurancePolicy: { type: Boolean, default: false },
      notaryDeed: { type: Boolean, default: false }
    }
  },

  // Histórico de compliance
  complianceHistory: [{
    action: {
      type: String,
      enum: ['created', 'updated', 'audited', 'approved', 'rejected', 'drawn']
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String,
    documents: [String] // URLs de documentos relacionados
  }],
  
  // Estatísticas
  stats: {
    totalRevenue: { type: Number, default: 0 },
    uniqueBuyers: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Índices
raffleSchema.index({ church: 1, status: 1 });
raffleSchema.index({ endDate: 1, status: 1 });
raffleSchema.index({ status: 1, isPublic: 1 });

// Middleware para atualizar estatísticas
raffleSchema.pre('save', function(next) {
  // Calcular receita total
  this.stats.totalRevenue = this.tickets
    .filter(ticket => ticket.paymentStatus === 'completed')
    .length * this.ticketPrice;
  
  // Calcular compradores únicos
  const uniqueBuyers = new Set(
    this.tickets
      .filter(ticket => ticket.paymentStatus === 'completed')
      .map(ticket => ticket.buyer.toString())
  );
  this.stats.uniqueBuyers = uniqueBuyers.size;
  
  // Atualizar quantidade vendida
  this.soldTickets = this.tickets.filter(ticket => ticket.paymentStatus === 'completed').length;
  
  // Verificar se esgotou
  if (this.soldTickets >= this.totalTickets && this.status === 'active') {
    this.status = 'sold_out';
  }
  
  next();
});

// Método para verificar se número está disponível
raffleSchema.methods.isNumberAvailable = function(number) {
  return !this.tickets.some(ticket => 
    ticket.number === number && ticket.paymentStatus !== 'failed'
  );
};

// Método para obter números disponíveis
raffleSchema.methods.getAvailableNumbers = function() {
  const soldNumbers = this.tickets
    .filter(ticket => ticket.paymentStatus !== 'failed')
    .map(ticket => ticket.number);
  
  const allNumbers = Array.from({ length: this.totalTickets }, (_, i) => i + 1);
  return allNumbers.filter(number => !soldNumbers.includes(number));
};

// Método para sortear vencedor
raffleSchema.methods.drawWinner = function() {
  const completedTickets = this.tickets.filter(ticket => ticket.paymentStatus === 'completed');
  
  if (completedTickets.length === 0) {
    throw new Error('Nenhum bilhete vendido para sortear');
  }
  
  const randomIndex = Math.floor(Math.random() * completedTickets.length);
  const winningTicket = completedTickets[randomIndex];
  
  this.winner = {
    ticket: winningTicket.number,
    user: winningTicket.buyer,
    drawnAt: new Date(),
    claimed: false
  };
  
  this.status = 'drawn';
  this.drawDate = new Date();
  
  return this.winner;
};

module.exports = mongoose.model('Raffle', raffleSchema);