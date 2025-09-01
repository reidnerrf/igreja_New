# ⛪ ConnectFé - Funcionalidades Católicas

## 📋 Visão Geral

O ConnectFé foi transformado em uma plataforma exclusivamente católica, implementando um sistema abrangente de funcionalidades específicas para a comunidade católica brasileira. Este documento detalha todas as novas funcionalidades implementadas.

## 🎯 Funcionalidades Implementadas

### 1. 🎨 Temas Sazonais Católicos

#### Sistema de Temas Automáticos
- **Advento** (1º de dezembro - 24 de dezembro): Azul, preparação para o Natal
- **Natal** (25 de dezembro - 6 de janeiro): Vermelho e dourado, celebração do nascimento
- **Quaresma** (Quarta-feira de Cinzas - Quinta-feira Santa): Roxo, penitência e preparação
- **Páscoa** (Domingo de Páscoa - Pentecostes): Dourado, ressurreição de Cristo
- **Pentecostes** (50 dias após Páscoa): Laranja, vinda do Espírito Santo
- **Corpus Christi** (Quinta-feira após Trindade): Dourado, corpo e sangue de Cristo
- **Nossa Senhora Aparecida** (12 de outubro): Rosa, padroeira do Brasil
- **Finados** (2 de novembro): Cinza, comemoração dos fiéis defuntos

#### Características
- Cálculo automático de datas móveis (Páscoa, Pentecostes, etc.)
- Cores litúrgicas apropriadas para cada estação
- Ícones e descrições específicas para cada tema
- Transições suaves entre temas

#### Arquivos Implementados
- `backend/config/catholic-theme.js` - Sistema de temas sazonais
- Cálculo automático de datas litúrgicas
- Suporte a 8 estações litúrgicas principais

### 2. 🏛️ Branding da Igreja

#### Personalização Completa
- **Cores**: Primária, secundária, de destaque, fundo, texto
- **Logotipo**: Principal, secundário e favicon
- **Imagens de Capa**: Principal, eventos, comunidade, oração
- **Tipografia**: Fontes personalizáveis com pesos variados
- **Layout**: Espaçamentos, bordas e sombras configuráveis

#### Validação de Acessibilidade
- Verificação automática de contraste
- Geração de paletas de cores complementares
- Suporte a temas de alto contraste
- Validação WCAG AA

#### Arquivos Implementados
- `backend/models/ChurchBranding.js` - Modelo de branding
- Sistema de validação de cores
- Geração automática de CSS personalizado

### 3. 🎯 Sistema de Quests e Desafios

#### Tipos de Quest
- **Diárias**: Objetivos diários (oração, caridade, etc.)
- **Semanais**: Desafios de uma semana
- **Mensais**: Metas mensais
- **Sazonais**: Relacionadas a datas especiais
- **Especiais**: Eventos únicos

#### Categorias
- **Oração**: Terço, meditação, orações espontâneas
- **Caridade**: Boas ações, voluntariado, doações
- **Comunidade**: Participação em eventos, evangelização
- **Aprendizado**: Estudo bíblico, catequese
- **Adoração**: Missa, adoração, sacramentos
- **Reflexão**: Diário espiritual, gratidão

#### Sistema de Recompensas
- Pontos de experiência
- Badges especiais
- Desbloqueios de conteúdo
- Sistema de níveis

#### Arquivos Implementados
- `backend/models/Quest.js` - Modelo de quests
- Sistema de objetivos e progresso
- Validação de participação
- Estatísticas de engajamento

### 4. 🔥 Sistema de Streak Diário

#### Funcionalidades
- **Contador de Dias**: Dias consecutivos de atividade
- **Metas**: Diárias, semanais e mensais
- **Lembretes**: Notificações para manter o streak
- **Período de Graça**: Evita quebrar o streak por pequenas falhas

#### Atividades Contadas
- Oração diária
- Check-in na igreja
- Leitura espiritual
- Ato de caridade
- Participação em eventos
- Estudo bíblico

#### Marcos e Recompensas
- **7 dias**: Primeiro marco (+25 pontos)
- **14 dias**: Semana dupla (+50 pontos)
- **30 dias**: Mês completo (+100 pontos)
- **100 dias**: Centenário (+500 pontos)
- **365 dias**: Ano santo (+1000 pontos)

#### Arquivos Implementados
- `backend/models/Streak.js` - Modelo de streak
- Sistema de check-ins
- Cálculo automático de estatísticas
- Sugestões de atividades

### 5. ✨ Animações de Conquista

#### Tipos de Animação
- **Badge Conquistado**: Slide-in com confetes
- **Quest Completada**: Scale-in com partículas
- **Streak Milestone**: Fade-in com fogos
- **Subiu de Nível**: Rotate-in com celebração
- **Conquista Especial**: Zoom-in com efeitos especiais

