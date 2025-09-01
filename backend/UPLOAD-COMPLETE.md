# 🖼️ Sistema de Upload Completo - ConnectFé

## ✅ **Implementação Concluída em Todas as Rotas**

O sistema de upload foi implementado em todos os locais que fazem upload de arquivos ou fotos, seguindo a nova rota `/uploads`.

## 🚀 **Rotas de Upload Disponíveis**

### **1. Upload Genérico**
- **POST** `/api/upload`
- **Campo:** `image` (arquivo único)
- **Uso:** Upload de imagem genérica
- **Limite:** 5MB

### **2. Upload de Imagem de Perfil**
- **POST** `/api/upload/profile`
- **Campo:** `profileImage` (arquivo único)
- **Uso:** Atualizar foto de perfil do usuário
- **Limite:** 5MB

### **3. Upload de Imagens de Posts**
- **POST** `/api/upload/post`
- **Campo:** `images` (múltiplos arquivos)
- **Uso:** Adicionar imagens a posts
- **Limite:** 10 arquivos, 5MB cada

### **4. Upload de Imagens de Eventos**
- **POST** `/api/upload/event`
- **Campo:** `images` (múltiplos arquivos)
- **Uso:** Adicionar imagens a eventos
- **Limite:** 10 arquivos, 5MB cada

### **5. Upload de Imagens de Doações**
- **POST** `/api/upload/donation`
- **Campo:** `images` (múltiplos arquivos)
- **Uso:** Adicionar imagens a campanhas de doação
- **Limite:** 10 arquivos, 5MB cada

### **6. Upload de Imagem de Prêmio de Rifa**
- **POST** `/api/upload/raffle-prize`
- **Campo:** `prizeImage` (arquivo único)
- **Uso:** Adicionar imagem do prêmio da rifa
- **Limite:** 5MB

## 🔧 **Como Usar em Cada Contexto**

### **Posts com Imagens**
```javascript
// 1. Primeiro, fazer upload das imagens
const formData = new FormData();
formData.append('images', file1);
formData.append('images', file2);

const uploadResponse = await fetch('/api/upload/post', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

const { files } = await uploadResponse.json();

// 2. Depois, criar o post com as URLs das imagens
const postData = {
  title: 'Meu post com imagens',
  content: 'Conteúdo do post',
  type: 'image',
  images: files.map(f => f.url)
};

const postResponse = await fetch('/api/posts', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(postData)
});
```

### **Eventos com Imagens**
```javascript
// 1. Upload das imagens
const formData = new FormData();
formData.append('images', eventImage1);
formData.append('images', eventImage2);

const uploadResponse = await fetch('/api/upload/event', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

const { files } = await uploadResponse.json();

// 2. Criar evento com as imagens
const eventData = {
  title: 'Meu evento',
  date: '2024-01-20',
  time: '19:00',
  images: files.map(f => f.url)
};

const eventResponse = await fetch('/api/events', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(eventData)
});
```

### **Campanhas de Doação com Imagens**
```javascript
// 1. Upload das imagens
const formData = new FormData();
formData.append('images', campaignImage);

const uploadResponse = await fetch('/api/upload/donation', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

const { files } = await uploadResponse.json();

// 2. Criar campanha com as imagens
const campaignData = {
  title: 'Campanha de doação',
  description: 'Ajude nossa causa',
  goal: 10000,
  images: files.map(f => f.url)
};

const campaignResponse = await fetch('/api/donations/campaigns', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(campaignData)
});
```

### **Rifas com Imagem do Prêmio**
```javascript
// 1. Upload da imagem do prêmio
const formData = new FormData();
formData.append('prizeImage', prizeImage);

const uploadResponse = await fetch('/api/upload/raffle-prize', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

const { file } = await uploadResponse.json();

// 2. Criar rifa com a imagem
const raffleData = {
  title: 'Rifa do carro',
  prize: 'Carro 0km',
  prizeImage: file.url,
  ticketPrice: 10,
  totalTickets: 1000
};

const raffleResponse = await fetch('/api/raffles', {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(raffleData)
});
```

### **Atualizar Imagem de Perfil**
```javascript
// 1. Upload da nova imagem
const formData = new FormData();
formData.append('profileImage', newProfileImage);

const uploadResponse = await fetch('/api/upload/profile', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

const { file } = await uploadResponse.json();

// 2. Atualizar perfil com a nova imagem
const profileData = {
  profileImage: file.url
};

const profileResponse = await fetch('/api/auth/profile', {
  method: 'PUT',
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(profileData)
});
```

