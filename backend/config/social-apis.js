/**
 * Configuração das APIs de Redes Sociais
 * ConnectFé - Sistema de Integração Social
 */

const path = require('path');
const fs = require('fs');

class SocialAPIConfig {
    constructor() {
        this.configs = {};
        this.loadConfigurations();
    }

    /**
     * Carrega as configurações das variáveis de ambiente
     */
    loadConfigurations() {
        // Facebook API
        this.configs.facebook = {
            appId: process.env.FACEBOOK_APP_ID,
            appSecret: process.env.FACEBOOK_APP_SECRET,
            apiVersion: 'v18.0',
            baseURL: 'https://graph.facebook.com',
            permissions: ['email', 'public_profile', 'pages_manage_posts', 'pages_read_engagement'],
            webhookVerifyToken: process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN || 'connectfe_webhook_verify',
            enabled: !!process.env.FACEBOOK_APP_ID && !!process.env.FACEBOOK_APP_SECRET
        };

        // Twitter API
        this.configs.twitter = {
            apiKey: process.env.TWITTER_API_KEY,
            apiSecret: process.env.TWITTER_API_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
            apiVersion: '2',
            baseURL: 'https://api.twitter.com',
            bearerToken: process.env.TWITTER_BEARER_TOKEN,
            enabled: !!process.env.TWITTER_API_KEY && !!process.env.TWITTER_API_SECRET
        };

        // Instagram API
        this.configs.instagram = {
            accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
            apiVersion: 'v18.0',
            baseURL: 'https://graph.instagram.com',
            permissions: ['basic', 'comments', 'relationships', 'likes'],
            enabled: !!process.env.INSTAGRAM_ACCESS_TOKEN
        };

        // WhatsApp Business API
        this.configs.whatsapp = {
            phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
            accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
            apiVersion: 'v18.0',
            baseURL: 'https://graph.facebook.com',
            webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'connectfe_whatsapp_verify',
            enabled: !!process.env.WHATSAPP_PHONE_NUMBER_ID && !!process.env.WHATSAPP_ACCESS_TOKEN
        };

        // Telegram Bot API
        this.configs.telegram = {
            botToken: process.env.TELEGRAM_BOT_TOKEN,
            baseURL: 'https://api.telegram.org',
            webhookURL: process.env.TELEGRAM_WEBHOOK_URL,
            enabled: !!process.env.TELEGRAM_BOT_TOKEN
        };

        // LinkedIn API
        this.configs.linkedin = {
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
            apiVersion: 'v2',
            baseURL: 'https://api.linkedin.com',
            enabled: !!process.env.LINKEDIN_CLIENT_ID && !!process.env.LINKEDIN_CLIENT_SECRET
        };

        // YouTube API
        this.configs.youtube = {
            apiKey: process.env.YOUTUBE_API_KEY,
            baseURL: 'https://www.googleapis.com/youtube/v3',
            enabled: !!process.env.YOUTUBE_API_KEY
        };

        // TikTok API
        this.configs.tiktok = {
            clientKey: process.env.TIKTOK_CLIENT_KEY,
            clientSecret: process.env.TIKTOK_CLIENT_SECRET,
            accessToken: process.env.TIKTOK_ACCESS_TOKEN,
            baseURL: 'https://open.tiktokapis.com',
            enabled: !!process.env.TIKTOK_CLIENT_KEY && !!process.env.TIKTOK_CLIENT_SECRET
        };

        // Pinterest API
        this.configs.pinterest = {
            accessToken: process.env.PINTEREST_ACCESS_TOKEN,
            apiVersion: 'v5',
            baseURL: 'https://api.pinterest.com',
            enabled: !!process.env.PINTEREST_ACCESS_TOKEN
        };

        // Discord API
        this.configs.discord = {
            botToken: process.env.DISCORD_BOT_TOKEN,
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            baseURL: 'https://discord.com/api',
            apiVersion: 'v10',
            enabled: !!process.env.DISCORD_BOT_TOKEN
        };

        // Reddit API
        this.configs.reddit = {
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            userAgent: 'ConnectFé/1.0.0',
            baseURL: 'https://oauth.reddit.com',
            enabled: !!process.env.REDDIT_CLIENT_ID && !!process.env.REDDIT_CLIENT_SECRET
        };

        // Snapchat API
        this.configs.snapchat = {
            clientId: process.env.SNAPCHAT_CLIENT_ID,
            clientSecret: process.env.SNAPCHAT_CLIENT_SECRET,
            accessToken: process.env.SNAPCHAT_ACCESS_TOKEN,
            baseURL: 'https://kit.snapchat.com',
            enabled: !!process.env.SNAPCHAT_CLIENT_ID && !!process.env.SNAPCHAT_CLIENT_SECRET
        };

        // Twitch API
        this.configs.twitch = {
            clientId: process.env.TWITCH_CLIENT_ID,
            clientSecret: process.env.TWITCH_CLIENT_SECRET,
            accessToken: process.env.TWITCH_ACCESS_TOKEN,
            baseURL: 'https://api.twitch.tv',
            apiVersion: 'helix',
            enabled: !!process.env.TWITCH_CLIENT_ID && !!process.env.TWITCH_CLIENT_SECRET
        };

        // Mastodon API
        this.configs.mastodon = {
            instance: process.env.MASTODON_INSTANCE,
            accessToken: process.env.MASTODON_ACCESS_TOKEN,
            baseURL: process.env.MASTODON_INSTANCE ? `https://${process.env.MASTODON_INSTANCE}/api/v1` : null,
            enabled: !!process.env.MASTODON_INSTANCE && !!process.env.MASTODON_ACCESS_TOKEN
        };

        // Bluesky API
        this.configs.bluesky = {
            identifier: process.env.BLUESKY_IDENTIFIER,
            password: process.env.BLUESKY_PASSWORD,
            baseURL: 'https://bsky.social/xrpc',
            enabled: !!process.env.BLUESKY_IDENTIFIER && !!process.env.BLUESKY_PASSWORD
        };
    }