#### Efeitos Visuais
- **Confetes**: 150-500 partículas coloridas
- **Partículas**: Sistemas de brilho, fogos e mágico
- **Sons**: Efeitos sonoros para cada conquista
- **Cartões**: Cartões de conquista animados

#### Sistema de Partículas
- **Brilho**: 50 partículas douradas
- **Fogos**: 100 partículas multicoloridas
- **Mágico**: 75 partículas especiais
- **Celebração**: 200 partículas festivas

#### Arquivos Implementados
- `backend/services/achievementAnimationService.js` - Serviço de animações
- Sistema de filas para múltiplas animações
- Configurações personalizáveis
- Eventos para integração com frontend

### 6. 🔔 Notificações com Ações Rápidas

#### Ações Disponíveis
- **Confirmar Presença**: Em eventos e missas
- **Doar**: Para campanhas da igreja
- **Orar**: Por pedidos de oração
- **Participar**: Em eventos da comunidade
- **Compartilhar**: Conteúdo espiritual
- **Salvar**: Para visualização posterior

#### Tipos de Notificação
- **Lembretes**: Missa, confissão, oração
- **Pedidos**: Oração, caridade, voluntariado
- **Atualizações**: Quest, streak, comunidade
- **Conquistas**: Badges, marcos, níveis
- **Eventos**: Missas, encontros, celebrações

#### Configurações
- **Quiet Hours**: Períodos de silêncio configuráveis
- **Prioridades**: Baixa, média, alta, urgente
- **Agrupamento**: Notificações similares agrupadas
- **Expiração**: Tempo de vida configurável

#### Arquivos Implementados
- `backend/models/QuickActionNotification.js` - Modelo de notificações
- Sistema de ações rápidas
- Configurações de entrega
- Métricas de engajamento

### 7. 🚀 Onboarding Católico

#### Etapas do Onboarding
1. **Boas-vindas**: Introdução à plataforma
2. **Declaração de Fé**: Confirmação de ser católico
3. **Informações da Igreja**: Paróquia e diocese
4. **Preferências Espirituais**: Estilo de oração, missa
5. **Envolvimento na Comunidade**: Ministérios e participação
6. **Vida de Oração**: Lembretes e preferências
7. **Sacramentos**: Registro dos sacramentos recebidos
8. **Tradições Católicas**: Devoções e práticas
9. **Configuração Final**: Revisão e conclusão

#### Declaração de Fé
- Confirmação de ser católico
- Data de batismo
- Data de confirmação
- Paróquia e diocese
- Sacramentos recebidos
- Educação religiosa

#### Preferências Configuráveis
- **Estilo de Oração**: Terço, liturgia das horas, meditação
- **Preferência de Missa**: Tradicional, novus ordo, carismática
- **Frequência de Confissão**: Semanal, mensal, trimestral
- **Envolvimento**: Observador, participante, ativo, líder

#### Arquivos Implementados
- `backend/models/CatholicOnboarding.js` - Modelo de onboarding
- Sistema de etapas progressivas
- Validação de dados obrigatórios
- Histórico de mudanças

## 🏗️ Arquitetura do Sistema

### Estrutura de Arquivos
```
backend/
├── config/
│   └── catholic-theme.js          # Temas sazonais católicos
├── models/
│   ├── Quest.js                   # Sistema de quests
│   ├── Streak.js                  # Sistema de streak
│   ├── ChurchBranding.js          # Branding da igreja
│   ├── QuickActionNotification.js # Notificações com ações rápidas
│   └── CatholicOnboarding.js     # Onboarding católico
├── services/
│   └── achievementAnimationService.js # Animações de conquista
└── public/
    └── catholic-features-demo.html # Demonstração das funcionalidades
```

### Dependências Principais
- **Moment.js**: Cálculo de datas litúrgicas
- **Sharp**: Processamento de imagens para branding
- **Node-cron**: Agendamento de temas sazonais
- **EventEmitter**: Sistema de eventos para animações

## 🚀 Como Usar

### 1. Configuração dos Temas Sazonais
```javascript
const CatholicThemeConfig = require('./config/catholic-theme');

// Obter tema atual
const currentTheme = CatholicThemeConfig.getCurrentTheme();

// Obter calendário litúrgico
const calendar = CatholicThemeConfig.getLiturgicalCalendar(2024);
```

### 2. Sistema de Quests
```javascript
const Quest = require('./models/Quest');

// Criar quest padrão
const quest = Quest.createDefaultQuest('daily', 'prayer');

// Completar quest
const result = quest.completeForUser(userId, 300, 5); // 5 min, rating 5
```

### 3. Sistema de Streak
```javascript
const Streak = require('./models/Streak');

// Fazer check-in
const streak = await Streak.findByUser(userId);
const result = streak.checkIn('prayer', 10, 'Oração matinal');
```

