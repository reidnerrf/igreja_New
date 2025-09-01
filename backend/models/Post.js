const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video'],
    default: 'text'
  },
  images: [String],
  video: {
    url: String,
    thumbnail: String,
    duration: Number
  },
  
  // Para posts de usuários marcando eventos
  eventTag: {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null
    },
    church: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  
  // Interações
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  shares: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Configurações
  isPublic: {
    type: Boolean,
    default: true
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  
  // Moderação (para igrejas)
  isModerated: {
    type: Boolean,
    default: false
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  moderatedAt: {
    type: Date,
    default: null
  },
  
  // Tags e categorias
  tags: [String],
  category: {
    type: String,
    enum: ['announcement', 'event', 'prayer', 'testimony', 'general'],
    default: 'general'
  },
  
  // Estatísticas
  stats: {
    views: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 } // likes + comments + shares
  }
}, {
  timestamps: true
});

// Índices
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ 'eventTag.church': 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

// Middleware para calcular engagement
postSchema.pre('save', function(next) {
  this.stats.engagement = this.likes.length + this.comments.length + this.shares.length;
  next();
});

// Método para verificar se usuário curtiu
postSchema.methods.isLikedByUser = function(userId) {
  return this.likes.some(like => like.user.toString() === userId.toString());
};

// Método para obter contadores
postSchema.methods.getCounts = function() {
  return {
    likes: this.likes.length,
    comments: this.comments.length,
    shares: this.shares.length,
    views: this.stats.views
  };
};

module.exports = mongoose.model('Post', postSchema);