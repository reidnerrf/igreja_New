const mongoose = require('mongoose');
const ChurchPlan = require('../models/ChurchPlan');

const plansData = [
  {
    name: 'Gratuito',
    slug: 'gratuito',
    description: 'Plano básico para igrejas iniciantes com recursos essenciais',
    price: {
      monthly: 0,
      yearly: 0
    },
    features: {
      // Perfil e Agenda
      basicProfile: true,
      advancedProfile: false,
      eventManagement: true,
      advancedScheduling: false,

      // Transmissões
      liveStreaming: false,
      streamingIntegration: false,
      multiPlatformStreaming: false,

      // Dados e Analytics
      basicAnalytics: true,
      advancedAnalytics: false,
      customReports: false,

      // Suporte
      basicSupport: true,
      prioritySupport: false,
      dedicatedSupport: false,

      // Multi-paróquias/Diocese
      multipleParishes: false,
      dioceseManagement: false,
      centralizedControl: false,

      // Limites
      maxEvents: 10,
      maxUsers: 100,
      maxParishes: 1,
      storageLimit: 1,

      // Recursos Especiais
      apiAccess: false,
      customIntegrations: false,
      whiteLabel: false
    },
    isActive: true,
    isPopular: false,
    order: 1
  },
  {
    name: 'Pro',
    slug: 'pro',
    description: 'Plano avançado com transmissões integradas, dados analíticos e suporte prioritário',
    price: {
      monthly: 49.90,
      yearly: 499.00
    },
    features: {
      // Perfil e Agenda
      basicProfile: true,
      advancedProfile: true,
      eventManagement: true,
      advancedScheduling: true,

      // Transmissões
      liveStreaming: true,
      streamingIntegration: true,
      multiPlatformStreaming: false,

      // Dados e Analytics
      basicAnalytics: true,
      advancedAnalytics: true,
      customReports: false,

      // Suporte
      basicSupport: true,
      prioritySupport: true,
      dedicatedSupport: false,

      // Multi-paróquias/Diocese
      multipleParishes: false,
      dioceseManagement: false,
      centralizedControl: false,

      // Limites
      maxEvents: 100,
      maxUsers: 1000,
      maxParishes: 5,
      storageLimit: 10,

      // Recursos Especiais
      apiAccess: true,
      customIntegrations: false,
      whiteLabel: false
    },
    isActive: true,
    isPopular: true,
    order: 2
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'Plano completo para dioceses e grandes organizações com multi-paróquias e recursos avançados',
    price: {
      monthly: 199.90,
      yearly: 1999.00
    },
    features: {
      // Perfil e Agenda
      basicProfile: true,
      advancedProfile: true,
      eventManagement: true,
      advancedScheduling: true,

      // Transmissões
      liveStreaming: true,
      streamingIntegration: true,
      multiPlatformStreaming: true,

      // Dados e Analytics
      basicAnalytics: true,
      advancedAnalytics: true,
      customReports: true,

      // Suporte
      basicSupport: true,
      prioritySupport: true,
      dedicatedSupport: true,

      // Multi-paróquias/Diocese
      multipleParishes: true,
      dioceseManagement: true,
      centralizedControl: true,

      // Limites
      maxEvents: -1, // Ilimitado
      maxUsers: -1, // Ilimitado
      maxParishes: -1, // Ilimitado
      storageLimit: 100,

      // Recursos Especiais
      apiAccess: true,
      customIntegrations: true,
      whiteLabel: true
    },
    isActive: true,
    isPopular: false,
    order: 3
  }
];

async function seedPlans() {
  try {
    console.log('🌱 Iniciando seed dos planos...');

    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/igreja-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('📦 Removendo planos existentes...');
    await ChurchPlan.deleteMany({});

    console.log('📝 Inserindo novos planos...');
    const createdPlans = await ChurchPlan.insertMany(plansData);

    console.log('✅ Planos criados com sucesso:');
    createdPlans.forEach(plan => {
      console.log(`   - ${plan.name} (${plan.slug})`);
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
  seedPlans();
}

module.exports = seedPlans;
