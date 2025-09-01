const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

class CleanupService {
  constructor(uploadsDir = 'uploads', maxAgeDays = 30) {
    this.uploadsDir = uploadsDir;
    this.maxAgeDays = maxAgeDays;
    this.isRunning = false;
    this.stats = {
      totalFiles: 0,
      deletedFiles: 0,
      freedSpace: 0,
      lastRun: null,
      errors: []
    };
  }

  // Iniciar o serviço de limpeza
  start() {
    console.log('🧹 Iniciando serviço de limpeza automática...');
    
    // Executar limpeza diariamente às 2:00 AM
    cron.schedule('0 2 * * *', () => {
      console.log('🕐 Executando limpeza automática...');
      this.cleanup();
    }, {
      scheduled: true,
      timezone: 'America/Sao_Paulo'
    });

    // Executar limpeza semanal aos domingos às 3:00 AM
    cron.schedule('0 3 * * 0', () => {
      console.log('📅 Executando limpeza semanal...');
      this.cleanup(true); // Limpeza mais agressiva
    }, {
      scheduled: true,
      timezone: 'America/Sao_Paulo'
    });

    console.log('✅ Serviço de limpeza iniciado com sucesso!');
    console.log(`   - Limpeza diária: 2:00 AM`);
    console.log(`   - Limpeza semanal: Domingo 3:00 AM`);
    console.log(`   - Diretório: ${this.uploadsDir}`);
    console.log(`   - Idade máxima: ${this.maxAgeDays} dias`);
  }

  // Executar limpeza manual
  async cleanup(aggressive = false) {
    if (this.isRunning) {
      console.log('⚠️ Limpeza já está em execução...');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();
    
    try {
      console.log('🧹 Iniciando processo de limpeza...');
      
      // Verificar se o diretório existe
      if (!fs.existsSync(this.uploadsDir)) {
        console.log('ℹ️ Diretório de uploads não encontrado, criando...');
        fs.mkdirSync(this.uploadsDir, { recursive: true });
        return;
      }

      // Calcular data limite
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.maxAgeDays);
      
      if (aggressive) {
        cutoffDate.setDate(cutoffDate.getDate() - 7); // Mais agressivo: 7 dias extras
      }

      console.log(`📅 Removendo arquivos mais antigos que: ${cutoffDate.toLocaleDateString()}`);

      // Executar limpeza
      await this.cleanupDirectory(this.uploadsDir, cutoffDate);
      
      // Atualizar estatísticas
      this.stats.lastRun = new Date();
      
      const duration = Date.now() - startTime;
      console.log(`✅ Limpeza concluída em ${duration}ms`);
      console.log(`📊 Estatísticas:`);
      console.log(`   - Arquivos processados: ${this.stats.totalFiles}`);
      console.log(`   - Arquivos removidos: ${this.stats.deletedFiles}`);
      console.log(`   - Espaço liberado: ${(this.stats.freedSpace / 1024 / 1024).toFixed(2)} MB`);
      
      if (this.stats.errors.length > 0) {
        console.log(`   - Erros: ${this.stats.errors.length}`);
        this.stats.errors.forEach(error => console.log(`     - ${error}`));
      }

    } catch (error) {
      console.error('❌ Erro durante a limpeza:', error);
      this.stats.errors.push(error.message);
    } finally {
      this.isRunning = false;
    }
  }

