## Arquitetura Alvo (Expo + Backend + IA/ML)

### Visão Geral
- Clientes: Expo (iOS/Android/Web PWA), Deep Links, Notificações Push.
- Backend: API GraphQL/REST (NestJS ou FastAPI), Workers (filas), Webhooks.
- Dados: Postgres + PostGIS, Redis (cache/filas), S3 compatível (mídia), Meilisearch/Elastic (busca), Mapbox/MapLibre.
- ML: Pipelines em Python, modelos ONNX/TFLite on-device e inferência servidor, Feature Store (Feast).

### Módulos Backend
- Auth: Social login (Google/Apple/Facebook), JWT/Session, RBAC (usuário/igreja/admin).
- Igreja: perfil, horários, ministérios, contatos, verificações/KYC.
- Geo: ingestão, deduplicação H3, geocodificação, proximidade/rota.
- Eventos/Agenda: CRUD, RSVP, check-in, sincronização com transmissões.
- Transmissões: integrações YouTube/Facebook/Mux RTMP, scheduling, VOD.
- Doações: pagamentos (Stripe/Pagar.me), split, recibos, relatórios.
- Rifas: criação, bilhetes, sorteio, compliance, auditoria pública.
- Feed/Chat: posts, comentários moderados, canais, automoderation.
- Moderation: fila humana + IA (toxicity, spam, fraude).

### Serviços de Terceiros
- Mapas: Mapbox/MapLibre, tiles, H3.
- Push: Expo Notifications.
- Pagamentos: Stripe/Pagar.me (Pix/cartão), antifraude.
- CDN/Storage: Cloudflare R2/S3.

### Topologia
- API gateway -> serviços (monólito modular inicialmente, evolução para microserviços conforme escala).
- Filas (BullMQ/Celery) para jobs: ingestão, dedupe, recomendações, moderação.
- Observabilidade: OpenTelemetry, Prometheus/Grafana, Sentry.

### Esquema de Dados (alto nível)
- `church`: id, nome, denominação, rito, geo (Point), endereço, verificada, contatos, mídias.
- `service_time`: church_id, weekday, time, tipo (missa/culto), linguagem.
- `event`: church_id, título, descrição, início/fim, tipo, capacidade.
- `live_stream`: church_id, provedor, key, status, start_at, vod_url.
- `donation`: church_id, campanha, meta, recebidos, recorrência.
- `raffle`: church_id, regras, bilhetes, sorteio_at, resultado.
- `post`, `comment`, `chat_channel`, `chat_message`.
- `user`: preferências, denominação/rito, premium, localização consentida.

### Segurança e LGPD
- Consentimento granular (localização, notificações, dados sensíveis).
- Criptografia em trânsito e repouso; rotação de segredos; DPO e processos de exclusão/exportação.
- KYC para igrejas (documentos, selo verificado).

### Deploy e CI/CD
- Infra como código (Terraform), contêineres (Docker), orquestração (ECS/Kubernetes).
- CI: lint/test/build, testes end-to-end (Detox/Playwright), análise estática.

### Roadmap Técnico
- Fase MVP: monólito NestJS/FastAPI + Postgres/PostGIS + Expo (tabs), Mapbox, Meilisearch, pagamentos básicos.
- Fase IA 1.0: ingestão NLP, dedupe H3, recomendação, moderação básica.
- Fase IA 2.0: visão computacional on-device, antifraude, personalização avançada.
