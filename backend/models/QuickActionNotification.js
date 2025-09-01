/**
 * Modelo de Notificação com Ações Rápidas
 * ConnectFé - Sistema de Notificações Avançado
 */

const mongoose = require('mongoose');

const quickActionNotificationSchema = new mongoose.Schema({
    // Usuário destinatário
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Informações básicas da notificação
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    
    // Tipo de notificação
    type: {
        type: String,
        enum: [
            'event_reminder',      // Lembrete de evento
            'prayer_request',      // Pedido de oração
            'donation_reminder',   // Lembrete de doação
            'community_update',    // Atualização da comunidade
            'achievement',         // Conquista/achievement
            'streak_reminder',     // Lembrete de streak
            'quest_update',        // Atualização de quest
            'badge_earned',        // Badge conquistado
            'event_checkin',       // Check-in em evento
            'mass_reminder',       // Lembrete de missa
            'confession_reminder', // Lembrete de confissão
            'rosary_reminder',     // Lembrete do terço
            'bible_study',         // Estudo bíblico
            'charity_opportunity', // Oportunidade de caridade
            'community_event',     // Evento da comunidade
            'spiritual_guidance',  // Orientação espiritual
            'system_update',       // Atualização do sistema
            'maintenance',         // Manutenção
            'security_alert',      // Alerta de segurança
            'custom'               // Notificação customizada
        ],
        required: true
    },
    
    // Categoria para organização
    category: {
        type: String,
        enum: [
            'spiritual',      // Espiritual/religioso
            'community',      // Comunidade
            'events',         // Eventos
            'achievements',   // Conquistas
            'reminders',      // Lembretes
            'system',         // Sistema
            'security',       // Segurança
            'charity',        // Caridade
            'prayer',         // Oração
            'worship',         // Adoração
            'learning',        // Aprendizado
            'social'          // Social
        ],
        required: true
    },
    
    // Prioridade da notificação
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    
    // Status da notificação
    status: {
        type: String,
        enum: ['unread', 'read', 'actioned', 'dismissed', 'expired'],
        default: 'unread'
    },
    
    // Ações rápidas disponíveis
    quickActions: [{
        type: {
            type: String,
            enum: [
                'confirm_presence',    // Confirmar presença
                'donate',              // Doar
                'pray',                // Orar
                'join_event',          // Participar do evento
                'share',               // Compartilhar
                'save',                // Salvar
                'remind_later',        // Lembrar depois
                'dismiss',             // Dispensar
                'view_details',        // Ver detalhes
                'respond',             // Responder
                'accept',              // Aceitar
                'decline',             // Recusar
                'mark_complete',       // Marcar como completo
                'add_calendar',        // Adicionar ao calendário
                'set_reminder',        // Definir lembrete
                'contact',             // Entrar em contato
                'volunteer',           // Voluntariar-se
                'learn_more',          // Saber mais
                'custom'               // Ação customizada
            ],
            required: true
        },
        label: {
            type: String,
            required: true,
            maxlength: 50
        },
        icon: {
            type: String,
            default: '📱'
        },
        color: {
            type: String,
            default: '#1976D2',
            validate: {
                validator: function(v) {
                    return /^#[0-9A-F]{6}$/i.test(v);
                },
                message: 'Cor deve estar no formato hexadecimal (#RRGGBB)'
            }
        },
        action: {
            type: String,
            required: true,
            maxlength: 200
        },
        requiresConfirmation: {
            type: Boolean,
            default: false
        },
        confirmationMessage: {
            type: String,
            maxlength: 200
        },
        isEnabled: {
            type: Boolean,
            default: true
        }
    }],
    
    // Dados relacionados à notificação
    relatedData: {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        },
        prayerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prayer'
        },
        donationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donation'
        },
        questId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quest'
        },
        badgeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Badge'
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        customData: {
            type: mongoose.Schema.Types.Mixed
        }
    },
    
    // Configurações de entrega
    delivery: {
        method: {
            type: String,
            enum: ['in_app', 'push', 'email', 'sms', 'all'],
            default: 'in_app'
        },
        scheduledFor: {
            type: Date
        },
        expiresAt: {
            type: Date
        },
        retryCount: {
            type: Number,
            default: 0,
            min: 0
        },
        maxRetries: {
            type: Number,
            default: 3,
            min: 0
        },
        lastAttempt: {
            type: Date
        },
        nextAttempt: {
            type: Date
        }
    },
    
    // Configurações de interação
    interaction: {
        requiresResponse: {
            type: Boolean,
            default: false
        },
        responseDeadline: {
            type: Date
        },
        allowDismiss: {
            type: Boolean,
            default: true
        },
        allowSnooze: {
            type: Boolean,
            default: true
        },
        snoozeOptions: [{
            label: String,
            value: Number, // em minutos
            icon: String
        }],
        autoExpire: {
            type: Boolean,
            default: true
        },
        expireAfter: {
            type: Number, // em minutos
            default: 1440 // 24 horas
        }
    },
    
    // Configurações de personalização
    personalization: {
        showUserAvatar: {
            type: Boolean,
            default: true
        },
        showTimestamp: {
            type: Boolean,
            default: true
        },
        showPriority: {
            type: Boolean,
            default: true
        },
        showCategory: {
            type: Boolean,
            default: true
        },
        customStyle: {
            backgroundColor: String,
            textColor: String,
            borderColor: String,
            iconColor: String
        }
    },
    
    // Configurações de agrupamento
    grouping: {
        groupKey: {
            type: String,
            trim: true
        },
        groupTitle: {
            type: String,
            trim: true
        },
        groupCount: {
            type: Number,
            default: 1
        },
        isGrouped: {
            type: Boolean,
            default: false
        }
    },
    
    // Configurações de localização
    localization: {
        language: {
            type: String,
            default: 'pt-BR'
        },
        timezone: {
            type: String,
            default: 'America/Sao_Paulo'
        },
        translations: [{
            language: String,
            title: String,
            message: String,
            quickActions: [{
                type: String,
                label: String,
                action: String
            }]
        }]
    },
    
    // Configurações de acessibilidade
    accessibility: {
        screenReaderText: {
            type: String,
            maxlength: 500
        },
        highContrast: {
            type: Boolean,
            default: false
        },
        largeText: {
            type: Boolean,
            default: false
        },
        reducedMotion: {
            type: Boolean,
            default: false
        }
    },
    
    // Estatísticas e métricas
    metrics: {
        sentAt: {
            type: Date,
            default: Date.now
        },
        readAt: {
            type: Date
        },
        actionedAt: {
            type: Date
        },
        dismissedAt: {
            type: Date
        },
        timeToRead: {
            type: Number // em segundos
        },
        timeToAction: {
            type: Number // em segundos
        },
        interactionCount: {
            type: Number,
            default: 0
        },
        actionCount: {
            type: Number,
            default: 0
        }
    },
    
    // Configurações de moderação
    moderation: {
        isModerated: {
            type: Boolean,
            default: false
        },
        moderatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        moderationStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'flagged'],
            default: 'pending'
        },
        moderationNotes: {
            type: String,
            maxlength: 1000
        },
        flaggedBy: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            reason: String,
            flaggedAt: {
                type: Date,
                default: Date.now
            }
        }]
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices para performance
quickActionNotificationSchema.index({ userId: 1, status: 1, createdAt: -1 });
quickActionNotificationSchema.index({ type: 1, category: 1, priority: 1 });
quickActionNotificationSchema.index({ 'delivery.scheduledFor': 1, 'delivery.expiresAt': 1 });
quickActionNotificationSchema.index({ 'grouping.groupKey': 1 });
quickActionNotificationSchema.index({ 'relatedData.eventId': 1 });
quickActionNotificationSchema.index({ 'relatedData.postId': 1 });