## 📁 **Estrutura de Arquivos**

```
backend/uploads/
├── 2024/
│   ├── 01/
│   │   ├── 15/
│   │   │   ├── img-1705276800000-123456789.jpg (perfil)
│   │   │   ├── img-1705276800001-987654321.png (post)
│   │   │   └── img-1705276800002-555666777.gif (evento)
│   │   └── 16/
│   │       ├── img-1705363200000-111222333.jpg (doação)
│   │       └── img-1705363200001-444555666.png (rifa)
│   └── 02/
└── 2025/
```

## 🔒 **Validações de Segurança**

### **Validação de URLs**
- Todas as imagens devem começar com `/uploads/`
- URLs externas não são permitidas
- Validação automática em todas as rotas

### **Validação de Arquivos**
- Apenas imagens (JPG, PNG, GIF, WebP)
- Tamanho máximo: 5MB por arquivo
- Máximo de 10 arquivos por upload múltiplo

### **Autenticação**
- Todas as rotas de upload requerem JWT
- Usuários só podem fazer upload para suas próprias entidades

## 📱 **Respostas da API**

### **Upload Único**
```json
{
  "success": true,
  "message": "Arquivo enviado com sucesso",
  "file": {
    "originalName": "minha-foto.jpg",
    "filename": "img-1705276800000-123456789.jpg",
    "size": 1024000,
    "mimetype": "image/jpeg",
    "url": "http://localhost:3001/uploads/img-1705276800000-123456789.jpg",
    "path": "/path/to/uploads/2024/01/15/img-1705276800000-123456789.jpg"
  }
}
```

### **Upload Múltiplo**
```json
{
  "success": true,
  "message": "3 arquivo(s) enviado(s) com sucesso",
  "files": [
    {
      "originalName": "imagem1.jpg",
      "filename": "img-1705276800000-111111111.jpg",
      "url": "http://localhost:3001/uploads/img-1705276800000-111111111.jpg"
    },
    {
      "originalName": "imagem2.png",
      "filename": "img-1705276800001-222222222.png",
      "url": "http://localhost:3001/uploads/img-1705276800001-222222222.png"
    }
  ]
}
```

## 🚀 **Fluxo de Upload Recomendado**

1. **Frontend faz upload** via rota específica (`/api/upload/post`, `/api/upload/event`, etc.)
2. **Backend retorna URLs** das imagens salvas
3. **Frontend usa URLs** para criar/atualizar entidades (posts, eventos, etc.)
4. **Backend valida URLs** antes de salvar no banco
5. **Imagens ficam disponíveis** via `/uploads/nome-do-arquivo`

## 🔧 **Manutenção e Limpeza**

### **Limpeza Automática (Futuro)**
```javascript
// Implementar cron job para limpar arquivos antigos
const cron = require('node-cron');

// Limpar arquivos com mais de 30 dias
cron.schedule('0 2 * * *', () => {
  // Lógica de limpeza
});
```

### **Backup**
```bash
# Backup diário da pasta uploads
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/
```

## 🌟 **Vantagens da Implementação**

1. **Centralizado** - Todas as rotas de upload em um lugar
2. **Consistente** - Mesma validação e estrutura em todo o sistema
3. **Seguro** - Validações automáticas de URLs e tipos
4. **Organizado** - Arquivos organizados por data automaticamente
5. **Escalável** - Fácil migração para S3/Cloudinary no futuro
6. **Manutenível** - Código limpo e bem estruturado

## 📋 **Checklist de Implementação**

- ✅ Rota genérica de upload
- ✅ Upload de imagem de perfil
- ✅ Upload de imagens de posts
- ✅ Upload de imagens de eventos
- ✅ Upload de imagens de doações
- ✅ Upload de imagem de prêmio de rifa
- ✅ Validação de URLs em todas as rotas
- ✅ Integração com sistema de autenticação
- ✅ Organização automática por data
- ✅ Tratamento de erros robusto
- ✅ Documentação completa

## 🎯 **Próximos Passos**

- [ ] Implementar limpeza automática de arquivos
- [ ] Adicionar compressão de imagens
- [ ] Implementar sistema de thumbnails
- [ ] Adicionar metadados EXIF
- [ ] Implementar CDN para produção
- [ ] Adicionar rate limiting por usuário

---

**🎉 Sistema de upload implementado com sucesso em todas as rotas necessárias!**