const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { scope, category } = req.query;
    const query = {};
    if (category) query.category = category;
    // scope church/user poderia filtrar por author userType quando disponível
    const posts = await Post.find(query).sort({ createdAt: -1 }).limit(100);
    res.json(posts);
  } catch (error) {
    console.error('Erro ao listar posts:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    // Se o post contém imagens, elas devem ser enviadas via /api/upload/post primeiro
    // e as URLs das imagens devem ser incluídas em req.body.images
    const postData = {
      ...req.body,
      author: req.user.userId
    };

    // Validar se as imagens são URLs válidas (devem começar com /uploads/)
    if (req.body.images && Array.isArray(req.body.images)) {
      const validImages = req.body.images.filter(img => 
        typeof img === 'string' && img.startsWith('/uploads/')
      );
      postData.images = validImages;
    }

    const post = await Post.create(postData);
    
    // Push para seguidores em anúncios da igreja
    if (req.body.type === 'announcement') {
      try {
        const churchUser = await User.findById(req.user.userId).select('followers userType');
        if (churchUser && churchUser.userType === 'church') {
          const followers = await User.find({ _id: { $in: churchUser.followers }, expoPushToken: { $ne: null } }).select('expoPushToken');
          const tokens = followers.map(f => f.expoPushToken);
          if (tokens.length > 0) {
            const { Expo } = require('expo-server-sdk');
            const expo = new Expo();
            const messages = tokens.filter(t => Expo.isExpoPushToken(t)).map(t => ({
              to: t,
              sound: 'default',
              title: 'Novo aviso da paróquia',
              body: req.body.title || 'Veja as novidades',
              data: { type: 'announcement' }
            }));
            const chunks = expo.chunkPushNotifications(messages);
            for (const chunk of chunks) { await expo.sendPushNotificationsAsync(chunk); }
          }
        }
      } catch (e) { console.warn('Push seguidores (announcement) falhou:', e.message); }
    }
    res.status(201).json(post);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para atualizar post com imagens
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    
    // Verificar se o usuário é o autor do post
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Não autorizado' });
    }
    
    const updateData = { ...req.body };
    
    // Validar imagens se fornecidas
    if (req.body.images && Array.isArray(req.body.images)) {
      const validImages = req.body.images.filter(img => 
        typeof img === 'string' && img.startsWith('/uploads/')
      );
      updateData.images = validImages;
    }
    
    const updatedPost = await Post.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    res.json(updatedPost);
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para deletar post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    
    // Verificar se o usuário é o autor do post
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Não autorizado' });
    }
    
    await Post.findByIdAndDelete(id);
    
    res.json({ message: 'Post deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

