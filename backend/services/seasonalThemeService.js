/**
 * Serviço de Temas Sazonais Católicos
 * ConnectFé - Sistema de Temas Automáticos
 */

const catholicThemeConfig = require('../config/catholic-theme');
const gamificationService = require('./gamificationService');
const notificationService = require('./notificationService');
const cron = require('node-cron');

class SeasonalThemeService {
    constructor() {
        this.currentTheme = null;
        this.initializeScheduledTasks();
        this.loadCurrentTheme();
    }

    /**
     * Inicializa tarefas agendadas
     */
    initializeScheduledTasks() {
        // Verifica mudança de tema diariamente às 00:00
        cron.schedule('0 0 * * *', () => {
            this.checkThemeChange();
        });

        // Verifica datas especiais a cada hora
        cron.schedule('0 * * * *', () => {
            this.checkSpecialDates();
        });
    }

    /**
     * Carrega o tema atual
     */
    loadCurrentTheme() {
        this.currentTheme = catholicThemeConfig.getCurrentTheme();
        console.log(`Tema atual carregado: ${this.currentTheme.data.name}`);
    }

    /**
     * Verifica se houve mudança de tema
     */
    async checkThemeChange() {
        const newTheme = catholicThemeConfig.getCurrentTheme();
        
        if (this.currentTheme && 
            this.currentTheme.data.name !== newTheme.data.name) {
            
            console.log(`Mudança de tema detectada: ${this.currentTheme.data.name} → ${newTheme.data.name}`);
            
            // Atualiza tema atual
            this.currentTheme = newTheme;
            
            // Dispara eventos de mudança de tema
            await this.onThemeChange(newTheme);
        }
    }

    /**
     * Verifica datas especiais
     */
    async checkSpecialDates() {
        const today = new Date();
        const theme = catholicThemeConfig.getCurrentTheme(today);
        
        if (theme.type === 'special' || theme.type === 'movable') {
            await this.onSpecialDate(theme);
        }
    }

    /**
     * Evento disparado quando há mudança de tema
     * @param {Object} newTheme - Novo tema
     */
    async onThemeChange(newTheme) {
        try {
            // Cria quests especiais para o novo tema
            await this.createSeasonalQuests(newTheme);
            
            // Envia notificações sobre a mudança de tema
            await this.sendThemeChangeNotifications(newTheme);
            
            // Atualiza configurações visuais
            await this.updateVisualSettings(newTheme);
            
        } catch (error) {
            console.error('Erro ao processar mudança de tema:', error);
        }
    }

    /**
     * Evento disparado em datas especiais
     * @param {Object} specialDate - Data especial
     */
    async onSpecialDate(specialDate) {
        try {
            // Cria quests especiais para a data
            await this.createSpecialDateQuests(specialDate);
            
            // Envia notificações especiais
            await this.sendSpecialDateNotifications(specialDate);
            
            // Concede bônus especiais
            await this.grantSpecialDateBonuses(specialDate);
            
        } catch (error) {
            console.error('Erro ao processar data especial:', error);
        }
    }

    /**
     * Cria quests sazonais baseadas no tema atual
     * @param {Object} theme - Tema atual
     */
    async createSeasonalQuests(theme) {
        try {
            const seasonalQuests = this.getSeasonalQuests(theme);
            
            // Obtém todos os usuários
            const User = require('../models/User');
            const users = await User.find({ userType: 'user' });
            
            for (const user of users) {
                for (const questData of seasonalQuests) {
                    await gamificationService.createQuest(questData, user._id);
                }
            }
            
            console.log(`${seasonalQuests.length} quests sazonais criadas para ${users.length} usuários`);
        } catch (error) {
            console.error('Erro ao criar quests sazonais:', error);
        }
    }

