/**
 * Configuração Principal do Sistema
 * ConnectFé - Configurações Centralizadas
 */

const path = require('path');
const fs = require('fs');
const socialAPIConfig = require('./social-apis');
const mlAnalyticsConfig = require('./ml-analytics');
const liveChatConfig = require('./live-chat');

class ConnectFeConfig {
    constructor() {
        this.configs = {};
        this.loadAllConfigurations();
    }

    /**
     * Carrega todas as configurações do sistema
     */
    loadAllConfigurations() {
        // Configurações do Sistema Principal
        this.configs.system = {
            name: 'ConnectFé',
            version: process.env.APP_VERSION || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            debug: process.env.DEBUG === 'true',
            logLevel: process.env.LOG_LEVEL || 'info',
            timezone: process.env.TZ || 'America/Sao_Paulo',
            locale: process.env.DEFAULT_LOCALE || 'pt-BR'
        };

        // Configurações do Servidor
        this.configs.server = {
            port: parseInt(process.env.PORT) || 3001,
            host: process.env.HOST || 'localhost',
            ssl: {
                enabled: process.env.SSL_ENABLED === 'true',
                keyPath: process.env.SSL_KEY_PATH,
                certPath: process.env.SSL_CERT_PATH
            },
            cors: {
                origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
            },
            rateLimit: {
                windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15min
                maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
            }
        };

        // Configurações do Banco de Dados
        this.configs.database = {
            mongodb: {
                uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/connectfe',
                uriProd: process.env.MONGODB_URI_PROD,
                options: {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE) || 10,
                    serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT) || 5000,
                    socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT) || 45000
                }
            },
            redis: {
                enabled: process.env.REDIS_ENABLED === 'true',
                url: process.env.REDIS_URL || 'redis://localhost:6379',
                password: process.env.REDIS_PASSWORD || null,
                options: {
                    retryDelayOnFailover: 100,
                    maxRetriesPerRequest: 3
                }
            }
        };

        // Configurações de Autenticação
        this.configs.auth = {
            jwt: {
                secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
                expiresIn: process.env.JWT_EXPIRES_IN || '7d',
                refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
            },
            bcrypt: {
                saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12
            },
            oauth: {
                google: {
                    enabled: process.env.OAUTH_GOOGLE_ENABLED === 'true',
                    clientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
                    clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET
                },
                facebook: {
                    enabled: process.env.OAUTH_FACEBOOK_ENABLED === 'true',
                    clientId: process.env.OAUTH_FACEBOOK_CLIENT_ID,
                    clientSecret: process.env.OAUTH_FACEBOOK_CLIENT_SECRET
                }
            },
            twoFactor: {
                enabled: process.env.TWO_FACTOR_ENABLED === 'true',
                issuer: process.env.TWO_FACTOR_ISSUER || 'ConnectFé'
            }
        };

        // Configurações de Upload
        this.configs.upload = {
            enabled: process.env.UPLOAD_ENABLED === 'true',
            directory: process.env.UPLOAD_DIR || 'uploads',
            thumbnailDirectory: process.env.THUMBNAIL_DIR || 'thumbnails',
            maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
            maxFiles: parseInt(process.env.MAX_FILES) || 10,
            allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(','),
            compression: {
                enabled: process.env.IMAGE_COMPRESSION_ENABLED === 'true',
                quality: parseInt(process.env.IMAGE_COMPRESSION_QUALITY) || 80,
                maxWidth: parseInt(process.env.IMAGE_MAX_WIDTH) || 1920,
                maxHeight: parseInt(process.env.IMAGE_MAX_HEIGHT) || 1080
            },
            thumbnails: {
                enabled: process.env.THUMBNAILS_ENABLED === 'true',
                sizes: [
                    { name: 'small', width: 150, height: 150 },
                    { name: 'medium', width: 300, height: 300 },
                    { name: 'large', width: 600, height: 600 }
                ]
            },
            cleanup: {
                enabled: process.env.AUTO_CLEANUP_ENABLED === 'true',
                interval: parseInt(process.env.AUTO_CLEANUP_INTERVAL) || 86400000, // 24h
                retentionDays: parseInt(process.env.FILE_RETENTION_DAYS) || 30
            }
        };

        // Configurações de Email
        this.configs.email = {
            enabled: process.env.EMAIL_NOTIFICATIONS_ENABLED === 'true',
            smtp: {
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === 'true',
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            templates: {
                directory: process.env.EMAIL_TEMPLATES_DIR || './templates/emails',
                defaultLanguage: process.env.EMAIL_DEFAULT_LANGUAGE || 'pt-BR'
            },
            from: {
                name: process.env.EMAIL_FROM_NAME || 'ConnectFé',
                address: process.env.EMAIL_FROM_ADDRESS || 'noreply@connectfe.com'
            }
        };

        // Configurações de Push Notifications
        this.configs.pushNotifications = {
            enabled: process.env.PUSH_NOTIFICATIONS_ENABLED === 'true',
            expo: {
                accessToken: process.env.EXPO_ACCESS_TOKEN,
                projectId: process.env.EXPO_PROJECT_ID
            },
            firebase: {
                enabled: process.env.FIREBASE_ENABLED === 'true',
                serviceAccountKey: process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
                projectId: process.env.FIREBASE_PROJECT_ID
            }
        };

        // Configurações de Gamificação
        this.configs.gamification = {
            enabled: process.env.GAMIFICATION_ENABLED === 'true',
            points: {
                enabled: process.env.POINTS_ENABLED === 'true',
                multiplier: parseFloat(process.env.POINTS_MULTIPLIER) || 1.0,
                actions: {
                    post_created: 10,
                    post_liked: 1,
                    post_shared: 5,
                    event_joined: 15,
                    donation_made: 25,
                    prayer_requested: 8,
                    checkin_made: 12
                }
            },
            badges: {
                enabled: process.env.BADGES_ENABLED === 'true',
                autoAward: process.env.BADGES_AUTO_AWARD === 'true',
                customBadges: process.env.CUSTOM_BADGES_ENABLED === 'true'
            },
            leaderboards: {
                enabled: process.env.LEADERBOARD_ENABLED === 'true',
                updateInterval: parseInt(process.env.LEADERBOARD_UPDATE_INTERVAL) || 3600000 // 1h
            }
        };

        // Configurações de Moderação
        this.configs.moderation = {
            enabled: process.env.AUTO_MODERATION_ENABLED === 'true',
            level: process.env.AUTO_MODERATION_LEVEL || 'medium',
            contentFilters: {
                enabled: process.env.CONTENT_FILTERS_ENABLED === 'true',
                forbiddenWordsFile: process.env.FORBIDDEN_WORDS_FILE || './config/forbidden-words.txt',
                profanityFilter: process.env.PROFANITY_FILTER_ENABLED === 'true',
                spamDetection: process.env.SPAM_DETECTION_ENABLED === 'true'
            },
            userManagement: {
                autoBan: process.env.AUTO_BAN_ENABLED === 'true',
                maxWarnings: parseInt(process.env.MAX_WARNINGS) || 3,
                banDuration: parseInt(process.env.BAN_DURATION) || 3600000 // 1h
            }
        };

        // Configurações de Analytics
        this.configs.analytics = {
            enabled: process.env.ANALYTICS_ENABLED === 'true',
            collection: {
                interval: parseInt(process.env.ANALYTICS_COLLECTION_INTERVAL) || 300000, // 5min
                realTime: process.env.ANALYTICS_REALTIME === 'true',
                batchProcessing: process.env.ANALYTICS_BATCH_PROCESSING === 'true'
            },
            retention: {
                days: parseInt(process.env.ANALYTICS_RETENTION_DAYS) || 90,
                autoCleanup: process.env.ANALYTICS_AUTO_CLEANUP === 'true'
            },
            export: {
                formats: (process.env.ANALYTICS_EXPORT_FORMATS || 'json,csv,pdf').split(','),
                maxSize: parseInt(process.env.ANALYTICS_MAX_EXPORT_SIZE_MB) || 50
            }
        };

        // Configurações de Cache
        this.configs.cache = {
            strategy: process.env.CACHE_STRATEGY || 'memory',
            ttl: parseInt(process.env.CACHE_TTL) || 3600000, // 1h
            maxItems: parseInt(process.env.CACHE_MAX_ITEMS) || 1000,
            redis: {
                enabled: process.env.REDIS_CACHE_ENABLED === 'true',
                url: process.env.REDIS_CACHE_URL || 'redis://localhost:6379/1',
                password: process.env.REDIS_CACHE_PASSWORD || null
            }
        };

        // Configurações de Logs
        this.configs.logging = {
            level: process.env.LOG_LEVEL || 'info',
            format: process.env.LOG_FORMAT || 'json',
            rotation: {
                enabled: process.env.LOG_ROTATION_ENABLED === 'true',
                maxSize: process.env.LOG_ROTATION_MAX_SIZE || '10m',
                maxFiles: parseInt(process.env.LOG_ROTATION_MAX_FILES) || 5
            },
            destinations: {
                console: process.env.LOG_CONSOLE_ENABLED !== 'false',
                file: process.env.LOG_FILE_ENABLED === 'true',
                filePath: process.env.LOG_FILE_PATH || './logs/app.log'
            }
        };

        // Configurações de Monitoramento
        this.configs.monitoring = {
            enabled: process.env.MONITORING_ENABLED === 'true',
            healthCheck: {
                enabled: process.env.HEALTH_CHECK_ENABLED === 'true',
                interval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000,
                endpoints: ['/health', '/health/detailed']
            },
            metrics: {
                enabled: process.env.METRICS_COLLECTION_ENABLED === 'true',
                port: parseInt(process.env.METRICS_PORT) || 9090,
                path: process.env.METRICS_PATH || '/metrics'
            },
            alerts: {
                enabled: process.env.ALERTS_ENABLED === 'true',
                webhook: process.env.ALERT_WEBHOOK_URL,
                email: process.env.ALERT_EMAIL_RECIPIENTS
            }
        };

        // Configurações de Backup
        this.configs.backup = {
            enabled: process.env.AUTO_BACKUP_ENABLED === 'true',
            schedule: {
                daily: process.env.BACKUP_DAILY_ENABLED === 'true',
                weekly: process.env.BACKUP_WEEKLY_ENABLED === 'true',
                monthly: process.env.BACKUP_MONTHLY_ENABLED === 'true'
            },
            storage: {
                type: process.env.BACKUP_STORAGE_TYPE || 'local',
                path: process.env.BACKUP_STORAGE_PATH || './backups',
                compression: process.env.BACKUP_COMPRESSION_ENABLED === 'true'
            },
            retention: {
                days: parseInt(process.env.BACKUP_RETENTION_DAYS) || 7,
                maxBackups: parseInt(process.env.BACKUP_MAX_COUNT) || 10
            }
        };

        // Configurações de Segurança
        this.configs.security = {
            enabled: process.env.SECURITY_ENABLED === 'true',
            headers: {
                enabled: process.env.SECURITY_HEADERS_ENABLED === 'true',
                helmet: process.env.HELMET_ENABLED === 'true'
            },
            encryption: {
                enabled: process.env.DATA_ENCRYPTION_ENABLED === 'true',
                algorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-gcm'
            },
            accessControl: {
                enabled: process.env.ACCESS_CONTROL_ENABLED === 'true',
                roleBased: process.env.ROLE_BASED_ACCESS === 'true'
            },
            audit: {
                enabled: process.env.AUDIT_LOGGING_ENABLED === 'true',
                retentionDays: parseInt(process.env.AUDIT_LOG_RETENTION_DAYS) || 365
            }
        };

        // Configurações de Performance
        this.configs.performance = {
            optimization: process.env.PERFORMANCE_OPTIMIZATION_ENABLED === 'true',
            compression: {
                enabled: process.env.COMPRESSION_ENABLED === 'true',
                level: parseInt(process.env.COMPRESSION_LEVEL) || 6
            },
            minification: process.env.MINIFICATION_ENABLED === 'true',
            caching: {
                static: process.env.STATIC_CACHING_ENABLED === 'true',
                dynamic: process.env.DYNAMIC_CACHING_ENABLED === 'true'
            }
        };

        // Configurações de Integração
        this.configs.integration = {
            webhooks: {
                enabled: process.env.WEBHOOKS_ENABLED === 'true',
                secret: process.env.WEBHOOK_SECRET,
                endpoints: process.env.WEBHOOK_ENDPOINTS ? process.env.WEBHOOK_ENDPOINTS.split(',') : []
            },
            externalAPIs: {
                enabled: process.env.EXTERNAL_APIS_ENABLED === 'true',
                timeout: parseInt(process.env.EXTERNAL_API_TIMEOUT) || 30000,
                retry: {
                    enabled: process.env.EXTERNAL_API_RETRY === 'true',
                    maxAttempts: parseInt(process.env.EXTERNAL_API_MAX_ATTEMPTS) || 3,
                    delay: parseInt(process.env.EXTERNAL_API_RETRY_DELAY) || 1000
                }
            }
        };

        // Configurações de Desenvolvimento
        this.configs.development = {
            hotReload: process.env.HOT_RELOAD_ENABLED === 'true',
            sourceMaps: process.env.SOURCE_MAPS_ENABLED === 'true',
            verboseLogging: process.env.VERBOSE_LOGGING === 'true',
            mockData: process.env.MOCK_DATA_ENABLED === 'true',
            testMode: process.env.TEST_MODE === 'true',
            profiling: process.env.PROFILING_ENABLED === 'true'
        };

        // Configurações de Features
        this.configs.features = {
            socialSharing: process.env.FEATURE_SOCIAL_SHARING === 'true',
            liveChat: process.env.FEATURE_LIVE_CHAT === 'true',
            mlAnalytics: process.env.FEATURE_ML_ANALYTICS === 'true',
            recommendations: process.env.FEATURE_RECOMMENDATIONS === 'true',
            badges: process.env.FEATURE_BADGES === 'true',
            polls: process.env.FEATURE_POLLS === 'true',
            checkin: process.env.FEATURE_CHECKIN === 'true',
            recurringDonations: process.env.FEATURE_RECURRING_DONATIONS === 'true',
            notifications: process.env.FEATURE_NOTIFICATIONS === 'true'
        };

        // Integra configurações específicas
        this.configs.socialAPIs = socialAPIConfig.getAllConfigs();
        this.configs.mlAnalytics = mlAnalyticsConfig.getAllConfigs();
        this.configs.liveChat = liveChatConfig.getAllConfigs();
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
        return this.configs.features && this.configs.features[feature] === true;
    }

    /**
     * Obtém todas as funcionalidades habilitadas
     * @returns {Array} Lista de funcionalidades habilitadas
     */
    getEnabledFeatures() {
        if (!this.configs.features) return [];
        
        return Object.keys(this.configs.features).filter(feature => 
            this.configs.features[feature] === true
        );
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

        // Validações específicas por seção
        const validations = {
            system: () => !!(config.name && config.version && config.environment),
            server: () => !!(config.port && config.host),
            database: () => !!(config.mongodb && config.mongodb.uri),
            auth: () => !!(config.jwt && config.jwt.secret),
            upload: () => !!(config.directory && config.maxFileSize),
            email: () => !!(config.smtp && config.smtp.host && config.smtp.user),
            pushNotifications: () => !!(config.expo && config.expo.accessToken),
            gamification: () => !!(config.points && config.badges),
            moderation: () => !!(config.contentFilters && config.userManagement),
            analytics: () => !!(config.collection && config.retention),
            cache: () => !!(config.strategy && config.ttl),
            logging: () => !!(config.level && config.destinations),
            monitoring: () => !!(config.healthCheck && config.metrics),
            backup: () => !!(config.storage && config.retention),
            security: () => !!(config.headers && config.encryption),
            performance: () => !!(config.compression && config.caching),
            integration: () => !!(config.webhooks && config.externalAPIs),
            development: () => !!(config.hotReload !== undefined && config.sourceMaps !== undefined),
            features: () => !!(Object.keys(config).length > 0)
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
                enabled: section === 'features' ? true : (config.enabled !== false),
                valid: validation.valid,
                error: validation.error,
                config: config
            };

            if (section === 'features' || config.enabled !== false) report.enabled++;
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
                let envContent = '# ConnectFé Main Configuration\n';
                envContent += `# Generated: ${exportData.timestamp}\n\n`;
                
                Object.keys(this.configs).forEach(section => {
                    if (section === 'socialAPIs' || section === 'mlAnalytics' || section === 'liveChat') {
                        return; // Skip complex nested configs
                    }
                    
                    const config = this.configs[section];
                    envContent += `# ${section.toUpperCase()} CONFIGURATION\n`;
                    Object.keys(config).forEach(key => {
                        if (key !== 'enabled' && typeof config[key] !== 'object') {
                            envContent += `${section.toUpperCase()}_${key.toUpperCase()}=${config[key]}\n`;
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
        this.loadAllConfigurations();
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
            invalidConfigs: this.getStatusReport().invalid,
            enabledFeatures: this.getEnabledFeatures().length,
            totalFeatures: Object.keys(this.configs.features || {}).length
        };
    }

    /**
     * Verifica se o sistema está configurado corretamente
     * @returns {Object} Resultado da verificação
     */
    validateSystemConfig() {
        const criticalSections = ['system', 'server', 'database', 'auth'];
        const validationResults = {};
        let overallValid = true;

        criticalSections.forEach(section => {
            const result = this.validateSectionConfig(section);
            validationResults[section] = result;
            if (!result.valid) {
                overallValid = false;
            }
        });

        return {
            valid: overallValid,
            criticalSections: validationResults,
            recommendations: this.generateRecommendations(validationResults)
        };
    }

    /**
     * Gera recomendações baseadas na validação
     * @param {Object} validationResults - Resultados da validação
     * @returns {Array} Lista de recomendações
     */
    generateRecommendations(validationResults) {
        const recommendations = [];

        Object.keys(validationResults).forEach(section => {
            const result = validationResults[section];
            if (!result.valid) {
                recommendations.push({
                    section: section,
                    priority: 'high',
                    message: result.error,
                    action: `Configure a seção '${section}' corretamente`
                });
            }
        });

        // Verifica funcionalidades críticas
        const criticalFeatures = ['socialSharing', 'liveChat', 'mlAnalytics'];
        criticalFeatures.forEach(feature => {
            if (!this.isFeatureEnabled(feature)) {
                recommendations.push({
                    section: 'features',
                    priority: 'medium',
                    message: `Funcionalidade '${feature}' não está habilitada`,
                    action: `Habilite FEATURE_${feature.toUpperCase()}=true no arquivo .env`
                });
            }
        });

        return recommendations;
    }
}

// Instância singleton
const connectFeConfig = new ConnectFeConfig();

module.exports = connectFeConfig;