/**
 * Serviço de Gamificação
 * ConnectFé - Sistema de Gamificação com Animações
 */

const Quest = require('../models/Quest');
const Streak = require('../models/Streak');
const Badge = require('../models/Badge');
const User = require('../models/User');
const cron = require('node-cron');

class GamificationService {
    constructor() {
        this.initializeScheduledTasks();
    }

    /**
     * Inicializa tarefas agendadas
     */
    initializeScheduledTasks() {
        // Verifica streaks diariamente às 00:01
        cron.schedule('1 0 * * *', () => {
            this.checkDailyStreaks();
        });

        // Gera novas quests semanais aos domingos às 06:00
        cron.schedule('0 6 * * 0', () => {
            this.generateWeeklyQuests();
        });

        // Limpa quests expiradas diariamente às 02:00
        cron.schedule('0 2 * * *', () => {
            this.cleanupExpiredQuests();
        });
    }

    /**
     * Cria uma nova quest para um usuário
     * @param {Object} questData - Dados da quest
     * @param {string} userId - ID do usuário
     * @returns {Object} Quest criada
     */
    async createQuest(questData, userId) {
        try {
            const quest = new Quest({
                ...questData,
                userId: userId,
                status: 'active',
                progress: 0
            });

            await quest.save();
            return quest;
        } catch (error) {
            throw new Error(`Erro ao criar quest: ${error.message}`);
        }
    }

    /**
     * Gera quests semanais para todos os usuários
     */
    async generateWeeklyQuests() {
        try {
            const users = await User.find({ userType: 'user' });
            
            for (const user of users) {
                await this.generateUserWeeklyQuests(user._id);
            }
        } catch (error) {
            console.error('Erro ao gerar quests semanais:', error);
        }
    }

