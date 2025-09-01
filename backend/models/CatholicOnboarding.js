/**
 * Modelo de Onboarding Católico
 * ConnectFé - Sistema de Onboarding Exclusivamente Católico
 */

const mongoose = require('mongoose');

const catholicOnboardingSchema = new mongoose.Schema({
    // Usuário
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    
    // Status do onboarding
    status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed', 'skipped'],
        default: 'not_started'
    },
    
    // Etapas do onboarding
    steps: [{
        id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true,
            maxlength: 100
        },
        description: {
            type: String,
            required: true,
            maxlength: 500
        },
        type: {
            type: String,
            enum: [
                'welcome',           // Boas-vindas
                'faith_declaration', // Declaração de fé
                'church_info',       // Informações da igreja
                'preferences',       // Preferências
                'community',         // Comunidade
                'prayer',            // Oração
                'sacraments',        // Sacramentos
                'traditions',        // Tradições
                'final_setup'        // Configuração final
            ],
            required: true
        },
        order: {
            type: Number,
            required: true,
            min: 1
        },
        isRequired: {
            type: Boolean,
            default: true
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
        completedAt: {
            type: Date
        },
        data: {
            type: mongoose.Schema.Types.Mixed
        },
        validation: {
            required: Boolean,
            minLength: Number,
            maxLength: Number,
            pattern: String,
            customValidation: String
        }
    }],
    
    // Declaração de fé católica
    faithDeclaration: {
        isCatholic: {
            type: Boolean,
            required: true
        },
        baptismDate: {
            type: Date
        },
        confirmationDate: {
            type: Date
        },
        parish: {
            name: String,
            diocese: String,
            city: String,
            state: String
        },
        sacraments: [{
            name: {
                type: String,
                enum: ['baptism', 'confirmation', 'eucharist', 'reconciliation', 'marriage', 'holy_orders', 'anointing_of_sick']
            },
            received: Boolean,
            date: Date,
            location: String
        }],
        religiousEducation: {
            completed: Boolean,
            level: String,
            institution: String,
            year: Number
        }
    },
    
    // Preferências espirituais
    spiritualPreferences: {
        prayerStyle: [{
            type: String,
            enum: [
                'rosary',           // Terço
                'divine_mercy',     // Divina Misericórdia
                'liturgy_hours',    // Liturgia das Horas
                'meditation',       // Meditação
                'contemplation',    // Contemplação
                'spontaneous',      // Espontânea
                'traditional',      // Tradicional
                'charismatic',      // Carismática
                'ignatian',         // Inaciana
                'benedictine',      // Beneditina
                'franciscan',       // Franciscana
                'carmelite'         // Carmelita
            ]
        }],
        massPreference: {
            type: String,
            enum: ['traditional', 'novus_ordo', 'charismatic', 'youth', 'family', 'no_preference'],
            default: 'no_preference'
        },
        confessionFrequency: {
            type: String,
            enum: ['weekly', 'monthly', 'quarterly', 'yearly', 'rarely', 'never'],
            default: 'monthly'
        },
        adoration: {
            type: Boolean,
            default: false
        },
        bibleStudy: {
            type: Boolean,
            default: false
        },
        spiritualDirection: {
            type: Boolean,
            default: false
        }
    },
    
    // Preferências de comunidade
    communityPreferences: {
        involvementLevel: {
            type: String,
            enum: ['observer', 'participant', 'active', 'leader', 'volunteer'],
            default: 'participant'
        },
        ministries: [{
            type: String,
            enum: [
                'altar_server',     // Coroinha
                'lector',           // Leitor
                'eucharistic_minister', // Ministro da Eucaristia
                'usher',            // Zelador
                'choir',            // Coral
                'catechist',        // Catequista
                'youth_leader',     // Líder de Jovens
                'charity_worker',   // Trabalhador de Caridade
                'prayer_group',     // Grupo de Oração
                'bible_study',      // Estudo Bíblico
                'family_ministry',  // Ministério da Família
                'outreach',         // Evangelização
                'hospital_visitor', // Visitador de Hospital
                'prison_ministry',  // Ministério Prisional
                'pro_life',         // Pró-Vida
                'social_justice',   // Justiça Social
                'environmental',    // Ambiental
                'music',            // Música
                'art',              // Arte
                'technology'        // Tecnologia
            ]
        }],
        ageGroup: {
            type: String,
            enum: ['children', 'youth', 'young_adult', 'adult', 'senior', 'family'],
            default: 'adult'
        },
        language: {
            type: String,
            default: 'pt-BR'
        },
        accessibility: {
            hearing: Boolean,
            visual: Boolean,
            mobility: Boolean,
            cognitive: Boolean
        }
    },
    
    // Configurações de notificação
    notificationSettings: {
        massReminders: {
            type: Boolean,
            default: true
        },
        confessionReminders: {
            type: Boolean,
            default: true
        },
        prayerReminders: {
            type: Boolean,
            default: true
        },
        communityUpdates: {
            type: Boolean,
            default: true
        },
        spiritualContent: {
            type: Boolean,
            default: true
        },
        seasonalThemes: {
            type: Boolean,
            default: true
        },
        quietHours: {
            enabled: {
                type: Boolean,
                default: false
            },
            start: {
                type: String,
                default: '22:00'
            },
            end: {
                type: String,
                default: '08:00'
            }
        }
    },
    
    // Configurações de privacidade
    privacySettings: {
        profileVisibility: {
            type: String,
            enum: ['public', 'community', 'friends', 'private'],
            default: 'community'
        },
        activitySharing: {
            type: Boolean,
            default: true
        },
        prayerRequests: {
            type: String,
            enum: ['public', 'community', 'friends', 'private'],
            default: 'community'
        },
        locationSharing: {
            type: Boolean,
            default: false
        },
        dataAnalytics: {
            type: Boolean,
            default: true
        }
    },
    
    // Configurações de tema
    themeSettings: {
        seasonalThemes: {
            type: Boolean,
            default: true
        },
        liturgicalColors: {
            type: Boolean,
            default: true
        },
        fontSize: {
            type: String,
            enum: ['small', 'medium', 'large', 'extra_large'],
            default: 'medium'
        },
        highContrast: {
            type: Boolean,
            default: false
        },
        reducedMotion: {
            type: Boolean,
            default: false
        }
    },
    
    // Configurações de idioma e localização
    localizationSettings: {
        language: {
            type: String,
            default: 'pt-BR'
        },
        timezone: {
            type: String,
            default: 'America/Sao_Paulo'
        },
        dateFormat: {
            type: String,
            default: 'DD/MM/YYYY'
        },
        timeFormat: {
            type: String,
            default: '24h'
        },
        currency: {
            type: String,
            default: 'BRL'
        }
    },
    
    // Configurações de gamificação
    gamificationSettings: {
        quests: {
            type: Boolean,
            default: true
        },
        streaks: {
            type: Boolean,
            default: true
        },
        badges: {
            type: Boolean,
            default: true
        },
        leaderboards: {
            type: Boolean,
            default: true
        },
        achievements: {
            type: Boolean,
            default: true
        },
        dailyChallenges: {
            type: Boolean,
            default: true
        }
    },
    
    // Configurações de integração
    integrationSettings: {
        calendar: {
            type: Boolean,
            default: true
        },
        contacts: {
            type: Boolean,
            default: false
        },
        socialMedia: {
            type: Boolean,
            default: false
        },
        pushNotifications: {
            type: Boolean,
            default: true
        },
        emailNotifications: {
            type: Boolean,
            default: true
        },
        smsNotifications: {
            type: Boolean,
            default: false
        }
    },
    
    // Progresso e estatísticas
    progress: {
        stepsCompleted: {
            type: Number,
            default: 0
        },
        totalSteps: {
            type: Number,
            default: 0
        },
        completionPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        timeSpent: {
            type: Number, // em segundos
            default: 0
        },
        startedAt: {
            type: Date
        },
        completedAt: {
            type: Date
        }
    },
    
    // Histórico de mudanças
    history: [{
        action: {
            type: String,
            required: true
        },
        field: String,
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed,
        timestamp: {
            type: Date,
            default: Date.now
        },
        stepId: String
    }],
    
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
catholicOnboardingSchema.index({ userId: 1 });
catholicOnboardingSchema.index({ status: 1 });
catholicOnboardingSchema.index({ 'faithDeclaration.isCatholic': 1 });
catholicOnboardingSchema.index({ 'progress.completionPercentage': -1 });

// Virtual para verificar se o onboarding está completo
catholicOnboardingSchema.virtual('isComplete').get(function() {
    return this.status === 'completed' && this.progress.completionPercentage === 100;
});

// Virtual para verificar se o usuário é católico
catholicOnboardingSchema.virtual('isCatholic').get(function() {
    return this.faithDeclaration.isCatholic === true;
});

// Virtual para obter próximos passos
catholicOnboardingSchema.virtual('nextSteps').get(function() {
    return this.steps.filter(step => !step.isCompleted && step.isRequired);
});

// Virtual para obter passos opcionais
catholicOnboardingSchema.virtual('optionalSteps').get(function() {
    return this.steps.filter(step => !step.isRequired);
});

// Middleware para atualizar progresso automaticamente
catholicOnboardingSchema.pre('save', function(next) {
    if (this.steps && this.steps.length > 0) {
        this.progress.totalSteps = this.steps.length;
        this.progress.stepsCompleted = this.steps.filter(step => step.isCompleted).length;
        this.progress.completionPercentage = Math.round((this.progress.stepsCompleted / this.progress.totalSteps) * 100);
        
        // Atualiza status baseado no progresso
        if (this.progress.completionPercentage === 100 && this.status !== 'completed') {
            this.status = 'completed';
            this.progress.completedAt = new Date();
        } else if (this.progress.completionPercentage > 0 && this.status === 'not_started') {
            this.status = 'in_progress';
            if (!this.progress.startedAt) {
                this.progress.startedAt = new Date();
            }
        }
    }
    
    this.updatedAt = new Date();
    next();
});

// Método para completar um passo
catholicOnboardingSchema.methods.completeStep = function(stepId, data = {}) {
    const step = this.steps.find(s => s.id === stepId);
    
    if (!step) {
        return { success: false, reason: 'Passo não encontrado' };
    }
    
    if (step.isCompleted) {
        return { success: false, reason: 'Passo já foi completado' };
    }
    
    // Valida dados se necessário
    if (step.validation) {
        const validationResult = this.validateStepData(step, data);
        if (!validationResult.isValid) {
            return { success: false, reason: validationResult.reason };
        }
    }
    
    // Completa o passo
    step.isCompleted = true;
    step.completedAt = new Date();
    step.data = data;
    
    // Adiciona ao histórico
    this.history.push({
        action: 'step_completed',
        field: `steps.${stepId}`,
        oldValue: false,
        newValue: true,
        stepId: stepId
    });
    
    return { success: true, message: 'Passo completado com sucesso!' };
};

// Método para validar dados de um passo
catholicOnboardingSchema.methods.validateStepData = function(step, data) {
    if (step.validation.required && (!data || Object.keys(data).length === 0)) {
        return { isValid: false, reason: 'Dados são obrigatórios para este passo' };
    }
    
    if (step.validation.minLength && data.value && data.value.length < step.validation.minLength) {
        return { isValid: false, reason: `Valor deve ter pelo menos ${step.validation.minLength} caracteres` };
    }
    
    if (step.validation.maxLength && data.value && data.value.length > step.validation.maxLength) {
        return { isValid: false, reason: `Valor deve ter no máximo ${step.validation.maxLength} caracteres` };
    }
    
    if (step.validation.pattern && data.value && !new RegExp(step.validation.pattern).test(data.value)) {
        return { isValid: false, reason: 'Valor não está no formato esperado' };
    }
    
    return { isValid: true };
};

// Método para pular um passo
catholicOnboardingSchema.methods.skipStep = function(stepId) {
    const step = this.steps.find(s => s.id === stepId);
    
    if (!step) {
        return { success: false, reason: 'Passo não encontrado' };
    }
    
    if (step.isRequired) {
        return { success: false, reason: 'Este passo é obrigatório e não pode ser pulado' };
    }
    
    if (step.isCompleted) {
        return { success: false, reason: 'Passo já foi completado' };
    }
    
    // Marca como completado (pulado)
    step.isCompleted = true;
    step.completedAt = new Date();
    step.data = { skipped: true };
    
    // Adiciona ao histórico
    this.history.push({
        action: 'step_skipped',
        field: `steps.${stepId}`,
        oldValue: false,
        newValue: true,
        stepId: stepId
    });
    
    return { success: true, message: 'Passo pulado com sucesso!' };
};

// Método para reverter um passo
catholicOnboardingSchema.methods.revertStep = function(stepId) {
    const step = this.steps.find(s => s.id === stepId);
    
    if (!step) {
        return { success: false, reason: 'Passo não encontrado' };
    }
    
    if (!step.isCompleted) {
        return { success: false, reason: 'Passo não foi completado' };
    }
    
    // Reverte o passo
    step.isCompleted = false;
    step.completedAt = null;
    step.data = {};
    
    // Adiciona ao histórico
    this.history.push({
        action: 'step_reverted',
        field: `steps.${stepId}`,
        oldValue: true,
        newValue: false,
        stepId: stepId
    });
    
    return { success: true, message: 'Passo revertido com sucesso!' };
};

// Método para obter estatísticas do onboarding
catholicOnboardingSchema.methods.getOnboardingStats = function() {
    const requiredSteps = this.steps.filter(step => step.isRequired);
    const optionalSteps = this.steps.filter(step => !step.isRequired);
    
    const requiredCompleted = requiredSteps.filter(step => step.isCompleted).length;
    const optionalCompleted = optionalSteps.filter(step => step.isCompleted).length;
    
    return {
        totalSteps: this.steps.length,
        requiredSteps: requiredSteps.length,
        optionalSteps: optionalSteps.length,
        requiredCompleted: requiredCompleted,
        optionalCompleted: optionalCompleted,
        requiredPercentage: requiredSteps.length > 0 ? Math.round((requiredCompleted / requiredSteps.length) * 100) : 0,
        optionalPercentage: optionalSteps.length > 0 ? Math.round((optionalCompleted / optionalSteps.length) * 100) : 0,
        overallPercentage: this.progress.completionPercentage,
        timeSpent: this.progress.timeSpent,
        estimatedTimeRemaining: this.estimateTimeRemaining()
    };
};

// Método para estimar tempo restante
catholicOnboardingSchema.methods.estimateTimeRemaining = function() {
    if (this.progress.stepsCompleted === 0) return null;
    
    const averageTimePerStep = this.progress.timeSpent / this.progress.stepsCompleted;
    const remainingSteps = this.progress.totalSteps - this.progress.stepsCompleted;
    
    return Math.round(averageTimePerStep * remainingSteps);
};

// Método para obter próximos passos recomendados
catholicOnboardingSchema.methods.getRecommendedNextSteps = function(limit = 3) {
    const incompleteSteps = this.steps.filter(step => !step.isCompleted);
    
    // Prioriza passos obrigatórios
    const requiredIncomplete = incompleteSteps.filter(step => step.isRequired);
    const optionalIncomplete = incompleteSteps.filter(step => !step.isRequired);
    
    const recommended = [...requiredIncomplete, ...optionalIncomplete];
    
    return recommended.slice(0, limit);
};

// Método para verificar se pode pular onboarding
catholicOnboardingSchema.methods.canSkipOnboarding = function() {
    const requiredSteps = this.steps.filter(step => step.isRequired);
    const completedRequired = requiredSteps.filter(step => step.isCompleted);
    
    return completedRequired.length === requiredSteps.length;
};

// Método para finalizar onboarding
catholicOnboardingSchema.methods.finishOnboarding = function() {
    if (!this.canSkipOnboarding()) {
        return { success: false, reason: 'Não é possível finalizar o onboarding sem completar os passos obrigatórios' };
    }
    
    this.status = 'completed';
    this.progress.completedAt = new Date();
    
    // Adiciona ao histórico
    this.history.push({
        action: 'onboarding_finished',
        field: 'status',
        oldValue: 'in_progress',
        newValue: 'completed'
    });
    
    return { success: true, message: 'Onboarding finalizado com sucesso!' };
};

// Método estático para criar onboarding padrão
catholicOnboardingSchema.statics.createDefault = function(userId) {
    const defaultSteps = [
        {
            id: 'welcome',
            title: 'Bem-vindo ao ConnectFé',
            description: 'Seja bem-vindo à nossa comunidade católica digital! Vamos configurar sua experiência personalizada.',
            type: 'welcome',
            order: 1,
            isRequired: true,
            isCompleted: false
        },
        {
            id: 'faith_declaration',
            title: 'Declaração de Fé',
            description: 'Confirme que você é católico e compartilhe informações sobre sua jornada espiritual.',
            type: 'faith_declaration',
            order: 2,
            isRequired: true,
            isCompleted: false
        },
        {
            id: 'church_info',
            title: 'Sua Paróquia',
            description: 'Conte-nos sobre sua paróquia e diocese para conectar você com sua comunidade local.',
            type: 'church_info',
            order: 3,
            isRequired: true,
            isCompleted: false
        },
        {
            id: 'preferences',
            title: 'Preferências Espirituais',
            description: 'Personalize sua experiência com base em suas práticas espirituais e preferências.',
            type: 'preferences',
            order: 4,
            isRequired: false,
            isCompleted: false
        },
        {
            id: 'community',
            title: 'Envolvimento na Comunidade',
            description: 'Como você gostaria de se envolver com nossa comunidade católica?',
            type: 'community',
            order: 5,
            isRequired: false,
            isCompleted: false
        },
        {
            id: 'prayer',
            title: 'Vida de Oração',
            description: 'Configure lembretes e preferências para sua vida de oração diária.',
            type: 'prayer',
            order: 6,
            isRequired: false,
            isCompleted: false
        },
        {
            id: 'sacraments',
            title: 'Sacramentos',
            description: 'Registre os sacramentos que você já recebeu para uma experiência mais personalizada.',
            type: 'sacraments',
            order: 7,
            isRequired: false,
            isCompleted: false
        },
        {
            id: 'traditions',
            title: 'Tradições Católicas',
            description: 'Descubra e configure suas preferências para tradições e devoções católicas.',
            type: 'traditions',
            order: 8,
            isRequired: false,
            isCompleted: false
        },
        {
            id: 'final_setup',
            title: 'Configuração Final',
            description: 'Revise suas configurações e finalize seu onboarding no ConnectFé.',
            type: 'final_setup',
            order: 9,
            isRequired: true,
            isCompleted: false
        }
    ];
    
    return new this({
        userId: userId,
        steps: defaultSteps,
        faithDeclaration: {
            isCatholic: true
        },
        spiritualPreferences: {
            prayerStyle: ['traditional', 'spontaneous'],
            massPreference: 'no_preference',
            confessionFrequency: 'monthly'
        },
        communityPreferences: {
            involvementLevel: 'participant',
            ageGroup: 'adult',
            language: 'pt-BR'
        },
        notificationSettings: {
            massReminders: true,
            confessionReminders: true,
            prayerReminders: true,
            communityUpdates: true,
            spiritualContent: true,
            seasonalThemes: true
        },
        privacySettings: {
            profileVisibility: 'community',
            activitySharing: true,
            prayerRequests: 'community'
        },
        themeSettings: {
            seasonalThemes: true,
            liturgicalColors: true,
            fontSize: 'medium'
        },
        localizationSettings: {
            language: 'pt-BR',
            timezone: 'America/Sao_Paulo',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            currency: 'BRL'
        },
        gamificationSettings: {
            quests: true,
            streaks: true,
            badges: true,
            leaderboards: true,
            achievements: true,
            dailyChallenges: true
        },
        integrationSettings: {
            calendar: true,
            pushNotifications: true,
            emailNotifications: true
        },
        progress: {
            totalSteps: defaultSteps.length,
            startedAt: new Date()
        }
    });
};

// Método estático para buscar onboarding por usuário
catholicOnboardingSchema.statics.findByUser = function(userId) {
    return this.findOne({ userId: userId });
};

// Método estático para buscar usuários com onboarding completo
catholicOnboardingSchema.statics.findCompleted = function() {
    return this.find({ status: 'completed' });
};

// Método estático para buscar usuários com onboarding em progresso
catholicOnboardingSchema.statics.findInProgress = function() {
    return this.find({ status: 'in_progress' });
};

// Método estático para obter estatísticas gerais
catholicOnboardingSchema.statics.getGeneralStats = function() {
    return this.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                avgCompletion: { $avg: '$progress.completionPercentage' },
                avgTimeSpent: { $avg: '$progress.timeSpent' }
            }
        }
    ]);
};

module.exports = mongoose.model('CatholicOnboarding', catholicOnboardingSchema);