  // Limpar diretório recursivamente
  async cleanupDirectory(dirPath, cutoffDate) {
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Processar subdiretório
          await this.cleanupDirectory(fullPath, cutoffDate);
          
          // Verificar se o diretório está vazio após limpeza
          const remainingItems = fs.readdirSync(fullPath);
          if (remainingItems.length === 0) {
            try {
              fs.rmdirSync(fullPath);
              console.log(`🗑️ Diretório vazio removido: ${fullPath}`);
            } catch (error) {
              console.warn(`⚠️ Não foi possível remover diretório: ${fullPath}`, error.message);
            }
          }
        } else if (stat.isFile()) {
          // Verificar se o arquivo é muito antigo
          const fileAge = new Date(stat.mtime);
          
          if (fileAge < cutoffDate) {
            try {
              const fileSize = stat.size;
              fs.unlinkSync(fullPath);
              
              this.stats.totalFiles++;
              this.stats.deletedFiles++;
              this.stats.freedSpace += fileSize;
              
              console.log(`🗑️ Arquivo removido: ${fullPath} (${(fileSize / 1024).toFixed(2)} KB)`);
            } catch (error) {
              console.warn(`⚠️ Não foi possível remover arquivo: ${fullPath}`, error.message);
              this.stats.errors.push(`Erro ao remover ${fullPath}: ${error.message}`);
            }
          } else {
            this.stats.totalFiles++;
          }
        }
      }
    } catch (error) {
      console.error(`❌ Erro ao processar diretório ${dirPath}:`, error);
      this.stats.errors.push(`Erro ao processar ${dirPath}: ${error.message}`);
    }
  }

  // Obter estatísticas
  getStats() {
    return {
      ...this.stats,
      isRunning: this.isRunning,
      uploadsDir: this.uploadsDir,
      maxAgeDays: this.maxAgeDays
    };
  }

  // Limpar estatísticas
  resetStats() {
    this.stats = {
      totalFiles: 0,
      deletedFiles: 0,
      freedSpace: 0,
      lastRun: null,
      errors: []
    };
  }

  // Parar o serviço
  stop() {
    console.log('🛑 Parando serviço de limpeza...');
    // O cron não tem método stop, mas podemos marcar como parado
    this.isRunning = false;
    console.log('✅ Serviço de limpeza parado');
  }

  // Verificar espaço em disco
  async checkDiskSpace() {
    try {
      const stats = fs.statSync(this.uploadsDir);
      const totalSize = this.calculateDirectorySize(this.uploadsDir);
      
      return {
        totalSize,
        totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
        totalSizeGB: (totalSize / 1024 / 1024 / 1024).toFixed(2),
        lastModified: stats.mtime
      };
    } catch (error) {
      console.error('❌ Erro ao verificar espaço em disco:', error);
      return null;
    }
  }

  // Calcular tamanho do diretório
  calculateDirectorySize(dirPath) {
    let totalSize = 0;
    
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          totalSize += this.calculateDirectorySize(fullPath);
        } else {
          totalSize += stat.size;
        }
      }
    } catch (error) {
      console.warn(`⚠️ Erro ao calcular tamanho de ${dirPath}:`, error.message);
    }
    
    return totalSize;
  }

  // Listar arquivos antigos (para preview)
  async listOldFiles(limit = 50) {
    const oldFiles = [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.maxAgeDays);
    
    try {
      await this.scanForOldFiles(this.uploadsDir, cutoffDate, oldFiles, limit);
    } catch (error) {
      console.error('❌ Erro ao listar arquivos antigos:', error);
    }
    
    return oldFiles.sort((a, b) => a.mtime - b.mtime);
  }

  // Escanear arquivos antigos
  async scanForOldFiles(dirPath, cutoffDate, oldFiles, limit) {
    if (oldFiles.length >= limit) return;
    
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        if (oldFiles.length >= limit) break;
        
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          await this.scanForOldFiles(fullPath, cutoffDate, oldFiles, limit);
        } else if (stat.isFile() && stat.mtime < cutoffDate) {
          oldFiles.push({
            path: fullPath,
            name: item,
            size: stat.size,
            sizeKB: (stat.size / 1024).toFixed(2),
            mtime: stat.mtime,
            age: Math.floor((Date.now() - stat.mtime.getTime()) / (1000 * 60 * 60 * 24))
          });
        }
      }
    } catch (error) {
      console.warn(`⚠️ Erro ao escanear ${dirPath}:`, error.message);
    }
  }
}

// Exportar a classe
module.exports = CleanupService;

// Se executado diretamente, criar instância e iniciar
if (require.main === module) {
  const cleanupService = new CleanupService();
  
  // Iniciar o serviço
  cleanupService.start();
  
  // Executar limpeza manual após 5 segundos
  setTimeout(() => {
    console.log('🚀 Executando limpeza manual...');
    cleanupService.cleanup();
  }, 5000);
  
  // Verificar espaço em disco a cada 10 minutos
  setInterval(async () => {
    const diskInfo = await cleanupService.checkDiskSpace();
    if (diskInfo) {
      console.log(`💾 Espaço em disco: ${diskInfo.totalSizeGB} GB`);
    }
  }, 10 * 60 * 1000);
  
  // Manter o processo rodando
  process.on('SIGINT', () => {
    console.log('\n🛑 Recebido SIGINT, parando serviço...');
    cleanupService.stop();
    process.exit(0);
  });
}