    /**
     * Gera quests semanais para um usuário específico
     * @param {string} userId - ID do usuário
     */
    async generateUserWeeklyQuests(userId) {
        const weeklyQuests = [
            {
                title: 'Oração Diária',
                description: 'Reze pelo menos uma vez por dia durante a semana',
                type: 'weekly',
                category: 'prayer',
                objectives: [{
                    description: 'Dias de oração',
                    target: 7,
                    current: 0
                }],
                rewards: {
                    points: 100,
                    experience: 50
                },
                duration: 7
            },
            {
                title: 'Caridade Semanal',
                description: 'Realize pelo menos 3 atos de caridade',
                type: 'weekly',
                category: 'charity',
                objectives: [{
                    description: 'Atos de caridade',
                    target: 3,
                    current: 0
                }],
                rewards: {
                    points: 75,
                    experience: 40
                },
                duration: 7
            },
            {
                title: 'Comunidade Ativa',
                description: 'Participe de pelo menos 2 eventos da comunidade',
                type: 'weekly',
                category: 'community',
                objectives: [{
                    description: 'Eventos participados',
                    target: 2,
                    current: 0
                }],
                rewards: {
                    points: 80,
                    experience: 45
                },
                duration: 7
            }
        ];

        for (const questData of weeklyQuests) {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 7);

            await this.createQuest({
                ...questData,
                startDate,
                endDate
            }, userId);
        }
    }

    /**
     * Atualiza o progresso de uma quest
     * @param {string} questId - ID da quest
     * @param {number} progress - Progresso atual
     * @returns {Object} Quest atualizada
     */
    async updateQuestProgress(questId, progress) {
        try {
            const quest = await Quest.findById(questId);
            if (!quest) {
                throw new Error('Quest não encontrada');
            }

            quest.progress = Math.min(progress, 100);
            
            // Verifica se a quest foi completada
            if (quest.progress >= 100 && quest.status === 'active') {
                quest.status = 'completed';
                quest.completedAt = new Date();
                
                // Concede recompensas
                await this.grantQuestRewards(quest);
            }

            await quest.save();
            return quest;
        } catch (error) {
            throw new Error(`Erro ao atualizar progresso: ${error.message}`);
        }
    }

    /**
     * Concede recompensas de uma quest completada
     * @param {Object} quest - Quest completada
     */
    async grantQuestRewards(quest) {
        try {
            const user = await User.findById(quest.userId);
            if (!user) return;

            // Adiciona pontos
            user.gamification.points += quest.rewards.points || 0;
            
            // Adiciona experiência
            user.gamification.points += quest.rewards.experience || 0;

            // Adiciona ao histórico
            user.gamification.history.push({
                type: 'quest_completed',
                points: quest.rewards.points || 0,
                context: `Quest: ${quest.title}`,
                createdAt: new Date()
            });

            await user.save();

            // Dispara evento de conquista
            this.triggerAchievementEvent(user._id, 'quest_completed', quest);
        } catch (error) {
            console.error('Erro ao conceder recompensas:', error);
        }
    }

    /**
     * Cria ou atualiza o streak de um usuário
     * @param {string} userId - ID do usuário
     * @param {string} activity - Tipo de atividade
     * @returns {Object} Streak atualizado
     */
    async updateStreak(userId, activity) {
        try {
            let streak = await Streak.findOne({ userId });
            
            if (!streak) {
                streak = new Streak({ userId });
            }

            const today = new Date();
            const lastCheckIn = streak.lastCheckIn;
            
            // Verifica se é o mesmo dia
            if (lastCheckIn && this.isSameDay(lastCheckIn, today)) {
                // Atualiza atividade do dia
                const todayCheckIn = streak.checkIns.find(checkIn => 
                    this.isSameDay(checkIn.date, today)
                );
                
                if (todayCheckIn) {
                    todayCheckIn.activity = activity;
                    todayCheckIn.points += 5; // Bônus por múltiplas atividades
                }
            } else {
                // Verifica se é o dia seguinte (streak continua)
                if (lastCheckIn && this.isNextDay(lastCheckIn, today)) {
                    streak.currentStreak++;
                } else if (lastCheckIn && !this.isNextDay(lastCheckIn, today)) {
                    // Streak quebrado
                    if (streak.currentStreak > streak.longestStreak) {
                        streak.longestStreak = streak.currentStreak;
                    }
                    streak.currentStreak = 1;
                    streak.currentStreakStart = today;
                } else {
                    // Primeiro check-in
                    streak.currentStreak = 1;
                    streak.currentStreakStart = today;
                }

                // Adiciona novo check-in
                streak.checkIns.push({
                    date: today,
                    activity: activity,
                    points: 10,
                    completedAt: today
                });

                streak.lastCheckIn = today;
            }

            // Atualiza estatísticas
            streak.stats.totalCheckIns = streak.checkIns.length;
            streak.stats.totalDays = new Set(
                streak.checkIns.map(checkIn => 
                    checkIn.date.toDateString()
                )
            ).size;

            await streak.save();

            // Verifica marcos do streak
            await this.checkStreakMilestones(streak);

            return streak;
        } catch (error) {
            throw new Error(`Erro ao atualizar streak: ${error.message}`);
        }
    }

    /**
     * Verifica marcos do streak e concede recompensas
     * @param {Object} streak - Objeto streak
     */
    async checkStreakMilestones(streak) {
        const milestones = [7, 14, 30, 60, 100];
        const currentStreak = streak.currentStreak;

        for (const milestone of milestones) {
            if (currentStreak === milestone) {
                // Concede recompensa
                const points = milestone * 10;
                await this.grantStreakReward(streak.userId, milestone, points);
                
                // Dispara evento de conquista
                this.triggerAchievementEvent(streak.userId, 'streak_milestone', {
                    days: milestone,
                    points: points
                });
                break;
            }
        }
    }

    /**
     * Concede recompensa por marco do streak
     * @param {string} userId - ID do usuário
     * @param {number} milestone - Marco alcançado
     * @param {number} points - Pontos a conceder
     */
    async grantStreakReward(userId, milestone, points) {
        try {
            const user = await User.findById(userId);
            if (!user) return;

            user.gamification.points += points;
            
            user.gamification.history.push({
                type: 'streak_milestone',
                points: points,
                context: `${milestone} dias de streak`,
                createdAt: new Date()
            });

            await user.save();
        } catch (error) {
            console.error('Erro ao conceder recompensa do streak:', error);
        }
    }

    /**
     * Verifica streaks diários
     */
    async checkDailyStreaks() {
        try {
            const streaks = await Streak.find({});
            
            for (const streak of streaks) {
                const today = new Date();
                const lastCheckIn = streak.lastCheckIn;
                
                // Se não fez check-in ontem, envia lembrete
                if (lastCheckIn && !this.isNextDay(lastCheckIn, today)) {
                    await this.sendStreakReminder(streak.userId);
                }
            }
        } catch (error) {
            console.error('Erro ao verificar streaks diários:', error);
        }
    }

    /**
     * Envia lembrete de streak
     * @param {string} userId - ID do usuário
     */
    async sendStreakReminder(userId) {
        // Aqui você implementaria o envio de notificação
        // Por enquanto, apenas log
        console.log(`Lembrete de streak enviado para usuário ${userId}`);
    }

    /**
     * Limpa quests expiradas
     */
    async cleanupExpiredQuests() {
        try {
            const expiredQuests = await Quest.find({
                endDate: { $lt: new Date() },
                status: 'active'
            });

            for (const quest of expiredQuests) {
                quest.status = 'expired';
                await quest.save();
            }
        } catch (error) {
            console.error('Erro ao limpar quests expiradas:', error);
        }
    }

    /**
     * Dispara evento de conquista
     * @param {string} userId - ID do usuário
     * @param {string} type - Tipo de conquista
     * @param {Object} data - Dados da conquista
     */
    triggerAchievementEvent(userId, type, data) {
        // Aqui você implementaria o envio de notificação
        // e animação de conquista
        console.log(`Conquista desbloqueada: ${type} para usuário ${userId}`, data);
    }

    /**
     * Obtém estatísticas de gamificação de um usuário
     * @param {string} userId - ID do usuário
     * @returns {Object} Estatísticas
     */
    async getUserGamificationStats(userId) {
        try {
            const [user, quests, streak] = await Promise.all([
                User.findById(userId),
                Quest.find({ userId }),
                Streak.findOne({ userId })
            ]);

            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            const activeQuests = quests.filter(q => q.status === 'active');
            const completedQuests = quests.filter(q => q.status === 'completed');
            const totalPoints = user.gamification.points;
            const totalBadges = user.gamification.badges.length;

            return {
                points: totalPoints,
                badges: totalBadges,
                activeQuests: activeQuests.length,
                completedQuests: completedQuests.length,
                currentStreak: streak ? streak.currentStreak : 0,
                longestStreak: streak ? streak.longestStreak : 0,
                totalCheckIns: streak ? streak.stats.totalCheckIns : 0
            };
        } catch (error) {
            throw new Error(`Erro ao obter estatísticas: ${error.message}`);
        }
    }

    /**
     * Verifica se duas datas são do mesmo dia
     * @param {Date} date1 - Primeira data
     * @param {Date} date2 - Segunda data
     * @returns {boolean} São do mesmo dia
     */
    isSameDay(date1, date2) {
        return date1.toDateString() === date2.toDateString();
    }

    /**
     * Verifica se uma data é o dia seguinte a outra
     * @param {Date} date1 - Primeira data
     * @param {Date} date2 - Segunda data
     * @returns {boolean} É o dia seguinte
     */
    isNextDay(date1, date2) {
        const nextDay = new Date(date1);
        nextDay.setDate(nextDay.getDate() + 1);
        return this.isSameDay(nextDay, date2);
    }
}

module.exports = new GamificationService();