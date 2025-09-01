/**
 * Serviço de Notificações com Ações Rápidas
 * ConnectFé - Sistema de Notificações Avançado
 */

const QuickActionNotification = require('../models/QuickActionNotification');
const User = require('../models/User');
const cron = require('node-cron');

class NotificationService {
    constructor() {
        this.initializeScheduledTasks();
    }

    /**
     * Inicializa tarefas agendadas
     */
    initializeScheduledTasks() {
        // Limpa notificações expiradas diariamente às 03:00
        cron.schedule('0 3 * * *', () => {
            this.cleanupExpiredNotifications();
        });

        // Envia lembretes de eventos às 08:00
        cron.schedule('0 8 * * *', () => {
            this.sendEventReminders();
        });

        // Envia lembretes de oração às 07:00
        cron.schedule('0 7 * * *', () => {
            this.sendPrayerReminders();
        });
    }

    /**
     * Cria uma nova notificação com ações rápidas
     * @param {Object} notificationData - Dados da notificação
     * @returns {Object} Notificação criada
     */
    async createNotification(notificationData) {
        try {
            const notification = new QuickActionNotification(notificationData);
            await notification.save();
            
            // Envia notificação push se configurado
            if (notification.userId) {
                await this.sendPushNotification(notification);
            }
            
            return notification;
        } catch (error) {
            throw new Error(`Erro ao criar notificação: ${error.message}`);
        }
    }

    /**
     * Cria notificação de lembrete de evento
     * @param {string} userId - ID do usuário
     * @param {Object} eventData - Dados do evento
     * @returns {Object} Notificação criada
     */
    async createEventReminder(userId, eventData) {
        const notificationData = {
            userId: userId,
            title: `Lembrete: ${eventData.title}`,
            message: `O evento ${eventData.title} começa em ${eventData.startTime}`,
            type: 'event_reminder',
            category: 'events',
            priority: 'medium',
            quickActions: [
                {
                    type: 'confirm_presence',
                    label: 'Confirmar Presença',
                    action: 'confirm_presence',
                    data: { eventId: eventData._id }
                },
                {
                    type: 'join_event',
                    label: 'Participar',
                    action: 'join_event',
                    data: { eventId: eventData._id }
                }
            ],
            expiresAt: new Date(eventData.startTime)
        };

        return await this.createNotification(notificationData);
    }

    /**
     * Cria notificação de pedido de oração
     * @param {string} userId - ID do usuário
     * @param {Object} prayerData - Dados da oração
     * @returns {Object} Notificação criada
     */
    async createPrayerRequest(userId, prayerData) {
        const notificationData = {
            userId: userId,
            title: 'Pedido de Oração',
            message: `Alguém pediu orações por: ${prayerData.intention}`,
            type: 'prayer_request',
            category: 'prayer',
            priority: 'high',
            quickActions: [
                {
                    type: 'pray',
                    label: 'Orar Agora',
                    action: 'pray',
                    data: { prayerId: prayerData._id }
                },
                {
                    type: 'mark_prayed',
                    label: 'Marcar como Orado',
                    action: 'mark_prayed',
                    data: { prayerId: prayerData._id }
                }
            ],
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
        };

        return await this.createNotification(notificationData);
    }

    /**
     * Cria notificação de lembrete de doação
     * @param {string} userId - ID do usuário
     * @param {Object} donationData - Dados da doação
     * @returns {Object} Notificação criada
     */
    async createDonationReminder(userId, donationData) {
        const notificationData = {
            userId: userId,
            title: 'Lembrete de Doação',
            message: `Sua doação mensal para ${donationData.campaign} vence em breve`,
            type: 'donation_reminder',
            category: 'charity',
            priority: 'medium',
            quickActions: [
                {
                    type: 'donate',
                    label: 'Doar Agora',
                    action: 'donate',
                    data: { campaignId: donationData.campaignId }
                },
                {
                    type: 'schedule_donation',
                    label: 'Agendar',
                    action: 'schedule_donation',
                    data: { campaignId: donationData.campaignId }
                }
            ],
            expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 dias
        };

        return await this.createNotification(notificationData);
    }

    /**
     * Cria notificação de conquista
     * @param {string} userId - ID do usuário
     * @param {Object} achievementData - Dados da conquista
     * @returns {Object} Notificação criada
     */
    async createAchievementNotification(userId, achievementData) {
        const notificationData = {
            userId: userId,
            title: '🎉 Nova Conquista!',
            message: `Parabéns! Você desbloqueou: ${achievementData.title}`,
            type: 'achievement',
            category: 'achievements',
            priority: 'high',
            quickActions: [
                {
                    type: 'view_achievement',
                    label: 'Ver Detalhes',
                    action: 'view_achievement',
                    data: { achievementId: achievementData._id }
                },
                {
                    type: 'share_achievement',
                    label: 'Compartilhar',
                    action: 'share_achievement',
                    data: { achievementId: achievementData._id }
                }
            ],
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
        };

        return await this.createNotification(notificationData);
    }