    /**
     * Obtém quests sazonais para um tema específico
     * @param {Object} theme - Tema
     * @returns {Array} Lista de quests
     */
    getSeasonalQuests(theme) {
        const quests = [];
        
        switch (theme.data.name) {
            case 'Advento':
                quests.push({
                    title: 'Preparação para o Natal',
                    description: 'Prepare seu coração para celebrar o nascimento de Jesus',
                    type: 'seasonal',
                    category: 'worship',
                    objectives: [{
                        description: 'Dias de preparação',
                        target: 24,
                        current: 0
                    }],
                    rewards: {
                        points: 200,
                        experience: 100
                    },
                    duration: 24
                });
                break;
                
            case 'Natal':
                quests.push({
                    title: 'Celebração do Natal',
                    description: 'Celebre o nascimento de Jesus com alegria e gratidão',
                    type: 'seasonal',
                    category: 'worship',
                    objectives: [{
                        description: 'Dias de celebração',
                        target: 12,
                        current: 0
                    }],
                    rewards: {
                        points: 150,
                        experience: 75
                    },
                    duration: 12
                });
                break;
                
            case 'Quaresma':
                quests.push({
                    title: 'Jornada Quaresmal',
                    description: 'Acompanhe Jesus em sua jornada para a Páscoa',
                    type: 'seasonal',
                    category: 'reflection',
                    objectives: [{
                        description: 'Dias de penitência',
                        target: 40,
                        current: 0
                    }],
                    rewards: {
                        points: 300,
                        experience: 150
                    },
                    duration: 40
                });
                break;
                
            case 'Páscoa':
                quests.push({
                    title: 'Tempo Pascal',
                    description: 'Celebre a ressurreição de Jesus Cristo',
                    type: 'seasonal',
                    category: 'worship',
                    objectives: [{
                        description: 'Dias de celebração',
                        target: 50,
                        current: 0
                    }],
                    rewards: {
                        points: 250,
                        experience: 125
                    },
                    duration: 50
                });
                break;
                
            case 'Pentecostes':
                quests.push({
                    title: 'Fogo do Espírito',
                    description: 'Deixe o Espírito Santo guiar suas ações',
                    type: 'seasonal',
                    category: 'community',
                    objectives: [{
                        description: 'Atos guiados pelo Espírito',
                        target: 7,
                        current: 0
                    }],
                    rewards: {
                        points: 100,
                        experience: 50
                    },
                    duration: 7
                });
                break;
        }
        
        return quests;
    }

    /**
     * Cria quests para datas especiais
     * @param {Object} specialDate - Data especial
     */
    async createSpecialDateQuests(specialDate) {
        try {
            const specialQuests = this.getSpecialDateQuests(specialDate);
            
            if (specialQuests.length === 0) return;
            
            const User = require('../models/User');
            const users = await User.find({ userType: 'user' });
            
            for (const user of users) {
                for (const questData of specialQuests) {
                    await gamificationService.createQuest(questData, user._id);
                }
            }
            
            console.log(`${specialQuests.length} quests especiais criadas para ${specialDate.name}`);
        } catch (error) {
            console.error('Erro ao criar quests especiais:', error);
        }
    }

    /**
     * Obtém quests para datas especiais
     * @param {Object} specialDate - Data especial
     * @returns {Array} Lista de quests
     */
    getSpecialDateQuests(specialDate) {
        const quests = [];
        
        switch (specialDate.name) {
            case 'Nossa Senhora Aparecida':
                quests.push({
                    title: 'Padroeira do Brasil',
                    description: 'Honre Nossa Senhora Aparecida com orações especiais',
                    type: 'special',
                    category: 'prayer',
                    objectives: [{
                        description: 'Orações à Padroeira',
                        target: 3,
                        current: 0
                    }],
                    rewards: {
                        points: 100,
                        experience: 50
                    },
                    duration: 1
                });
                break;
                
            case 'Corpus Christi':
                quests.push({
                    title: 'Corpo de Cristo',
                    description: 'Participe da procissão e adoração ao Santíssimo',
                    type: 'special',
                    category: 'worship',
                    objectives: [{
                        description: 'Participação na celebração',
                        target: 1,
                        current: 0
                    }],
                    rewards: {
                        points: 150,
                        experience: 75
                    },
                    duration: 1
                });
                break;
                
            case 'Finados':
                quests.push({
                    title: 'Oração pelos Fiéis Defuntos',
                    description: 'Reze pelos que partiram para a casa do Pai',
                    type: 'special',
                    category: 'prayer',
                    objectives: [{
                        description: 'Orações pelos defuntos',
                        target: 5,
                        current: 0
                    }],
                    rewards: {
                        points: 80,
                        experience: 40
                    },
                    duration: 1
                });
                break;
        }
        
        return quests;
    }

    /**
     * Envia notificações sobre mudança de tema
     * @param {Object} theme - Novo tema
     */
    async sendThemeChangeNotifications(theme) {
        try {
            const User = require('../models/User');
            const users = await User.find({ userType: 'user' });
            
            for (const user of users) {
                await notificationService.createNotification({
                    userId: user._id,
                    title: `🎨 Novo Tema: ${theme.data.name}`,
                    message: theme.data.description,
                    type: 'system_update',
                    category: 'system',
                    priority: 'medium',
                    quickActions: [
                        {
                            type: 'view_theme',
                            label: 'Ver Detalhes',
                            action: 'view_theme',
                            data: { themeName: theme.data.name }
                        }
                    ],
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                });
            }
            
            console.log(`Notificações de mudança de tema enviadas para ${users.length} usuários`);
        } catch (error) {
            console.error('Erro ao enviar notificações de mudança de tema:', error);
        }
    }

