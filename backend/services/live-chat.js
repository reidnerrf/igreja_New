const EventEmitter = require('events');
const crypto = require('crypto');

/**
 * Serviço de Chat Moderado para Transmissões ao Vivo
 * ConnectFé - Conectando Fé e Tecnologia
 */
class LiveChatService extends EventEmitter {
    constructor() {
        super();
        
        this.activeStreams = new Map(); // streamId -> streamInfo
        this.chatRooms = new Map(); // streamId -> chatRoom
        this.moderators = new Map(); // userId -> moderatorInfo
        this.badges = new Map(); // badgeId -> badgeInfo
        this.reactions = new Map(); // reactionId -> reactionInfo
        this.polls = new Map(); // pollId -> pollInfo
        
        this.initializeBadges();
        this.initializeReactions();
    }

    /**
     * Inicializa sistema de badges para moderadores
     */
    initializeBadges() {
        const defaultBadges = [
            {
                id: 'moderator',
                name: 'Moderador',
                description: 'Moderador oficial da comunidade',
                icon: '🛡️',
                color: '#ff6b6b',
                permissions: ['delete', 'warn', 'ban', 'pin', 'create_poll']
            },
            {
                id: 'trusted',
                name: 'Confiável',
                description: 'Usuário confiável da comunidade',
                icon: '⭐',
                color: '#4ecdc4',
                permissions: ['pin', 'create_poll']
            },
            {
                id: 'helper',
                name: 'Ajudante',
                description: 'Ajuda outros usuários',
                icon: '🤝',
                color: '#45b7d1',
                permissions: ['pin']
            },
            {
                id: 'newcomer',
                name: 'Novato',
                description: 'Novo membro da comunidade',
                icon: '🌱',
                color: '#96ceb4',
                permissions: []
            }
        ];

        defaultBadges.forEach(badge => {
            this.badges.set(badge.id, badge);
        });

        console.log('🏆 Sistema de badges inicializado');
    }

    /**
     * Inicializa sistema de reações
     */
    initializeReactions() {
        const defaultReactions = [
            { id: 'like', icon: '👍', name: 'Curtir' },
            { id: 'love', icon: '❤️', name: 'Amar' },
            { id: 'pray', icon: '🙏', name: 'Orar' },
            { id: 'amen', icon: '🙌', name: 'Amém' },
            { id: 'clap', icon: '👏', name: 'Aplaudir' },
            { id: 'fire', icon: '🔥', name: 'Fogo' },
            { id: 'blessed', icon: '✨', name: 'Abençoado' },
            { id: 'wow', icon: '😮', name: 'Uau' }
        ];

        defaultReactions.forEach(reaction => {
            this.reactions.set(reaction.id, reaction);
        });

        console.log('😊 Sistema de reações inicializado');
    }

