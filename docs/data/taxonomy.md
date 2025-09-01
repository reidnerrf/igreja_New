## Taxonomia de Dados — Multi-denominacional

### Conceitos
- `Denominação`: grande família eclesial (Católica Apostólica Romana, Batista, Presbiteriana, Assembleia, Luterana, Metodista, Pentecostal/Neo, Ortodoxa etc.)
- `Rito` (quando aplicável): Romano, Bizantino, Ambrosiano; Culto/Ordem litúrgica em tradições protestantes
- `Governança`: Diocese/Arquidiocese, Paróquia, Presbitério/Sínodo, Convenção/Associação
- `Ministério`: Jovens, Família, Música, Caridade, Catequese/EBD, Células/Pequenos grupos
- `Serviço religioso`: Missa, Culto, Estudo Bíblico, Vigília, Adoração, Confissão/Atendimento pastoral

### Esquemas principais
- `church`
  - `id`, `name`, `aka[]`, `verified`
  - `denomination` (enum), `rite` (enum|null), `governance_unit` (string), `is_cathedral` (bool)
  - `location` (Point), `address`, `coverage_area` (Polygon|null)
  - `contacts`: phone, email, website, social[]
  - `ministries[]` (enum), `accessibility[]` (ramp, interpreter, braille, nursery)
  - `tags[]` (string)

- `service_time`
  - `church_id`, `type` (enum: mass,cult,study,prayer,adoration,confession,other)
  - `weekday` (0-6), `time` (hh:mm), `language`, `notes`

- `event`
  - `church_id`, `title`, `category` (enum), `starts_at`, `ends_at`, `location_override` (Point|null)
  - `capacity`, `rsvp_required` (bool)

- `live_stream`
  - `church_id`, `provider` (youtube, facebook, mux, other), `status`, `start_at`, `vod_url`

- `donation`
  - `church_id`, `campaign`, `goal_amount`, `received_amount`, `recurring` (bool)

- `raffle`
  - `church_id`, `title`, `rules_url`, `ticket_price`, `draw_at`, `result`

- `user`
  - `id`, `preferences`: denomination[], rite[], distance_km, languages[], notifications
  - `premium` (bool), `following_churches[]`, `saved_items[]`

### Enumerações (iniciais)
- `Denomination`
  - CATHOLIC_ROMAN, BAPTIST, PRESBYTERIAN, ASSEMBLY_OF_GOD, LUTHERAN, METHODIST, PENTECOSTAL, NEO_PENTECOSTAL, ORTHODOX, ANGLICAN, OTHER
- `Rite`
  - ROMAN, AMBROSIAN, BYZANTINE, OTHER
- `EventCategory`
  - MASS, SERVICE, STUDY, YOUTH, FAMILY, CHARITY, MUSIC, RETREAT, VIGIL, OTHER
- `Accessibility`
  - RAMP, WHEELCHAIR, SIGN_LANGUAGE, BRAILLE, NURSERY, SUBTITLES

### Normalização e Sinônimos
- Tabela `denomination_synonym(name -> enum)`, exemplo: “Católica”, “Igreja Católica Apostólica Romana” -> `CATHOLIC_ROMAN`; “Igreja Batista”, “Batista Nacional” -> `BAPTIST`.

### Regras de Inclusão
- Linguagem neutra nos rótulos; explicar contextos específicos por tradição quando necessário.

### Índices e Busca
- Índices geoespaciais (PostGIS) por `location` e H3 para agregações.
- Meilisearch/Elastic: campos `name`, `aka`, `denomination`, `address.city`, `ministries`.

### Telemetria de Dados
- Campos de `source` e `confidence` em itens enriquecidos por IA.
- Auditoria de mudanças (quem, quando, antes/depois).
