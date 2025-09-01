/**
 * Serviço de Animações de Conquista
 * ConnectFé - Sistema de Gamificação
 */

const EventEmitter = require('events');
const path = require('path');
const fs = require('fs');

class AchievementAnimationService extends EventEmitter {
    constructor() {
        super();
        this.animations = new Map();
        this.soundEffects = new Map();
        this.particleSystems = new Map();
        this.achievementQueue = [];
        this.isPlaying = false;
        
        this.loadAnimationConfigs();
        this.loadSoundEffects();
        this.setupParticleSystems();
    }

    /**
     * Carrega configurações de animações
     */
    loadAnimationConfigs() {
        this.animations = new Map([
            ['badge_earned', {
                name: 'Badge Conquistado',
                duration: 5000,
                type: 'slide_in',
                direction: 'top',
                easing: 'bounce',
                particles: true,
                sound: 'achievement_unlock',
                confetti: true,
                confettiConfig: {
                    count: 150,
                    colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
                    gravity: 0.8,
                    wind: 0.1,
                    lifetime: 3000
                }
            }],
            ['quest_completed', {
                name: 'Quest Completada',
                duration: 4000,
                type: 'scale_in',
                direction: 'center',
                easing: 'elastic',
                particles: true,
                sound: 'quest_complete',
                confetti: true,
                confettiConfig: {
                    count: 100,
                    colors: ['#FFD700', '#FF9800', '#4CAF50', '#2196F3', '#9C27B0'],
                    gravity: 0.6,
                    wind: 0.2,
                    lifetime: 2500
                }
            }],
            ['streak_milestone', {
                name: 'Marco de Streak',
                duration: 6000,
                type: 'fade_in',
                direction: 'bottom',
                easing: 'swing',
                particles: true,
                sound: 'streak_milestone',
                confetti: true,
                confettiConfig: {
                    count: 200,
                    colors: ['#FFD700', '#FF5722', '#E91E63', '#9C27B0', '#673AB7'],
                    gravity: 0.7,
                    wind: 0.15,
                    lifetime: 4000
                }
            }],
            ['level_up', {
                name: 'Subiu de Nível',
                duration: 7000,
                type: 'rotate_in',
                direction: 'center',
                easing: 'bounce',
                particles: true,
                sound: 'level_up',
                confetti: true,
                confettiConfig: {
                    count: 300,
                    colors: ['#FFD700', '#4CAF50', '#2196F3', '#FF9800', '#E91E63'],
                    gravity: 0.5,
                    wind: 0.1,
                    lifetime: 5000
                }
            }],
            ['special_achievement', {
                name: 'Conquista Especial',
                duration: 8000,
                type: 'zoom_in',
                direction: 'center',
                easing: 'back',
                particles: true,
                sound: 'special_achievement',
                confetti: true,
                confettiConfig: {
                    count: 500,
                    colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFE66D', '#FF6B6B'],
                    gravity: 0.4,
                    wind: 0.05,
                    lifetime: 6000
                }
            }]
        ]);
    }

    /**
     * Carrega efeitos sonoros
     */
    loadSoundEffects() {
        this.soundEffects = new Map([
            ['achievement_unlock', {
                name: 'Desbloqueio de Conquista',
                file: 'achievement_unlock.mp3',
                volume: 0.7,
                duration: 2000
            }],
            ['quest_complete', {
                name: 'Quest Completa',
                file: 'quest_complete.mp3',
                volume: 0.6,
                duration: 1500
            }],
            ['streak_milestone', {
                name: 'Marco de Streak',
                file: 'streak_milestone.mp3',
                volume: 0.8,
                duration: 3000
            }],
            ['level_up', {
                name: 'Subiu de Nível',
                file: 'level_up.mp3',
                volume: 0.9,
                duration: 4000
            }],
            ['special_achievement', {
                name: 'Conquista Especial',
                file: 'special_achievement.mp3',
                volume: 1.0,
                duration: 5000
            }],
            ['confetti_pop', {
                name: 'Pop de Confete',
                file: 'confetti_pop.mp3',
                volume: 0.4,
                duration: 500
            }],
            ['particle_effect', {
                name: 'Efeito de Partícula',
                file: 'particle_effect.mp3',
                volume: 0.3,
                duration: 800
            }]
        ]);
    }

