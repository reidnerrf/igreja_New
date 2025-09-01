const axios = require('axios');
const crypto = require('crypto');

/**
 * Serviço de Integração com APIs de Redes Sociais
 * ConnectFé - Conectando Fé e Tecnologia
 */
class SocialAPIService {
    constructor() {
        this.configs = {
            facebook: {
                appId: process.env.FACEBOOK_APP_ID,
                appSecret: process.env.FACEBOOK_APP_SECRET,
                apiVersion: 'v18.0',
                baseURL: 'https://graph.facebook.com'
            },
            twitter: {
                apiKey: process.env.TWITTER_API_KEY,
                apiSecret: process.env.TWITTER_API_SECRET,
                accessToken: process.env.TWITTER_ACCESS_TOKEN,
                accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
                baseURL: 'https://api.twitter.com/2'
            },
            instagram: {
                accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
                baseURL: 'https://graph.instagram.com'
            },
            whatsapp: {
                phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
                accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
                baseURL: 'https://graph.facebook.com/v18.0'
            },
            telegram: {
                botToken: process.env.TELEGRAM_BOT_TOKEN,
                baseURL: 'https://api.telegram.org/bot'
            }
        };
        
        this.initializeAPIs();
    }

    /**
     * Inicializa as APIs e valida as configurações
     */
    initializeAPIs() {
        console.log('🔗 Inicializando APIs de Redes Sociais...');
        
        Object.entries(this.configs).forEach(([platform, config]) => {
            if (this.validateConfig(platform, config)) {
                console.log(`✅ ${platform.toUpperCase()} configurado`);
            } else {
                console.log(`⚠️ ${platform.toUpperCase()} não configurado`);
            }
        });
    }

    /**
     * Valida se a configuração de uma plataforma está completa
     */
    validateConfig(platform, config) {
        const requiredFields = {
            facebook: ['appId', 'appSecret'],
            twitter: ['apiKey', 'apiSecret', 'accessToken', 'accessTokenSecret'],
            instagram: ['accessToken'],
            whatsapp: ['phoneNumberId', 'accessToken'],
            telegram: ['botToken']
        };

        return requiredFields[platform]?.every(field => config[field]) || false;
    }