    /**
     * Cria notificação de lembrete de streak
     * @param {string} userId - ID do usuário
     * @param {Object} streakData - Dados do streak
     * @returns {Object} Notificação criada
     */
    async createStreakReminder(userId, streakData) {
        const notificationData = {
            userId: userId,
            title: '🔥 Mantenha seu Streak!',
            message: `Você tem um streak de ${streakData.currentStreak} dias. Não quebre hoje!`,
            type: 'streak_reminder',
            category: 'achievements',
            priority: 'medium',
            quickActions: [
                {
                    type: 'check_in',
                    label: 'Fazer Check-in',
                    action: 'check_in',
                    data: { activity: 'general' }
                },
                {
                    type: 'pray',
                    label: 'Orar Agora',
                    action: 'pray',
                    data: { type: 'daily' }
                }
            ],
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
        };

        return await this.createNotification(notificationData);
    }

    /**
     * Processa uma ação rápida de notificação
     * @param {string} notificationId - ID da notificação
     * @param {string} actionType - Tipo de ação
     * @param {Object} actionData - Dados da ação
     * @returns {Object} Resultado da ação
     */
    async processQuickAction(notificationId, actionType, actionData) {
        try {
            const notification = await QuickActionNotification.findById(notificationId);
            if (!notification) {
                throw new Error('Notificação não encontrada');
            }

            // Marca como processada
            notification.status = 'actioned';
            notification.processedAt = new Date();
            notification.processedAction = actionType;
            await notification.save();

            // Processa a ação específica
            let result;
            switch (actionType) {
                case 'confirm_presence':
                    result = await this.processConfirmPresence(actionData);
                    break;
                case 'join_event':
                    result = await this.processJoinEvent(actionData);
                    break;
                case 'pray':
                    result = await this.processPray(actionData);
                    break;
                case 'donate':
                    result = await this.processDonate(actionData);
                    break;
                case 'check_in':
                    result = await this.processCheckIn(actionData);
                    break;
                default:
                    result = { success: false, message: 'Ação não reconhecida' };
            }

            return {
                success: true,
                notification: notification,
                actionResult: result
            };
        } catch (error) {
            throw new Error(`Erro ao processar ação rápida: ${error.message}`);
        }
    }

    /**
     * Processa confirmação de presença
     * @param {Object} actionData - Dados da ação
     * @returns {Object} Resultado
     */
    async processConfirmPresence(actionData) {
        try {
            // Aqui você implementaria a lógica de confirmação de presença
            // Por enquanto, apenas retorna sucesso
            return {
                success: true,
                message: 'Presença confirmada com sucesso!',
                eventId: actionData.eventId
            };
        } catch (error) {
            return {
                success: false,
                message: `Erro ao confirmar presença: ${error.message}`
            };
        }
    }

    /**
     * Processa participação em evento
     * @param {Object} actionData - Dados da ação
     * @returns {Object} Resultado
     */
    async processJoinEvent(actionData) {
        try {
            // Aqui você implementaria a lógica de participação no evento
            return {
                success: true,
                message: 'Você foi adicionado ao evento!',
                eventId: actionData.eventId
            };
        } catch (error) {
            return {
                success: false,
                message: `Erro ao participar do evento: ${error.message}`
            };
        }
    }

    /**
     * Processa ação de oração
     * @param {Object} actionData - Dados da ação
     * @returns {Object} Resultado
     */
    async processPray(actionData) {
        try {
            // Aqui você implementaria a lógica de registro de oração
            return {
                success: true,
                message: 'Oração registrada! Deus abençoe você.',
                prayerId: actionData.prayerId,
                type: actionData.type
            };
        } catch (error) {
            return {
                success: false,
                message: `Erro ao registrar oração: ${error.message}`
            };
        }
    }

    /**
     * Processa ação de doação
     * @param {Object} actionData - Dados da ação
     * @returns {Object} Resultado
     */
    async processDonate(actionData) {
        try {
            // Aqui você implementaria a lógica de processamento de doação
            return {
                success: true,
                message: 'Redirecionando para página de doação...',
                campaignId: actionData.campaignId
            };
        } catch (error) {
            return {
                success: false,
                message: `Erro ao processar doação: ${error.message}`
            };
        }
    }