    /**
     * Configura sistemas de partículas
     */
    setupParticleSystems() {
        this.particleSystems = new Map([
            ['sparkle', {
                name: 'Brilho',
                particleCount: 50,
                particleLife: 2000,
                particleSpeed: 2,
                particleSize: { min: 2, max: 6 },
                particleColor: '#FFD700',
                particleShape: 'circle',
                emissionRate: 100,
                gravity: 0.1,
                wind: 0.05
            }],
            ['firework', {
                name: 'Fogos de Artifício',
                particleCount: 100,
                particleLife: 3000,
                particleSpeed: 5,
                particleSize: { min: 3, max: 8 },
                particleColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
                particleShape: 'star',
                emissionRate: 200,
                gravity: 0.3,
                wind: 0.1
            }],
            ['magic', {
                name: 'Mágico',
                particleCount: 75,
                particleLife: 2500,
                particleSpeed: 3,
                particleSize: { min: 2, max: 7 },
                particleColor: ['#9C27B0', '#E91E63', '#FF9800', '#4CAF50'],
                particleShape: 'diamond',
                emissionRate: 150,
                gravity: 0.2,
                wind: 0.08
            }],
            ['celebration', {
                name: 'Celebração',
                particleCount: 200,
                particleLife: 4000,
                particleSpeed: 4,
                particleSize: { min: 4, max: 10 },
                particleColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
                particleShape: 'circle',
                emissionRate: 300,
                gravity: 0.4,
                wind: 0.15
            }]
        ]);
    }

    /**
     * Reproduz uma animação de conquista
     * @param {string} achievementType - Tipo de conquista
     * @param {Object} achievementData - Dados da conquista
     * @param {Object} options - Opções da animação
     */
    async playAchievementAnimation(achievementType, achievementData, options = {}) {
        const animation = this.animations.get(achievementType);
        
        if (!animation) {
            console.warn(`Tipo de animação não encontrado: ${achievementType}`);
            return;
        }

        // Adiciona à fila se já estiver reproduzindo
        if (this.isPlaying) {
            this.achievementQueue.push({ achievementType, achievementData, options });
            return;
        }

        this.isPlaying = true;

        try {
            // Emite evento de início da animação
            this.emit('animationStart', {
                type: achievementType,
                data: achievementData,
                config: animation
            });

            // Reproduz som
            if (animation.sound && options.playSound !== false) {
                await this.playSound(animation.sound, options.soundVolume);
            }

            // Cria cartão de conquista
            const achievementCard = this.createAchievementCard(achievementData, animation);

            // Reproduz animação do cartão
            await this.animateCard(achievementCard, animation);

            // Ativa sistema de partículas
            if (animation.particles) {
                await this.activateParticleSystem(achievementType, achievementData);
            }

            // Ativa confetes
            if (animation.confetti) {
                await this.activateConfetti(animation.confettiConfig, achievementData);
            }

            // Aguarda duração da animação
            await this.wait(animation.duration);

            // Emite evento de conclusão da animação
            this.emit('animationComplete', {
                type: achievementType,
                data: achievementData,
                config: animation
            });

        } catch (error) {
            console.error('Erro ao reproduzir animação:', error);
            this.emit('animationError', { error, achievementType, achievementData });
        } finally {
            this.isPlaying = false;
            
            // Processa próxima animação na fila
            if (this.achievementQueue.length > 0) {
                const next = this.achievementQueue.shift();
                setTimeout(() => {
                    this.playAchievementAnimation(next.achievementType, next.achievementData, next.options);
                }, 500);
            }
        }
    }

    /**
     * Cria cartão de conquista
     * @param {Object} achievementData - Dados da conquista
     * @param {Object} animation - Configuração da animação
     * @returns {Object} Cartão da conquista
     */
    createAchievementCard(achievementData, animation) {
        const card = {
            id: `achievement-${Date.now()}`,
            title: achievementData.title || 'Conquista!',
            description: achievementData.description || 'Parabéns pela conquista!',
            icon: achievementData.icon || '🏆',
            color: achievementData.color || '#FFD700',
            type: achievementData.type || 'achievement',
            rarity: achievementData.rarity || 'common',
            points: achievementData.points || 0,
            timestamp: new Date(),
            animation: animation
        };

        // Adiciona dados específicos baseados no tipo
        switch (achievementData.type) {
            case 'badge':
                card.badgeLevel = achievementData.level || 1;
                card.badgeCategory = achievementData.category || 'general';
                break;
            case 'quest':
                card.questDifficulty = achievementData.difficulty || 'medium';
                card.questCategory = achievementData.category || 'general';
                break;
            case 'streak':
                card.streakDays = achievementData.days || 0;
                card.streakType = achievementData.streakType || 'daily';
                break;
            case 'level':
                card.oldLevel = achievementData.oldLevel || 1;
                card.newLevel = achievementData.newLevel || 2;
                card.levelRewards = achievementData.rewards || [];
                break;
        }

        return card;
    }

