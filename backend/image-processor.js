const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

class ImageProcessor {
  constructor(options = {}) {
    this.options = {
      quality: options.quality || 80,
      maxWidth: options.maxWidth || 1920,
      maxHeight: options.maxHeight || 1080,
      format: options.format || 'jpeg', // jpeg, png, webp
      progressive: options.progressive !== false,
      stripMetadata: options.stripMetadata !== false,
      ...options
    };
    
    this.supportedFormats = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'tiff'];
  }

  // Processar uma imagem
  async processImage(inputPath, outputPath, options = {}) {
    try {
      const processOptions = { ...this.options, ...options };
      
      console.log(`🖼️ Processando imagem: ${path.basename(inputPath)}`);
      
      // Verificar se o arquivo existe
      if (!fs.existsSync(inputPath)) {
        throw new Error(`Arquivo não encontrado: ${inputPath}`);
      }

      // Obter informações da imagem original
      const originalStats = fs.statSync(inputPath);
      const originalSize = originalStats.size;
      
      // Processar a imagem
      let processedImage = sharp(inputPath);
      
      // Redimensionar se necessário
      if (processOptions.maxWidth || processOptions.maxHeight) {
        processedImage = processedImage.resize(
          processOptions.maxWidth || null,
          processOptions.maxHeight || null,
          {
            fit: 'inside',
            withoutEnlargement: true
          }
        );
      }
      
      // Aplicar otimizações baseadas no formato
      if (processOptions.format === 'jpeg' || processOptions.format === 'jpg') {
        processedImage = processedImage.jpeg({
          quality: processOptions.quality,
          progressive: processOptions.progressive,
          mozjpeg: true
        });
      } else if (processOptions.format === 'png') {
        processedImage = processedImage.png({
          quality: processOptions.quality,
          progressive: processOptions.progressive,
          compressionLevel: 9
        });
      } else if (processOptions.format === 'webp') {
        processedImage = processedImage.webp({
          quality: processOptions.quality,
          effort: 6
        });
      }
      
      // Remover metadados se configurado
      if (processOptions.stripMetadata) {
        processedImage = processedImage.withMetadata(false);
      }
      
      // Salvar imagem processada
      await processedImage.toFile(outputPath);
      
      // Obter estatísticas da imagem processada
      const processedStats = fs.statSync(outputPath);
      const processedSize = processedStats.size;
      
      // Calcular economia
      const savings = originalSize - processedSize;
      const savingsPercent = ((savings / originalSize) * 100).toFixed(2);
      
      console.log(`✅ Imagem processada com sucesso!`);
      console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
      console.log(`   Processada: ${(processedSize / 1024).toFixed(2)} KB`);
      console.log(`   Economia: ${(savings / 1024).toFixed(2)} KB (${savingsPercent}%)`);
      
      return {
        success: true,
        originalSize,
        processedSize,
        savings,
        savingsPercent,
        outputPath
      };
      
    } catch (error) {
      console.error(`❌ Erro ao processar imagem: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Processar múltiplas imagens
  async processMultipleImages(inputPaths, outputDir, options = {}) {
    const results = [];
    
    console.log(`🖼️ Processando ${inputPaths.length} imagens...`);
    
    for (const inputPath of inputPaths) {
      const filename = path.basename(inputPath, path.extname(inputPath));
      const outputPath = path.join(outputDir, `${filename}.${options.format || 'jpg'}`);
      
      const result = await this.processImage(inputPath, outputPath, options);
      results.push({
        inputPath,
        outputPath,
        ...result
      });
    }
    
    // Calcular estatísticas totais
    const totalOriginalSize = results.reduce((sum, r) => sum + (r.originalSize || 0), 0);
    const totalProcessedSize = results.reduce((sum, r) => sum + (r.processedSize || 0), 0);
    const totalSavings = totalOriginalSize - totalProcessedSize;
    const totalSavingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(2);
    
    console.log(`📊 Processamento em lote concluído!`);
    console.log(`   Total original: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Total processado: ${(totalProcessedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Economia total: ${(totalSavings / 1024 / 1024).toFixed(2)} MB (${totalSavingsPercent}%)`);
    
    return {
      results,
      summary: {
        totalImages: inputPaths.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        totalOriginalSize,
        totalProcessedSize,
        totalSavings,
        totalSavingsPercent
      }
    };
  }

  // Criar thumbnail
  async createThumbnail(inputPath, outputPath, options = {}) {
    const thumbnailOptions = {
      width: options.width || 300,
      height: options.height || 300,
      fit: options.fit || 'cover',
      quality: options.quality || 80,
      format: options.format || 'jpeg',
      ...options
    };
    
    try {
      console.log(`🖼️ Criando thumbnail: ${path.basename(inputPath)}`);
      
      let processedImage = sharp(inputPath)
        .resize(thumbnailOptions.width, thumbnailOptions.height, {
          fit: thumbnailOptions.fit,
          withoutEnlargement: true
        });
      
      // Aplicar formato
      if (thumbnailOptions.format === 'jpeg' || thumbnailOptions.format === 'jpg') {
        processedImage = processedImage.jpeg({
          quality: thumbnailOptions.quality,
          progressive: true
        });
      } else if (thumbnailOptions.format === 'png') {
        processedImage = processedImage.png({
          quality: thumbnailOptions.quality,
          progressive: true
        });
      } else if (thumbnailOptions.format === 'webp') {
        processedImage = processedImage.webp({
          quality: thumbnailOptions.quality
        });
      }
      
      await processedImage.toFile(outputPath);
      
      console.log(`✅ Thumbnail criado: ${outputPath}`);
      return { success: true, outputPath };
      
    } catch (error) {
      console.error(`❌ Erro ao criar thumbnail: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Criar múltiplos thumbnails
  async createMultipleThumbnails(inputPaths, outputDir, options = {}) {
    const results = [];
    
    for (const inputPath of inputPaths) {
      const filename = path.basename(inputPath, path.extname(inputPath));
      const outputPath = path.join(outputDir, `${filename}_thumb.${options.format || 'jpg'}`);
      
      const result = await this.createThumbnail(inputPath, outputPath, options);
      results.push({
        inputPath,
        outputPath,
        ...result
      });
    }
    
    return results;
  }

  // Otimizar imagem existente (in-place)
  async optimizeImage(imagePath, options = {}) {
    try {
      const tempPath = imagePath + '.tmp';
      const result = await this.processImage(imagePath, tempPath, options);
      
      if (result.success) {
        // Substituir arquivo original
        fs.unlinkSync(imagePath);
        fs.renameSync(tempPath, imagePath);
        
        console.log(`✅ Imagem otimizada: ${imagePath}`);
        return result;
      } else {
        // Remover arquivo temporário se falhou
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        return result;
      }
      
    } catch (error) {
      console.error(`❌ Erro ao otimizar imagem: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Verificar se o formato é suportado
  isSupportedFormat(filename) {
    const ext = path.extname(filename).toLowerCase().substring(1);
    return this.supportedFormats.includes(ext);
  }

  // Obter informações da imagem
  async getImageInfo(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      const stats = fs.statSync(imagePath);
      
      return {
        success: true,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: stats.size,
        sizeKB: (stats.size / 1024).toFixed(2),
        hasAlpha: metadata.hasAlpha,
        isOpaque: metadata.isOpaque,
        space: metadata.space,
        channels: metadata.channels,
        depth: metadata.depth,
        density: metadata.density,
        orientation: metadata.orientation
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Converter formato
  async convertFormat(inputPath, outputPath, targetFormat, options = {}) {
    try {
      console.log(`🔄 Convertendo formato: ${path.basename(inputPath)} → ${targetFormat}`);
      
      let processedImage = sharp(inputPath);
      
      // Aplicar formato de destino
      if (targetFormat === 'jpeg' || targetFormat === 'jpg') {
        processedImage = processedImage.jpeg({
          quality: options.quality || this.options.quality,
          progressive: options.progressive !== false
        });
      } else if (targetFormat === 'png') {
        processedImage = processedImage.png({
          quality: options.quality || this.options.quality,
          progressive: options.progressive !== false
        });
      } else if (targetFormat === 'webp') {
        processedImage = processedImage.webp({
          quality: options.quality || this.options.quality
        });
      }
      
      await processedImage.toFile(outputPath);
      
      console.log(`✅ Formato convertido: ${outputPath}`);
      return { success: true, outputPath };
      
    } catch (error) {
      console.error(`❌ Erro ao converter formato: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Aplicar filtros e efeitos
  async applyFilters(inputPath, outputPath, filters = {}) {
    try {
      console.log(`🎨 Aplicando filtros: ${path.basename(inputPath)}`);
      
      let processedImage = sharp(inputPath);
      
      // Aplicar filtros disponíveis
      if (filters.blur) {
        processedImage = processedImage.blur(filters.blur);
      }
      
      if (filters.sharpen) {
        processedImage = processedImage.sharpen(filters.sharpen);
      }
      
      if (filters.gamma) {
        processedImage = processedImage.gamma(filters.gamma);
      }
      
      if (filters.brightness) {
        processedImage = processedImage.modulate({
          brightness: filters.brightness
        });
      }
      
      if (filters.contrast) {
        processedImage = processedImage.modulate({
          contrast: filters.contrast
        });
      }
      
      if (filters.saturation) {
        processedImage = processedImage.modulate({
          saturation: filters.saturation
        });
      }
      
      if (filters.hue) {
        processedImage = processedImage.modulate({
          hue: filters.hue
        });
      }
      
      // Aplicar formato
      if (filters.format) {
        if (filters.format === 'jpeg' || filters.format === 'jpg') {
          processedImage = processedImage.jpeg({
            quality: filters.quality || this.options.quality
          });
        } else if (filters.format === 'png') {
          processedImage = processedImage.png({
            quality: filters.quality || this.options.quality
          });
        } else if (filters.format === 'webp') {
          processedImage = processedImage.webp({
            quality: filters.quality || this.options.quality
          });
        }
      }
      
      await processedImage.toFile(outputPath);
      
      console.log(`✅ Filtros aplicados: ${outputPath}`);
      return { success: true, outputPath };
      
    } catch (error) {
      console.error(`❌ Erro ao aplicar filtros: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

// Exportar a classe
module.exports = ImageProcessor;

// Se executado diretamente, executar testes
if (require.main === module) {
  console.log('🧪 Executando testes do ImageProcessor...');
  
  const processor = new ImageProcessor({
    quality: 80,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'jpeg',
    progressive: true,
    stripMetadata: true
  });
  
  console.log('✅ ImageProcessor configurado com sucesso!');
  console.log('📋 Opções:', processor.options);
  console.log('🖼️ Formatos suportados:', processor.supportedFormats);
}