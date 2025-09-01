## UX Flows e Mapa de Navegação (Mobile/Web – Expo)

### Princípios de UX/UI
- **Clean e inclusivo**: azul (primário), branco (base), dourado (destaques/premium). Ícones minimalistas, linguagem neutra para católicos e protestantes.
- **Acessibilidade**: contraste AA/AAA, tamanhos dinâmicos, suporte a screen readers, foco visível, animações discretas.
- **Coerência**: tema claro/escuro, componentes reusáveis, naming consistente entre web e mobile.
- **On-device primeiro**: feedback imediato, estados vazios úteis, placeholders para latência.

### Estrutura de Navegação
- **App Usuário (abas inferior)**: `Mapa`, `Agenda`, `Transmissões`, `Feed`, `Perfil`.
- **App Igreja (Dashboard)**: `Visão Geral`, `Agenda`, `Transmissões`, `Doações`, `Rifas`, `Avisos/Feed`, `Chat`, `Configurações`.
- **Navegação global**: Deep links (evento/igreja/transmissão), busca global, notificações push segmentadas.

### Onboarding (Usuário)
1) Tela de boas-vindas + seleção de idioma e tema (claro/escuro/sistema).
2) Preferências rápidas: denominação/rito, distância máxima, horários preferidos.
3) Permissões: localização (precisa/approx), notificações (eventos, transmissões, orações).
4) Sugestões iniciais: igrejas próximas, eventos do dia, transmissões ao vivo.
5) Login social opcional (Google/Apple/Facebook) ou continuar anônimo.

### Onboarding (Igreja)
1) Identificar-se como representante (KYC simplificado).
2) Buscar e reivindicar igreja existente (deduplicação assistida) ou cadastrar nova.
3) Completar perfil: horários, ministérios, contatos, transmissões, doações.
4) Tour do dashboard com metas (publicar 1 evento, configurar doações, convidar moderador).

### Autenticação e Acesso
- Social login (Google/Apple/Facebook). E-mail/senha como fallback.
- Contas: Usuário padrão; Representante de igreja (papéis: admin, editor, moderador).
- Freemium/Premium: recursos com cadeados e explicações claras de upgrade.

---

## Fluxos-Chave (Usuário)

### 1) Mapa de Igrejas
Entradas: localização do usuário, filtros, busca por nome/denominação.
- Mapa com cluster de marcadores e calor de eventos.
- Filtros: denominação/rito, idioma do culto, acessibilidade, horário, distância.
- Sheet de igreja ao tocar marcador: nome, denominação, próximos horários, ações (Salvar, Rota, Ver Perfil).
- Ações principais: abrir `Perfil da Igreja`, iniciar rota, favoritar/salvar, compartilhar.
- Estados: sem permissão de localização, offline, sem resultados (sugerir ampliar raio).

### 2) Perfil da Igreja
Estrutura em abas: `Sobre`, `Agenda`, `Transmissões`, `Doações`, `Rifas`, `Avisos`, `Chat`.
- Header: capa/foto, nome, denominação/rito, status verificada, distância, botões (Salvar, Compartilhar).
- Sobre: endereço com rota, contatos, ministérios, descrição, horários fixos.
- Agenda: lista calendário (com RSVP/“Vou”), filtro por tipo (missa/culto, encontro, estudo).
- Transmissões: ao vivo agora, próximas, gravações; player embutido e deep link para TV.
- Doações: metas, valores rápidos, recorrência, histórico e recibos.
- Rifas: campanhas ativas, compra de bilhetes, regras e transparência do sorteio.
- Avisos/Feed: posts da igreja, editais, chamados para voluntariado.
- Chat: canais abertos/moderados; denunciar, silenciar, seguir regras da comunidade.

### 3) Agenda Pessoal
- Lista e calendário com eventos de igrejas seguidas e recomendações.
- Ações: confirmar presença, adicionar ao calendário do dispositivo, compartilhar com grupos.
- Filtros: por dia, por tipo, por igreja.

