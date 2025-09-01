const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  type: {
    type: String,
    enum: [
      'event_reminder',
      'donation_received',
      'donation_confirmation',
      'badge_earned',
      'checkin_success',
      'post_like',
      'post_comment',
      'event_update',
      'campaign_update',
      'system_alert',
      'welcome',
      'achievement'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived', 'deleted'],
    default: 'unread'
  },
  readAt: {
    type: Date,
    default: null
  },
  archivedAt: {
    type: Date,
    default: null
  },
  scheduledFor: {
    type: Date,
    default: null
  },
  sentAt: {
    type: Date,
    default: null
  },
  deliveryMethod: {
    push: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    },
    inApp: {
      type: Boolean,
      default: true
    }
  },
  deliveryStatus: {
    push: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String
    },
    email: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String
    },
    sms: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      error: String
    }
  },
  category: {
    type: String,
    enum: [
      'social',
      'financial',
      'events',
      'achievements',
      'system',
      'marketing'
    ],
    default: 'social'
  },
  expiresAt: {
    type: Date,
    default: null
  },
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String,
    default: null
  },
  actionText: {
    type: String,
    default: null
  },
  metadata: {
    source: String,
    campaign: String,
    device: String,
    platform: String,
    appVersion: String
  }
}, {
  timestamps: true
});

// Índices
notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1 });
notificationSchema.index({ recipient: 1, category: 1 });
notificationSchema.index({ scheduledFor: 1, status: 1 });
notificationSchema.index({ expiresAt: 1, status: 1 });
notificationSchema.index({ 'deliveryStatus.push.sent': 1, createdAt: -1 });

// Middleware para verificar expiração
notificationSchema.pre('find', function() {
  this.where({ 
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  });
});

// Método para marcar como lida
notificationSchema.methods.markAsRead = function() {
  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};

// Método para arquivar
notificationSchema.methods.archive = function() {
  this.status = 'archived';
  this.archivedAt = new Date();
  return this.save();
};

// Método para deletar
notificationSchema.methods.deleteNotification = function() {
  this.status = 'deleted';
  return this.save();
};

// Método para verificar se expirou
notificationSchema.methods.isExpired = function() {
  return this.expiresAt && new Date() > this.expiresAt;
};

// Método para verificar se pode ser enviada
notificationSchema.methods.canBeSent = function() {
  return this.status === 'unread' && 
         !this.isExpired() && 
         (!this.scheduledFor || new Date() >= this.scheduledFor);
};

// Método para obter dados de template
notificationSchema.methods.getTemplateData = function() {
  const baseData = {
    title: this.title,
    message: this.message,
    type: this.type,
    category: this.category,
    priority: this.priority,
    actionRequired: this.actionRequired,
    actionUrl: this.actionUrl,
    actionText: this.actionText
  };
  
  // Adicionar dados específicos do tipo
  switch (this.type) {
    case 'event_reminder':
      return {
        ...baseData,
        eventId: this.data.get('eventId'),
        eventTitle: this.data.get('eventTitle'),
        eventDate: this.data.get('eventDate'),
        eventTime: this.data.get('eventTime')
      };
    
    case 'donation_received':
      return {
        ...baseData,
        donationId: this.data.get('donationId'),
        amount: this.data.get('amount'),
        donorName: this.data.get('donorName'),
        campaignTitle: this.data.get('campaignTitle')
      };
    
    case 'badge_earned':
      return {
        ...baseData,
        badgeId: this.data.get('badgeId'),
        badgeName: this.data.get('badgeName'),
        badgeIcon: this.data.get('badgeIcon'),
        points: this.data.get('points')
      };
    
    case 'checkin_success':
      return {
        ...baseData,
        eventId: this.data.get('eventId'),
        eventTitle: this.data.get('eventTitle'),
        points: this.data.get('points'),
        badges: this.data.get('badges')
      };
    
    default:
      return baseData;
  }
};

// Método estático para criar notificação
notificationSchema.statics.createNotification = async function(data) {
  try {
    const notification = new this(data);
    
    // Definir expiração padrão baseada no tipo
    if (!notification.expiresAt) {
      switch (notification.type) {
        case 'event_reminder':
          notification.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
          break;
        case 'donation_confirmation':
          notification.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias
          break;
        case 'badge_earned':
          notification.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias
          break;
        default:
          notification.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias
      }
    }
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    throw error;
  }
};

// Método estático para criar notificação em lote
notificationSchema.statics.createBatchNotifications = async function(notificationsData) {
  try {
    const notifications = notificationsData.map(data => {
      const notification = new this(data);
      
      // Definir expiração padrão
      if (!notification.expiresAt) {
        notification.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      }
      
      return notification;
    });
    
    const savedNotifications = await this.insertMany(notifications);
    return savedNotifications;
  } catch (error) {
    console.error('Erro ao criar notificações em lote:', error);
    throw error;
  }
};

// Método estático para limpar notificações antigas
notificationSchema.statics.cleanupOldNotifications = async function(daysOld = 90) {
  try {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    
    const result = await this.updateMany(
      {
        createdAt: { $lt: cutoffDate },
        status: { $in: ['read', 'archived'] }
      },
      {
        status: 'deleted'
      }
    );
    
    return result;
  } catch (error) {
    console.error('Erro ao limpar notificações antigas:', error);
    throw error;
  }
};

// Método estático para obter estatísticas
notificationSchema.statics.getStats = async function(userId) {
  try {
    const stats = await this.aggregate([
      { $match: { recipient: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const total = await this.countDocuments({ recipient: userId });
    const unread = await this.countDocuments({ 
      recipient: userId, 
      status: 'unread' 
    });
    
    return {
      total,
      unread,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    throw error;
  }
};

module.exports = mongoose.model('Notification', notificationSchema);