    /**
     * Anima o cartão de conquista
     * @param {Object} card - Cartão da conquista
     * @param {Object} animation - Configuração da animação
     */
    async animateCard(card, animation) {
        return new Promise((resolve) => {
            // Emite evento de criação do cartão
            this.emit('cardCreated', { card, animation });

            // Simula animação baseada no tipo
            setTimeout(() => {
                this.emit('cardAnimated', { card, animation });
                resolve();
            }, 1000);
        });
    }

    /**
     * Ativa sistema de partículas
     * @param {string} achievementType - Tipo de conquista
     * @param {Object} achievementData - Dados da conquista
     */
    async activateParticleSystem(achievementType, achievementData) {
        const particleSystem = this.particleSystems.get('celebration');
        
        if (!particleSystem) return;

        // Emite evento de ativação do sistema de partículas
        this.emit('particleSystemActivated', {
            system: particleSystem,
            achievementType,
            achievementData
        });

        // Simula duração do sistema de partículas
        await this.wait(particleSystem.particleLife);
    }

    /**
     * Ativa sistema de confetes
     * @param {Object} confettiConfig - Configuração dos confetes
     * @param {Object} achievementData - Dados da conquista
     */
    async activateConfetti(confettiConfig, achievementData) {
        // Emite evento de ativação dos confetes
        this.emit('confettiActivated', {
            config: confettiConfig,
            achievementData
        });

        // Simula duração dos confetes
        await this.wait(confettiConfig.lifetime);
    }

    /**
     * Reproduz efeito sonoro
     * @param {string} soundName - Nome do som
     * @param {number} volume - Volume (0-1)
     */
    async playSound(soundName, volume = 1.0) {
        const sound = this.soundEffects.get(soundName);
        
        if (!sound) {
            console.warn(`Som não encontrado: ${soundName}`);
            return;
        }

        // Emite evento de reprodução do som
        this.emit('soundPlayed', {
            sound: sound,
            volume: volume
        });

        // Simula duração do som
        await this.wait(sound.duration);
    }

    /**
     * Cria animação customizada
     * @param {Object} config - Configuração da animação
     * @returns {string} ID da animação criada
     */
    createCustomAnimation(config) {
        const animationId = `custom-${Date.now()}`;
        
        const customAnimation = {
            name: config.name || 'Animação Customizada',
            duration: config.duration || 5000,
            type: config.type || 'fade_in',
            direction: config.direction || 'center',
            easing: config.easing || 'linear',
            particles: config.particles || false,
            sound: config.sound || null,
            confetti: config.confetti || false,
            confettiConfig: config.confettiConfig || this.animations.get('badge_earned').confettiConfig,
            customEffects: config.customEffects || []
        };

        this.animations.set(animationId, customAnimation);
        
        // Emite evento de criação da animação customizada
        this.emit('customAnimationCreated', {
            id: animationId,
            animation: customAnimation
        });

        return animationId;
    }

    /**
     * Remove animação customizada
     * @param {string} animationId - ID da animação
     */
    removeCustomAnimation(animationId) {
        if (this.animations.has(animationId) && animationId.startsWith('custom-')) {
            this.animations.delete(animationId);
            
            // Emite evento de remoção da animação
            this.emit('customAnimationRemoved', { id: animationId });
        }
    }

    /**
     * Obtém estatísticas das animações
     * @returns {Object} Estatísticas
     */
    getAnimationStats() {
        const totalAnimations = this.animations.size;
        const customAnimations = Array.from(this.animations.keys()).filter(key => key.startsWith('custom-')).length;
        const builtInAnimations = totalAnimations - customAnimations;
        
        return {
            total: totalAnimations,
            builtIn: builtInAnimations,
            custom: customAnimations,
            queueLength: this.achievementQueue.length,
            isPlaying: this.isPlaying,
            soundEffects: this.soundEffects.size,
            particleSystems: this.particleSystems.size
        };
    }

    /**
     * Limpa fila de animações
     */
    clearQueue() {
        const clearedCount = this.achievementQueue.length;
        this.achievementQueue = [];
        
        // Emite evento de limpeza da fila
        this.emit('queueCleared', { clearedCount });
        
        return clearedCount;
    }

    /**
     * Pausa todas as animações
     */
    pauseAnimations() {
        this.isPlaying = true; // Impede novas animações
        
        // Emite evento de pausa
        this.emit('animationsPaused');
    }