    /**
     * Envia notificações para datas especiais
     * @param {Object} specialDate - Data especial
     */
    async sendSpecialDateNotifications(specialDate) {
        try {
            const User = require('../models/User');
            const users = await User.find({ userType: 'user' });
            
            for (const user of users) {
                await notificationService.createNotification({
                    userId: user._id,
                    title: `🎉 ${specialDate.name}`,
                    message: specialDate.description,
                    type: 'special_date',
                    category: 'spiritual',
                    priority: 'high',
                    quickActions: [
                        {
                            type: 'celebrate',
                            label: 'Celebrar',
                            action: 'celebrate',
                            data: { dateName: specialDate.name }
                        },
                        {
                            type: 'pray',
                            label: 'Orar',
                            action: 'pray',
                            data: { intention: specialDate.name }
                        }
                    ],
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                });
            }
            
            console.log(`Notificações de data especial enviadas para ${users.length} usuários`);
        } catch (error) {
            console.error('Erro ao enviar notificações de data especial:', error);
        }
    }

    /**
     * Concede bônus especiais para datas especiais
     * @param {Object} specialDate - Data especial
     */
    async grantSpecialDateBonuses(specialDate) {
        try {
            const User = require('../models/User');
            const users = await User.find({ userType: 'user' });
            
            const bonusPoints = this.getSpecialDateBonus(specialDate);
            
            for (const user of users) {
                user.gamification.points += bonusPoints;
                
                user.gamification.history.push({
                    type: 'special_date_bonus',
                    points: bonusPoints,
                    context: `Bônus: ${specialDate.name}`,
                    createdAt: new Date()
                });
                
                await user.save();
            }
            
            console.log(`Bônus de ${bonusPoints} pontos concedidos para ${specialDate.name}`);
        } catch (error) {
            console.error('Erro ao conceder bônus de data especial:', error);
        }
    }

    /**
     * Obtém bônus para uma data especial
     * @param {Object} specialDate - Data especial
     * @returns {number} Pontos de bônus
     */
    getSpecialDateBonus(specialDate) {
        switch (specialDate.type) {
            case 'solemnity':
                return 100;
            case 'feast':
                return 75;
            case 'memorial':
                return 50;
            case 'commemoration':
                return 25;
            default:
                return 25;
        }
    }

    /**
     * Atualiza configurações visuais baseadas no tema
     * @param {Object} theme - Tema atual
     */
    async updateVisualSettings(theme) {
        try {
            // Aqui você implementaria a atualização das configurações visuais
            // Por exemplo, atualizar cores do app, ícones, etc.
            console.log(`Configurações visuais atualizadas para o tema: ${theme.data.name}`);
        } catch (error) {
            console.error('Erro ao atualizar configurações visuais:', error);
        }
    }

    /**
     * Obtém o tema atual
     * @returns {Object} Tema atual
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Obtém o tema para uma data específica
     * @param {Date} date - Data
     * @returns {Object} Tema da data
     */
    getThemeForDate(date) {
        return catholicThemeConfig.getCurrentTheme(date);
    }

    /**
     * Obtém o calendário litúrgico de um ano
     * @param {number} year - Ano
     * @returns {Object} Calendário litúrgico
     */
    getLiturgicalCalendar(year) {
        return catholicThemeConfig.getLiturgicalCalendar(year);
    }

    /**
     * Obtém as próximas datas especiais
     * @param {number} count - Número de datas
     * @returns {Array} Próximas datas especiais
     */
    getUpcomingSpecialDates(count = 10) {
        return catholicThemeConfig.getUpcomingSpecialDates(count);
    }

    /**
     * Verifica se uma data é feriado
     * @param {string} date - Data
     * @returns {boolean} É feriado
     */
    isHoliday(date) {
        return catholicThemeConfig.isHoliday(date);
    }

    /**
     * Obtém estatísticas dos temas
     * @returns {Object} Estatísticas
     */
    getThemeStats() {
        return catholicThemeConfig.getThemeStats();
    }
}

module.exports = new SeasonalThemeService();