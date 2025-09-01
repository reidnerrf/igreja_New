const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Church or other user
    required: true
  },
  type: {
    type: String,
    enum: ['follow', 'rsvp', 'donate', 'pray', 'view', 'share'],
    required: true
  },
  weight: {
    type: Number,
    default: 1,
    min: 0,
    max: 5
  },
  metadata: {
    eventId: mongoose.Schema.Types.ObjectId,
    donationAmount: Number,
    prayerId: mongoose.Schema.Types.ObjectId,
    // Additional context
  }
}, {
  timestamps: true
});

// Índices para consultas eficientes
interactionSchema.index({ user: 1, type: 1, createdAt: -1 });
interactionSchema.index({ target: 1, type: 1 });
interactionSchema.index({ user: 1, target: 1, type: 1 });

module.exports = mongoose.model('Interaction', interactionSchema);
