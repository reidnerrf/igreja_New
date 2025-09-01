const mongoose = require('mongoose');

const recurringDonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DonationCampaign',
    default: null
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  currency: {
    type: String,
    default: 'BRL'
  },
  frequency: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  nextDonationDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null
  },
  maxDonations: {
    type: Number,
    default: null
  },
  currentDonationCount: {
    type: Number,
    default: 0
  },
  paymentMethod: {
    type: String,
    enum: ['pix', 'card', 'bank_transfer'],
    required: true
  },
  paymentDetails: {
    pixKey: String,
    cardLast4: String,
    cardBrand: String,
    bankAccount: String,
    bankCode: String
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled', 'completed', 'failed'],
    default: 'active'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    maxlength: 500
  },
  metadata: {
    source: String,
    referrer: String,
    device: String,
    ipAddress: String
  },
  lastDonationDate: {
    type: Date,
    default: null
  },
  totalDonated: {
    type: Number,
    default: 0
  },
  failedAttempts: {
    type: Number,
    default: 0
  },
  lastFailureDate: {
    type: Date,
    default: null
  },
  failureReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Índices
recurringDonationSchema.index({ donor: 1, status: 1 });
recurringDonationSchema.index({ church: 1, status: 1 });
recurringDonationSchema.index({ nextDonationDate: 1, status: 1 });
recurringDonationSchema.index({ status: 1, nextDonationDate: 1 });

// Middleware para calcular próxima data de doação
recurringDonationSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('frequency') || this.isModified('startDate')) {
    this.calculateNextDonationDate();
  }
  next();
});

// Método para calcular próxima data de doação
recurringDonationSchema.methods.calculateNextDonationDate = function() {
  const startDate = this.startDate || new Date();
  let nextDate = new Date(startDate);
  
  switch (this.frequency) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'biweekly':
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }
  
  this.nextDonationDate = nextDate;
};

// Método para processar próxima doação
recurringDonationSchema.methods.processNextDonation = async function() {
  try {
    // Verificar se deve parar
    if (this.status !== 'active') {
      return { success: false, reason: 'Recurring donation not active' };
    }
    
    if (this.endDate && new Date() > this.endDate) {
      this.status = 'completed';
      await this.save();
      return { success: false, reason: 'End date reached' };
    }
    
    if (this.maxDonations && this.currentDonationCount >= this.maxDonations) {
      this.status = 'completed';
      await this.save();
      return { success: false, reason: 'Max donations reached' };
    }
    
    // Criar doação
    const Donation = mongoose.model('Donation');
    const donation = new Donation({
      donor: this.donor,
      church: this.church,
      campaign: this.campaign,
      amount: this.amount,
      paymentMethod: this.paymentMethod,
      isAnonymous: this.isAnonymous,
      message: this.message,
      source: 'recurring',
      recurringDonationId: this._id
    });
    
    await donation.save();
    
    // Atualizar estatísticas
    this.currentDonationCount += 1;
    this.totalDonated += this.amount;
    this.lastDonationDate = new Date();
    this.failedAttempts = 0;
    this.failureReason = null;
    
    // Calcular próxima data
    this.calculateNextDonationDate();
    
    await this.save();
    
    return { 
      success: true, 
      donation: donation._id,
      nextDonationDate: this.nextDonationDate
    };
    
  } catch (error) {
    console.error('Erro ao processar doação recorrente:', error);
    
    // Incrementar tentativas falhadas
    this.failedAttempts += 1;
    this.lastFailureDate = new Date();
    this.failureReason = error.message;
    
    // Pausar se muitas falhas
    if (this.failedAttempts >= 3) {
      this.status = 'failed';
    }
    
    await this.save();
    
    return { success: false, reason: error.message };
  }
};

// Método para pausar doação recorrente
recurringDonationSchema.methods.pause = function() {
  this.status = 'paused';
  return this.save();
};

// Método para retomar doação recorrente
recurringDonationSchema.methods.resume = function() {
  this.status = 'active';
  this.failedAttempts = 0;
  this.failureReason = null;
  return this.save();
};

// Método para cancelar doação recorrente
recurringDonationSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

// Método para obter estatísticas
recurringDonationSchema.methods.getStats = function() {
  return {
    totalDonated: this.totalDonated,
    currentDonationCount: this.currentDonationCount,
    averageDonation: this.currentDonationCount > 0 ? this.totalDonated / this.currentDonationCount : 0,
    daysActive: Math.floor((new Date() - this.startDate) / (1000 * 60 * 60 * 24)),
    nextDonationDate: this.nextDonationDate,
    estimatedMonthly: this.getEstimatedMonthlyAmount()
  };
};

// Método para calcular valor mensal estimado
recurringDonationSchema.methods.getEstimatedMonthlyAmount = function() {
  switch (this.frequency) {
    case 'weekly':
      return this.amount * 4.33; // Média de semanas por mês
    case 'biweekly':
      return this.amount * 2.17; // Média de quinzenas por mês
    case 'monthly':
      return this.amount;
    case 'quarterly':
      return this.amount / 3;
    case 'yearly':
      return this.amount / 12;
    default:
      return this.amount;
  }
};

module.exports = mongoose.model('RecurringDonation', recurringDonationSchema);