    /**
     * Obtém a configuração de uma plataforma específica
     * @param {string} platform - Nome da plataforma
     * @returns {Object} Configuração da plataforma
     */
    getPlatformConfig(platform) {
        return this.configs[platform.toLowerCase()] || null;
    }

    /**
     * Verifica se uma plataforma está habilitada
     * @param {string} platform - Nome da plataforma
     * @returns {boolean} Status de habilitação
     */
    isPlatformEnabled(platform) {
        const config = this.getPlatformConfig(platform);
        return config ? config.enabled : false;
    }

    /**
     * Obtém todas as plataformas habilitadas
     * @returns {Array} Lista de plataformas habilitadas
     */
    getEnabledPlatforms() {
        return Object.keys(this.configs).filter(platform => 
            this.configs[platform].enabled
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
     * @param {string} platform - Nome da plataforma
     * @returns {Object} Resultado da validação
     */
    validatePlatformConfig(platform) {
        const config = this.getPlatformConfig(platform);
        if (!config) {
            return {
                valid: false,
                error: `Plataforma '${platform}' não encontrada`
            };
        }

        if (!config.enabled) {
            return {
                valid: false,
                error: `Plataforma '${platform}' não está habilitada`
            };
        }

        // Validações específicas por plataforma
        const validations = {
            facebook: () => !!(config.appId && config.appSecret),
            twitter: () => !!(config.apiKey && config.apiSecret),
            instagram: () => !!config.accessToken,
            whatsapp: () => !!(config.phoneNumberId && config.accessToken),
            telegram: () => !!config.botToken,
            linkedin: () => !!(config.clientId && config.clientSecret),
            youtube: () => !!config.apiKey,
            tiktok: () => !!(config.clientKey && config.clientSecret),
            pinterest: () => !!config.accessToken,
            discord: () => !!config.botToken,
            reddit: () => !!(config.clientId && config.clientSecret),
            snapchat: () => !!(config.clientId && config.clientSecret),
            twitch: () => !!(config.clientId && config.clientSecret),
            mastodon: () => !!(config.instance && config.accessToken),
            bluesky: () => !!(config.identifier && config.password)
        };

        const validationFunction = validations[platform.toLowerCase()];
        if (!validationFunction) {
            return {
                valid: false,
                error: `Validação não implementada para '${platform}'`
            };
        }

        const isValid = validationFunction();
        return {
            valid: isValid,
            error: isValid ? null : `Configuração incompleta para '${platform}'`
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
            platforms: {}
        };

        Object.keys(this.configs).forEach(platform => {
            const config = this.configs[platform];
            const validation = this.validatePlatformConfig(platform);
            
            report.platforms[platform] = {
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
                let envContent = '# ConnectFé Social APIs Configuration\n';
                envContent += `# Generated: ${exportData.timestamp}\n\n`;
                
                Object.keys(this.configs).forEach(platform => {
                    const config = this.configs[platform];
                    envContent += `# ${platform.toUpperCase()} API\n`;
                    Object.keys(config).forEach(key => {
                        if (key !== 'enabled' && key !== 'baseURL' && key !== 'apiVersion') {
                            envContent += `${key.toUpperCase()}=${config[key] || ''}\n`;
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
     * @param {string} platform - Nome da plataforma
     * @param {Object} newConfig - Nova configuração
     */
    updatePlatformConfig(platform, newConfig) {
        if (this.configs[platform.toLowerCase()]) {
            this.configs[platform.toLowerCase()] = {
                ...this.configs[platform.toLowerCase()],
                ...newConfig
            };
        }
    }

    /**
     * Obtém estatísticas de uso das APIs
     * @returns {Object} Estatísticas
     */
    getUsageStats() {
        return {
            totalPlatforms: Object.keys(this.configs).length,
            enabledPlatforms: this.getEnabledPlatforms().length,
            disabledPlatforms: Object.keys(this.configs).length - this.getEnabledPlatforms().length,
            validConfigs: this.getStatusReport().valid,
            invalidConfigs: this.getStatusReport().invalid
        };
    }
}

// Instância singleton
const socialAPIConfig = new SocialAPIConfig();

module.exports = socialAPIConfig;