    /**
     * Processa ação de check-in
     * @param {Object} actionData - Dados da ação
     * @returns {Object} Resultado
     */
    async processCheckIn(actionData) {
        try {
            // Aqui você implementaria a lógica de check-in
            return {
                success: true,
                message: 'Check-in realizado com sucesso!',
                activity: actionData.activity
            };
        } catch (error) {
            return {
                success: false,
                message: `Erro ao fazer check-in: ${error.message}`
            };
        }
    }

    /**
     * Envia notificação push
     * @param {Object} notification - Notificação
     */
    async sendPushNotification(notification) {
        try {
            const user = await User.findById(notification.userId);
            if (!user || !user.expoPushToken) return;

            // Aqui você implementaria o envio via Expo Push Notifications
            // Por enquanto, apenas log
            console.log(`Push notification enviada para ${user.email}: ${notification.title}`);
        } catch (error) {
            console.error('Erro ao enviar push notification:', error);
        }
    }

    /**
     * Envia lembretes de eventos
     */
    async sendEventReminders() {
        try {
            // Aqui você implementaria a lógica de envio de lembretes
            // Por enquanto, apenas log
            console.log('Enviando lembretes de eventos...');
        } catch (error) {
            console.error('Erro ao enviar lembretes de eventos:', error);
        }
    }

    /**
     * Envia lembretes de oração
     */
    async sendPrayerReminders() {
        try {
            // Aqui você implementaria a lógica de envio de lembretes de oração
            console.log('Enviando lembretes de oração...');
        } catch (error) {
            console.error('Erro ao enviar lembretes de oração:', error);
        }
    }

    /**
     * Limpa notificações expiradas
     */
    async cleanupExpiredNotifications() {
        try {
            const expiredNotifications = await QuickActionNotification.find({
                expiresAt: { $lt: new Date() },
                status: { $nin: ['actioned', 'dismissed'] }
            });

            for (const notification of expiredNotifications) {
                notification.status = 'expired';
                await notification.save();
            }

            console.log(`${expiredNotifications.length} notificações expiradas foram limpas`);
        } catch (error) {
            console.error('Erro ao limpar notificações expiradas:', error);
        }
    }

    /**
     * Obtém notificações de um usuário
     * @param {string} userId - ID do usuário
     * @param {Object} filters - Filtros opcionais
     * @returns {Array} Lista de notificações
     */
    async getUserNotifications(userId, filters = {}) {
        try {
            const query = { userId, ...filters };
            
            if (filters.status) {
                query.status = filters.status;
            }
            
            if (filters.category) {
                query.category = filters.category;
            }

            const notifications = await QuickActionNotification.find(query)
                .sort({ createdAt: -1 })
                .limit(filters.limit || 50);

            return notifications;
        } catch (error) {
            throw new Error(`Erro ao obter notificações: ${error.message}`);
        }
    }

    /**
     * Marca notificação como lida
     * @param {string} notificationId - ID da notificação
     * @returns {Object} Notificação atualizada
     */
    async markAsRead(notificationId) {
        try {
            const notification = await QuickActionNotification.findById(notificationId);
            if (!notification) {
                throw new Error('Notificação não encontrada');
            }

            notification.status = 'read';
            notification.readAt = new Date();
            await notification.save();

            return notification;
        } catch (error) {
            throw new Error(`Erro ao marcar como lida: ${error.message}`);
        }
    }

    /**
     * Desmarca notificação
     * @param {string} notificationId - ID da notificação
     * @returns {Object} Notificação atualizada
     */
    async dismissNotification(notificationId) {
        try {
            const notification = await QuickActionNotification.findById(notificationId);
            if (!notification) {
                throw new Error('Notificação não encontrada');
            }

            notification.status = 'dismissed';
            notification.dismissedAt = new Date();
            await notification.save();

            return notification;
        } catch (error) {
            throw new Error(`Erro ao desmarcar notificação: ${error.message}`);
        }
    }

    /**
     * Obtém estatísticas de notificações de um usuário
     * @param {string} userId - ID do usuário
     * @returns {Object} Estatísticas
     */
    async getUserNotificationStats(userId) {
        try {
            const [total, unread, actioned, dismissed] = await Promise.all([
                QuickActionNotification.countDocuments({ userId }),
                QuickActionNotification.countDocuments({ userId, status: 'unread' }),
                QuickActionNotification.countDocuments({ userId, status: 'actioned' }),
                QuickActionNotification.countDocuments({ userId, status: 'dismissed' })
            ]);

            return {
                total,
                unread,
                actioned,
                dismissed,
                read: total - unread - actioned - dismissed
            };
        } catch (error) {
            throw new Error(`Erro ao obter estatísticas: ${error.message}`);
        }
    }
}

module.exports = new NotificationService();