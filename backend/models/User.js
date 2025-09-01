const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.socialLogin;
    }
  },
  userType: {
    type: String,
    enum: ['church', 'user'],
    required: true
  },
  profileImage: {
    type: String,
    default: null
  },
  // Sistema Premium para Usuários
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiresAt: {
    type: Date,
    default: null
  },
  premiumFeatures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PremiumFeature'
  }],
  premiumSubscription: {
    plan: String,
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly']
    },
    autoRenew: { type: Boolean, default: true },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'paypal', 'bank_transfer']
    }
  },

  // Sistema de Planos para Igrejas
  churchSubscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChurchSubscription',
    default: null
  },
  churchPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChurchPlan',
    default: null
  },
  
  // Dados específicos do usuário
  city: {
    type: String,
    default: null
  },
  denomination: {
    type: String,
    default: null
  },
  ministry: {
    type: String,
    default: null
  },
  
  // Dados específicos da igreja
  churchData: {
    address: String,
    phone: String,
    pixKey: String,
    instagram: String,
    website: String,
    description: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      }
    }
  },
  
  // Configurações
  notificationSettings: {
    events: { type: Boolean, default: true },
    prayers: { type: Boolean, default: true },
    donations: { type: Boolean, default: true },
    announcements: { type: Boolean, default: true },
    dailyDevotional: { type: Boolean, default: true },
    devotionalTime: {
      hour: { type: Number, default: 7 },
      minute: { type: Number, default: 0 }
    }
  },
  
  // Gamificação
  gamification: {
    points: { type: Number, default: 0 },
    badges: [
      {
        id: { type: String },
        name: { type: String },
        icon: { type: String, default: null },
        earnedAt: { type: Date, default: Date.now }
      }
    ],
    history: [
      {
        type: { type: String }, // e.g., "event_attendance", "donation", "share"
        points: { type: Number, default: 0 },
        context: { type: String, default: null },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },

  // Social login
  socialLogin: {
    provider: {
      type: String,
      enum: ['google', 'facebook', 'apple'],
      default: null
    },
    providerId: {
      type: String,
      default: null
    }
  },
  
  // Push notification token
  expoPushToken: {
    type: String,
    default: null
  },
  
  // Igrejas seguidas (apenas para usuários)
  followedChurches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Seguidores (apenas para igrejas)
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Estatísticas
  stats: {
    totalDonations: { type: Number, default: 0 },
    totalEvents: { type: Number, default: 0 },
    totalPosts: { type: Number, default: 0 },
    totalPrayers: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Índices
userSchema.index({ email: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ 'churchData.location': '2dsphere' });
userSchema.index({ followedChurches: 1 });

// Middleware para hash da senha
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senha
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para verificar se é premium
userSchema.methods.isPremiumActive = function() {
  return this.isPremium && (!this.premiumExpiresAt || this.premiumExpiresAt > new Date());
};

// Método para obter dados públicos
userSchema.methods.getPublicData = function() {
  const user = this.toObject();
  delete user.password;
  delete user.expoPushToken;
  return user;
};

module.exports = mongoose.model('User', userSchema);