// Virtual para verificar se a notificação está ativa
quickActionNotificationSchema.virtual('isActive').get(function() {
    const now = new Date();
    
    if (this.status === 'expired' || this.status === 'dismissed') {
        return false;
    }
    
    if (this.delivery.expiresAt && now > this.delivery.expiresAt) {
        return false;
    }
    
    if (this.interaction.responseDeadline && now > this.interaction.responseDeadline) {
        return false;
    }
    
    return true;
});

// Virtual para verificar se a notificação está agendada
quickActionNotificationSchema.virtual('isScheduled').get(function() {
    return this.delivery.scheduledFor && new Date() < this.delivery.scheduledFor;
});

// Virtual para verificar se a notificação está expirada
quickActionNotificationSchema.virtual('isExpired').get(function() {
    if (this.delivery.expiresAt) {
        return new Date() > this.delivery.expiresAt;
    }
    
    if (this.interaction.autoExpire && this.interaction.expireAfter) {
        const expireTime = new Date(this.metrics.sentAt.getTime() + this.interaction.expireAfter * 60000);
        return new Date() > expireTime;
    }
    
    return false;
});

// Virtual para verificar se a notificação requer resposta
quickActionNotificationSchema.virtual('requiresImmediateResponse').get(function() {
    if (!this.interaction.requiresResponse) return false;
    
    if (this.interaction.responseDeadline) {
        return new Date() > this.interaction.responseDeadline;
    }
    
    return false;
});

