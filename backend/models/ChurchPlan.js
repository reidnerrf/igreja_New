const mongoose = require('mongoose');

const churchPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Gratuito', 'Pro', 'Enterprise'],
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
    // Perfil e Agenda
    basicProfile: { type: Boolean, default: true },
    advancedProfile: { type: Boolean, default: false },
    eventManagement: { type: Boolean, default: true },
    advancedScheduling: { type: Boolean, default: false },

    // Transmissões
    liveStreaming: { type: Boolean, default: false },
    streamingIntegration: { type: Boolean, default: false },
    multiPlatformStreaming: { type: Boolean, default: false },

    // Dados e Analytics
    basicAnalytics: { type: Boolean, default: true },
    advancedAnalytics: { type: Boolean, default: false },
    customReports: { type: Boolean, default: false },

    // Suporte
    basicSupport: { type: Boolean, default: true },
    prioritySupport: { type: Boolean, default: false },
    dedicatedSupport: { type: Boolean, default: false },

    // Multi-paróquias/Diocese
    multipleParishes: { type: Boolean, default: false },
    dioceseManagement: { type: Boolean, default: false },
    centralizedControl: { type: Boolean, default: false },

    // Limites
    maxEvents: { type: Number, default: 10 },
    maxUsers: { type: Number, default: 100 },
    maxParishes: { type: Number, default: 1 },
    storageLimit: { type: Number, default: 1 }, // GB

    // Recursos Especiais
    apiAccess: { type: Boolean, default: false },
    customIntegrations: { type: Boolean, default: false },
    whiteLabel: { type: Boolean, default: false }
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
churchPlanSchema.index({ slug: 1 });
churchPlanSchema.index({ order: 1 });
churchPlanSchema.index({ isActive: 1 });

// Middleware para atualizar updatedAt
churchPlanSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método para verificar se um plano tem uma feature
churchPlanSchema.methods.hasFeature = function(feature) {
  return this.features[feature] === true;
};

// Método para obter limites do plano
churchPlanSchema.methods.getLimits = function() {
  return {
    maxEvents: this.features.maxEvents,
    maxUsers: this.features.maxUsers,
    maxParishes: this.features.maxParishes,
    storageLimit: this.features.storageLimit
  };
};

// Método estático para obter plano por slug
churchPlanSchema.statics.getBySlug = function(slug) {
  return this.findOne({ slug, isActive: true });
};

// Método estático para obter planos ativos ordenados
churchPlanSchema.statics.getActivePlans = function() {
  return this.find({ isActive: true }).sort({ order: 1 });
};

module.exports = mongoose.model('ChurchPlan', churchPlanSchema);
