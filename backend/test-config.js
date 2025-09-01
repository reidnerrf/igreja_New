/**
 * Teste do Sistema de Configuração
 * ConnectFé - Verificação de Configurações
 */

const path = require('path');
const fs = require('fs');

// Carrega as configurações
console.log('🔧 Carregando sistema de configuração...\n');

try {
    const config = require('./config');
    const socialConfig = require('./config/social-apis');
    const mlConfig = require('./config/ml-analytics');
    const chatConfig = require('./config/live-chat');

    console.log('✅ Configurações carregadas com sucesso!\n');

    // Teste da configuração principal
    console.log('📋 === CONFIGURAÇÃO PRINCIPAL ===');
    console.log(`Nome do Sistema: ${config.getSectionConfig('system').name}`);
    console.log(`Versão: ${config.getSectionConfig('system').version}`);
    console.log(`Ambiente: ${config.getSectionConfig('system').environment}`);
    console.log(`Porta do Servidor: ${config.getSectionConfig('server').port}`);
    console.log(`Timezone: ${config.getSectionConfig('system').timezone}`);
    console.log(`Idioma: ${config.getSectionConfig('system').locale}\n`);

    // Teste das funcionalidades
    console.log('🚀 === FUNCIONALIDADES HABILITADAS ===');
    const enabledFeatures = config.getEnabledFeatures();
    if (enabledFeatures.length > 0) {
        enabledFeatures.forEach(feature => {
            console.log(`✅ ${feature}`);
        });
    } else {
        console.log('❌ Nenhuma funcionalidade habilitada');
    }
    console.log('');

    // Teste das APIs sociais
    console.log('🔗 === APIS DE REDES SOCIAIS ===');
    const socialPlatforms = socialConfig.getEnabledPlatforms();
    if (socialPlatforms.length > 0) {
        socialPlatforms.forEach(platform => {
            const platformConfig = socialConfig.getPlatformConfig(platform);
            console.log(`✅ ${platform}: ${platformConfig.baseURL || 'N/A'}`);
        });
    } else {
        console.log('❌ Nenhuma API social habilitada');
    }
    console.log('');

    // Teste do ML e Analytics
    console.log('🤖 === ML E ANALYTICS ===');
    const mlFeatures = mlConfig.getEnabledFeatures();
    if (mlFeatures.length > 0) {
        mlFeatures.forEach(feature => {
            console.log(`✅ ${feature}`);
        });
    } else {
        console.log('❌ Nenhuma funcionalidade de ML habilitada');
    }
    console.log('');

    // Teste do Live Chat
    console.log('💬 === LIVE CHAT ===');
    const chatFeatures = chatConfig.getEnabledFeatures();
    if (chatFeatures.length > 0) {
        chatFeatures.forEach(feature => {
            console.log(`✅ ${feature}`);
        });
    } else {
        console.log('❌ Nenhuma funcionalidade de chat habilitada');
    }
    console.log('');

    // Validação do sistema
    console.log('🔍 === VALIDAÇÃO DO SISTEMA ===');
    const systemValidation = config.validateSystemConfig();
    
    if (systemValidation.valid) {
        console.log('✅ Sistema configurado corretamente');
    } else {
        console.log('❌ Problemas na configuração:');
        systemValidation.recommendations.forEach(rec => {
            console.log(`  - ${rec.message}: ${rec.action}`);
        });
    }
    console.log('');

    // Relatório de status
    console.log('📊 === RELATÓRIO DE STATUS ===');
    const status = config.getStatusReport();
    console.log(`Total de seções: ${status.total}`);
    console.log(`Seções habilitadas: ${status.enabled}`);
    console.log(`Seções desabilitadas: ${status.disabled}`);
    console.log(`Configurações válidas: ${status.valid}`);
    console.log(`Configurações inválidas: ${status.invalid}`);
    console.log('');

    // Estatísticas de uso
    console.log('📈 === ESTATÍSTICAS DE USO ===');
    const stats = config.getUsageStats();
    console.log(`Total de seções: ${stats.totalSections}`);
    console.log(`Seções habilitadas: ${stats.enabledSections}`);
    console.log(`Funcionalidades habilitadas: ${stats.enabledFeatures}`);
    console.log(`Total de funcionalidades: ${stats.totalFeatures}`);
    console.log('');

    // Teste de exportação
    console.log('📤 === TESTE DE EXPORTAÇÃO ===');
    try {
        const exportResult = config.exportConfig('./test-config-export.json', 'json');
        if (exportResult.success) {
            console.log('✅ Configuração exportada com sucesso');
            console.log(`📁 Arquivo: ${exportResult.message}`);
        } else {
            console.log('❌ Erro na exportação:', exportResult.error);
        }
    } catch (error) {
        console.log('❌ Erro na exportação:', error.message);
    }
    console.log('');

    // Verificação de arquivos de configuração
    console.log('📁 === VERIFICAÇÃO DE ARQUIVOS ===');
    const configFiles = [
        './config/index.js',
        './config/social-apis.js',
        './config/ml-analytics.js',
        './config/live-chat.js',
        './config/forbidden-words.txt',
        './config/.env.example',
        './config/README.md'
    ];

    configFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file}`);
        } else {
            console.log(`❌ ${file} - NÃO ENCONTRADO`);
        }
    });
    console.log('');

    // Verificação de variáveis de ambiente críticas
    console.log('🔐 === VARIÁVEIS CRÍTICAS ===');
    const criticalVars = [
        'NODE_ENV',
        'PORT',
        'JWT_SECRET',
        'MONGODB_URI'
    ];

    criticalVars.forEach(varName => {
        if (process.env[varName]) {
            console.log(`✅ ${varName}: ${varName === 'JWT_SECRET' ? '***CONFIGURADO***' : process.env[varName]}`);
        } else {
            console.log(`❌ ${varName}: NÃO CONFIGURADO`);
        }
    });
    console.log('');

    // Teste de funcionalidades específicas
    console.log('🧪 === TESTES ESPECÍFICOS ===');
    
    // Teste de configuração de upload
    const uploadConfig = config.getSectionConfig('upload');
    if (uploadConfig && uploadConfig.enabled) {
        console.log('✅ Upload habilitado');
        console.log(`  - Diretório: ${uploadConfig.directory}`);
        console.log(`  - Tamanho máximo: ${uploadConfig.maxFileSize} bytes`);
        console.log(`  - Máximo de arquivos: ${uploadConfig.maxFiles}`);
    } else {
        console.log('❌ Upload não habilitado');
    }

    // Teste de configuração de email
    const emailConfig = config.getSectionConfig('email');
    if (emailConfig && emailConfig.enabled) {
        console.log('✅ Email habilitado');
        console.log(`  - Host SMTP: ${emailConfig.smtp.host}`);
        console.log(`  - Porta: ${emailConfig.smtp.port}`);
    } else {
        console.log('❌ Email não habilitado');
    }

    // Teste de configuração de gamificação
    const gamificationConfig = config.getSectionConfig('gamification');
    if (gamificationConfig && gamificationConfig.enabled) {
        console.log('✅ Gamificação habilitada');
        console.log(`  - Sistema de pontos: ${gamificationConfig.points.enabled ? 'Sim' : 'Não'}`);
        console.log(`  - Sistema de badges: ${gamificationConfig.badges.enabled ? 'Sim' : 'Não'}`);
    } else {
        console.log('❌ Gamificação não habilitada');
    }
    console.log('');

    // Resumo final
    console.log('🎯 === RESUMO FINAL ===');
    if (systemValidation.valid) {
        console.log('🎉 Sistema configurado e funcionando corretamente!');
        console.log(`🚀 ${enabledFeatures.length} funcionalidades habilitadas`);
        console.log(`🔗 ${socialPlatforms.length} APIs sociais configuradas`);
        console.log(`🤖 ${mlFeatures.length} recursos de ML habilitados`);
        console.log(`💬 ${chatFeatures.length} funcionalidades de chat ativas`);
    } else {
        console.log('⚠️  Sistema configurado com problemas');
        console.log('📋 Verifique as recomendações acima');
        console.log('🔧 Configure as variáveis de ambiente necessárias');
    }

} catch (error) {
    console.error('❌ Erro ao carregar configurações:', error.message);
    console.error('📋 Stack trace:', error.stack);
    
    // Verifica se os arquivos de configuração existem
    console.log('\n📁 Verificando arquivos de configuração...');
    const configDir = './config';
    
    if (fs.existsSync(configDir)) {
        const files = fs.readdirSync(configDir);
        console.log('Arquivos encontrados em ./config:');
        files.forEach(file => {
            console.log(`  - ${file}`);
        });
    } else {
        console.log('❌ Diretório ./config não encontrado');
    }
    
    process.exit(1);
}

console.log('\n✨ Teste de configuração concluído!');