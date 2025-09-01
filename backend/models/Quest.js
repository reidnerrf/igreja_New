/**
 * Modelo de Quest/Desafio
 * ConnectFé - Sistema de Gamificação
 */

const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
    // Informações básicas
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    
    // Tipo e categoria
    type: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'special', 'seasonal'],
        default: 'daily'
    },
    category: {
        type: String,
        enum: ['prayer', 'charity', 'community', 'learning', 'worship', 'reflection'],
        required: true
    },
    
    // Objetivos e progresso
    objectives: [{
        description: {
            type: String,
            required: true
        },
        target: {
            type: Number,
            required: true,
            min: 1
        },
        current: {
            type: Number,
            default: 0,
            min: 0
        },
        completed: {
            type: Boolean,
            default: false
        }
    }],
    
    // Recompensas
    rewards: {
        points: {
            type: Number,
            default: 0,
            min: 0
        },
        badges: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Badge'
        }],
        experience: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    
    // Datas e duração
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // em dias
        required: true,
        min: 1
    },
    
    // Status e progresso
    status: {
        type: String,
        enum: ['active', 'completed', 'expired', 'failed'],
        default: 'active'
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    
    // Dificuldade e requisitos
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard', 'expert'],
        default: 'medium'
    },
    levelRequirement: {
        type: Number,
        default: 1,
        min: 1
    },
    
    // Temas sazonais
    seasonalTheme: {
        type: String,
        enum: ['advent', 'christmas', 'lent', 'easter', 'pentecost', 'ordinary'],
        default: 'ordinary'
    },
    
    // Configurações especiais
    isRepeatable: {
        type: Boolean,
        default: false
    },
    maxCompletions: {
        type: Number,
        default: 1,
        min: 1
    },
    currentCompletions: {
        type: Number,
        default: 0,
        min: 0
    },
    
    // Metadados
    tags: [{
        type: String,
        trim: true
    }],
    icon: {
        type: String,
        default: '🎯'
    },
    color: {
        type: String,
        default: '#4CAF50'
    },
    
    // Estatísticas
    totalParticipants: {
        type: Number,
        default: 0
    },
    completionRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    
    // Configurações de notificação
    notifications: {
        reminder: {
            type: Boolean,
            default: true
        },
        reminderTime: {
            type: String, // HH:MM
            default: '09:00'
        },
        completion: {
            type: Boolean,
            default: true
        }
    },
    
    // Histórico de usuários que completaram
    completions: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        completedAt: {
            type: Date,
            default: Date.now
        },
        timeSpent: {
            type: Number, // em minutos
            default: 0
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 0
        }
    }],
    
    // Configurações de moderação
    isModerated: {
        type: Boolean,
        default: false
    },
    moderatorNotes: {
        type: String,
        maxlength: 1000
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
questSchema.index({ type: 1, status: 1, startDate: 1, endDate: 1 });
questSchema.index({ category: 1, difficulty: 1 });
questSchema.index({ seasonalTheme: 1, startDate: 1 });
questSchema.index({ 'completions.userId': 1 });

// Virtual para verificar se a quest está ativa
questSchema.virtual('isActive').get(function() {
    const now = new Date();
    return this.status === 'active' && 
           now >= this.startDate && 
           now <= this.endDate;
});

// Virtual para verificar se a quest está expirada
questSchema.virtual('isExpired').get(function() {
    return new Date() > this.endDate;
});

// Virtual para verificar se a quest pode ser repetida
questSchema.virtual('canRepeat').get(function() {
    return this.isRepeatable && 
           this.currentCompletions < this.maxCompletions;
});

// Middleware para atualizar progresso automaticamente
questSchema.pre('save', function(next) {
    if (this.objectives && this.objectives.length > 0) {
        const totalObjectives = this.objectives.length;
        const completedObjectives = this.objectives.filter(obj => obj.completed).length;
        this.progress = Math.round((completedObjectives / totalObjectives) * 100);
        
        // Atualiza status baseado no progresso
        if (this.progress === 100) {
            this.status = 'completed';
        } else if (this.isExpired) {
            this.status = 'expired';
        }
    }
    
    this.updatedAt = new Date();
    next();
});

// Método para calcular estatísticas
questSchema.methods.calculateStats = function() {
    if (this.completions && this.completions.length > 0) {
        const totalTime = this.completions.reduce((sum, comp) => sum + comp.timeSpent, 0);
        const avgRating = this.completions.reduce((sum, comp) => sum + comp.rating, 0) / this.completions.length;
        
        return {
            totalCompletions: this.completions.length,
            averageTimeSpent: Math.round(totalTime / this.completions.length),
            averageRating: Math.round(avgRating * 10) / 10,
            completionRate: this.completionRate
        };
    }
    
    return {
        totalCompletions: 0,
        averageTimeSpent: 0,
        averageRating: 0,
        completionRate: this.completionRate
    };
};

// Método para verificar se um usuário pode participar
questSchema.methods.canUserParticipate = function(userId, userLevel = 1) {
    // Verifica se já completou o máximo de vezes
    if (!this.canRepeat) {
        const userCompletions = this.completions.filter(comp => 
            comp.userId.toString() === userId.toString()
        ).length;
        
        if (userCompletions >= this.maxCompletions) {
            return { can: false, reason: 'Quest já completada o máximo de vezes permitido' };
        }
    }
    
    // Verifica nível mínimo
    if (userLevel < this.levelRequirement) {
        return { can: false, reason: `Nível mínimo requerido: ${this.levelRequirement}` };
    }
    
    // Verifica se está ativa
    if (!this.isActive) {
        return { can: false, reason: 'Quest não está ativa' };
    }
    
    return { can: true, reason: 'Usuário pode participar' };
};

// Método para atualizar progresso de um usuário
questSchema.methods.updateUserProgress = function(userId, objectiveIndex, progress) {
    if (objectiveIndex >= 0 && objectiveIndex < this.objectives.length) {
        const objective = this.objectives[objectiveIndex];
        objective.current = Math.min(progress, objective.target);
        
        if (objective.current >= objective.target) {
            objective.completed = true;
        }
        
        return true;
    }
    return false;
};

// Método para marcar quest como completada por um usuário
questSchema.methods.completeForUser = function(userId, timeSpent = 0, rating = 0) {
    const canParticipate = this.canUserParticipate(userId);
    
    if (!canParticipate.can) {
        return { success: false, reason: canParticipate.reason };
    }
    
    // Adiciona à lista de completions
    this.completions.push({
        userId: userId,
        completedAt: new Date(),
        timeSpent: timeSpent,
        rating: rating
    });
    
    this.currentCompletions += 1;
    this.totalParticipants += 1;
    
    // Atualiza taxa de conclusão
    if (this.totalParticipants > 0) {
        this.completionRate = Math.round((this.currentCompletions / this.totalParticipants) * 100);
    }
    
    return { success: true, message: 'Quest completada com sucesso!' };
};

// Método estático para buscar quests ativas
questSchema.statics.findActive = function() {
    const now = new Date();
    return this.find({
        status: 'active',
        startDate: { $lte: now },
        endDate: { $gte: now }
    }).sort({ startDate: 1 });
};

// Método estático para buscar quests por categoria
questSchema.statics.findByCategory = function(category) {
    return this.find({ 
        category: category,
        status: 'active'
    }).sort({ startDate: 1 });
};

// Método estático para buscar quests sazonais
questSchema.statics.findSeasonal = function(theme) {
    return this.find({
        seasonalTheme: theme,
        status: 'active'
    }).sort({ startDate: 1 });
};

// Método estático para buscar quests por dificuldade
questSchema.statics.findByDifficulty = function(difficulty, userLevel = 1) {
    return this.find({
        difficulty: difficulty,
        levelRequirement: { $lte: userLevel },
        status: 'active'
    }).sort({ startDate: 1 });
};

// Método estático para criar quest padrão
questSchema.statics.createDefaultQuest = function(type, category) {
    const now = new Date();
    const endDate = new Date(now);
    
    switch (type) {
        case 'daily':
            endDate.setDate(endDate.getDate() + 1);
            break;
        case 'weekly':
            endDate.setDate(endDate.getDate() + 7);
            break;
        case 'monthly':
            endDate.setMonth(endDate.getMonth() + 1);
            break;
        default:
            endDate.setDate(endDate.getDate() + 7);
    }
    
    const defaultQuests = {
        prayer: {
            daily: {
                title: 'Oração Diária',
                description: 'Reze uma oração por 5 minutos hoje',
                objectives: [{ description: 'Tempo de oração', target: 5, current: 0, completed: false }],
                rewards: { points: 10, experience: 5 }
            },
            weekly: {
                title: 'Semana de Oração',
                description: 'Reze todos os dias desta semana',
                objectives: [{ description: 'Dias de oração', target: 7, current: 0, completed: false }],
                rewards: { points: 50, experience: 25 }
            }
        },
        charity: {
            daily: {
                title: 'Ato de Caridade',
                description: 'Faça uma boa ação hoje',
                objectives: [{ description: 'Boas ações', target: 1, current: 0, completed: false }],
                rewards: { points: 15, experience: 8 }
            },
            weekly: {
                title: 'Semana de Caridade',
                description: 'Faça pelo menos 3 boas ações esta semana',
                objectives: [{ description: 'Boas ações', target: 3, current: 0, completed: false }],
                rewards: { points: 75, experience: 40 }
            }
        }
    };
    
    const questData = defaultQuests[category]?.[type];
    if (questData) {
        return new this({
            ...questData,
            type: type,
            category: category,
            startDate: now,
            endDate: endDate,
            duration: Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
        });
    }
    
    return null;
};

module.exports = mongoose.model('Quest', questSchema);