const mongoose = require('mongoose');
const PremiumFeature = require('../models/PremiumFeature');

const premiumFeaturesData = [
  // Conteúdos exclusivos
  {
    name: 'Conteúdos Exclusivos',
    slug: 'conteudos-exclusivos',
    description: 'Acesso a conteúdos exclusivos para membros premium',
    category: 'content',
    price: {
      monthly: 9.90,
      yearly: 99.00
    },
    features: {
      exclusiveContent: true,
      premiumSermons: true,
      devotionalPlans: true,
      advancedHistory: false,
      unlimitedHistory: false,
      exportHistory: false,
      offlineMode: false,
      downloadContent: false,
      offlinePrayers: false,
      adFree: false,
      premiumUI: false,
      prioritySupport: false,
      directSupport: false,
      earlyAccess: false,
      betaFeatures: false
    },
    isActive: true,
    isPopular: false,
    order: 1
  },

  // Histórico avançado
  {
    name: 'Histórico Avançado',
    slug: 'historico-avancado',
    description: 'Histórico ilimitado com recursos avançados de análise',
    category: 'history',
    price: {
      monthly: 7.90,
      yearly: 79.00
    },
    features: {
      exclusiveContent: false,
      premiumSermons: false,
      devotionalPlans: false,
      advancedHistory: true,
      unlimitedHistory: true,
      exportHistory: true,
      offlineMode: false,
      downloadContent: false,
      offlinePrayers: false,
      adFree: false,
      premiumUI: false,
      prioritySupport: false,
      directSupport: false,
      earlyAccess: false,
      betaFeatures: false
    },
    isActive: true,
    isPopular: false,
    order: 2
  },

  // Modo offline
  {
    name: 'Modo Offline',
    slug: 'modo-offline',
    description: 'Acesse conteúdos mesmo sem conexão com a internet',
    category: 'offline',
    price: {
      monthly: 12.90,
      yearly: 129.00
    },
    features: {
      exclusiveContent: false,
      premiumSermons: false,
      devotionalPlans: false,
      advancedHistory: false,
      unlimitedHistory: false,
      exportHistory: false,
      offlineMode: true,
      downloadContent: true,
      offlinePrayers: true,
      adFree: false,
      premiumUI: false,
      prioritySupport: false,
      directSupport: false,
      earlyAccess: false,
      betaFeatures: false
    },
    isActive: true,
    isPopular: true,
    order: 3
  },

  // Sem anúncios
  {
    name: 'Experiência Sem Anúncios',
    slug: 'sem-anuncios',
    description: 'Navegação completa sem interrupções de anúncios',
    category: 'ads',
    price: {
      monthly: 4.90,
      yearly: 49.00
    },
    features: {
      exclusiveContent: false,
      premiumSermons: false,
      devotionalPlans: false,
      advancedHistory: false,
      unlimitedHistory: false,
      exportHistory: false,
      offlineMode: false,
      downloadContent: false,
      offlinePrayers: false,
      adFree: true,
      premiumUI: true,
      prioritySupport: false,
      directSupport: false,
      earlyAccess: false,
      betaFeatures: false
    },
    isActive: true,
    isPopular: false,
    order: 4
  },

  // Suporte prioritário
  {
    name: 'Suporte Prioritário',
    slug: 'suporte-prioritario',
    description: 'Atendimento prioritário e suporte direto',
    category: 'support',
    price: {
      monthly: 14.90,
      yearly: 149.00
    },
    features: {
      exclusiveContent: false,
      premiumSermons: false,
      devotionalPlans: false,
      advancedHistory: false,
      unlimitedHistory: false,
      exportHistory: false,
      offlineMode: false,
      downloadContent: false,
      offlinePrayers: false,
      adFree: false,
      premiumUI: false,
      prioritySupport: true,
      directSupport: true,
      earlyAccess: false,
      betaFeatures: false
    },
    isActive: true,
    isPopular: false,
    order: 5
  },

  // Acesso antecipado
  {
    name: 'Acesso Antecipado',
    slug: 'acesso-antecipado',
    description: 'Acesso antecipado a novos recursos e funcionalidades',
    category: 'other',
    price: {
      monthly: 19.90,
      yearly: 199.00
    },
    features: {
      exclusiveContent: true,
      premiumSermons: true,
      devotionalPlans: true,
      advancedHistory: true,
      unlimitedHistory: true,
      exportHistory: true,
      offlineMode: true,
      downloadContent: true,
      offlinePrayers: true,
      adFree: true,
      premiumUI: true,
      prioritySupport: true,
      directSupport: true,
      earlyAccess: true,
      betaFeatures: true
    },
    isActive: true,
    isPopular: true,
    order: 6
  }
];

async function seedPremiumFeatures() {
  try {
    console.log('🌟 Iniciando seed das features premium...');

    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/igreja-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('📦 Removendo features premium existentes...');
    await PremiumFeature.deleteMany({});

    console.log('📝 Inserindo novas features premium...');
    const createdFeatures = await PremiumFeature.insertMany(premiumFeaturesData);

    console.log('✅ Features premium criadas com sucesso:');
    createdFeatures.forEach(feature => {
      console.log(`   - ${feature.name} (${feature.slug}) - R$ ${feature.price.monthly}/mês`);
    });

    console.log('🎉 Seed concluído!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    process.exit(1);
  }
}

// Executar seed se chamado diretamente
if (require.main === module) {
  seedPremiumFeatures();
}

module.exports = seedPremiumFeatures;
