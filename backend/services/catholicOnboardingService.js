/**
 * Serviço de Onboarding Católico
 * ConnectFé - Sistema de Onboarding Exclusivamente Católico
 */

const CatholicOnboarding = require('../models/CatholicOnboarding');
const User = require('../models/User');
const gamificationService = require('./gamificationService');
const notificationService = require('./notificationService');

class CatholicOnboardingService {
    constructor() {
        this.defaultSteps = this.initializeDefaultSteps();
    }

    /**
     * Inicializa os passos padrão do onboarding
     * @returns {Array} Lista de passos padrão
     */
    initializeDefaultSteps() {
        return [
            {
                id: 'welcome',
                title: 'Bem-vindo ao ConnectFé',
                description: 'A plataforma católica que conecta você à sua fé e comunidade',
                type: 'welcome',
                order: 1,
                isRequired: true,
                isCompleted: false
            },
            {
                id: 'faith_declaration',
                title: 'Declaração de Fé Católica',
                description: 'Confirme que você é católico e aceita os ensinamentos da Igreja',
                type: 'faith_declaration',
                order: 2,
                isRequired: true,
                isCompleted: false,
                validation: {
                    required: true
                }
            },
            {
                id: 'church_info',
                title: 'Sua Paróquia',
                description: 'Conte-nos sobre sua paróquia e diocese',
                type: 'church_info',
                order: 3,
                isRequired: true,
                isCompleted: false,
                validation: {
                    required: true
                }
            },
            {
                id: 'sacraments',
                title: 'Sacramentos Recebidos',
                description: 'Informe quais sacramentos você já recebeu',
                type: 'sacraments',
                order: 4,
                isRequired: false,
                isCompleted: false
            },
            {
                id: 'prayer_life',
                title: 'Vida de Oração',
                description: 'Como é sua vida de oração e devoção?',
                type: 'prayer',
                order: 5,
                isRequired: false,
                isCompleted: false
            },
            {
                id: 'community',
                title: 'Participação na Comunidade',
                description: 'Como você gostaria de participar da comunidade católica?',
                type: 'community',
                order: 6,
                isRequired: false,
                isCompleted: false
            },
            {
                id: 'preferences',
                title: 'Suas Preferências',
                description: 'Configure suas notificações e preferências',
                type: 'preferences',
                order: 7,
                isRequired: false,
                isCompleted: false
            },
            {
                id: 'final_setup',
                title: 'Configuração Final',
                description: 'Complete seu perfil e comece a usar o ConnectFé',
                type: 'final_setup',
                order: 8,
                isRequired: true,
                isCompleted: false
            }
        ];
    }

    /**
     * Inicia o processo de onboarding para um usuário
     * @param {string} userId - ID do usuário
     * @returns {Object} Onboarding iniciado
     */
    async startOnboarding(userId) {
        try {
            // Verifica se o usuário já tem onboarding
            let onboarding = await CatholicOnboarding.findOne({ userId });
            
            if (onboarding) {
                if (onboarding.status === 'completed') {
                    throw new Error('Onboarding já foi completado');
                }
                onboarding.status = 'in_progress';
            } else {
                // Cria novo onboarding
                onboarding = new CatholicOnboarding({
                    userId,
                    status: 'in_progress',
                    steps: this.defaultSteps.map(step => ({ ...step })),
                    faithDeclaration: {
                        isCatholic: false
                    }
                });
            }

            await onboarding.save();
            
            // Envia notificação de boas-vindas
            await this.sendWelcomeNotification(userId);
            
            return onboarding;
        } catch (error) {
            throw new Error(`Erro ao iniciar onboarding: ${error.message}`);
        }
    }

    /**
     * Atualiza um passo do onboarding
     * @param {string} userId - ID do usuário
     * @param {string} stepId - ID do passo
     * @param {Object} stepData - Dados do passo
     * @returns {Object} Passo atualizado
     */
    async updateOnboardingStep(userId, stepId, stepData) {
        try {
            const onboarding = await CatholicOnboarding.findOne({ userId });
            if (!onboarding) {
                throw new Error('Onboarding não encontrado');
            }

            const step = onboarding.steps.find(s => s.id === stepId);
            if (!step) {
                throw new Error('Passo não encontrado');
            }

            // Atualiza o passo
            Object.assign(step, stepData);
            step.isCompleted = true;
            step.completedAt = new Date();

            // Atualiza dados específicos baseados no tipo
            await this.updateStepSpecificData(onboarding, stepId, stepData);

            // Verifica se o onboarding foi completado
            const allRequiredStepsCompleted = onboarding.steps
                .filter(s => s.isRequired)
                .every(s => s.isCompleted);

            if (allRequiredStepsCompleted) {
                onboarding.status = 'completed';
                onboarding.completedAt = new Date();
                
                // Dispara eventos de conclusão
                await this.onOnboardingCompleted(userId);
            }

            await onboarding.save();
            return onboarding;
        } catch (error) {
            throw new Error(`Erro ao atualizar passo: ${error.message}`);
        }
    }

