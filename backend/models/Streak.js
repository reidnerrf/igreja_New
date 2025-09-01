/**
 * Modelo de Streak Diário
 * ConnectFé - Sistema de Gamificação
 */

const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
    // Usuário
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    
    // Streak atual
    currentStreak: {
        type: Number,
        default: 0,
        min: 0
    },
    
    // Maior streak já alcançado
    longestStreak: {
        type: Number,
        default: 0,
        min: 0
    },
    
    // Data do último check-in
    lastCheckIn: {
        type: Date,
        default: null
    },
    
    // Data de início do streak atual
    currentStreakStart: {
        type: Date,
        default: null
    },
    
    // Histórico de check-ins
    checkIns: [{
        date: {
            type: Date,
            required: true
        },
        activity: {
            type: String,
            enum: ['prayer', 'charity', 'community', 'learning', 'worship', 'reflection', 'general'],
            default: 'general'
        },
        points: {
            type: Number,
            default: 0,
            min: 0
        },
        notes: {
            type: String,
            maxlength: 200
        },
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // Metas de streak
    goals: {
        daily: {
            type: Number,
            default: 1,
            min: 1,
            description: 'Meta diária de atividades'
        },
        weekly: {
            type: Number,
            default: 7,
            min: 1,
            description: 'Meta semanal de dias ativos'
        },
        monthly: {
            type: Number,
            default: 30,
            min: 1,
            description: 'Meta mensal de dias ativos'
        }
    },
    
    // Estatísticas
    stats: {
        totalCheckIns: {
            type: Number,
            default: 0
        },
        totalDays: {
            type: Number,
            default: 0
        },
        averageCheckInsPerDay: {
            type: Number,
            default: 0
        },
        bestWeek: {
            type: Number,
            default: 0
        },
        bestMonth: {
            type: Number,
            default: 0
        }
    },
    
    // Recompensas por streak
    rewards: {
        daily: {
            type: Number,
            default: 5,
            description: 'Pontos por dia de streak'
        },
        weekly: {
            type: Number,
            default: 25,
            description: 'Pontos bônus por semana completa'
        },
        monthly: {
            type: Number,
            default: 100,
            description: 'Pontos bônus por mês completo'
        },
        milestone: {
            type: Number,
            default: 50,
            description: 'Pontos bônus por marcos (7, 30, 100 dias)'
        }
    },
    
    // Configurações de notificação
    notifications: {
        dailyReminder: {
            type: Boolean,
            default: true
        },
        reminderTime: {
            type: String, // HH:MM
            default: '09:00'
        },
        streakWarning: {
            type: Boolean,
            default: true
        },
        warningThreshold: {
            type: Number,
            default: 1, // dias antes de quebrar o streak
            min: 1
        },
        milestoneCelebration: {
            type: Boolean,
            default: true
        }
    },
    
    // Preferências
    preferences: {
        autoCheckIn: {
            type: Boolean,
            default: false
        },
        minimumActivityTime: {
            type: Number,
            default: 5, // minutos
            min: 1
        },
        allowMultipleCheckIns: {
            type: Boolean,
            default: false
        },
        streakBreakGrace: {
            type: Number,
            default: 1, // dias de graça antes de quebrar o streak
            min: 0
        }
    },
    
    // Histórico de conquistas
    achievements: [{
        type: {
            type: String,
            enum: ['streak', 'milestone', 'goal', 'special'],
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        achievedAt: {
            type: Date,
            default: Date.now
        },
        value: {
            type: Number,
            default: 0
        },
        icon: {
            type: String,
            default: '🏆'
        }
    }],
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices para performance
streakSchema.index({ userId: 1 });
streakSchema.index({ currentStreak: -1 });
streakSchema.index({ lastCheckIn: -1 });
streakSchema.index({ 'checkIns.date': -1 });

// Virtual para verificar se o streak está ativo hoje
streakSchema.virtual('isActiveToday').get(function() {
    if (!this.lastCheckIn) return false;
    
    const today = new Date();
    const lastCheckIn = new Date(this.lastCheckIn);
    
    return today.toDateString() === lastCheckIn.toDateString();
});

// Virtual para verificar se o streak está em risco
streakSchema.virtual('isAtRisk').get(function() {
    if (!this.lastCheckIn) return false;
    
    const today = new Date();
    const lastCheckIn = new Date(this.lastCheckIn);
    const daysSinceLastCheckIn = Math.floor((today - lastCheckIn) / (1000 * 60 * 60 * 24));
    
    return daysSinceLastCheckIn >= this.preferences.streakBreakGrace;
});

// Virtual para calcular dias até quebrar o streak
streakSchema.virtual('daysUntilBreak').get(function() {
    if (!this.lastCheckIn) return 0;
    
    const today = new Date();
    const lastCheckIn = new Date(this.lastCheckIn);
    const daysSinceLastCheckIn = Math.floor((today - lastCheckIn) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, this.preferences.streakBreakGrace - daysSinceLastCheckIn);
});

// Virtual para verificar se pode fazer check-in hoje
streakSchema.virtual('canCheckInToday').get(function() {
    if (this.isActiveToday && !this.preferences.allowMultipleCheckIns) {
        return false;
    }
    
    return true;
});

// Middleware para atualizar estatísticas automaticamente
streakSchema.pre('save', function(next) {
    if (this.checkIns && this.checkIns.length > 0) {
        this.stats.totalCheckIns = this.checkIns.length;
        
        // Calcula dias únicos
        const uniqueDays = new Set(
            this.checkIns.map(checkIn => 
                new Date(checkIn.date).toDateString()
            )
        );
        this.stats.totalDays = uniqueDays.size;
        
        // Calcula média de check-ins por dia
        if (this.stats.totalDays > 0) {
            this.stats.averageCheckInsPerDay = Math.round(
                (this.stats.totalCheckIns / this.stats.totalDays) * 100
            ) / 100;
        }
        
        // Calcula melhor semana e mês
        this.calculateBestPeriods();
    }
    
    this.updatedAt = new Date();
    next();
});

// Método para fazer check-in
streakSchema.methods.checkIn = function(activity = 'general', points = 0, notes = '') {
    const today = new Date();
    
    // Verifica se pode fazer check-in
    if (!this.canCheckInToday) {
        return { 
            success: false, 
            reason: 'Check-in já realizado hoje ou não permitido' 
        };
    }
    
    // Adiciona check-in
    this.checkIns.push({
        date: today,
        activity: activity,
        points: points,
        notes: notes,
        completedAt: new Date()
    });
    
    // Atualiza streak
    this.updateStreak(today);
    
    // Verifica marcos
    this.checkMilestones();
    
    return { 
        success: true, 
        message: 'Check-in realizado com sucesso!',
        newStreak: this.currentStreak,
        pointsEarned: this.calculatePointsEarned()
    };
};

// Método para atualizar o streak
streakSchema.methods.updateStreak = function(checkInDate) {
    const today = new Date();
    const lastCheckIn = this.lastCheckIn ? new Date(this.lastCheckIn) : null;
    
    if (!lastCheckIn) {
        // Primeiro check-in
        this.currentStreak = 1;
        this.currentStreakStart = checkInDate;
    } else {
        const daysDifference = Math.floor(
            (checkInDate - lastCheckIn) / (1000 * 60 * 60 * 24)
        );
        
        if (daysDifference === 1) {
            // Check-in consecutivo
            this.currentStreak += 1;
        } else if (daysDifference === 0) {
            // Mesmo dia, não altera o streak
            return;
        } else if (daysDifference <= this.preferences.streakBreakGrace + 1) {
            // Dentro do período de graça, mantém o streak
            this.currentStreak += 1;
        } else {
            // Streak quebrado
            this.currentStreak = 1;
            this.currentStreakStart = checkInDate;
        }
    }
    
    // Atualiza maior streak
    if (this.currentStreak > this.longestStreak) {
        this.longestStreak = this.currentStreak;
    }
    
    this.lastCheckIn = checkInDate;
};

// Método para verificar marcos
streakSchema.methods.checkMilestones = function() {
    const milestones = [7, 30, 100, 365];
    
    milestones.forEach(milestone => {
        if (this.currentStreak === milestone && 
            !this.achievements.some(achievement => 
                achievement.type === 'milestone' && 
                achievement.value === milestone
            )) {
            
            // Adiciona conquista
            this.achievements.push({
                type: 'milestone',
                name: `${milestone} Dias de Streak`,
                description: `Manteve um streak de ${milestone} dias consecutivos!`,
                value: milestone,
                icon: this.getMilestoneIcon(milestone)
            });
            
            // Adiciona pontos bônus
            this.addPoints(this.rewards.milestone);
        }
    });
};

// Método para obter ícone do marco
streakSchema.methods.getMilestoneIcon = function(milestone) {
    const icons = {
        7: '🔥',
        30: '⚡',
        100: '💎',
        365: '👑'
    };
    
    return icons[milestone] || '🏆';
};

// Método para calcular pontos ganhos
streakSchema.methods.calculatePointsEarned = function() {
    let points = 0;
    
    // Pontos por dia de streak
    points += this.currentStreak * this.rewards.daily;
    
    // Bônus por semana completa
    if (this.currentStreak % 7 === 0) {
        points += this.rewards.weekly;
    }
    
    // Bônus por mês completo
    if (this.currentStreak % 30 === 0) {
        points += this.rewards.monthly;
    }
    
    return points;
};

// Método para adicionar pontos
streakSchema.methods.addPoints = function(points) {
    // Aqui você pode integrar com o sistema de pontos do usuário
    // Por enquanto, apenas retorna os pontos
    return points;
};

// Método para calcular melhores períodos
streakSchema.methods.calculateBestPeriods = function() {
    if (!this.checkIns || this.checkIns.length === 0) return;
    
    const checkInsByDate = {};
    
    // Agrupa check-ins por data
    this.checkIns.forEach(checkIn => {
        const dateStr = new Date(checkIn.date).toDateString();
        if (!checkInsByDate[dateStr]) {
            checkInsByDate[dateStr] = 0;
        }
        checkInsByDate[dateStr]++;
    });
    
    // Calcula melhor semana
    const dates = Object.keys(checkInsByDate).sort();
    let bestWeek = 0;
    
    for (let i = 0; i < dates.length - 6; i++) {
        let weekTotal = 0;
        for (let j = 0; j < 7; j++) {
            weekTotal += checkInsByDate[dates[i + j]] || 0;
        }
        bestWeek = Math.max(bestWeek, weekTotal);
    }
    
    this.stats.bestWeek = bestWeek;
    
    // Calcula melhor mês (aproximado)
    const checkInsByMonth = {};
    this.checkIns.forEach(checkIn => {
        const monthKey = `${new Date(checkIn.date).getFullYear()}-${new Date(checkIn.date).getMonth()}`;
        if (!checkInsByMonth[monthKey]) {
            checkInsByMonth[monthKey] = 0;
        }
        checkInsByMonth[monthKey]++;
    });
    
    const monthlyTotals = Object.values(checkInsByMonth);
    this.stats.bestMonth = monthlyTotals.length > 0 ? Math.max(...monthlyTotals) : 0;
};

// Método para obter estatísticas do período
streakSchema.methods.getPeriodStats = function(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const periodCheckIns = this.checkIns.filter(checkIn => {
        const checkInDate = new Date(checkIn.date);
        return checkInDate >= start && checkInDate <= end;
    });
    
    const uniqueDays = new Set(
        periodCheckIns.map(checkIn => 
            new Date(checkIn.date).toDateString()
        )
    );
    
    return {
        totalCheckIns: periodCheckIns.length,
        activeDays: uniqueDays.size,
        averageCheckInsPerDay: periodCheckIns.length / uniqueDays.size || 0,
        totalPoints: periodCheckIns.reduce((sum, checkIn) => sum + checkIn.points, 0)
    };
};

// Método para obter ranking de atividades
streakSchema.methods.getActivityRanking = function() {
    const activityCounts = {};
    
    this.checkIns.forEach(checkIn => {
        if (!activityCounts[checkIn.activity]) {
            activityCounts[checkIn.activity] = 0;
        }
        activityCounts[checkIn.activity]++;
    });
    
    return Object.entries(activityCounts)
        .map(([activity, count]) => ({ activity, count }))
        .sort((a, b) => b.count - a.count);
};

// Método para obter sugestões de atividades
streakSchema.methods.getActivitySuggestions = function() {
    const suggestions = {
        prayer: [
            'Reze o Pai Nosso',
            'Medite por 10 minutos',
            'Reze o Terço',
            'Faça uma oração espontânea'
        ],
        charity: [
            'Ajude alguém hoje',
            'Faça uma doação',
            'Voluntarie-se',
            'Seja gentil com um estranho'
        ],
        community: [
            'Participe de um evento da igreja',
            'Conecte-se com um membro da comunidade',
            'Compartilhe uma mensagem inspiradora',
            'Ajude na organização de um evento'
        ],
        learning: [
            'Leia um capítulo da Bíblia',
            'Estude sobre um santo',
            'Aprenda sobre uma tradição católica',
            'Reflita sobre uma passagem bíblica'
        ],
        worship: [
            'Assista a uma missa',
            'Participe de uma adoração',
            'Cante um hino religioso',
            'Faça uma peregrinação'
        ],
        reflection: [
            'Reflita sobre seu dia',
            'Escreva em um diário espiritual',
            'Pratique gratidão',
            'Medite sobre uma virtude'
        ]
    };
    
    // Retorna sugestões baseadas nas atividades menos frequentes
    const activityRanking = this.getActivityRanking();
    const leastFrequent = activityRanking.slice(-3).map(item => item.activity);
    
    return leastFrequent.map(activity => ({
        activity: activity,
        suggestions: suggestions[activity] || []
    }));
};

// Método estático para buscar usuários com maior streak
streakSchema.statics.findTopStreaks = function(limit = 10) {
    return this.find()
        .sort({ currentStreak: -1, longestStreak: -1 })
        .limit(limit)
        .populate('userId', 'name profileImage');
};

// Método estático para buscar usuários ativos hoje
streakSchema.statics.findActiveToday = function() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    
    return this.find({
        'checkIns.date': {
            $gte: startOfDay,
            $lt: endOfDay
        }
    }).populate('userId', 'name profileImage');
};

// Método estático para criar streak padrão para um usuário
streakSchema.statics.createForUser = function(userId) {
    return new this({
        userId: userId,
        currentStreak: 0,
        longestStreak: 0,
        checkIns: [],
        achievements: [],
        stats: {
            totalCheckIns: 0,
            totalDays: 0,
            averageCheckInsPerDay: 0,
            bestWeek: 0,
            bestMonth: 0
        }
    });
};

module.exports = mongoose.model('Streak', streakSchema);