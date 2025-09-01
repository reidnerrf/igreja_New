# 🔧 Sistema de Configuração - ConnectFé

Este diretório contém todas as configurações centralizadas do sistema ConnectFé, organizadas de forma modular e extensível.

## 📁 Estrutura de Arquivos

```
config/
├── index.js              # Configuração principal do sistema
├── social-apis.js        # Configurações das APIs de redes sociais
├── ml-analytics.js       # Configurações de ML e Analytics
├── live-chat.js          # Configurações do Live Chat
├── forbidden-words.txt   # Lista de palavras proibidas
├── .env.example          # Exemplo de variáveis de ambiente
└── README.md             # Este arquivo
```

## 🚀 Configuração Principal (`index.js`)

A classe `ConnectFeConfig` centraliza todas as configurações do sistema:

### Seções Principais

- **system**: Informações básicas do sistema
- **server**: Configurações do servidor HTTP
- **database**: Configurações de banco de dados
- **auth**: Configurações de autenticação
- **upload**: Configurações de upload de arquivos
- **email**: Configurações de email
- **pushNotifications**: Configurações de notificações push
- **gamification**: Sistema de gamificação
- **moderation**: Sistema de moderação
- **analytics**: Sistema de analytics
- **cache**: Sistema de cache
- **logging**: Sistema de logs
- **monitoring**: Sistema de monitoramento
- **backup**: Sistema de backup
- **security**: Configurações de segurança
- **performance**: Otimizações de performance
- **integration**: Integrações externas
- **development**: Configurações de desenvolvimento
- **features**: Flags de funcionalidades

### Métodos Principais

```javascript
const config = require('./config');

// Obter configuração de uma seção
const serverConfig = config.getSectionConfig('server');

// Verificar se uma funcionalidade está habilitada
const isEnabled = config.isFeatureEnabled('liveChat');

// Obter todas as funcionalidades habilitadas
const enabledFeatures = config.getEnabledFeatures();

// Validar configuração do sistema
const validation = config.validateSystemConfig();

// Exportar configurações
config.exportConfig('./config-export.json', 'json');
```

## 🔗 APIs de Redes Sociais (`social-apis.js`)

Configurações para integração com plataformas sociais:

### Plataformas Suportadas

- Facebook
- Twitter
- Instagram
- WhatsApp Business
- Telegram
- LinkedIn
- YouTube
- TikTok
- Pinterest
- Discord
- Reddit
- Snapchat
- Twitch
- Mastodon
- Bluesky

### Uso

```javascript
const socialConfig = require('./config/social-apis');

// Verificar se uma plataforma está habilitada
const isFacebookEnabled = socialConfig.isPlatformEnabled('facebook');

// Obter configuração de uma plataforma
const twitterConfig = socialConfig.getPlatformConfig('twitter');

// Validar configuração
const validation = socialConfig.validatePlatformConfig('instagram');

// Relatório de status
const status = socialConfig.getStatusReport();
```

## 🤖 ML e Analytics (`ml-analytics.js`)

Configurações para machine learning e analytics:

### Funcionalidades

- **NLP**: Processamento de linguagem natural
- **Classificação**: Categorização automática de conteúdo
- **Sentimento**: Análise de sentimento
- **Engajamento**: Predição de engajamento
- **Comportamento**: Análise de comportamento do usuário
- **Recomendações**: Sistema de recomendações
- **Analytics**: Coleta e análise de dados

### Uso

```javascript
const mlConfig = require('./config/ml-analytics');

// Verificar se uma funcionalidade está habilitada
const isNLPEnabled = mlConfig.isFeatureEnabled('nlp');

// Obter configuração de uma seção
const classificationConfig = mlConfig.getSectionConfig('classification');

// Validar configuração
const validation = mlConfig.validateSectionConfig('sentiment');

// Relatório de status
const status = mlConfig.getStatusReport();
```

## 💬 Live Chat (`live-chat.js`)

Configurações para o sistema de chat ao vivo:

### Funcionalidades

- **WebSocket**: Configurações de conexão
- **Chat**: Configurações básicas do chat
- **Reações**: Sistema de reações
- **Enquetes**: Sistema de enquetes
- **Badges**: Sistema de badges
- **Moderação**: Sistema de moderação
- **Stream**: Configurações de transmissão
- **Usuários**: Configurações de usuários
- **Notificações**: Sistema de notificações
- **Analytics**: Analytics do chat
- **Segurança**: Configurações de segurança
- **Performance**: Otimizações de performance

### Uso

```javascript
const chatConfig = require('./config/live-chat');

// Verificar se uma funcionalidade está habilitada
const isReactionsEnabled = chatConfig.isFeatureEnabled('reactions');

// Obter configuração de uma seção
const moderationConfig = chatConfig.getSectionConfig('moderation');

// Validar configuração
const validation = chatConfig.validateSectionConfig('websocket');

// Relatório de status
const status = chatConfig.getStatusReport();
```

## ⚙️ Variáveis de Ambiente

### Arquivo `.env`

Copie o arquivo `.env.example` para `.env` e configure as variáveis necessárias:

