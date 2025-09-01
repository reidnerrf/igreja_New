const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const ImageProcessor = require('./image-processor');
const CleanupService = require('./cleanup-service');

const app = express();
const PORT = 3003;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use('/uploads', express.static('uploads'));
app.use('/thumbnails', express.static('thumbnails'));

// Configurar processador de imagens
const imageProcessor = new ImageProcessor({
  quality: 80,
  maxWidth: 1920,
  maxHeight: 1080,
  format: 'jpeg',
  progressive: true,
  stripMetadata: true
});

// Configurar serviço de limpeza
const cleanupService = new CleanupService('uploads', 30);

// Configurar storage do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const uploadPath = path.join(__dirname, 'uploads', String(year), month, day);
    const thumbnailPath = path.join(__dirname, 'thumbnails', String(year), month, day);
    
    // Criar diretórios
    fs.mkdirSync(uploadPath, { recursive: true });
    fs.mkdirSync(thumbnailPath, { recursive: true });
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `img-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
    files: 1
  }
});

const uploadMultiple = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
    files: 10
  }
});

// Simular autenticação para teste
const mockAuth = (req, res, next) => {
  req.user = { userId: 'test-user-123' };
  next();
};

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Servidor de upload com processamento funcionando!',
    features: ['Upload', 'Compressão', 'Thumbnails', 'Limpeza automática']
  });
});

// Rota para upload com processamento
app.post('/api/upload/processed', mockAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const originalPath = req.file.path;
    const originalSize = req.file.size;
    
    // Processar imagem (comprimir e otimizar)
    const processedPath = originalPath.replace(path.extname(originalPath), '_processed.jpg');
    const processResult = await imageProcessor.processImage(originalPath, processedPath, {
      quality: 80,
      format: 'jpeg',
      maxWidth: 1920,
      maxHeight: 1080
    });

    if (!processResult.success) {
      return res.status(500).json({ error: 'Erro ao processar imagem' });
    }

    // Criar thumbnail
    const thumbnailPath = originalPath.replace('uploads', 'thumbnails').replace(path.extname(originalPath), '_thumb.jpg');
    const thumbnailResult = await imageProcessor.createThumbnail(processedPath, thumbnailPath, {
      width: 300,
      height: 300,
      fit: 'cover',
      quality: 80,
      format: 'jpeg'
    });

    if (!thumbnailResult.success) {
      console.warn('⚠️ Erro ao criar thumbnail, continuando...');
    }

    // Construir URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const originalUrl = `${baseUrl}/uploads/${path.basename(originalPath)}`;
    const processedUrl = `${baseUrl}/uploads/${path.basename(processedPath)}`;
    const thumbnailUrl = thumbnailResult.success ? `${baseUrl}/thumbnails/${path.basename(thumbnailPath)}` : null;

    // Remover arquivo original se processamento foi bem-sucedido
    if (processResult.success && processResult.savings > 0) {
      try {
        fs.unlinkSync(originalPath);
        console.log(`🗑️ Arquivo original removido: ${originalPath}`);
      } catch (error) {
        console.warn(`⚠️ Não foi possível remover arquivo original: ${error.message}`);
      }
    }

    res.json({
      success: true,
      message: 'Imagem processada e enviada com sucesso',
      file: {
        originalName: req.file.originalname,
        originalSize,
        processedSize: processResult.processedSize,
        savings: processResult.savings,
        savingsPercent: processResult.savingsPercent,
        urls: {
          original: originalUrl,
          processed: processedUrl,
          thumbnail: thumbnailUrl
        },
        paths: {
          original: originalPath,
          processed: processedPath,
          thumbnail: thumbnailPath
        }
      }
    });

  } catch (error) {
    console.error('Erro no upload processado:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Rota para upload múltiplo com processamento
app.post('/api/upload/processed-multiple', mockAuth, uploadMultiple.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const results = [];
    let totalOriginalSize = 0;
    let totalProcessedSize = 0;
    let totalSavings = 0;

    for (const file of req.files) {
      const originalPath = file.path;
      const originalSize = file.size;
      totalOriginalSize += originalSize;

      // Processar imagem
      const processedPath = originalPath.replace(path.extname(originalPath), '_processed.jpg');
      const processResult = await imageProcessor.processImage(originalPath, processedPath, {
        quality: 80,
        format: 'jpeg',
        maxWidth: 1920,
        maxHeight: 1080
      });

      if (processResult.success) {
        // Criar thumbnail
        const thumbnailPath = originalPath.replace('uploads', 'thumbnails').replace(path.extname(originalPath), '_thumb.jpg');
        const thumbnailResult = await imageProcessor.createThumbnail(processedPath, thumbnailPath, {
          width: 300,
          height: 300,
          fit: 'cover',
          quality: 80,
          format: 'jpeg'
        });

        // Construir URLs
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const processedUrl = `${baseUrl}/uploads/${path.basename(processedPath)}`;
        const thumbnailUrl = thumbnailResult.success ? `${baseUrl}/thumbnails/${path.basename(thumbnailPath)}` : null;

        // Remover arquivo original se processamento foi bem-sucedido
        if (processResult.savings > 0) {
          try {
            fs.unlinkSync(originalPath);
          } catch (error) {
            console.warn(`⚠️ Não foi possível remover arquivo original: ${error.message}`);
          }
        }

        results.push({
          originalName: file.originalname,
          originalSize,
          processedSize: processResult.processedSize,
          savings: processResult.savings,
          savingsPercent: processResult.savingsPercent,
          urls: {
            processed: processedUrl,
            thumbnail: thumbnailUrl
          }
        });

        totalProcessedSize += processResult.processedSize;
        totalSavings += processResult.savings;
      } else {
        results.push({
          originalName: file.originalname,
          error: processResult.error
        });
      }
    }

    const totalSavingsPercent = totalOriginalSize > 0 ? ((totalSavings / totalOriginalSize) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      message: `${results.length} arquivo(s) processado(s)`,
      results,
      summary: {
        totalFiles: req.files.length,
        successful: results.filter(r => !r.error).length,
        failed: results.filter(r => r.error).length,
        totalOriginalSize,
        totalProcessedSize,
        totalSavings,
        totalSavingsPercent: totalSavingsPercent + '%'
      }
    });

  } catch (error) {
    console.error('Erro no upload múltiplo processado:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Rota para obter estatísticas de limpeza
app.get('/api/cleanup/stats', mockAuth, async (req, res) => {
  try {
    const stats = cleanupService.getStats();
    const diskInfo = await cleanupService.checkDiskSpace();
    
    res.json({
      success: true,
      cleanup: stats,
      disk: diskInfo
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para executar limpeza manual
app.post('/api/cleanup/run', mockAuth, async (req, res) => {
  try {
    const { aggressive } = req.body;
    
    if (cleanupService.isRunning) {
      return res.status(400).json({ error: 'Limpeza já está em execução' });
    }

    // Executar limpeza em background
    cleanupService.cleanup(aggressive === true);
    
    res.json({
      success: true,
      message: 'Limpeza iniciada com sucesso',
      aggressive: aggressive === true
    });
  } catch (error) {
    console.error('Erro ao executar limpeza:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para listar arquivos antigos
app.get('/api/cleanup/old-files', mockAuth, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const oldFiles = await cleanupService.listOldFiles(parseInt(limit));
    
    res.json({
      success: true,
      oldFiles,
      count: oldFiles.length
    });
  } catch (error) {
    console.error('Erro ao listar arquivos antigos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para obter informações de uma imagem
app.get('/api/image/info/:filename', mockAuth, async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Procurar arquivo em uploads
    const uploadsDir = path.join(__dirname, 'uploads');
    let imagePath = null;
    
    const findFile = (dir) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          findFile(fullPath);
        } else if (item === filename) {
          imagePath = fullPath;
          return;
        }
      }
    };
    
    findFile(uploadsDir);
    
    if (!imagePath) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }

    const imageInfo = await imageProcessor.getImageInfo(imagePath);
    
    if (!imageInfo.success) {
      return res.status(500).json({ error: 'Erro ao obter informações da imagem' });
    }

    res.json({
      success: true,
      imageInfo
    });
  } catch (error) {
    console.error('Erro ao obter informações da imagem:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Middleware para tratamento de erros
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Arquivo muito grande. Máximo 10MB.' });
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

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Algo deu errado!',
    message: err.message 
  });
});

// Iniciar serviço de limpeza
cleanupService.start();

app.listen(PORT, () => {
  console.log(`🚀 Servidor de upload com processamento rodando na porta ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📤 Upload processado: http://localhost:${PORT}/api/upload/processed`);
  console.log(`📤 Upload múltiplo processado: http://localhost:${PORT}/api/upload/processed-multiple`);
  console.log(`🧹 Estatísticas de limpeza: http://localhost:${PORT}/api/cleanup/stats`);
  console.log(`📁 Arquivos: http://localhost:${PORT}/uploads/`);
  console.log(`🖼️ Thumbnails: http://localhost:${PORT}/thumbnails/`);
});