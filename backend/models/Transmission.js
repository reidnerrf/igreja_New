const mongoose = require('mongoose');

const transmissionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  church: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, enum: ['youtube', 'facebook', 'instagram', 'tiktok', 'native'], default: 'youtube' },
  url: { type: String, default: null },
  thumbnail: { type: String, default: null },
  isLive: { type: Boolean, default: false },
  viewers: { type: Number, default: 0 },
  duration: { type: String, default: null },
  scheduledAt: { type: Date, default: null }
}, {
  timestamps: true
});

transmissionSchema.index({ church: 1, createdAt: -1 });
transmissionSchema.index({ platform: 1, createdAt: -1 });

module.exports = mongoose.model('Transmission', transmissionSchema);