### 4. Animações de Conquista
```javascript
const AchievementAnimationService = require('./services/achievementAnimationService');

// Reproduzir animação
await AchievementAnimationService.playAchievementAnimation(
    'badge_earned',
    achievementData
);
```

### 5. Notificações com Ações Rápidas
```javascript
const QuickActionNotification = require('./models/QuickActionNotification');

// Criar notificação
const notification = QuickActionNotification.createDefault(
    userId,
    'event_reminder',
    'Lembrete de Missa',
    'Missa dominical às 10h'
);

// Executar ação
const result = notification.executeQuickAction('confirm_presence', userId);
```

### 6. Onboarding Católico
```javascript
const CatholicOnboarding = require('./models/CatholicOnboarding');

// Criar onboarding padrão
const onboarding = CatholicOnboarding.createDefault(userId);

// Completar etapa
const result = onboarding.completeStep('faith_declaration', {
    isCatholic: true,
    baptismDate: new Date('1990-01-01')
});
```

## 🎨 Personalização

### Cores dos Temas
- **Advento**: #1976D2 (Azul)
- **Natal**: #D32F2F (Vermelho)
- **Quaresma**: #7B1FA2 (Roxo)
- **Páscoa**: #FFD700 (Dourado)
- **Pentecostes**: #FF5722 (Laranja)

### Configurações de Branding
- Paleta de cores personalizável
- Tipografias configuráveis
- Layout responsivo
- Suporte a temas claro/escuro

## 📱 Demonstração

### Acessar Demo
Abra o arquivo `backend/public/catholic-features-demo.html` em seu navegador para ver todas as funcionalidades em ação.

### Funcionalidades Demonstradas
- ✅ Temas sazonais automáticos
- ✅ Sistema de branding personalizável
- ✅ Quests e desafios interativos
- ✅ Contador de streak em tempo real
- ✅ Animações de conquista com confetes
- ✅ Notificações com ações rápidas
- ✅ Progresso do onboarding católico

## 🔧 Configuração

### Variáveis de Ambiente
```bash
# Temas Católicos
CATHOLIC_THEMES_ENABLED=true
SEASONAL_THEMES_AUTO=true

# Branding
CHURCH_BRANDING_ENABLED=true
CUSTOM_COLORS_ENABLED=true

# Gamificação
QUESTS_ENABLED=true
STREAKS_ENABLED=true
ACHIEVEMENTS_ENABLED=true

# Notificações
QUICK_ACTIONS_ENABLED=true
PUSH_NOTIFICATIONS_ENABLED=true

# Onboarding
CATHOLIC_ONBOARDING_ENABLED=true
FAITH_DECLARATION_REQUIRED=true
```

### Configuração do Banco de Dados
```javascript
// Conectar modelos ao MongoDB
mongoose.model('Quest', QuestSchema);
mongoose.model('Streak', StreakSchema);
mongoose.model('ChurchBranding', ChurchBrandingSchema);
mongoose.model('QuickActionNotification', QuickActionNotificationSchema);
mongoose.model('CatholicOnboarding', CatholicOnboardingSchema);
```

## 📊 Monitoramento e Analytics

### Métricas Disponíveis
- **Engajamento**: Taxa de conclusão de quests
- **Retenção**: Dias de streak mantidos
- **Personalização**: Uso de temas sazonais
- **Notificações**: Taxa de ação nas notificações
- **Onboarding**: Taxa de conclusão por etapa

### Logs e Eventos
- Criação de quests e streaks
- Conquistas desbloqueadas
- Mudanças de tema sazonal
- Ações em notificações
- Progresso do onboarding

## 🚀 Próximos Passos

### Funcionalidades Planejadas
- [ ] Integração com calendário litúrgico oficial
- [ ] Sistema de indulgências e graças especiais
- [ ] Comunhão espiritual online
- [ ] Peregrinações virtuais
- [ ] Biblioteca de orações e devoções
- [ ] Sistema de padroeiros pessoais

### Melhorias Técnicas
- [ ] Cache de temas sazonais
- [ ] Otimização de animações
- [ ] Sistema de backup automático
- [ ] API para integração externa
- [ ] Dashboard de administração

## 🤝 Contribuição

### Como Contribuir
1. Fork do repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Adicione testes
5. Faça commit das mudanças
6. Abra um Pull Request

### Padrões de Código
- Use ES6+ features
- Siga o padrão de nomenclatura
- Adicione documentação JSDoc
- Inclua testes unitários
- Mantenha a compatibilidade com Node.js 16+

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- Comunidade católica brasileira
- Desenvolvedores contribuintes
- Paróquias e dioceses parceiras
- Especialistas em liturgia e catequese

---

**ConnectFé** - Conectando fé e tecnologia para uma experiência espiritual mais rica e engajante. ⛪✨