    /**
     * Compartilha conteúdo no Facebook
     */
    async shareToFacebook(content, options = {}) {
        try {
            const { message, link, imageUrl } = content;
            const { privacy = 'EVERYONE' } = options;

            // Gerar token de acesso
            const accessToken = await this.getFacebookAccessToken();

            const postData = {
                message,
                link,
                privacy: { value: privacy }
            };

            if (imageUrl) {
                postData.image_url = imageUrl;
            }

            const response = await axios.post(
                `${this.configs.facebook.baseURL}/${this.configs.facebook.apiVersion}/me/feed`,
                postData,
                {
                    params: { access_token: accessToken }
                }
            );

            return {
                success: true,
                platform: 'facebook',
                postId: response.data.id,
                url: `https://facebook.com/${response.data.id}`,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Erro ao compartilhar no Facebook:', error.message);
            return {
                success: false,
                platform: 'facebook',
                error: error.message
            };
        }
    }

    /**
     * Compartilha conteúdo no Twitter
     */
    async shareToTwitter(content, options = {}) {
        try {
            const { message, imageUrl } = content;
            const { replyTo } = options;

            // Autenticação OAuth 1.0a
            const authHeader = this.generateTwitterAuthHeader('POST', '/2/tweets', {
                text: message,
                ...(replyTo && { reply: { in_reply_to_tweet_id: replyTo } })
            });

            const tweetData = {
                text: message
            };

            if (imageUrl) {
                // Primeiro fazer upload da imagem
                const mediaId = await this.uploadTwitterMedia(imageUrl);
                tweetData.media = { media_ids: [mediaId] };
            }

            const response = await axios.post(
                `${this.configs.twitter.baseURL}/tweets`,
                tweetData,
                {
                    headers: {
                        'Authorization': authHeader,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                success: true,
                platform: 'twitter',
                tweetId: response.data.data.id,
                url: `https://twitter.com/user/status/${response.data.data.id}`,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Erro ao compartilhar no Twitter:', error.message);
            return {
                success: false,
                platform: 'twitter',
                error: error.message
            };
        }
    }

    /**
     * Compartilha conteúdo no Instagram
     */
    async shareToInstagram(content, options = {}) {
        try {
            const { message, imageUrl } = content;
            const { hashtags = [] } = options;

            if (!imageUrl) {
                throw new Error('Instagram requer uma imagem');
            }

            const accessToken = this.configs.instagram.accessToken;
            
            // Criar container de mídia
            const mediaContainer = await axios.post(
                `${this.configs.instagram.baseURL}/me/media`,
                {
                    image_url: imageUrl,
                    caption: `${message} ${hashtags.map(tag => `#${tag}`).join(' ')}`,
                    access_token: accessToken
                }
            );

            const containerId = mediaContainer.data.id;

            // Publicar a mídia
            const publishResponse = await axios.post(
                `${this.configs.instagram.baseURL}/me/media_publish`,
                {
                    creation_id: containerId,
                    access_token: accessToken
                }
            );

            return {
                success: true,
                platform: 'instagram',
                postId: publishResponse.data.id,
                url: `https://instagram.com/p/${publishResponse.data.id}`,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Erro ao compartilhar no Instagram:', error.message);
            return {
                success: false,
                platform: 'instagram',
                error: error.message
            };
        }
    }

    /**
     * Envia mensagem via WhatsApp Business API
     */
    async sendWhatsAppMessage(content, options = {}) {
        try {
            const { message, imageUrl, phoneNumber } = content;
            const { template = 'text' } = options;

            if (!phoneNumber) {
                throw new Error('Número de telefone é obrigatório para WhatsApp');
            }

            const messageData = {
                messaging_product: 'whatsapp',
                to: phoneNumber,
                type: template
            };

            if (template === 'text') {
                messageData.text = { body: message };
            } else if (template === 'image' && imageUrl) {
                messageData.image = { link: imageUrl };
            }

            const response = await axios.post(
                `${this.configs.whatsapp.baseURL}/${this.configs.whatsapp.phoneNumberId}/messages`,
                messageData,
                {
                    headers: {
                        'Authorization': `Bearer ${this.configs.whatsapp.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                success: true,
                platform: 'whatsapp',
                messageId: response.data.messages[0].id,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Erro ao enviar mensagem WhatsApp:', error.message);
            return {
                success: false,
                platform: 'whatsapp',
                error: error.message
            };
        }
    }

    /**
     * Envia mensagem via Telegram Bot
     */
    async sendTelegramMessage(content, options = {}) {
        try {
            const { message, imageUrl, chatId } = content;
            const { parseMode = 'HTML' } = options;

            if (!chatId) {
                throw new Error('Chat ID é obrigatório para Telegram');
            }

            const messageData = {
                chat_id: chatId,
                text: message,
                parse_mode: parseMode
            };

            if (imageUrl) {
                // Enviar foto com legenda
                const response = await axios.post(
                    `${this.configs.telegram.baseURL}${this.configs.telegram.botToken}/sendPhoto`,
                    {
                        chat_id: chatId,
                        photo: imageUrl,
                        caption: message,
                        parse_mode: parseMode
                    }
                );

                return {
                    success: true,
                    platform: 'telegram',
                    messageId: response.data.result.message_id,
                    timestamp: new Date().toISOString()
                };
            } else {
                // Enviar apenas texto
                const response = await axios.post(
                    `${this.configs.telegram.baseURL}${this.configs.telegram.botToken}/sendMessage`,
                    messageData
                );

                return {
                    success: true,
                    platform: 'telegram',
                    messageId: response.data.result.message_id,
                    timestamp: new Date().toISOString()
                };
            }

        } catch (error) {
            console.error('❌ Erro ao enviar mensagem Telegram:', error.message);
            return {
                success: false,
                platform: 'telegram',
                error: error.message
            };
        }
    }

    /**
     * Compartilhamento em massa para múltiplas plataformas
     */
    async shareToMultiplePlatforms(content, platforms, options = {}) {
        const results = [];
        const promises = [];

        platforms.forEach(platform => {
            switch (platform) {
                case 'facebook':
                    promises.push(this.shareToFacebook(content, options));
                    break;
                case 'twitter':
                    promises.push(this.shareToTwitter(content, options));
                    break;
                case 'instagram':
                    promises.push(this.shareToInstagram(content, options));
                    break;
                case 'whatsapp':
                    if (options.phoneNumber) {
                        promises.push(this.sendWhatsAppMessage(content, options));
                    }
                    break;
                case 'telegram':
                    if (options.chatId) {
                        promises.push(this.sendTelegramMessage(content, options));
                    }
                    break;
            }
        });

        try {
            const platformResults = await Promise.allSettled(promises);
            
            platformResults.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    results.push(result.value);
                } else {
                    results.push({
                        success: false,
                        platform: platforms[index],
                        error: result.reason.message
                    });
                }
            });

            return {
                success: true,
                results,
                summary: {
                    total: platforms.length,
                    successful: results.filter(r => r.success).length,
                    failed: results.filter(r => !r.success).length
                }
            };

        } catch (error) {
            console.error('❌ Erro no compartilhamento em massa:', error.message);
            return {
                success: false,
                error: error.message,
                results: []
            };
        }
    }

    /**
     * Gera link de compartilhamento personalizado
     */
    generateShareLink(content, platform) {
        const baseUrls = {
            facebook: 'https://www.facebook.com/sharer/sharer.php',
            twitter: 'https://twitter.com/intent/tweet',
            linkedin: 'https://www.linkedin.com/sharing/share-offsite',
            whatsapp: 'https://wa.me',
            telegram: 'https://t.me/share/url'
        };

        const url = encodeURIComponent(content.url || '');
        const text = encodeURIComponent(content.message || '');
        const hashtags = encodeURIComponent(content.hashtags?.join(',') || '');

        switch (platform) {
            case 'facebook':
                return `${baseUrls.facebook}?u=${url}&quote=${text}`;
            
            case 'twitter':
                return `${baseUrls.twitter}?text=${text}&url=${url}&hashtags=${hashtags}`;
            
            case 'linkedin':
                return `${baseUrls.linkedin}?url=${url}`;
            
            case 'whatsapp':
                return `${baseUrls.whatsapp}?text=${text}%20${url}`;
            
            case 'telegram':
                return `${baseUrls.telegram}?url=${url}&text=${text}`;
            
            default:
                return content.url || '';
        }
    }

    /**
     * Gera QR Code para compartilhamento
     */
    async generateQRCode(content, size = 200) {
        try {
            const shareUrl = this.generateShareLink(content, 'web');
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(shareUrl)}`;
            
            return {
                success: true,
                qrCodeUrl,
                shareUrl,
                size
            };
        } catch (error) {
            console.error('❌ Erro ao gerar QR Code:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Obtém token de acesso do Facebook
     */
    async getFacebookAccessToken() {
        try {
            const response = await axios.get(
                `${this.configs.facebook.baseURL}/oauth/access_token`,
                {
                    params: {
                        client_id: this.configs.facebook.appId,
                        client_secret: this.configs.facebook.appSecret,
                        grant_type: 'client_credentials'
                    }
                }
            );

            return response.data.access_token;
        } catch (error) {
            console.error('❌ Erro ao obter token Facebook:', error.message);
            throw error;
        }
    }

    /**
     * Gera header de autenticação OAuth 1.0a para Twitter
     */
    generateTwitterAuthHeader(method, endpoint, params) {
        const timestamp = Math.floor(Date.now() / 1000);
        const nonce = crypto.randomBytes(16).toString('hex');

        // Implementação simplificada - em produção usar biblioteca OAuth
        const oauthParams = {
            oauth_consumer_key: this.configs.twitter.apiKey,
            oauth_nonce: nonce,
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: timestamp,
            oauth_token: this.configs.twitter.accessToken,
            oauth_version: '1.0'
        };

        // Em produção, implementar assinatura OAuth completa
        return `OAuth oauth_consumer_key="${oauthParams.oauth_consumer_key}", oauth_token="${oauthParams.oauth_token}"`;
    }

    /**
     * Faz upload de mídia para Twitter
     */
    async uploadTwitterMedia(imageUrl) {
        try {
            // Em produção, implementar upload real de mídia
            // Por enquanto, retorna um ID simulado
            return 'mock_media_id_' + Date.now();
        } catch (error) {
            console.error('❌ Erro ao fazer upload de mídia Twitter:', error.message);
            throw error;
        }
    }

    /**
     * Obtém estatísticas de compartilhamento
     */
    async getSharingStats(postId, platform) {
        try {
            switch (platform) {
                case 'facebook':
                    return await this.getFacebookStats(postId);
                case 'twitter':
                    return await this.getTwitterStats(postId);
                case 'instagram':
                    return await this.getInstagramStats(postId);
                default:
                    return { error: 'Plataforma não suportada' };
            }
        } catch (error) {
            console.error(`❌ Erro ao obter estatísticas do ${platform}:`, error.message);
            return { error: error.message };
        }
    }

    /**
     * Obtém estatísticas do Facebook
     */
    async getFacebookStats(postId) {
        try {
            const accessToken = await this.getFacebookAccessToken();
            const response = await axios.get(
                `${this.configs.facebook.baseURL}/${postId}`,
                {
                    params: {
                        fields: 'shares,comments.summary(true),reactions.summary(true)',
                        access_token: accessToken
                    }
                }
            );

            return {
                shares: response.data.shares?.count || 0,
                comments: response.data.comments?.summary?.total_count || 0,
                reactions: response.data.reactions?.summary?.total_count || 0
            };
        } catch (error) {
            console.error('❌ Erro ao obter estatísticas Facebook:', error.message);
            return { error: error.message };
        }
    }

    /**
     * Obtém estatísticas do Twitter
     */
    async getTwitterStats(tweetId) {
        try {
            const authHeader = this.generateTwitterAuthHeader('GET', `/2/tweets/${tweetId}`, {});
            
            const response = await axios.get(
                `${this.configs.twitter.baseURL}/tweets/${tweetId}`,
                {
                    params: {
                        'tweet.fields': 'public_metrics'
                    },
                    headers: {
                        'Authorization': authHeader
                    }
                }
            );

            const metrics = response.data.data.public_metrics;
            return {
                retweets: metrics.retweet_count || 0,
                likes: metrics.like_count || 0,
                replies: metrics.reply_count || 0,
                quotes: metrics.quote_count || 0
            };
        } catch (error) {
            console.error('❌ Erro ao obter estatísticas Twitter:', error.message);
            return { error: error.message };
        }
    }

    /**
     * Obtém estatísticas do Instagram
     */
    async getInstagramStats(postId) {
        try {
            const response = await axios.get(
                `${this.configs.instagram.baseURL}/${postId}`,
                {
                    params: {
                        fields: 'like_count,comments_count',
                        access_token: this.configs.instagram.accessToken
                    }
                }
            );

            return {
                likes: response.data.like_count || 0,
                comments: response.data.comments_count || 0
            };
        } catch (error) {
            console.error('❌ Erro ao obter estatísticas Instagram:', error.message);
            return { error: error.message };
        }
    }
}

module.exports = SocialAPIService;