    /**
     * Atualiza dados específicos baseados no tipo do passo
     * @param {Object} onboarding - Objeto onboarding
     * @param {string} stepId - ID do passo
     * @param {Object} stepData - Dados do passo
     */
    async updateStepSpecificData(onboarding, stepId, stepData) {
        switch (stepId) {
            case 'faith_declaration':
                onboarding.faithDeclaration = {
                    ...onboarding.faithDeclaration,
                    ...stepData
                };
                break;
                
            case 'church_info':
                onboarding.churchInfo = {
                    ...onboarding.churchInfo,
                    ...stepData
                };
                break;
                
            case 'sacraments':
                onboarding.sacraments = {
                    ...onboarding.sacraments,
                    ...stepData
                };
                break;
                
            case 'prayer_life':
                onboarding.prayerLife = {
                    ...onboarding.prayerLife,
                    ...stepData
                };
                break;
                
            case 'community':
                onboarding.community = {
                    ...onboarding.community,
                    ...stepData
                };
                break;
                
            case 'preferences':
                onboarding.preferences = {
                    ...onboarding.preferences,
                    ...stepData
                };
                break;
        }
    }

    /**
     * Evento disparado quando o onboarding é completado
     * @param {string} userId - ID do usuário
     */
    async onOnboardingCompleted(userId) {
        try {
            // Concede pontos de gamificação
            await gamificationService.updateStreak(userId, 'onboarding_completed');
            
            // Cria quest de boas-vindas
            await gamificationService.createQuest({
                title: 'Bem-vindo ao ConnectFé!',
                description: 'Complete seu primeiro dia na plataforma',
                type: 'daily',
                category: 'community',
                objectives: [{
                    description: 'Primeiro dia ativo',
                    target: 1,
                    current: 0
                }],
                rewards: {
                    points: 50,
                    experience: 25
                },
                duration: 1
            }, userId);

            // Envia notificação de boas-vindas
            await notificationService.createNotification({
                userId,
                title: '🎉 Onboarding Concluído!',
                message: 'Parabéns! Você completou o onboarding e está pronto para usar o ConnectFé',
                type: 'achievement',
                category: 'achievements',
                priority: 'high',
                quickActions: [
                    {
                        type: 'explore_app',
                        label: 'Explorar App',
                        action: 'explore_app',
                        data: { section: 'home' }
                    },
                    {
                        type: 'join_community',
                        label: 'Participar da Comunidade',
                        action: 'join_community',
                        data: { type: 'welcome' }
                    }
                ],
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

            console.log(`Onboarding completado para usuário ${userId}`);
        } catch (error) {
            console.error('Erro ao processar conclusão do onboarding:', error);
        }
    }

    /**
     * Envia notificação de boas-vindas
     * @param {string} userId - ID do usuário
     */
    async sendWelcomeNotification(userId) {
        try {
            await notificationService.createNotification({
                userId,
                title: '🙏 Bem-vindo ao ConnectFé!',
                message: 'Vamos começar sua jornada de fé. Complete o onboarding para desbloquear todas as funcionalidades.',
                type: 'system_update',
                category: 'system',
                priority: 'high',
                quickActions: [
                    {
                        type: 'start_onboarding',
                        label: 'Começar Onboarding',
                        action: 'start_onboarding',
                        data: { step: 'welcome' }
                    }
                ],
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            });
        } catch (error) {
            console.error('Erro ao enviar notificação de boas-vindas:', error);
        }
    }

    /**
     * Obtém o progresso do onboarding de um usuário
     * @param {string} userId - ID do usuário
     * @returns {Object} Progresso do onboarding
     */
    async getOnboardingProgress(userId) {
        try {
            const onboarding = await CatholicOnboarding.findOne({ userId });
            if (!onboarding) {
                return {
                    status: 'not_started',
                    progress: 0,
                    currentStep: null,
                    totalSteps: this.defaultSteps.length,
                    completedSteps: 0
                };
            }

            const completedSteps = onboarding.steps.filter(s => s.isCompleted).length;
            const progress = (completedSteps / onboarding.steps.length) * 100;
            const currentStep = onboarding.steps.find(s => !s.isCompleted);

            return {
                status: onboarding.status,
                progress: Math.round(progress),
                currentStep: currentStep ? currentStep.id : null,
                totalSteps: onboarding.steps.length,
                completedSteps: completedSteps,
                steps: onboarding.steps
            };
        } catch (error) {
            throw new Error(`Erro ao obter progresso: ${error.message}`);
        }
    }

    /**
     * Pula um passo do onboarding
     * @param {string} userId - ID do usuário
     * @param {string} stepId - ID do passo
     * @returns {Object} Onboarding atualizado
     */
    async skipOnboardingStep(userId, stepId) {
        try {
            const onboarding = await CatholicOnboarding.findOne({ userId });
            if (!onboarding) {
                throw new Error('Onboarding não encontrado');
            }

            const step = onboarding.steps.find(s => s.id === stepId);
            if (!step) {
                throw new Error('Passo não encontrado');
            }

            if (step.isRequired) {
                throw new Error('Não é possível pular passos obrigatórios');
            }

            step.isCompleted = true;
            step.completedAt = new Date();
            step.skipped = true;

            await onboarding.save();
            return onboarding;
        } catch (error) {
            throw new Error(`Erro ao pular passo: ${error.message}`);
        }
    }

    /**
     * Reinicia o onboarding de um usuário
     * @param {string} userId - ID do usuário
     * @returns {Object} Onboarding reiniciado
     */
    async restartOnboarding(userId) {
        try {
            const onboarding = await CatholicOnboarding.findOne({ userId });
            if (!onboarding) {
                return await this.startOnboarding(userId);
            }

            // Reseta todos os passos
            onboarding.steps = this.defaultSteps.map(step => ({ ...step }));
            onboarding.status = 'in_progress';
            onboarding.completedAt = null;
            onboarding.faithDeclaration = { isCatholic: false };
            onboarding.churchInfo = {};
            onboarding.sacraments = {};
            onboarding.prayerLife = {};
            onboarding.community = {};
            onboarding.preferences = {};

            await onboarding.save();
            return onboarding;
        } catch (error) {
            throw new Error(`Erro ao reiniciar onboarding: ${error.message}`);
        }
    }

    /**
     * Obtém estatísticas do onboarding
     * @returns {Object} Estatísticas
     */
    async getOnboardingStats() {
        try {
            const [total, completed, inProgress, notStarted] = await Promise.all([
                CatholicOnboarding.countDocuments(),
                CatholicOnboarding.countDocuments({ status: 'completed' }),
                CatholicOnboarding.countDocuments({ status: 'in_progress' }),
                CatholicOnboarding.countDocuments({ status: 'not_started' })
            ]);

            const completionRate = total > 0 ? (completed / total) * 100 : 0;

            return {
                total,
                completed,
                inProgress,
                notStarted,
                completionRate: Math.round(completionRate),
                averageCompletionTime: await this.calculateAverageCompletionTime()
            };
        } catch (error) {
            throw new Error(`Erro ao obter estatísticas: ${error.message}`);
        }
    }

    /**
     * Calcula o tempo médio de conclusão
     * @returns {number} Tempo médio em dias
     */
    async calculateAverageCompletionTime() {
        try {
            const completedOnboardings = await CatholicOnboarding.find({
                status: 'completed',
                startedAt: { $exists: true },
                completedAt: { $exists: true }
            });

            if (completedOnboardings.length === 0) return 0;

            const totalDays = completedOnboardings.reduce((sum, onboarding) => {
                const startDate = new Date(onboarding.startedAt);
                const endDate = new Date(onboarding.completedAt);
                const diffTime = Math.abs(endDate - startDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return sum + diffDays;
            }, 0);

            return Math.round(totalDays / completedOnboardings.length);
        } catch (error) {
            console.error('Erro ao calcular tempo médio:', error);
            return 0;
        }
    }

    /**
     * Valida se um usuário pode pular um passo
     * @param {string} userId - ID do usuário
     * @param {string} stepId - ID do passo
     * @returns {boolean} Pode pular
     */
    async canSkipStep(userId, stepId) {
        try {
            const onboarding = await CatholicOnboarding.findOne({ userId });
            if (!onboarding) return false;

            const step = onboarding.steps.find(s => s.id === stepId);
            if (!step) return false;

            return !step.isRequired;
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtém o próximo passo recomendado
     * @param {string} userId - ID do usuário
     * @returns {Object} Próximo passo
     */
    async getNextRecommendedStep(userId) {
        try {
            const onboarding = await CatholicOnboarding.findOne({ userId });
            if (!onboarding) return this.defaultSteps[0];

            const nextStep = onboarding.steps.find(s => !s.isCompleted);
            return nextStep || null;
        } catch (error) {
            return null;
        }
    }
}

module.exports = new CatholicOnboardingService();