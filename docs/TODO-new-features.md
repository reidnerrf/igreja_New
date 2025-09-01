# 🚀 TODO - Sistema de Planos e Compliance 2.0

## 🎯 **Visão Geral**
Implementar sistema de planos para igrejas, premium para usuários e compliance de rifas conforme solicitado.

## 📋 **Sistema de Planos para Igrejas**

## ✅ **Modelos a Criar**
- [x] Modelo `ChurchPlan` - Planos disponíveis (Gratuito, Pro, Enterprise)
- [x] Modelo `ChurchSubscription` - Assinaturas das igrejas
- [x] Atualizar modelo `User` - Adicionar campos de plano da igreja

### ✅ **Funcionalidades por Plano**
- [x] **Gratuito:** Perfil básico, agenda simples
- [x] **Pro:** Transmissões integradas, dados analíticos, suporte prioritário
- [x] **Enterprise:** Multi-paróquias/diocese, recursos avançados

### ✅ **APIs de Planos**
- [x] `GET /plans` - Listar planos disponíveis
- [x] `POST /plans/subscribe` - Criar assinatura
- [x] `PUT /plans/subscription/:id` - Atualizar plano
- [x] `GET /plans/subscription/status` - Status da assinatura
- [x] `DELETE /plans/subscription/:id` - Cancelar assinatura
- [x] `POST /plans/subscription/:id/renew` - Renovar assinatura

## 👤 **Sistema Premium para Usuários**

### ✅ **Modelos a Atualizar**
- [x] Atualizar modelo `User` - Adicionar campos premium
- [x] Modelo `PremiumFeature` - Recursos premium disponíveis

### ✅ **Funcionalidades Premium**
- [x] Conteúdos exclusivos
- [x] Histórico avançado
- [x] Modo offline
- [x] Experiências sem anúncios

### ✅ **APIs Premium**
- [x] `POST /premium/subscribe` - Assinar premium
- [x] `GET /premium/status` - Status da assinatura
- [x] `GET /premium/features` - Recursos disponíveis
- [x] `PUT /premium/renew` - Renovar assinatura
- [x] `DELETE /premium/cancel` - Cancelar assinatura
- [x] `GET /premium/features/:slug` - Detalhes de feature
- [x] `GET /premium/features/category/:category` - Features por categoria

## 🎰 **Compliance de Rifas**

### ✅ **Atualizações no Modelo Raffle**
- [ ] Campos de compliance (normas locais, transparência)
- [x] Sistema de auditoria de sorteios
- [ ] Limites e validações

### ✅ **APIs de Compliance**
- [ ] `POST /raffles/:id/audit` - Registrar auditoria
- [ ] `GET /raffles/:id/compliance` - Status de compliance
- [ ] `POST /raffles/:id/draw` - Realizar sorteio com compliance

## 🔒 **Segurança e Validações**

### ✅ **Middleware de Planos**
- [ ] Verificar limites por plano
- [ ] Bloquear recursos não autorizados
- [ ] Rate limiting baseado no plano

### ✅ **Validações de Compliance**
- [ ] Verificar normas locais
- [ ] Validar limites de rifas
- [ ] Auditar processos de sorteio

## 📊 **Dashboard e Analytics**

### ✅ **Métricas de Planos**
- [ ] Uso por plano
- [ ] Conversões e retenção
- [ ] Receita por plano

### ✅ **Relatórios de Compliance**
- [ ] Status de conformidade
- [ ] Alertas de não conformidade
- [ ] Histórico de auditorias

## 🎯 **Objetivos da Fase**

- [x] Sistema de planos totalmente funcional
- [ ] Compliance 100% aderente às normas
- [x] Interface clara para upgrade/downgrade
- [x] Transparência total nos processos

## 📅 **Cronograma Sugerido**

1. **Semana 1:** Modelos e estrutura básica
2. **Semana 2:** APIs de planos e premium
3. **Semana 3:** Compliance de rifas
4. **Semana 4:** Testes e refinamentos