### 4) Transmissões
- Carrosséis: Ao vivo agora, Começando em breve, Reprises populares.
- Player com mini chat/reações; modo PIP no mobile; enviar intenção de oração durante live (opcional).
- Notificações configuráveis por igreja/categoria.

### 5) Orações
- Enviar pedido: público (com nome), anônimo (privado para moderadores) ou somente amigos.
- Categorias (saúde, família, gratidão), duração, consentimento LGPD.
- Interações: “Estou orando”, comentários moderados, cadeia de oração.

### 6) Doações
- Valores rápidos, opção dízimo/oferta, recorrência mensal.
- Métodos: cartão, Pix, carteira; comprovante e histórico.
- Transparência: destino da campanha, metas e progresso.

### 7) Rifas Premium
- Lista de rifas ativas, detalhes de prêmios, termos e compliance.
- Compra de bilhetes, numeração, status do sorteio, auditoria pública.
- Carteira com bilhetes comprados e resultados.

### 8) Feed
- Posts de igrejas seguidas e recomendações; mídia rica (imagem/vídeo/links).
- Ações: curtir, comentar (moderado), compartilhar, salvar.

### 9) Perfil do Usuário
- Preferências: denominação/rito, distância, notificações, tema.
- Itens salvos: igrejas, eventos, transmissões.
- Assinatura Premium: benefícios, gestão de plano.

---

## Fluxos-Chave (Igreja – Dashboard)

### 10) Visão Geral (Home do Dashboard)
- Métricas de engajamento: seguidores, presença em eventos, doações, alcance das transmissões.
- Tarefas sugeridas: criar evento, programar transmissão, publicar aviso, convidar moderador.

### 11) Agenda (Gestão)
- Criar/editar eventos com recorrência, categorias, capacidade e voluntários.
- Sincronizar com transmissões e publicar no feed.

### 12) Transmissões (Gestão)
- Integrações: YouTube/Facebook/RTMP. Programar lives, thumbnails, chat e moderação.
- VOD: catálogo de gravações com capítulos e descrições.

### 13) Doações (Gestão)
- Campanhas: metas, prazos, visibilidade; split de pagamentos; recibos e relatórios.
- Configurar recorrência, integrações contábeis e exportação.

### 14) Rifas (Gestão – Premium)
- Criar rifas com regras locais, termos, auditoria; emissão de bilhetes e sorteio.
- Relatórios, transparência pública e compliance.

### 15) Avisos/Feed (Gestão)
- Editor de posts com prévias; agendamento; análise de alcance.

### 16) Chat (Gestão)
- Canais por ministério/grupo; moderadores; regras e automoderação com IA.

### 17) Configurações
- Perfil, horários, ministérios, verificação/KYC, equipe, permissões, integrações.

---

## Estados e Diretrizes de UI
- **Tema claro/escuro**: dourado adaptado a contraste; superfícies elevadas com sombra sutil.
- **Carregamento**: skeletons e shimmer; pull-to-refresh; retry claro em erros.
- **Vazio**: ilustrações minimalistas, CTA direto (ex.: “Siga uma igreja para ver eventos”).
- **Erros**: mensagens empáticas e ação corretiva; logs silenciosos para suporte.

## Medição e Telemetria (pontos principais)
- Onboarding completado, permissões concedidas, preferências definidas.
- Taps em filtros do mapa, aberturas de perfil de igreja, cliques em rotas.
- RSVP/“Vou”, check-ins, tempo de view em transmissões, doações iniciadas/concluídas.
- Criações e edições no dashboard; publicações e alcance; moderação acionada.

## Notas de Design
- Tipografia legível (inter/titillium/sempre com fallbacks), ícones minimalistas (phosphor/feather), espaços generosos.
- Microinterações: estados de botão (normal/hover/pressed/disabled), feedback de sucesso/erro, snackbar discreto.

## Próximos Entregáveis
- Wireframes de baixa fidelidade para os 15 fluxos acima.
- Protótipo navegável no Figma com tema claro/escuro.
