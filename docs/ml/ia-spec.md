## Especificação IA/ML — Identificação de Igrejas e Recomendações

### Objetivos
- Identificar e classificar igrejas (denominação/rito) a partir de texto, imagens e sinais geoespaciais.
- Melhorar descoberta e relevância (mapa, eventos, transmissões) com recomendações.
- Evitar spam, fraude e conteúdo tóxico.

### Tarefas de ML
1) Enriquecimento por NLP
   - Extração de entidades: nome da igreja, denominação, endereço, horários, contatos a partir de páginas e perfis
   - Normalização de nomes e deduplicação (similaridade semântica)
   - Classificação de denominação (Católica, Batista, Presbiteriana, Assembleia, etc.)

2) Visão Computacional
   - Classificação de fachada/placas: presença de símbolos (cruz, rosácea, logotipos) e texto OCR
   - On-device (TFLite/ONNX) para privacidade; servidor para lotes

3) Geoespacial
   - Clustering por H3 + fuzzy de endereço para dedupe
   - Sinais: proximidade de POIs correlatos, densidade por bairro

4) Recomendação
   - Baseado em conteúdo (preferências, denominação, horários)
   - Colaborativo leve (interações: seguir, RSVP, doações)

5) Moderação
   - Classificador de toxicidade/spam para chat, comentários, orações
   - Anomalias em rifas/doações

### Dados e Coleta
- Fontes: sites diocesanos/convenções, redes sociais, OSM/Google Places (compliance), submissões de usuários.
- Anotações: humanos-in-the-loop; editores locais com reputação.
- Métricas de qualidade: precisão por classe, cobertura por região, tempo até verificação.

### Pipeline
- Ingestão -> Limpeza -> Extração (NLP/OCR) -> Classificação -> Deduplicação -> Verificação humana -> Publicação.
- Orquestração: Prefect/Airflow; armazenamento de features com Feast.

### Modelos e Tech
- NLP: mBERT/BERTo/Distil-BERT PT-BR fine-tuned; OCR (Tesseract/TrOCR).
- Visão: EfficientNet/MobileNetV3 quantizado para TFLite/ONNX.
- Recsys: LightFM/Matrix Factorization + re-ranking por regras e diversidade.

### Privacidade e Ética
- Minimização de dados; opt-out; explicabilidade simples para recomendações.
- Auditoria de viés (católicos/protestantes), fairness por denominação/rito.

### Métricas
- Classificação: F1 macro por denominação/rito; top-1/top-3 accuracy.
- Dedup: precisão/recall de mesclagem; taxa de duplicatas restantes.
- Recs: CTR, tempo de sessão, satisfação (NPS), diversidade de resultados.
- Moderação: precisão e taxa de revisão humana necessária.

### Entregáveis
- Protótipo de pipeline com dados de 3 cidades
- Modelos on-device e servidor com avaliação
- Dashboard de qualidade e drift