    /**
     * Cria uma nova transmissão ao vivo
     */
    async createLiveStream(streamData) {
        try {
            const streamId = crypto.randomUUID();
            const now = new Date();

            const stream = {
                id: streamId,
                title: streamData.title,
                description: streamData.description,
                hostId: streamData.hostId,
                hostName: streamData.hostName,
                status: 'preparing', // preparing, live, ended
                startTime: null,
                endTime: null,
                viewers: 0,
                maxViewers: 0,
                settings: {
                    chatEnabled: true,
                    moderationEnabled: true,
                    slowMode: false,
                    slowModeInterval: 5,
                    followersOnly: false,
                    subscribersOnly: false,
                    ageRestriction: false
                },
                createdAt: now.toISOString(),
                updatedAt: now.toISOString()
            };

            // Criar sala de chat para a transmissão
            const chatRoom = {
                streamId,
                messages: [],
                pinnedMessages: [],
                moderators: [streamData.hostId],
                bannedUsers: new Set(),
                warnedUsers: new Map(),
                slowModeUsers: new Map(),
                activePolls: new Map(),
                stats: {
                    totalMessages: 0,
                    totalReactions: 0,
                    totalPolls: 0,
                    deletedMessages: 0,
                    warnedUsers: 0,
                    bannedUsers: 0
                }
            };

            this.activeStreams.set(streamId, stream);
            this.chatRooms.set(streamId, chatRoom);

            // Emitir evento de nova transmissão
            this.emit('streamCreated', { streamId, stream });

            return {
                success: true,
                streamId,
                stream,
                chatRoom: {
                    streamId,
                    moderators: chatRoom.moderators,
                    settings: stream.settings
                }
            };

        } catch (error) {
            console.error('❌ Erro ao criar transmissão:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Inicia uma transmissão ao vivo
     */
    async startLiveStream(streamId) {
        try {
            const stream = this.activeStreams.get(streamId);
            if (!stream) {
                throw new Error('Transmissão não encontrada');
            }

            if (stream.status === 'live') {
                throw new Error('Transmissão já está ao vivo');
            }

            stream.status = 'live';
            stream.startTime = new Date().toISOString();
            stream.updatedAt = new Date().toISOString();

            // Emitir evento de início da transmissão
            this.emit('streamStarted', { streamId, stream });

            return {
                success: true,
                stream,
                message: 'Transmissão iniciada com sucesso'
            };

        } catch (error) {
            console.error('❌ Erro ao iniciar transmissão:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Finaliza uma transmissão ao vivo
     */
    async endLiveStream(streamId) {
        try {
            const stream = this.activeStreams.get(streamId);
            if (!stream) {
                throw new Error('Transmissão não encontrada');
            }

            stream.status = 'ended';
            stream.endTime = new Date().toISOString();
            stream.updatedAt = new Date().toISOString();

            // Emitir evento de fim da transmissão
            this.emit('streamEnded', { streamId, stream });

            return {
                success: true,
                stream,
                message: 'Transmissão finalizada com sucesso'
            };

        } catch (error) {
            console.error('❌ Erro ao finalizar transmissão:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Envia mensagem no chat ao vivo
     */
    async sendChatMessage(streamId, messageData) {
        try {
            const stream = this.activeStreams.get(streamId);
            const chatRoom = this.chatRooms.get(streamId);

            if (!stream || !chatRoom) {
                throw new Error('Transmissão ou sala de chat não encontrada');
            }

            if (stream.status !== 'live') {
                throw new Error('Transmissão não está ao vivo');
            }

            if (!stream.settings.chatEnabled) {
                throw new Error('Chat está desabilitado para esta transmissão');
            }

            // Verificar se usuário está banido
            if (chatRoom.bannedUsers.has(messageData.userId)) {
                throw new Error('Usuário está banido do chat');
            }

            // Verificar modo lento
            if (stream.settings.slowMode) {
                const lastMessage = this.getLastUserMessage(chatRoom, messageData.userId);
                if (lastMessage && this.isSlowModeActive(lastMessage.timestamp, stream.settings.slowModeInterval)) {
                    throw new Error('Modo lento ativo. Aguarde antes de enviar outra mensagem');
                }
            }

            // Verificar restrições
            if (stream.settings.followersOnly && !this.isUserFollower(messageData.userId, stream.hostId)) {
                throw new Error('Apenas seguidores podem enviar mensagens');
            }

            // Criar mensagem
            const message = {
                id: crypto.randomUUID(),
                streamId,
                userId: messageData.userId,
                userName: messageData.userName,
                userAvatar: messageData.userAvatar,
                content: messageData.content,
                type: messageData.type || 'text', // text, image, link, emoji
                reactions: [],
                isPinned: false,
                isDeleted: false,
                moderationStatus: 'pending', // pending, approved, flagged, deleted
                timestamp: new Date().toISOString(),
                metadata: {
                    userLevel: messageData.userLevel || 'viewer',
                    badges: messageData.badges || [],
                    isModerator: this.isUserModerator(messageData.userId, streamId),
                    isHost: messageData.userId === stream.hostId
                }
            };

            // Adicionar mensagem à sala
            chatRoom.messages.push(message);
            chatRoom.stats.totalMessages++;

            // Emitir evento de nova mensagem
            this.emit('messageSent', { streamId, message });

            // Auto-moderação básica
            await this.autoModerateMessage(streamId, message);

            return {
                success: true,
                message,
                messageId: message.id
            };

        } catch (error) {
            console.error('❌ Erro ao enviar mensagem:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Adiciona reação a uma mensagem
     */
    async addReaction(streamId, messageId, reactionData) {
        try {
            const chatRoom = this.chatRooms.get(streamId);
            if (!chatRoom) {
                throw new Error('Sala de chat não encontrada');
            }

            const message = chatRoom.messages.find(m => m.id === messageId);
            if (!message) {
                throw new Error('Mensagem não encontrada');
            }

            // Verificar se reação já existe
            const existingReaction = message.reactions.find(r => 
                r.userId === reactionData.userId && r.type === reactionData.type
            );

            if (existingReaction) {
                // Remover reação existente
                message.reactions = message.reactions.filter(r => r !== existingReaction);
                chatRoom.stats.totalReactions--;
            } else {
                // Adicionar nova reação
                const reaction = {
                    id: crypto.randomUUID(),
                    type: reactionData.type,
                    userId: reactionData.userId,
                    userName: reactionData.userName,
                    timestamp: new Date().toISOString()
                };

                message.reactions.push(reaction);
                chatRoom.stats.totalReactions++;
            }

            // Emitir evento de reação
            this.emit('reactionUpdated', { streamId, messageId, message });

            return {
                success: true,
                message,
                reactionCount: message.reactions.length
            };

        } catch (error) {
            console.error('❌ Erro ao adicionar reação:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Cria uma enquete no chat
     */
    async createPoll(streamId, pollData) {
        try {
            const stream = this.activeStreams.get(streamId);
            const chatRoom = this.chatRooms.get(streamId);

            if (!stream || !chatRoom) {
                throw new Error('Transmissão ou sala de chat não encontrada');
            }

            if (!this.isUserModerator(pollData.userId, streamId)) {
                throw new Error('Apenas moderadores podem criar enquetes');
            }

            const poll = {
                id: crypto.randomUUID(),
                streamId,
                createdBy: pollData.userId,
                question: pollData.question,
                options: pollData.options.map((option, index) => ({
                    id: index,
                    text: option,
                    votes: 0,
                    voters: new Set()
                })),
                settings: {
                    multipleChoice: pollData.multipleChoice || false,
                    anonymous: pollData.anonymous || false,
                    duration: pollData.duration || 300, // 5 minutos
                    showResults: pollData.showResults !== false
                },
                status: 'active', // active, ended
                createdAt: new Date().toISOString(),
                endTime: new Date(Date.now() + (pollData.duration || 300) * 1000).toISOString(),
                totalVotes: 0
            };

            // Adicionar enquete à sala
            chatRoom.activePolls.set(poll.id, poll);
            chatRoom.stats.totalPolls++;

            // Emitir evento de nova enquete
            this.emit('pollCreated', { streamId, poll });

            // Agendar fim da enquete
            setTimeout(() => {
                this.endPoll(streamId, poll.id);
            }, poll.settings.duration * 1000);

            return {
                success: true,
                poll,
                pollId: poll.id
            };

        } catch (error) {
            console.error('❌ Erro ao criar enquete:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Vota em uma enquete
     */
    async voteInPoll(streamId, pollId, voteData) {
        try {
            const chatRoom = this.chatRooms.get(streamId);
            if (!chatRoom) {
                throw new Error('Sala de chat não encontrada');
            }

            const poll = chatRoom.activePolls.get(pollId);
            if (!poll) {
                throw new Error('Enquete não encontrada');
            }

            if (poll.status !== 'active') {
                throw new Error('Enquete não está ativa');
            }

            const userId = voteData.userId;
            const optionIds = Array.isArray(voteData.optionIds) ? voteData.optionIds : [voteData.optionIds];

            // Verificar se usuário já votou
            const hasVoted = poll.options.some(option => option.voters.has(userId));
            if (hasVoted && !poll.settings.multipleChoice) {
                throw new Error('Usuário já votou nesta enquete');
            }

            // Processar votos
            optionIds.forEach(optionId => {
                const option = poll.options.find(o => o.id === optionId);
                if (option && !option.voters.has(userId)) {
                    option.votes++;
                    option.voters.add(userId);
                    poll.totalVotes++;
                }
            });

            // Emitir evento de voto
            this.emit('pollVote', { streamId, pollId, poll, userId, optionIds });

            return {
                success: true,
                poll,
                totalVotes: poll.totalVotes
            };

        } catch (error) {
            console.error('❌ Erro ao votar na enquete:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Finaliza uma enquete
     */
    async endPoll(streamId, pollId) {
        try {
            const chatRoom = this.chatRooms.get(streamId);
            if (!chatRoom) {
                throw new Error('Sala de chat não encontrada');
            }

            const poll = chatRoom.activePolls.get(pollId);
            if (!poll) {
                throw new Error('Enquete não encontrada');
            }

            poll.status = 'ended';
            poll.endTime = new Date().toISOString();

            // Calcular resultados
            const results = poll.options.map(option => ({
                id: option.id,
                text: option.text,
                votes: option.votes,
                percentage: poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0
            }));

            // Emitir evento de fim da enquete
            this.emit('pollEnded', { streamId, pollId, poll, results });

            return {
                success: true,
                poll,
                results
            };

        } catch (error) {
            console.error('❌ Erro ao finalizar enquete:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Modera uma mensagem (deletar, avisar, banir)
     */
    async moderateMessage(streamId, messageId, moderationData) {
        try {
            const chatRoom = this.chatRooms.get(streamId);
            if (!chatRoom) {
                throw new Error('Sala de chat não encontrada');
            }

            if (!this.isUserModerator(moderationData.moderatorId, streamId)) {
                throw new Error('Apenas moderadores podem moderar mensagens');
            }

            const message = chatRoom.messages.find(m => m.id === messageId);
            if (!message) {
                throw new Error('Mensagem não encontrada');
            }

            const action = moderationData.action;
            const reason = moderationData.reason || 'Sem motivo especificado';

            switch (action) {
                case 'delete':
                    message.isDeleted = true;
                    message.moderationStatus = 'deleted';
                    message.moderationInfo = {
                        action,
                        reason,
                        moderatorId: moderationData.moderatorId,
                        timestamp: new Date().toISOString()
                    };
                    chatRoom.stats.deletedMessages++;
                    break;

                case 'warn':
                    message.moderationStatus = 'flagged';
                    message.moderationInfo = {
                        action,
                        reason,
                        moderatorId: moderationData.moderatorId,
                        timestamp: new Date().toISOString()
                    };
                    
                    // Adicionar usuário à lista de avisados
                    const warnings = chatRoom.warnedUsers.get(message.userId) || 0;
                    chatRoom.warnedUsers.set(message.userId, warnings + 1);
                    chatRoom.stats.warnedUsers++;
                    break;

                case 'ban':
                    message.moderationStatus = 'deleted';
                    message.isDeleted = true;
                    chatRoom.bannedUsers.add(message.userId);
                    chatRoom.stats.bannedUsers++;
                    break;

                default:
                    throw new Error('Ação de moderação inválida');
            }

            // Emitir evento de moderação
            this.emit('messageModerated', { streamId, messageId, message, moderationData });

            return {
                success: true,
                message,
                action,
                reason
            };

        } catch (error) {
            console.error('❌ Erro ao moderar mensagem:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Fixa uma mensagem no chat
     */
    async pinMessage(streamId, messageId, moderatorId) {
        try {
            const chatRoom = this.chatRooms.get(streamId);
            if (!chatRoom) {
                throw new Error('Sala de chat não encontrada');
            }

            if (!this.isUserModerator(moderatorId, streamId)) {
                throw new Error('Apenas moderadores podem fixar mensagens');
            }

            const message = chatRoom.messages.find(m => m.id === messageId);
            if (!message) {
                throw new Error('Mensagem não encontrada');
            }

            // Desfixar mensagens anteriores
            chatRoom.messages.forEach(m => m.isPinned = false);
            chatRoom.pinnedMessages = [];

            // Fixar nova mensagem
            message.isPinned = true;
            chatRoom.pinnedMessages.push(message);

            // Emitir evento de mensagem fixada
            this.emit('messagePinned', { streamId, messageId, message });

            return {
                success: true,
                message,
                pinnedMessages: chatRoom.pinnedMessages
            };

        } catch (error) {
            console.error('❌ Erro ao fixar mensagem:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Atualiza configurações da transmissão
     */
    async updateStreamSettings(streamId, settings, userId) {
        try {
            const stream = this.activeStreams.get(streamId);
            if (!stream) {
                throw new Error('Transmissão não encontrada');
            }

            if (userId !== stream.hostId && !this.isUserModerator(userId, streamId)) {
                throw new Error('Apenas o host ou moderadores podem alterar configurações');
            }

            // Atualizar configurações
            Object.assign(stream.settings, settings);
            stream.updatedAt = new Date().toISOString();

            // Emitir evento de configurações atualizadas
            this.emit('streamSettingsUpdated', { streamId, stream, settings });

            return {
                success: true,
                stream,
                message: 'Configurações atualizadas com sucesso'
            };

        } catch (error) {
            console.error('❌ Erro ao atualizar configurações:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Obtém estatísticas do chat
     */
    async getChatStats(streamId) {
        try {
            const chatRoom = this.chatRooms.get(streamId);
            if (!chatRoom) {
                throw new Error('Sala de chat não encontrada');
            }

            const stats = {
                ...chatRoom.stats,
                activeUsers: this.getActiveUsers(streamId),
                activePolls: chatRoom.activePolls.size,
                pinnedMessages: chatRoom.pinnedMessages.length,
                moderators: chatRoom.moderators.length,
                bannedUsers: chatRoom.bannedUsers.size,
                warnedUsers: chatRoom.warnedUsers.size
            };

            return {
                success: true,
                stats
            };

        } catch (error) {
            console.error('❌ Erro ao obter estatísticas do chat:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Auto-moderação básica de mensagens
     */
    async autoModerateMessage(streamId, message) {
        try {
            const content = message.content.toLowerCase();
            const flags = [];

            // Verificar palavras proibidas
            const forbiddenWords = ['palavrão', 'xingamento', 'spam'];
            forbiddenWords.forEach(word => {
                if (content.includes(word)) {
                    flags.push(`Contém palavra proibida: ${word}`);
                }
            });

            // Verificar spam (muitas mensagens em pouco tempo)
            const recentMessages = this.getRecentUserMessages(streamId, message.userId, 10);
            if (recentMessages.length > 5) {
                flags.push('Possível spam - muitas mensagens em pouco tempo');
            }

            // Verificar links suspeitos
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urls = content.match(urlRegex);
            if (urls && urls.length > 2) {
                flags.push('Muitos links - possível spam');
            }

            // Se houver flags, marcar para revisão
            if (flags.length > 0) {
                message.moderationStatus = 'flagged';
                message.autoModerationFlags = flags;
                
                // Emitir evento de auto-moderação
                this.emit('messageAutoFlagged', { streamId, message, flags });
            }

        } catch (error) {
            console.error('❌ Erro na auto-moderação:', error.message);
        }
    }

    /**
     * Verifica se usuário é moderador
     */
    isUserModerator(userId, streamId) {
        const chatRoom = this.chatRooms.get(streamId);
        if (!chatRoom) return false;

        return chatRoom.moderators.includes(userId);
    }

    /**
     * Obtém última mensagem do usuário
     */
    getLastUserMessage(chatRoom, userId) {
        return chatRoom.messages
            .filter(m => m.userId === userId && !m.isDeleted)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
    }

    /**
     * Verifica se modo lento está ativo
     */
    isSlowModeActive(lastMessageTime, interval) {
        const now = new Date();
        const lastMessage = new Date(lastMessageTime);
        const diffSeconds = (now - lastMessage) / 1000;
        return diffSeconds < interval;
    }

    /**
     * Verifica se usuário é seguidor
     */
    isUserFollower(userId, hostId) {
        // Em produção, verificar no banco de dados
        return true; // Mock para desenvolvimento
    }

    /**
     * Obtém usuários ativos
     */
    getActiveUsers(streamId) {
        // Em produção, implementar lógica real de usuários ativos
        return Math.floor(Math.random() * 100) + 50; // Mock para desenvolvimento
    }

    /**
     * Obtém mensagens recentes do usuário
     */
    getRecentUserMessages(streamId, userId, limit = 10) {
        const chatRoom = this.chatRooms.get(streamId);
        if (!chatRoom) return [];

        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

        return chatRoom.messages
            .filter(m => m.userId === userId && new Date(m.timestamp) > fiveMinutesAgo)
            .slice(0, limit);
    }

    /**
     * Obtém transmissões ativas
     */
    getActiveStreams() {
        return Array.from(this.activeStreams.values())
            .filter(stream => stream.status === 'live');
    }

    /**
     * Obtém informações da transmissão
     */
    getStreamInfo(streamId) {
        return this.activeStreams.get(streamId);
    }

    /**
     * Obtém mensagens do chat
     */
    getChatMessages(streamId, limit = 50, offset = 0) {
        const chatRoom = this.chatRooms.get(streamId);
        if (!chatRoom) return [];

        return chatRoom.messages
            .filter(m => !m.isDeleted)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            .slice(offset, offset + limit);
    }

    /**
     * Limpa dados antigos
     */
    cleanupOldData() {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Limpar transmissões encerradas há mais de 1 dia
        for (const [streamId, stream] of this.activeStreams.entries()) {
            if (stream.status === 'ended' && new Date(stream.endTime) < oneDayAgo) {
                this.activeStreams.delete(streamId);
                this.chatRooms.delete(streamId);
                console.log(`🧹 Transmissão ${streamId} removida da memória`);
            }
        }
    }
}

module.exports = LiveChatService;