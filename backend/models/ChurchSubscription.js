const mongoose = require('mongoose');

const churchSubscriptionSchema = new mongoose.Schema({
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChurchPlan',
    required: true
  },

  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'suspended', 'trial'],
    default: 'trial'
  },

  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true
  },

  currentPeriodStart: {
    type: Date,
    required: true
  },

  currentPeriodEnd: {
    type: Date,
    required: true
  },

  trialEnd: {
    type: Date
  },

  cancelAtPeriodEnd: {
    type: Boolean,
    default: false
  },

  cancelledAt: {
    type: Date
  },

  // Dados de cobrança
  paymentMethod: {
    type: {
      type: String,
      enum: ['credit_card', 'bank_transfer', 'paypal', 'other']
    },
    provider: String,
    last4: String,
    expiryMonth: Number,
    expiryYear: Number
  },

  // Histórico de faturamento
  billingHistory: [{
    amount: Number,
    currency: { type: String, default: 'BRL' },
    status: {
      type: String,
      enum: ['paid', 'pending', 'failed', 'refunded']
    },
    invoiceId: String,
    paidAt: Date,
    dueDate: Date,
    periodStart: Date,
    periodEnd: Date
  }],

  // Metadados
  metadata: {
    type: Map,
    of: String
  },

  // Limites atuais (cache do plano)
  limits: {
    maxEvents: { type: Number, default: 10 },
    maxUsers: { type: Number, default: 100 },
    maxParishes: { type: Number, default: 1 },
    storageLimit: { type: Number, default: 1 } // GB
  },

  // Uso atual
  usage: {
    eventsCount: { type: Number, default: 0 },
    usersCount: { type: Number, default: 0 },
    parishesCount: { type: Number, default: 0 },
    storageUsed: { type: Number, default: 0 }, // GB
    lastUpdated: { type: Date, default: Date.now }
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Índices
churchSubscriptionSchema.index({ church: 1 });
churchSubscriptionSchema.index({ plan: 1 });
churchSubscriptionSchema.index({ status: 1 });
churchSubscriptionSchema.index({ currentPeriodEnd: 1 });
churchSubscriptionSchema.index({ 'usage.lastUpdated': 1 });

// Middleware para atualizar updatedAt
churchSubscriptionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método para verificar se está ativo
churchSubscriptionSchema.methods.isActive = function() {
  return this.status === 'active' || (this.status === 'trial' && new Date() < this.trialEnd);
};

// Método para verificar se pode usar um recurso
churchSubscriptionSchema.methods.canUseFeature = function(feature) {
  if (!this.isActive()) return false;

  // Verificar limites
  switch (feature) {
    case 'createEvent':
      return this.usage.eventsCount < this.limits.maxEvents;
    case 'addUser':
      return this.usage.usersCount < this.limits.maxUsers;
    case 'addParish':
      return this.usage.parishesCount < this.limits.maxParishes;
    case 'uploadFile':
      return this.usage.storageUsed < this.limits.storageLimit;
    default:
      return true;
  }
};

// Método para incrementar uso
churchSubscriptionSchema.methods.incrementUsage = function(feature, amount = 1) {
  switch (feature) {
    case 'events':
      this.usage.eventsCount += amount;
      break;
    case 'users':
      this.usage.usersCount += amount;
      break;
    case 'parishes':
      this.usage.parishesCount += amount;
      break;
    case 'storage':
      this.usage.storageUsed += amount;
      break;
  }
  this.usage.lastUpdated = new Date();
  return this.save();
};

// Método para renovar período
churchSubscriptionSchema.methods.renewPeriod = function() {
  const now = new Date();
  this.currentPeriodStart = now;

  if (this.billingCycle === 'monthly') {
    this.currentPeriodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  } else {
    this.currentPeriodEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  }

  return this.save();
};

// Método para cancelar
churchSubscriptionSchema.methods.cancel = function(immediate = false) {
  if (immediate) {
    this.status = 'cancelled';
    this.cancelledAt = new Date();
  } else {
    this.cancelAtPeriodEnd = true;
  }
  return this.save();
};

// Método estático para encontrar assinaturas ativas
churchSubscriptionSchema.statics.getActiveSubscriptions = function() {
  return this.find({
    status: { $in: ['active', 'trial'] },
    $or: [
      { trialEnd: { $exists: false } },
      { trialEnd: { $gt: new Date() } }
    ]
  }).populate('church plan');
};

// Método estático para verificar assinatura de uma igreja
churchSubscriptionSchema.statics.getChurchSubscription = function(churchId) {
  return this.findOne({
    church: churchId,
    status: { $in: ['active', 'trial'] }
  }).populate('plan');
};

module.exports = mongoose.model('ChurchSubscription', churchSubscriptionSchema);
