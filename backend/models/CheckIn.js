const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkInTime: {
    type: Date,
    default: Date.now
  },
  checkOutTime: {
    type: Date,
    default: null
  },
  method: {
    type: String,
    enum: ['qr', 'manual', 'gps'],
    default: 'qr'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: null
    },
    accuracy: Number,
    address: String
  },
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    badge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge'
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    device: String,
    appVersion: String,
    platform: String
  },
  status: {
    type: String,
    enum: ['checked_in', 'checked_out', 'cancelled'],
    default: 'checked_in'
  }
}, {
  timestamps: true
});

// Índices
checkInSchema.index({ user: 1, event: 1 }, { unique: true });
checkInSchema.index({ event: 1, checkInTime: -1 });
checkInSchema.index({ church: 1, checkInTime: -1 });
checkInSchema.index({ 'location.coordinates': '2dsphere' });

// Middleware para calcular pontos e badges
checkInSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Calcular pontos base
      this.points = 5; // Pontos base por check-in
      
      // Verificar se é o primeiro check-in do usuário
      const totalCheckIns = await mongoose.model('CheckIn').countDocuments({
        user: this.user
      });
      
      if (totalCheckIns === 0) {
        this.points += 10; // Bônus para primeiro check-in
      }
      
      // Verificar se é o primeiro check-in no evento
      const eventCheckIns = await mongoose.model('CheckIn').countDocuments({
        event: this.event
      });
      
      if (eventCheckIns === 0) {
        this.points += 5; // Bônus para primeiro check-in no evento
      }
      
      // Verificar se é o primeiro check-in na igreja
      const churchCheckIns = await mongoose.model('CheckIn').countDocuments({
        user: this.user,
        church: this.church
      });
      
      if (churchCheckIns === 0) {
        this.points += 15; // Bônus para primeiro check-in na igreja
      }
      
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Método para fazer check-out
checkInSchema.methods.checkOut = function() {
  this.checkOutTime = new Date();
  this.status = 'checked_out';
  
  // Adicionar pontos por tempo de permanência
  if (this.checkInTime && this.checkOutTime) {
    const duration = this.checkOutTime - this.checkInTime;
    const hours = duration / (1000 * 60 * 60);
    
    if (hours >= 1) {
      this.points += Math.floor(hours) * 2; // 2 pontos por hora
    }
  }
  
  return this.save();
};

// Método para calcular tempo de permanência
checkInSchema.methods.getDuration = function() {
  const endTime = this.checkOutTime || new Date();
  return endTime - this.checkInTime;
};

// Método para verificar se ainda está no evento
checkInSchema.methods.isActive = function() {
  return this.status === 'checked_in';
};

module.exports = mongoose.model('CheckIn', checkInSchema);