// Middleware para atualizar timestamp e status
quickActionNotificationSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    
    // Atualiza status baseado em condições
    if (this.isExpired && this.status !== 'expired') {
        this.status = 'expired';
    }
    
    // Calcula métricas de tempo
    if (this.status === 'read' && this.metrics.readAt && !this.metrics.timeToRead) {
        this.metrics.timeToRead = Math.floor((this.metrics.readAt - this.metrics.sentAt) / 1000);
    }
    
    if (this.status === 'actioned' && this.metrics.actionedAt && !this.metrics.timeToAction) {
        this.metrics.timeToAction = Math.floor((this.metrics.actionedAt - this.metrics.sentAt) / 1000);
    }
    
    next();
});

// Método para marcar como lida
quickActionNotificationSchema.methods.markAsRead = function() {
    if (this.status === 'unread') {
        this.status = 'read';
        this.metrics.readAt = new Date();
        
        if (!this.metrics.timeToRead) {
            this.metrics.timeToRead = Math.floor((this.metrics.readAt - this.metrics.sentAt) / 1000);
        }
    }
    
    return this;
};

// Método para marcar como actionada
quickActionNotificationSchema.methods.markAsActioned = function() {
    if (this.status !== 'actioned') {
        this.status = 'actioned';
        this.metrics.actionedAt = new Date();
        
        if (!this.metrics.timeToAction) {
            this.metrics.timeToAction = Math.floor((this.metrics.actionedAt - this.metrics.sentAt) / 1000);
        }
        
        this.metrics.actionCount += 1;
    }
    
    return this;
};

// Método para dispensar
quickActionNotificationSchema.methods.dismiss = function() {
    if (this.status !== 'dismissed' && this.interaction.allowDismiss) {
        this.status = 'dismissed';
        this.metrics.dismissedAt = new Date();
    }
    
    return this;
};

// Método para adiar (snooze)
quickActionNotificationSchema.methods.snooze = function(minutes) {
    if (this.interaction.allowSnooze) {
        const snoozeTime = new Date();
        snoozeTime.setMinutes(snoozeTime.getMinutes() + minutes);
        
        this.delivery.scheduledFor = snoozeTime;
        this.status = 'unread';
        
        return true;
    }
    
    return false;
};

// Método para executar ação rápida
quickActionNotificationSchema.methods.executeQuickAction = function(actionType, userId) {
    const action = this.quickActions.find(a => a.type === actionType && a.isEnabled);
    
    if (!action) {
        return { success: false, reason: 'Ação não encontrada ou desabilitada' };
    }
    
    // Incrementa contador de interações
    this.metrics.interactionCount += 1;
    
    // Executa a ação baseada no tipo
    switch (actionType) {
        case 'confirm_presence':
            return this.executeConfirmPresence(userId);
        case 'donate':
            return this.executeDonate(userId);
        case 'pray':
            return this.executePray(userId);
        case 'join_event':
            return this.executeJoinEvent(userId);
        case 'share':
            return this.executeShare(userId);
        case 'save':
            return this.executeSave(userId);
        case 'remind_later':
            return this.executeRemindLater(userId);
        case 'dismiss':
            return this.executeDismiss(userId);
        case 'view_details':
            return this.executeViewDetails(userId);
        case 'respond':
            return this.executeRespond(userId);
        case 'accept':
            return this.executeAccept(userId);
        case 'decline':
            return this.executeDecline(userId);
        case 'mark_complete':
            return this.executeMarkComplete(userId);
        case 'add_calendar':
            return this.executeAddCalendar(userId);
        case 'set_reminder':
            return this.executeSetReminder(userId);
        case 'contact':
            return this.executeContact(userId);
        case 'volunteer':
            return this.executeVolunteer(userId);
        case 'learn_more':
            return this.executeLearnMore(userId);
        default:
            return { success: false, reason: 'Tipo de ação não suportado' };
    }
};

