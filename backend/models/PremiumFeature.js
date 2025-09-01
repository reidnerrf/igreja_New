const mongoose = require('mongoose');

const premiumFeatureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: ['content', 'history', 'offline', 'ads', 'support', 'other'],
    required: true
  },

  price: {
    monthly: {
      type: Number,
      required: true,
      min: 0
    },
    yearly: {
      type: Number,
      required: true,
      min: 0
    }
  },

  features: {
    // Conteúdos exclusivos
    exclusiveContent: { type: Boolean, default: false },
    premiumSermons: { type: Boolean, default: false },
    devotionalPlans: { type: Boolean, default: false },

    // Histórico avançado
    advancedHistory: { type: Boolean, default: false },
    unlimitedHistory: { type: Boolean, default: false },
    exportHistory: { type: Boolean, default: false },

    // Offline
    offlineMode: { type: Boolean, default: false },
    downloadContent: { type: Boolean, default: false },
    offlinePrayers: { type: Boolean, default: false },

    // Sem anúncios
    adFree: { type: Boolean, default: false },
    premiumUI: { type: Boolean, default: false },

    // Suporte
    prioritySupport: { type: Boolean, default: false },
    directSupport: { type: Boolean, default: false },

    // Outros
    earlyAccess: { type: Boolean, default: false },
    betaFeatures: { type: Boolean, default: false }
  },

  isActive: {
    type: Boolean,
    default: true
  },

  isPopular: {
    type: Boolean,
    default: false
  },

  order: {
    type: Number,
    default: 0
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
premiumFeatureSchema.index({ slug: 1 });
premiumFeatureSchema.index({ category: 1 });
premiumFeatureSchema.index({ order: 1 });
premiumFeatureSchema.index({ isActive: 1 });

// Middleware para atualizar updatedAt
premiumFeatureSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método para verificar se tem uma feature específica
premiumFeatureSchema.methods.hasFeature = function(feature) {
  return this.features[feature] === true;
};

// Método estático para obter features por categoria
premiumFeatureSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ order: 1 });
};

// Método estático para obter feature por slug
premiumFeatureSchema.statics.getBySlug = function(slug) {
  return this.findOne({ slug, isActive: true });
};

// Método estático para obter todas as features ativas
premiumFeatureSchema.statics.getActiveFeatures = function() {
  return this.find({ isActive: true }).sort({ order: 1 });
};

module.exports = mongoose.model('PremiumFeature', premiumFeatureSchema);
