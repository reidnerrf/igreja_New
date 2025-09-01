/**
 * Configuração do Sistema de Live Chat
 * ConnectFé - Chat ao Vivo Moderado
 */

const path = require('path');
const fs = require('fs');

class LiveChatConfig {
    constructor() {
        this.configs = {};
        this.loadConfigurations();
    }

    /**
     * Carrega as configurações das variáveis de ambiente
     */
    loadConfigurations() {
        // Configurações Gerais do Live Chat
        this.configs.general = {
            enabled: process.env.FEATURE_LIVE_CHAT === 'true',
            environment: process.env.NODE_ENV || 'development',
            debug: process.env.DEBUG === 'true',
            logLevel: process.env.LOG_LEVEL || 'info'
        };

        // WebSocket
        this.configs.websocket = {
            enabled: process.env.WEBSOCKET_ENABLED === 'true',
            port: parseInt(process.env.WEBSOCKET_PORT) || 3002,
            path: process.env.WEBSOCKET_PATH || '/socket.io',
            cors: {
                origin: process.env.WEBSOCKET_CORS_ORIGIN || '*',
                methods: ['GET', 'POST'],
                credentials: true
            },
            maxConnections: parseInt(process.env.WEBSOCKET_MAX_CONNECTIONS) || 1000,
            heartbeatInterval: parseInt(process.env.WEBSOCKET_HEARTBEAT_INTERVAL) || 30000,
            messageQueueSize: parseInt(process.env.WEBSOCKET_MESSAGE_QUEUE_SIZE) || 100
        };

        // Configurações do Chat
        this.configs.chat = {
            maxMessages: parseInt(process.env.CHAT_MAX_MESSAGES) || 1000,
            messageRetentionHours: parseInt(process.env.CHAT_MESSAGE_RETENTION_HOURS) || 24,
            slowModeDefaultInterval: parseInt(process.env.CHAT_SLOW_MODE_DEFAULT_INTERVAL) || 5,
            maxMessageLength: parseInt(process.env.CHAT_MAX_MESSAGE_LENGTH) || 500,
            allowEmojis: process.env.CHAT_ALLOW_EMOJIS === 'true',
            allowLinks: process.env.CHAT_ALLOW_LINKS === 'true',
            allowImages: process.env.CHAT_ALLOW_IMAGES === 'true',
            allowVideos: process.env.CHAT_ALLOW_VIDEOS === 'true',
            allowFiles: process.env.CHAT_ALLOW_FILES === 'true',
            maxFileSize: parseInt(process.env.CHAT_MAX_FILE_SIZE) || 10485760, // 10MB
            allowedFileTypes: (process.env.CHAT_ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,mp4,mov,pdf,doc,docx').split(',')
        };

        // Sistema de Reações
        this.configs.reactions = {
            enabled: process.env.CHAT_REACTIONS_ENABLED === 'true',
            maxReactionsPerMessage: parseInt(process.env.CHAT_MAX_REACTIONS_PER_MESSAGE) || 10,
            customReactions: process.env.CHAT_CUSTOM_REACTIONS === 'true',
            defaultReactions: ['👍', '❤️', '😊', '🙏', '🎉', '🔥', '💯', '👏', '🤔', '😢'],
            reactionCooldown: parseInt(process.env.CHAT_REACTION_COOLDOWN) || 1000, // 1s
            reactionLimitPerUser: parseInt(process.env.CHAT_REACTION_LIMIT_PER_USER) || 3
        };

        // Sistema de Enquetes
        this.configs.polls = {
            enabled: process.env.CHAT_POLLS_ENABLED === 'true',
            maxPollsPerStream: parseInt(process.env.CHAT_MAX_POLLS_PER_STREAM) || 5,
            maxOptionsPerPoll: parseInt(process.env.CHAT_MAX_OPTIONS_PER_POLL) || 6,
            pollDuration: parseInt(process.env.CHAT_POLL_DURATION) || 300000, // 5min
            allowMultipleVotes: process.env.CHAT_ALLOW_MULTIPLE_VOTES === 'true',
            showResults: process.env.CHAT_SHOW_POLL_RESULTS === 'true',
            allowAnonymousVotes: process.env.CHAT_ALLOW_ANONYMOUS_VOTES === 'true'
        };

        // Sistema de Badges
        this.configs.badges = {
            enabled: process.env.CHAT_BADGES_ENABLED === 'true',
            types: {
                moderator: {
                    name: 'Moderador',
                    color: '#ff4444',
                    icon: '🛡️',
                    permissions: ['delete', 'warn', 'ban', 'pin', 'slow_mode']
                },
                host: {
                    name: 'Host',
                    color: '#ff8800',
                    icon: '👑',
                    permissions: ['delete', 'warn', 'pin', 'slow_mode', 'polls']
                },
                trusted: {
                    name: 'Confiável',
                    color: '#00aa00',
                    icon: '✅',
                    permissions: ['pin']
                },
                subscriber: {
                    name: 'Inscrito',
                    color: '#8800ff',
                    icon: '💎',
                    permissions: []
                },
                vip: {
                    name: 'VIP',
                    color: '#ff00ff',
                    icon: '⭐',
                    permissions: []
                }
            },
            autoAward: process.env.CHAT_BADGES_AUTO_AWARD === 'true',
            customBadges: process.env.CHAT_CUSTOM_BADGES === 'true'
        };

        // Sistema de Moderação
        this.configs.moderation = {
            enabled: process.env.CHAT_MODERATION_ENABLED === 'true',
            autoModeration: process.env.CHAT_AUTO_MODERATION === 'true',
            autoModerationLevel: process.env.CHAT_AUTO_MODERATION_LEVEL || 'medium',
            forbiddenWords: process.env.CHAT_FORBIDDEN_WORDS_FILE || './config/forbidden-words.txt',
            spamDetection: process.env.CHAT_SPAM_DETECTION === 'true',
            spamThreshold: parseInt(process.env.CHAT_SPAM_THRESHOLD) || 5,
            spamTimeWindow: parseInt(process.env.CHAT_SPAM_TIME_WINDOW) || 10000, // 10s
            linkModeration: process.env.CHAT_LINK_MODERATION === 'true',
            imageModeration: process.env.CHAT_IMAGE_MODERATION === 'true',
            profanityFilter: process.env.CHAT_PROFANITY_FILTER === 'true',
            capsLockFilter: process.env.CHAT_CAPS_LOCK_FILTER === 'true',
            capsLockThreshold: parseFloat(process.env.CHAT_CAPS_LOCK_THRESHOLD) || 0.7
        };

        // Ações de Moderação
        this.configs.moderationActions = {
            delete: {
                enabled: true,
                cooldown: 0,
                requiresPermission: 'delete'
            },
            warn: {
                enabled: true,
                cooldown: 5000, // 5s
                requiresPermission: 'warn',
                maxWarnings: 3
            },
            ban: {
                enabled: true,
                cooldown: 10000, // 10s
                requiresPermission: 'ban',
                duration: parseInt(process.env.CHAT_BAN_DURATION) || 3600000, // 1h
                permanent: process.env.CHAT_PERMANENT_BAN === 'true'
            },
            timeout: {
                enabled: true,
                cooldown: 5000, // 5s
                requiresPermission: 'timeout',
                defaultDuration: parseInt(process.env.CHAT_TIMEOUT_DURATION) || 300000 // 5min
            },
            pin: {
                enabled: true,
                cooldown: 0,
                requiresPermission: 'pin',
                maxPinnedMessages: parseInt(process.env.CHAT_MAX_PINNED_MESSAGES) || 3
            },
            slowMode: {
                enabled: true,
                cooldown: 0,
                requiresPermission: 'slow_mode',
                defaultInterval: parseInt(process.env.CHAT_SLOW_MODE_DEFAULT_INTERVAL) || 5
            }
        };

        // Configurações de Stream
        this.configs.stream = {
            maxDuration: parseInt(process.env.CHAT_STREAM_MAX_DURATION) || 7200000, // 2h
            autoEnd: process.env.CHAT_STREAM_AUTO_END === 'true',
            recording: process.env.CHAT_STREAM_RECORDING === 'true',
            recordingPath: process.env.CHAT_STREAM_RECORDING_PATH || './recordings',
            quality: process.env.CHAT_STREAM_QUALITY || '720p',
            bitrate: parseInt(process.env.CHAT_STREAM_BITRATE) || 2500,
            fps: parseInt(process.env.CHAT_STREAM_FPS) || 30,
            resolution: process.env.CHAT_STREAM_RESOLUTION || '1280x720'
        };

        // Configurações de Usuários
        this.configs.users = {
            maxUsernameLength: parseInt(process.env.CHAT_MAX_USERNAME_LENGTH) || 20,
            allowAnonymous: process.env.CHAT_ALLOW_ANONYMOUS === 'true',
            requireAuthentication: process.env.CHAT_REQUIRE_AUTHENTICATION === 'true',
            userRoles: ['viewer', 'follower', 'subscriber', 'moderator', 'host', 'admin'],
            defaultRole: process.env.CHAT_DEFAULT_ROLE || 'viewer',
            rolePermissions: {
                viewer: ['read', 'react'],
                follower: ['read', 'react', 'vote'],
                subscriber: ['read', 'react', 'vote', 'custom_reactions'],
                moderator: ['read', 'react', 'vote', 'delete', 'warn', 'timeout', 'pin'],
                host: ['read', 'react', 'vote', 'delete', 'warn', 'pin', 'slow_mode', 'polls'],
                admin: ['read', 'react', 'vote', 'delete', 'warn', 'ban', 'pin', 'slow_mode', 'polls', 'manage_users']
            }
        };

        // Configurações de Notificações
        this.configs.notifications = {
            enabled: process.env.CHAT_NOTIFICATIONS_ENABLED === 'true',
            types: ['mention', 'reply', 'reaction', 'poll', 'moderation'],
            pushNotifications: process.env.CHAT_PUSH_NOTIFICATIONS === 'true',
            emailNotifications: process.env.CHAT_EMAIL_NOTIFICATIONS === 'true',
            inAppNotifications: process.env.CHAT_IN_APP_NOTIFICATIONS === 'true',
            soundEnabled: process.env.CHAT_SOUND_ENABLED === 'true',
            soundFile: process.env.CHAT_SOUND_FILE || './sounds/notification.mp3'
        };

        // Configurações de Analytics
        this.configs.analytics = {
            enabled: process.env.CHAT_ANALYTICS_ENABLED === 'true',
            trackMetrics: [
                'messages_sent', 'reactions_given', 'polls_created', 'polls_voted',
                'users_online', 'peak_concurrent_users', 'moderation_actions',
                'stream_duration', 'engagement_rate', 'spam_detected'
            ],
            retentionDays: parseInt(process.env.CHAT_ANALYTICS_RETENTION_DAYS) || 90,
            realTimeMetrics: process.env.CHAT_REALTIME_METRICS === 'true',
            exportFormats: (process.env.CHAT_EXPORT_FORMATS || 'json,csv,pdf').split(',')
        };

        // Configurações de Segurança
        this.configs.security = {
            enabled: process.env.CHAT_SECURITY_ENABLED === 'true',
            rateLimiting: process.env.CHAT_RATE_LIMITING === 'true',
            rateLimitWindow: parseInt(process.env.CHAT_RATE_LIMIT_WINDOW) || 60000, // 1min
            rateLimitMaxRequests: parseInt(process.env.CHAT_RATE_LIMIT_MAX_REQUESTS) || 30,
            contentFiltering: process.env.CHAT_CONTENT_FILTERING === 'true',
            maliciousLinkDetection: process.env.CHAT_MALICIOUS_LINK_DETECTION === 'true',
            ddosProtection: process.env.CHAT_DDOS_PROTECTION === 'true',
            encryption: process.env.CHAT_ENCRYPTION === 'true',
            sslRequired: process.env.CHAT_SSL_REQUIRED === 'true'
        };

        // Configurações de Performance
        this.configs.performance = {
            messageBatchSize: parseInt(process.env.CHAT_MESSAGE_BATCH_SIZE) || 50,
            messageFlushInterval: parseInt(process.env.CHAT_MESSAGE_FLUSH_INTERVAL) || 1000, // 1s
            cacheEnabled: process.env.CHAT_CACHE_ENABLED === 'true',
            cacheTTL: parseInt(process.env.CHAT_CACHE_TTL) || 300000, // 5min
            maxCacheSize: parseInt(process.env.CHAT_MAX_CACHE_SIZE) || 1000,
            compression: process.env.CHAT_COMPRESSION === 'true',
            compressionLevel: parseInt(process.env.CHAT_COMPRESSION_LEVEL) || 6
        };

        // Configurações de Integração
        this.configs.integration = {
            externalAPIs: process.env.CHAT_EXTERNAL_APIS === 'true',
            webhooks: process.env.CHAT_WEBHOOKS === 'true',
            webhookURL: process.env.CHAT_WEBHOOK_URL,
            webhookSecret: process.env.CHAT_WEBHOOK_SECRET,
            thirdPartyServices: {
                profanityFilter: process.env.CHAT_PROFANITY_FILTER_SERVICE,
                imageModeration: process.env.CHAT_IMAGE_MODERATION_SERVICE,
                sentimentAnalysis: process.env.CHAT_SENTIMENT_ANALYSIS_SERVICE
            }
        };

        // Configurações de Desenvolvimento
        this.configs.development = {
            hotReload: process.env.CHAT_HOT_RELOAD === 'true',
            sourceMaps: process.env.CHAT_SOURCE_MAPS === 'true',
            verboseLogging: process.env.CHAT_VERBOSE_LOGGING === 'true',
            mockData: process.env.CHAT_MOCK_DATA === 'true',
            testMode: process.env.CHAT_TEST_MODE === 'true',
            profiling: process.env.CHAT_PROFILING === 'true'
        };
    }

    /**
     * Obtém a configuração de uma seção específica
     * @param {string} section - Nome da seção
     * @returns {Object} Configuração da seção
     */
    getSectionConfig(section) {
        return this.configs[section] || null;
    }

    /**
     * Verifica se uma funcionalidade está habilitada
     * @param {string} feature - Nome da funcionalidade
     * @returns {boolean} Status de habilitação
     */
    isFeatureEnabled(feature) {
        const section = feature.split('.')[0];
        const key = feature.split('.')[1];
        
        if (section && key) {
            return this.configs[section] && this.configs[section][key];
        }
        
        return this.configs[feature] && this.configs[feature].enabled;
    }

    /**
     * Obtém todas as funcionalidades habilitadas
     * @returns {Array} Lista de funcionalidades habilitadas
     */
    getEnabledFeatures() {
        const enabled = [];
        
        Object.keys(this.configs).forEach(section => {
            if (this.configs[section].enabled) {
                enabled.push(section);
            }
        });
        
        return enabled;
    }

    /**
     * Obtém todas as configurações
     * @returns {Object} Todas as configurações
     */
    getAllConfigs() {
        return this.configs;
    }

    /**
     * Valida se uma configuração está completa
     * @param {string} section - Nome da seção
     * @returns {Object} Resultado da validação
     */
    validateSectionConfig(section) {
        const config = this.getSectionConfig(section);
        if (!config) {
            return {
                valid: false,
                error: `Seção '${section}' não encontrada`
            };
        }

        if (!config.enabled) {
            return {
                valid: false,
                error: `Seção '${section}' não está habilitada`
            };
        }

        // Validações específicas por seção
        const validations = {
            websocket: () => !!(config.port && config.path),
            chat: () => !!(config.maxMessages && config.messageRetentionHours),
            reactions: () => !!(config.maxReactionsPerMessage && config.defaultReactions.length > 0),
            polls: () => !!(config.maxPollsPerStream && config.maxOptionsPerPoll),
            badges: () => !!(config.types && Object.keys(config.types).length > 0),
            moderation: () => !!(config.autoModeration !== undefined && config.spamDetection !== undefined),
            moderationActions: () => !!(Object.keys(config).length > 0),
            stream: () => !!(config.maxDuration && config.quality),
            users: () => !!(config.maxUsernameLength && config.userRoles.length > 0),
            notifications: () => !!(config.types && config.types.length > 0),
            analytics: () => !!(config.trackMetrics && config.trackMetrics.length > 0),
            security: () => !!(config.rateLimiting !== undefined && config.contentFiltering !== undefined),
            performance: () => !!(config.messageBatchSize && config.messageFlushInterval),
            integration: () => !!(config.externalAPIs !== undefined && config.webhooks !== undefined)
        };

        const validationFunction = validations[section];
        if (!validationFunction) {
            return {
                valid: false,
                error: `Validação não implementada para '${section}'`
            };
        }

        const isValid = validationFunction();
        return {
            valid: isValid,
            error: isValid ? null : `Configuração incompleta para '${section}'`
        };
    }

    /**
     * Gera um relatório de status das configurações
     * @returns {Object} Relatório de status
     */
    getStatusReport() {
        const report = {
            total: Object.keys(this.configs).length,
            enabled: 0,
            disabled: 0,
            valid: 0,
            invalid: 0,
            sections: {}
        };

        Object.keys(this.configs).forEach(section => {
            const config = this.configs[section];
            const validation = this.validateSectionConfig(section);
            
            report.sections[section] = {
                enabled: config.enabled,
                valid: validation.valid,
                error: validation.error,
                config: config
            };

            if (config.enabled) report.enabled++;
            else report.disabled++;

            if (validation.valid) report.valid++;
            else report.invalid++;
        });

        return report;
    }

    /**
     * Exporta configurações para um arquivo
     * @param {string} filePath - Caminho do arquivo
     * @param {string} format - Formato (json, env)
     */
    exportConfig(filePath, format = 'json') {
        try {
            const exportData = {
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
                configs: this.configs,
                status: this.getStatusReport()
            };

            if (format === 'env') {
                let envContent = '# ConnectFé Live Chat Configuration\n';
                envContent += `# Generated: ${exportData.timestamp}\n\n`;
                
                Object.keys(this.configs).forEach(section => {
                    const config = this.configs[section];
                    envContent += `# ${section.toUpperCase()} CONFIGURATION\n`;
                    Object.keys(config).forEach(key => {
                        if (key !== 'enabled' && typeof config[key] !== 'object') {
                            envContent += `CHAT_${section.toUpperCase()}_${key.toUpperCase()}=${config[key]}\n`;
                        }
                    });
                    envContent += '\n';
                });

                fs.writeFileSync(filePath, envContent);
            } else {
                fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
            }

            return {
                success: true,
                message: `Configuração exportada para ${filePath}`,
                format: format
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Importa configurações de um arquivo
     * @param {string} filePath - Caminho do arquivo
     * @returns {Object} Resultado da importação
     */
    importConfig(filePath) {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`Arquivo não encontrado: ${filePath}`);
            }

            const fileContent = fs.readFileSync(filePath, 'utf8');
            const fileExtension = path.extname(filePath);

            let importData;
            if (fileExtension === '.env') {
                // Parse .env file
                const lines = fileContent.split('\n');
                importData = {};
                
                lines.forEach(line => {
                    if (line.trim() && !line.startsWith('#')) {
                        const [key, value] = line.split('=');
                        if (key && value) {
                            importData[key.trim()] = value.trim();
                        }
                    }
                });
            } else {
                // Parse JSON file
                importData = JSON.parse(fileContent);
            }

            // Atualiza as configurações
            if (importData.configs) {
                this.configs = { ...this.configs, ...importData.configs };
            }

            return {
                success: true,
                message: 'Configuração importada com sucesso',
                importedData: importData
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Reseta todas as configurações
     */
    resetConfigs() {
        this.configs = {};
        this.loadConfigurations();
    }

    /**
     * Atualiza uma configuração específica
     * @param {string} section - Nome da seção
     * @param {Object} newConfig - Nova configuração
     */
    updateSectionConfig(section, newConfig) {
        if (this.configs[section]) {
            this.configs[section] = {
                ...this.configs[section],
                ...newConfig
            };
        }
    }

    /**
     * Obtém estatísticas de uso das configurações
     * @returns {Object} Estatísticas
     */
    getUsageStats() {
        return {
            totalSections: Object.keys(this.configs).length,
            enabledSections: this.getEnabledFeatures().length,
            disabledSections: Object.keys(this.configs).length - this.getEnabledFeatures().length,
            validConfigs: this.getStatusReport().valid,
            invalidConfigs: this.getStatusReport().invalid
        };
    }
}

// Instância singleton
const liveChatConfig = new LiveChatConfig();

module.exports = liveChatConfig;