// Métodos de execução de ações específicas
quickActionNotificationSchema.methods.executeConfirmPresence = function(userId) {
    // Implementar lógica de confirmação de presença
    return { success: true, message: 'Presença confirmada com sucesso!' };
};

quickActionNotificationSchema.methods.executeDonate = function(userId) {
    // Implementar lógica de doação
    return { success: true, message: 'Redirecionando para doação...' };
};

quickActionNotificationSchema.methods.executePray = function(userId) {
    // Implementar lógica de oração
    return { success: true, message: 'Oração registrada com sucesso!' };
};

quickActionNotificationSchema.methods.executeJoinEvent = function(userId) {
    // Implementar lógica de participação em evento
    return { success: true, message: 'Participação confirmada!' };
};

quickActionNotificationSchema.methods.executeShare = function(userId) {
    // Implementar lógica de compartilhamento
    return { success: true, message: 'Compartilhando...' };
};

quickActionNotificationSchema.methods.executeSave = function(userId) {
    // Implementar lógica de salvamento
    return { success: true, message: 'Salvo com sucesso!' };
};

quickActionNotificationSchema.methods.executeRemindLater = function(userId) {
    // Implementar lógica de lembrete posterior
    return { success: true, message: 'Lembrete definido para mais tarde' };
};

quickActionNotificationSchema.methods.executeDismiss = function(userId) {
    // Implementar lógica de dispensa
    this.dismiss();
    return { success: true, message: 'Notificação dispensada' };
};

quickActionNotificationSchema.methods.executeViewDetails = function(userId) {
    // Implementar lógica de visualização de detalhes
    return { success: true, message: 'Exibindo detalhes...' };
};

quickActionNotificationSchema.methods.executeRespond = function(userId) {
    // Implementar lógica de resposta
    return { success: true, message: 'Abrindo resposta...' };
};

quickActionNotificationSchema.methods.executeAccept = function(userId) {
    // Implementar lógica de aceitação
    return { success: true, message: 'Aceito com sucesso!' };
};

quickActionNotificationSchema.methods.executeDecline = function(userId) {
    // Implementar lógica de recusa
    return { success: true, message: 'Recusado com sucesso!' };
};

quickActionNotificationSchema.methods.executeMarkComplete = function(userId) {
    // Implementar lógica de marcação como completo
    return { success: true, message: 'Marcado como completo!' };
};

quickActionNotificationSchema.methods.executeAddCalendar = function(userId) {
    // Implementar lógica de adição ao calendário
    return { success: true, message: 'Adicionado ao calendário!' };
};

quickActionNotificationSchema.methods.executeSetReminder = function(userId) {
    // Implementar lógica de definição de lembrete
    return { success: true, message: 'Lembrete definido!' };
};

quickActionNotificationSchema.methods.executeContact = function(userId) {
    // Implementar lógica de contato
    return { success: true, message: 'Abrindo contato...' };
};

quickActionNotificationSchema.methods.executeVolunteer = function(userId) {
    // Implementar lógica de voluntariado
    return { success: true, message: 'Voluntariado registrado!' };
};

quickActionNotificationSchema.methods.executeLearnMore = function(userId) {
    // Implementar lógica de saber mais
    return { success: true, message: 'Exibindo mais informações...' };
};

// Método para agrupar notificações
quickActionNotificationSchema.methods.groupWith = function(otherNotification) {
    if (this.grouping.groupKey === otherNotification.grouping.groupKey) {
        this.grouping.isGrouped = true;
        this.grouping.groupCount += 1;
        
        if (!this.grouping.groupTitle) {
            this.grouping.groupTitle = `${this.grouping.groupCount} notificações similares`;
        }
        
        return true;
    }
    
    return false;
};

// Método para obter estatísticas de engajamento
quickActionNotificationSchema.methods.getEngagementStats = function() {
    return {
        readRate: this.status === 'read' ? 100 : 0,
        actionRate: this.status === 'actioned' ? 100 : 0,
        responseTime: this.metrics.timeToRead || 0,
        actionTime: this.metrics.timeToAction || 0,
        interactionCount: this.metrics.interactionCount,
        actionCount: this.metrics.actionCount
    };
};

// Método estático para buscar notificações ativas de um usuário
quickActionNotificationSchema.statics.findActiveByUser = function(userId, limit = 50) {
    return this.find({
        userId: userId,
        status: { $nin: ['expired', 'dismissed'] },
        $or: [
            { 'delivery.expiresAt': { $gt: new Date() } },
            { 'delivery.expiresAt': null }
        ]
    })
    .sort({ priority: -1, createdAt: -1 })
    .limit(limit)
    .populate('relatedData.eventId', 'title date location')
    .populate('relatedData.postId', 'title content')
    .populate('relatedData.userId', 'name profileImage');
};

