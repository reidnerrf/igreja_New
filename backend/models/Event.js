const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
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
  category: {
    type: String,
    enum: ['missa', 'novena', 'festa', 'retiro', 'catequese', 'jovens', 'estudo', 'culto', 'outros'],
    default: 'outros'
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    address: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: null
    }
  },
  maxAttendees: {
    type: Number,
    default: null
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    confirmedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['confirmed', 'maybe', 'declined'],
      default: 'confirmed'
    }
  }],
  images: [String],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: null
    },
    interval: {
      type: Number,
      default: 1
    },
    endDate: {
      type: Date,
      default: null
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'published'
  },
  isPremiumFeature: {
    type: Boolean,
    default: false
  },
  tags: [String],
  
  // Estatísticas
  stats: {
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Índices
eventSchema.index({ church: 1, date: 1 });
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ 'location.coordinates': '2dsphere' });

// Middleware para validar data
eventSchema.pre('save', function(next) {
  if (this.date < new Date() && this.isNew) {
    return next(new Error('Não é possível criar evento com data passada'));
  }
  next();
});

// Método para verificar se usuário confirmou presença
eventSchema.methods.isUserAttending = function(userId) {
  return this.attendees.some(attendee => 
    attendee.user.toString() === userId.toString() && 
    attendee.status === 'confirmed'
  );
};

// Método para obter contagem de participantes
eventSchema.methods.getAttendeesCount = function() {
  return this.attendees.filter(attendee => attendee.status === 'confirmed').length;
};

module.exports = mongoose.model('Event', eventSchema);