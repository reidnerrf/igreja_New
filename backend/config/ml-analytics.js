/**
 * Configuração do Sistema de ML e Analytics
 * ConnectFé - Machine Learning e Analytics
 */

const path = require('path');
const fs = require('fs');

class MLAnalyticsConfig {
    constructor() {
        this.configs = {};
        this.loadConfigurations();
    }

    /**
     * Carrega as configurações das variáveis de ambiente
     */
    loadConfigurations() {
        // Configurações Gerais do ML
        this.configs.general = {
            enabled: process.env.FEATURE_ML_ANALYTICS === 'true',
            environment: process.env.NODE_ENV || 'development',
            debug: process.env.DEBUG === 'true',
            logLevel: process.env.LOG_LEVEL || 'info'
        };

        // TensorFlow.js
        this.configs.tensorflow = {
            enabled: process.env.TENSORFLOW_ENABLED === 'true',
            gpuEnabled: process.env.TENSORFLOW_GPU_ENABLED === 'true',
            memoryGrowth: process.env.TENSORFLOW_MEMORY_GROWTH === 'true',
            backend: process.env.TENSORFLOW_BACKEND || 'cpu',
            modelPath: process.env.TENSORFLOW_MODEL_PATH || './models',
            cacheDir: process.env.TENSORFLOW_CACHE_DIR || './cache/tensorflow'
        };

        // Natural Language Processing
        this.configs.nlp = {
            enabled: process.env.NLP_ENABLED === 'true',
            language: process.env.NLP_LANGUAGE || 'pt-BR',
            models: {
                classifier: process.env.NLP_CLASSIFIER_MODEL || 'naive-bayes',
                sentiment: process.env.NLP_SENTIMENT_MODEL || 'vader',
                tokenizer: process.env.NLP_TOKENIZER || 'word-tokenizer',
                stemmer: process.env.NLP_STEMMER || 'porter'
            },
            customModelsPath: process.env.NLP_CUSTOM_MODELS_PATH || './models/nlp',
            trainingDataPath: process.env.NLP_TRAINING_DATA_PATH || './data/training'
        };

        // Sistema de Classificação
        this.configs.classification = {
            enabled: process.env.CLASSIFICATION_ENABLED === 'true',
            algorithm: process.env.CLASSIFICATION_ALGORITHM || 'naive-bayes',
            categories: [
                'evento', 'oração', 'testemunho', 'estudo', 'notícia',
                'anúncio', 'reflexão', 'devocional', 'musical', 'outro'
            ],
            confidenceThreshold: parseFloat(process.env.CLASSIFICATION_CONFIDENCE_THRESHOLD) || 0.7,
            autoTraining: process.env.CLASSIFICATION_AUTO_TRAINING === 'true',
            trainingInterval: parseInt(process.env.CLASSIFICATION_TRAINING_INTERVAL) || 86400000, // 24h
            maxTrainingExamples: parseInt(process.env.CLASSIFICATION_MAX_TRAINING_EXAMPLES) || 10000
        };

        // Análise de Sentimento
        this.configs.sentiment = {
            enabled: process.env.SENTIMENT_ANALYSIS_ENABLED === 'true',
            algorithm: process.env.SENTIMENT_ALGORITHM || 'vader',
            languages: ['pt-BR', 'en-US', 'es-ES'],
            customLexicons: process.env.SENTIMENT_CUSTOM_LEXICONS_PATH || './data/lexicons',
            neutralThreshold: parseFloat(process.env.SENTIMENT_NEUTRAL_THRESHOLD) || 0.1,
            batchProcessing: process.env.SENTIMENT_BATCH_PROCESSING === 'true',
            batchSize: parseInt(process.env.SENTIMENT_BATCH_SIZE) || 100
        };

        // Predição de Engajamento
        this.configs.engagement = {
            enabled: process.env.ENGAGEMENT_PREDICTION_ENABLED === 'true',
            algorithm: process.env.ENGAGEMENT_ALGORITHM || 'regression',
            features: [
                'content_length', 'hashtags_count', 'mentions_count',
                'time_of_day', 'day_of_week', 'content_category',
                'user_followers', 'user_engagement_rate', 'content_sentiment'
            ],
            predictionWindow: parseInt(process.env.ENGAGEMENT_PREDICTION_WINDOW) || 24, // horas
            modelUpdateInterval: parseInt(process.env.ENGAGEMENT_MODEL_UPDATE_INTERVAL) || 604800000, // 7 dias
            accuracyThreshold: parseFloat(process.env.ENGAGEMENT_ACCURACY_THRESHOLD) || 0.8
        };

        // Análise de Comportamento do Usuário
        this.configs.userBehavior = {
            enabled: process.env.USER_BEHAVIOR_ANALYSIS_ENABLED === 'true',
            trackingEvents: [
                'post_created', 'post_liked', 'post_shared', 'post_commented',
                'event_joined', 'donation_made', 'prayer_requested', 'checkin_made'
            ],
            analysisPeriods: ['1d', '7d', '30d', '90d', '1y'],
            clusteringEnabled: process.env.USER_BEHAVIOR_CLUSTERING === 'true',
            clusteringAlgorithm: process.env.USER_BEHAVIOR_CLUSTERING_ALGORITHM || 'k-means',
            maxClusters: parseInt(process.env.USER_BEHAVIOR_MAX_CLUSTERS) || 10
        };

        // Sistema de Recomendações
        this.configs.recommendations = {
            enabled: process.env.RECOMMENDATIONS_ENABLED === 'true',
            algorithm: process.env.RECOMMENDATIONS_ALGORITHM || 'hybrid',
            algorithms: {
                collaborative: process.env.RECOMMENDATIONS_COLLABORATIVE === 'true',
                content: process.env.RECOMMENDATIONS_CONTENT === 'true',
                hybrid: process.env.RECOMMENDATIONS_HYBRID === 'true'
            },
            updateInterval: parseInt(process.env.RECOMMENDATIONS_UPDATE_INTERVAL) || 3600000, // 1h
            maxRecommendations: parseInt(process.env.RECOMMENDATIONS_MAX_COUNT) || 20,
            diversityFactor: parseFloat(process.env.RECOMMENDATIONS_DIVERSITY_FACTOR) || 0.3,
            coldStartStrategy: process.env.RECOMMENDATIONS_COLD_START_STRATEGY || 'popular'
        };

        // Analytics e Métricas
        this.configs.analytics = {
            enabled: process.env.ANALYTICS_ENABLED === 'true',
            collectionInterval: parseInt(process.env.ANALYTICS_COLLECTION_INTERVAL) || 300000, // 5min
            retentionDays: parseInt(process.env.ANALYTICS_RETENTION_DAYS) || 90,
            realTimeEnabled: process.env.ANALYTICS_REALTIME === 'true',
            batchProcessing: process.env.ANALYTICS_BATCH_PROCESSING === 'true',
            exportFormats: (process.env.ANALYTICS_EXPORT_FORMATS || 'json,csv,pdf').split(','),
            maxExportSize: parseInt(process.env.ANALYTICS_MAX_EXPORT_SIZE_MB) || 50
        };

        // Agendamento de Tarefas
        this.configs.scheduling = {
            enabled: process.env.ML_SCHEDULING_ENABLED === 'true',
            cronPatterns: {
                daily: process.env.ML_CRON_DAILY || '0 2 * * *', // 2:00 AM
                weekly: process.env.ML_CRON_WEEKLY || '0 3 * * 0', // 3:00 AM Sunday
                monthly: process.env.ML_CRON_MONTHLY || '0 4 1 * *' // 4:00 AM 1st of month
            },
            timezone: process.env.ML_TIMEZONE || 'America/Sao_Paulo',
            maxConcurrentJobs: parseInt(process.env.ML_MAX_CONCURRENT_JOBS) || 5,
            jobTimeout: parseInt(process.env.ML_JOB_TIMEOUT) || 300000 // 5min
        };

        // Cache e Performance
        this.configs.cache = {
            enabled: process.env.ML_CACHE_ENABLED === 'true',
            strategy: process.env.ML_CACHE_STRATEGY || 'memory',
            ttl: parseInt(process.env.ML_CACHE_TTL) || 3600000, // 1h
            maxItems: parseInt(process.env.ML_CACHE_MAX_ITEMS) || 1000,
            redis: {
                enabled: process.env.ML_REDIS_ENABLED === 'true',
                url: process.env.ML_REDIS_URL || 'redis://localhost:6379',
                password: process.env.ML_REDIS_PASSWORD || null
            }
        };

        // Modelos Pré-treinados
        this.configs.pretrainedModels = {
            enabled: process.env.ML_PRETRAINED_ENABLED === 'true',
            models: {
                'bert-pt': process.env.ML_BERT_PT_MODEL || './models/bert-pt',
                'gpt-pt': process.env.ML_GPT_PT_MODEL || './models/gpt-pt',
                'roberta-pt': process.env.ML_ROBERTA_PT_MODEL || './models/roberta-pt'
            },
            downloadEnabled: process.env.ML_MODEL_DOWNLOAD === 'true',
            modelRegistry: process.env.ML_MODEL_REGISTRY || 'https://huggingface.co',
            autoUpdate: process.env.ML_MODEL_AUTO_UPDATE === 'true'
        };

        // Validação e Testes
        this.configs.validation = {
            enabled: process.env.ML_VALIDATION_ENABLED === 'true',
            testDataSplit: parseFloat(process.env.ML_TEST_DATA_SPLIT) || 0.2,
            crossValidation: process.env.ML_CROSS_VALIDATION === 'true',
            crossValidationFolds: parseInt(process.env.ML_CROSS_VALIDATION_FOLDS) || 5,
            metrics: ['accuracy', 'precision', 'recall', 'f1-score', 'auc'],
            threshold: parseFloat(process.env.ML_VALIDATION_THRESHOLD) || 0.8
        };

        // Monitoramento e Alertas
        this.configs.monitoring = {
            enabled: process.env.ML_MONITORING_ENABLED === 'true',
            metrics: {
                modelAccuracy: process.env.ML_MONITORING_MODEL_ACCURACY === 'true',
                predictionLatency: process.env.ML_MONITORING_PREDICTION_LATENCY === 'true',
                trainingTime: process.env.ML_MONITORING_TRAINING_TIME === 'true',
                resourceUsage: process.env.ML_MONITORING_RESOURCE_USAGE === 'true'
            },
            alerts: {
                enabled: process.env.ML_ALERTS_ENABLED === 'true',
                accuracyDrop: parseFloat(process.env.ML_ALERT_ACCURACY_DROP) || 0.1,
                latencyIncrease: parseFloat(process.env.ML_ALERT_LATENCY_INCREASE) || 2.0,
                errorRate: parseFloat(process.env.ML_ALERT_ERROR_RATE) || 0.05
            },
            dashboard: {
                enabled: process.env.ML_DASHBOARD_ENABLED === 'true',
                port: parseInt(process.env.ML_DASHBOARD_PORT) || 3003,
                refreshInterval: parseInt(process.env.ML_DASHBOARD_REFRESH) || 30000
            }
        };

        // Segurança e Privacidade
        this.configs.security = {
            enabled: process.env.ML_SECURITY_ENABLED === 'true',
            dataEncryption: process.env.ML_DATA_ENCRYPTION === 'true',
            modelEncryption: process.env.ML_MODEL_ENCRYPTION === 'true',
            accessControl: process.env.ML_ACCESS_CONTROL === 'true',
            auditLogging: process.env.ML_AUDIT_LOGGING === 'true',
            dataAnonymization: process.env.ML_DATA_ANONYMIZATION === 'true',
            gdprCompliance: process.env.ML_GDPR_COMPLIANCE === 'true'
        };

        // Integração com APIs Externas
        this.configs.externalAPIs = {
            enabled: process.env.ML_EXTERNAL_APIS_ENABLED === 'true',
            openai: {
                enabled: process.env.ML_OPENAI_ENABLED === 'true',
                apiKey: process.env.ML_OPENAI_API_KEY,
                model: process.env.ML_OPENAI_MODEL || 'gpt-3.5-turbo',
                maxTokens: parseInt(process.env.ML_OPENAI_MAX_TOKENS) || 1000
            },
            huggingface: {
                enabled: process.env.ML_HUGGINGFACE_ENABLED === 'true',
                apiKey: process.env.ML_HUGGINGFACE_API_KEY,
                endpoint: process.env.ML_HUGGINGFACE_ENDPOINT || 'https://api-inference.huggingface.co'
            },
            googleAI: {
                enabled: process.env.ML_GOOGLE_AI_ENABLED === 'true',
                apiKey: process.env.ML_GOOGLE_AI_API_KEY,
                projectId: process.env.ML_GOOGLE_AI_PROJECT_ID
            }
        };

        // Configurações de Desenvolvimento
        this.configs.development = {
            hotReload: process.env.ML_HOT_RELOAD === 'true',
            sourceMaps: process.env.ML_SOURCE_MAPS === 'true',
            verboseLogging: process.env.ML_VERBOSE_LOGGING === 'true',
            mockData: process.env.ML_MOCK_DATA === 'true',
            testMode: process.env.ML_TEST_MODE === 'true',
            profiling: process.env.ML_PROFILING === 'true'
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
            tensorflow: () => !!(config.modelPath && config.cacheDir),
            nlp: () => !!(config.language && config.customModelsPath),
            classification: () => !!(config.algorithm && config.categories.length > 0),
            sentiment: () => !!(config.algorithm && config.languages.length > 0),
            engagement: () => !!(config.algorithm && config.features.length > 0),
            recommendations: () => !!(config.algorithm && config.updateInterval),
            analytics: () => !!(config.collectionInterval && config.retentionDays),
            scheduling: () => !!(config.cronPatterns && config.timezone),
            cache: () => !!(config.strategy && config.ttl),
            monitoring: () => !!(config.metrics && config.alerts),
            security: () => !!(config.dataEncryption !== undefined && config.accessControl !== undefined)
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
                let envContent = '# ConnectFé ML Analytics Configuration\n';
                envContent += `# Generated: ${exportData.timestamp}\n\n`;
                
                Object.keys(this.configs).forEach(section => {
                    const config = this.configs[section];
                    envContent += `# ${section.toUpperCase()} CONFIGURATION\n`;
                    Object.keys(config).forEach(key => {
                        if (key !== 'enabled' && typeof config[key] !== 'object') {
                            envContent += `ML_${section.toUpperCase()}_${key.toUpperCase()}=${config[key]}\n`;
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
const mlAnalyticsConfig = new MLAnalyticsConfig();

module.exports = mlAnalyticsConfig;