```bash
# Configurações básicas
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key

# Banco de dados
MONGODB_URI=mongodb://localhost:27017/connectfe

# APIs sociais
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
TWITTER_API_KEY=your_api_key

# Features
FEATURE_SOCIAL_SHARING=true
FEATURE_LIVE_CHAT=true
FEATURE_ML_ANALYTICS=true
```

## 🔍 Validação de Configuração

### Validação Automática

O sistema valida automaticamente as configurações:

```javascript
const config = require('./config');

// Validação completa do sistema
const systemValidation = config.validateSystemConfig();

if (systemValidation.valid) {
    console.log('✅ Sistema configurado corretamente');
} else {
    console.log('❌ Problemas na configuração:');
    systemValidation.recommendations.forEach(rec => {
        console.log(`- ${rec.message}: ${rec.action}`);
    });
}
```

### Relatórios de Status

```javascript
// Relatório geral
const status = config.getStatusReport();

// Estatísticas de uso
const stats = config.getUsageStats();

// Configurações de uma seção específica
const sectionConfig = config.getSectionConfig('upload');
```

## 📤 Exportação e Importação

### Exportar Configurações

```javascript
// Exportar para JSON
config.exportConfig('./config-export.json', 'json');

// Exportar para .env
config.exportConfig('./config-export.env', 'env');
```

### Importar Configurações

```javascript
// Importar de arquivo
const result = config.importConfig('./config-import.json');

if (result.success) {
    console.log('Configuração importada com sucesso');
} else {
    console.error('Erro na importação:', result.error);
}
```

## 🛡️ Segurança

### Configurações Sensíveis

- **JWT_SECRET**: Chave secreta para tokens JWT
- **API Keys**: Chaves das APIs externas
- **Database URIs**: URLs de conexão com banco
- **SMTP Credentials**: Credenciais de email

### Recomendações

1. **Nunca** commite o arquivo `.env` no repositório
2. Use variáveis de ambiente diferentes para cada ambiente
3. Rotacione chaves secretas regularmente
4. Use HTTPS em produção
5. Configure firewalls e rate limiting

## 🚀 Desenvolvimento

### Configurações de Desenvolvimento

```bash
# Habilitar modo debug
DEBUG=true

# Logs verbosos
VERBOSE_LOGGING=true

# Hot reload
HOT_RELOAD_ENABLED=true

# Dados mock
MOCK_DATA_ENABLED=true
```

### Configurações de Teste

```bash
# Modo de teste
NODE_ENV=test

# Banco de dados de teste
MONGODB_URI=mongodb://localhost:27017/connectfe_test

# Logs de teste
LOG_LEVEL=debug
```

## 📊 Monitoramento

### Health Checks

```javascript
// Endpoint de saúde básico
GET /health

// Endpoint de saúde detalhado
GET /health/detailed
```

### Métricas

```javascript
// Endpoint de métricas
GET /metrics

// Métricas específicas
GET /metrics/system
GET /metrics/database
GET /metrics/performance
```

## 🔄 Atualizações

### Atualizar Configuração

```javascript
// Atualizar uma seção específica
config.updateSectionConfig('server', {
    port: 3002,
    host: '0.0.0.0'
});

// Recarregar configurações
config.resetConfigs();
```

### Recarregar Configurações

```javascript
// Recarregar do arquivo .env
require('dotenv').config();
config.resetConfigs();
```

## 📝 Logs

### Configuração de Logs

```bash
# Nível de log
LOG_LEVEL=info

# Formato de log
LOG_FORMAT=json

# Rotação de logs
LOG_ROTATION_ENABLED=true
LOG_ROTATION_MAX_SIZE=10m
LOG_ROTATION_MAX_FILES=5
```

### Destinos de Log

- **Console**: Logs no terminal
- **Arquivo**: Logs em arquivo
- **Sistema**: Logs do sistema operacional

## 🆘 Suporte

### Problemas Comuns

1. **Configuração não encontrada**: Verifique se o arquivo `.env` existe
2. **Validação falhou**: Verifique as variáveis obrigatórias
3. **Feature não habilitada**: Configure a variável `FEATURE_*` como `true`

### Debug

```bash
# Habilitar debug
DEBUG=true

# Logs verbosos
VERBOSE_LOGGING=true

# Modo de desenvolvimento
NODE_ENV=development
```

## 📚 Documentação Adicional

- [Variáveis de Ambiente](./.env.example)
- [Configuração de APIs Sociais](./social-apis.js)
- [Configuração de ML e Analytics](./ml-analytics.js)
- [Configuração de Live Chat](./live-chat.js)
- [Lista de Palavras Proibidas](./forbidden-words.txt)

## 🤝 Contribuição

Para contribuir com melhorias no sistema de configuração:

1. Mantenha a compatibilidade com versões anteriores
2. Documente novas variáveis de ambiente
3. Adicione validações apropriadas
4. Teste em diferentes ambientes
5. Atualize este README

---

**ConnectFé** - Sistema de Configuração Centralizada v1.0.0