// Método estático para buscar notificações por tipo
quickActionNotificationSchema.statics.findByType = function(userId, type, limit = 20) {
    return this.find({
        userId: userId,
        type: type,
        status: { $nin: ['expired', 'dismissed'] }
    })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Método estático para buscar notificações agrupadas
quickActionNotificationSchema.statics.findGrouped = function(userId, limit = 20) {
    return this.aggregate([
        {
            $match: {
                userId: mongoose.Types.ObjectId(userId),
                status: { $nin: ['expired', 'dismissed'] },
                'grouping.groupKey': { $exists: true, $ne: null }
            }
        },
        {
            $group: {
                _id: '$grouping.groupKey',
                notifications: { $push: '$$ROOT' },
                count: { $sum: 1 },
                latest: { $max: '$createdAt' }
            }
        },
        {
            $sort: { latest: -1 }
        },
        {
            $limit: limit
        }
    ]);
};

// Método estático para criar notificação padrão
quickActionNotificationSchema.statics.createDefault = function(userId, type, title, message, quickActions = []) {
    const defaultActions = {
        event_reminder: [
            { type: 'confirm_presence', label: 'Confirmar Presença', action: 'confirm_presence' },
            { type: 'add_calendar', label: 'Adicionar ao Calendário', action: 'add_calendar' },
            { type: 'remind_later', label: 'Lembrar Depois', action: 'remind_later' }
        ],
        prayer_request: [
            { type: 'pray', label: 'Orar Agora', action: 'pray' },
            { type: 'share', label: 'Compartilhar', action: 'share' },
            { type: 'respond', label: 'Responder', action: 'respond' }
        ],
        donation_reminder: [
            { type: 'donate', label: 'Doar Agora', action: 'donate' },
            { type: 'remind_later', label: 'Lembrar Depois', action: 'remind_later' },
            { type: 'dismiss', label: 'Dispensar', action: 'dismiss' }
        ]
    };
    
    const actions = quickActions.length > 0 ? quickActions : (defaultActions[type] || []);
    
    return new this({
        userId: userId,
        type: type,
        title: title,
        message: message,
        category: this.getCategoryFromType(type),
        priority: this.getPriorityFromType(type),
        quickActions: actions,
        delivery: {
            method: 'in_app',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
        },
        interaction: {
            requiresResponse: false,
            allowDismiss: true,
            allowSnooze: true,
            autoExpire: true,
            expireAfter: 1440 // 24 horas
        }
    });
};

// Método estático para obter categoria baseada no tipo
quickActionNotificationSchema.statics.getCategoryFromType = function(type) {
    const categoryMap = {
        event_reminder: 'events',
        prayer_request: 'prayer',
        donation_reminder: 'charity',
        community_update: 'community',
        achievement: 'achievements',
        streak_reminder: 'reminders',
        quest_update: 'achievements',
        badge_earned: 'achievements',
        event_checkin: 'events',
        mass_reminder: 'worship',
        confession_reminder: 'worship',
        rosary_reminder: 'prayer',
        bible_study: 'learning',
        charity_opportunity: 'charity',
        community_event: 'community',
        spiritual_guidance: 'spiritual',
        system_update: 'system',
        maintenance: 'system',
        security_alert: 'security'
    };
    
    return categoryMap[type] || 'custom';
};

// Método estático para obter prioridade baseada no tipo
quickActionNotificationSchema.statics.getPriorityFromType = function(type) {
    const priorityMap = {
        event_reminder: 'medium',
        prayer_request: 'high',
        donation_reminder: 'medium',
        community_update: 'low',
        achievement: 'medium',
        streak_reminder: 'low',
        quest_update: 'medium',
        badge_earned: 'medium',
        event_checkin: 'low',
        mass_reminder: 'high',
        confession_reminder: 'medium',
        rosary_reminder: 'medium',
        bible_study: 'low',
        charity_opportunity: 'medium',
        community_event: 'medium',
        spiritual_guidance: 'high',
        system_update: 'low',
        maintenance: 'medium',
        security_alert: 'urgent'
    };
    
    return priorityMap[type] || 'medium';
};

module.exports = mongoose.model('QuickActionNotification', quickActionNotificationSchema);