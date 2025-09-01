const mongoose = require('mongoose');

const prayerSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  category: {
    type: String,
    enum: ['personal', 'family', 'health', 'work', 'gratitude', 'community'],
    default: 'personal'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'in_prayer', 'answered', 'rejected'],
    default: 'pending'
  },
  
  // Moderação (para igrejas)
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  moderatedAt: {
    type: Date,
    default: null
  },
  moderationNote: {
    type: String,
    default: null
  },
  
  // Interações
  prayers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    prayedAt: {
      type: Date,
      default: Date.now
    },
    message: {
      type: String,
      default: null
    }
  }],
  
  // Resposta/Testemunho
  testimony: {
    content: String,
    createdAt: Date,
    isPublic: { type: Boolean, default: false }
  },
  
  // Configurações de privacidade
  visibility: {
    type: String,
    enum: ['public', 'church_only', 'private'],
    default: 'church_only'
  },
  
  // Tags
  tags: [String]
}, {
  timestamps: true
});

// Índices
prayerSchema.index({ author: 1, createdAt: -1 });
prayerSchema.index({ church: 1, status: 1, createdAt: -1 });
prayerSchema.index({ category: 1, status: 1 });
prayerSchema.index({ isUrgent: 1, status: 1 });

// Método para contar orações
prayerSchema.methods.getPrayersCount = function() {
  return this.prayers.length;
};

// Método para verificar se usuário já orou
prayerSchema.methods.hasUserPrayed = function(userId) {
  return this.prayers.some(prayer => prayer.user.toString() === userId.toString());
};

module.exports = mongoose.model('Prayer', prayerSchema);