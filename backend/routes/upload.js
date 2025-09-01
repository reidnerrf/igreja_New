const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configurar storage do multer para salvar arquivos localmente
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Criar pasta com data atual (YYYY/MM/DD)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const uploadPath = path.join(__dirname, '../uploads', String(year), month, day);
    
    // Criar diretórios se não existirem
    fs.mkdirSync(uploadPath, { recursive: true });
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `img-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

// Filtro para validar tipos de arquivo
const fileFilter = (req, file, cb) => {
  // Permitir apenas imagens
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
  }
};

// Configurar multer com limites e validações
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
    files: 1 // Apenas 1 arquivo por vez
  }
});

// Configurar multer para múltiplos arquivos
const uploadMultiple = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
    files: 10 // Máximo 10 arquivos
  }
});

// Rota para upload de imagem genérica
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    // Construir URL para acessar o arquivo
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    // Retornar informações do arquivo
    res.json({
      success: true,
      message: 'Arquivo enviado com sucesso',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl,
        path: req.file.path
      }
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Rota para upload de imagem de perfil
router.post('/profile', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    // Construir URL para acessar o arquivo
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    // Retornar informações do arquivo
    res.json({
      success: true,
      message: 'Imagem de perfil enviada com sucesso',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl,
        path: req.file.path
      }
    });

  } catch (error) {
    console.error('Erro no upload de perfil:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Rota para upload de imagens de posts
router.post('/post', authenticateToken, uploadMultiple.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const uploadedFiles = req.files.map(file => {
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      return {
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        url: fileUrl,
        path: file.path
      };
    });

    res.json({
      success: true,
      message: `${uploadedFiles.length} arquivo(s) enviado(s) com sucesso`,
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Erro no upload de post:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Rota para upload de imagens de eventos
router.post('/event', authenticateToken, uploadMultiple.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const uploadedFiles = req.files.map(file => {
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      return {
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        url: fileUrl,
        path: file.path
      };
    });

    res.json({
      success: true,
      message: `${uploadedFiles.length} arquivo(s) de evento enviado(s) com sucesso`,
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Erro no upload de evento:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Rota para upload de imagens de doações
router.post('/donation', authenticateToken, uploadMultiple.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const uploadedFiles = req.files.map(file => {
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      return {
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        url: fileUrl,
        path: file.path
      };
    });

    res.json({
      success: true,
      message: `${uploadedFiles.length} arquivo(s) de doação enviado(s) com sucesso`,
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Erro no upload de doação:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Rota para upload de imagem de prêmio de rifa
router.post('/raffle-prize', authenticateToken, upload.single('prizeImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    // Construir URL para acessar o arquivo
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    // Retornar informações do arquivo
    res.json({
      success: true,
      message: 'Imagem do prêmio enviada com sucesso',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: fileUrl,
        path: req.file.path
      }
    });

  } catch (error) {
    console.error('Erro no upload de prêmio:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Rota para listar arquivos do usuário (opcional)
router.get('/my-files', authenticateToken, async (req, res) => {
  try {
    // Aqui você pode implementar lógica para listar arquivos do usuário
    // Por enquanto, retornamos uma mensagem
    res.json({
      message: 'Lista de arquivos do usuário',
      files: []
    });
  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para deletar arquivo (opcional)
router.delete('/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Aqui você pode implementar lógica para verificar se o usuário tem permissão
    // para deletar o arquivo
    
    // Procurar o arquivo em todas as subpastas
    const uploadsDir = path.join(__dirname, '../uploads');
    let filePath = null;
    
    // Função recursiva para encontrar o arquivo
    const findFile = (dir) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          findFile(fullPath);
        } else if (item === filename) {
          filePath = fullPath;
          return;
        }
      }
    };
    
    findFile(uploadsDir);
    
    if (!filePath) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }
    
    // Deletar o arquivo
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      message: 'Arquivo deletado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Middleware para tratamento de erros do multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Arquivo muito grande. Máximo 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Muitos arquivos. Máximo 10 arquivos.' });
    }
    return res.status(400).json({ error: 'Erro no upload do arquivo' });
  }
  
  if (error.message.includes('Apenas arquivos de imagem')) {
    return res.status(400).json({ error: error.message });
  }
  
  next(error);
});

module.exports = router;