    /**
     * Resume animações
     */
    resumeAnimations() {
        this.isPlaying = false;
        
        // Emite evento de retomada
        this.emit('animationsResumed');
        
        // Processa fila se houver
        if (this.achievementQueue.length > 0) {
            const next = this.achievementQueue.shift();
            setTimeout(() => {
                this.playAchievementAnimation(next.achievementType, next.achievementData, next.options);
            }, 500);
        }
    }

    /**
     * Obtém configuração de animação
     * @param {string} animationType - Tipo da animação
     * @returns {Object} Configuração da animação
     */
    getAnimationConfig(animationType) {
        return this.animations.get(animationType);
    }

    /**
     * Lista todas as animações disponíveis
     * @returns {Array} Lista de animações
     */
    listAnimations() {
        return Array.from(this.animations.entries()).map(([id, config]) => ({
            id,
            name: config.name,
            duration: config.duration,
            type: config.type,
            hasParticles: config.particles,
            hasSound: !!config.sound,
            hasConfetti: config.confetti
        }));
    }

    /**
     * Lista todos os efeitos sonoros
     * @returns {Array} Lista de efeitos sonoros
     */
    listSoundEffects() {
        return Array.from(this.soundEffects.entries()).map(([id, config]) => ({
            id,
            name: config.name,
            file: config.file,
            volume: config.volume,
            duration: config.duration
        }));
    }

    /**
     * Lista todos os sistemas de partículas
     * @returns {Array} Lista de sistemas de partículas
     */
    listParticleSystems() {
        return Array.from(this.particleSystems.entries()).map(([id, config]) => ({
            id,
            name: config.name,
            particleCount: config.particleCount,
            particleLife: config.particleLife,
            particleSpeed: config.particleSpeed,
            particleSize: config.particleSize,
            particleColor: config.particleColor
        }));
    }

    /**
     * Utilitário para aguardar tempo
     * @param {number} ms - Milissegundos para aguardar
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Gera dados de exemplo para teste
     * @param {string} type - Tipo de conquista
     * @returns {Object} Dados de exemplo
     */
    generateSampleData(type = 'badge') {
        const sampleData = {
            badge: {
                title: 'Primeiro Passo',
                description: 'Completou seu primeiro objetivo!',
                icon: '🌟',
                color: '#FFD700',
                type: 'badge',
                rarity: 'common',
                points: 10,
                level: 1,
                category: 'beginner'
            },
            quest: {
                title: 'Oração Diária',
                description: 'Manteve uma semana de orações!',
                icon: '🙏',
                color: '#4CAF50',
                type: 'quest',
                rarity: 'uncommon',
                points: 25,
                difficulty: 'easy',
                category: 'spiritual'
            },
            streak: {
                title: '7 Dias de Streak',
                description: 'Manteve um streak de 7 dias!',
                icon: '🔥',
                color: '#FF9800',
                type: 'streak',
                rarity: 'rare',
                points: 50,
                days: 7,
                streakType: 'daily'
            },
            level: {
                title: 'Nível 5 Alcançado',
                description: 'Subiu para o nível 5!',
                icon: '⭐',
                color: '#2196F3',
                type: 'level',
                rarity: 'epic',
                points: 100,
                oldLevel: 4,
                newLevel: 5,
                rewards: ['Badge Especial', '100 Pontos', 'Tema Exclusivo']
            }
        };

        return sampleData[type] || sampleData.badge;
    }

    /**
     * Testa todas as animações disponíveis
     */
    async testAllAnimations() {
        console.log('🧪 Testando todas as animações...');
        
        for (const [type, config] of this.animations) {
            console.log(`🎬 Testando: ${config.name}`);
            
            const sampleData = this.generateSampleData(type.split('_')[0]);
            await this.playAchievementAnimation(type, sampleData, { playSound: false });
            
            // Aguarda entre animações
            await this.wait(1000);
        }
        
        console.log('✅ Teste de animações concluído!');
    }
}

// Instância singleton
const achievementAnimationService = new AchievementAnimationService();

// Event listeners para logging
achievementAnimationService.on('animationStart', (data) => {
    console.log(`🎬 Animação iniciada: ${data.type}`);
});

achievementAnimationService.on('animationComplete', (data) => {
    console.log(`✅ Animação concluída: ${data.type}`);
});

achievementAnimationService.on('animationError', (data) => {
    console.error(`❌ Erro na animação: ${data.achievementType}`, data.error);
});

module.exports = achievementAnimationService;