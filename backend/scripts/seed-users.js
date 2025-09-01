const mongoose = require('mongoose');
const User = require('../models/User');

const sampleUsers = [
  {
    name: 'Igreja São João Batista',
    email: 'igreja@saojoao.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password123
    role: 'church',
    profileImage: 'https://exemplo.com/igreja.jpg',
    churchData: {
      address: 'Rua São João, 123',
      city: 'São Paulo',
      state: 'SP',
      phone: '(11) 99999-9999',
      website: 'https://saojoao.com',
      description: 'Igreja dedicada à comunidade local'
    },
    isPremium: true,
    premiumExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
    premiumFeatures: ['conteudos-exclusivos', 'historico-avancado']
  },
  {
    name: 'João Silva',
    email: 'joao@email.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password123
    role: 'user',
    profileImage: 'https://exemplo.com/joao.jpg',
    isPremium: false
  },
  {
    name: 'Maria Santos',
    email: 'maria@email.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password123
    role: 'user',
    profileImage: 'https://exemplo.com/maria.jpg',
    isPremium: true,
    premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    premiumFeatures: ['modo-offline', 'sem-anuncios']
  }
];

async function seedUsers() {
  try {
    console.log('🌱 Iniciando seed de usuários...');

    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/igreja-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Limpar usuários existentes
    await User.deleteMany({});
    console.log('🧹 Usuários existentes removidos');

    // Inserir usuários de exemplo
    const users = await User.insertMany(sampleUsers);

    console.log('✅ Usuários criados com sucesso:');
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
    });

    console.log('\n🔑 Credenciais de teste:');
    console.log('   Email: igreja@saojoao.com | Senha: password123 (Igreja Premium)');
    console.log('   Email: joao@email.com | Senha: password123 (Usuário comum)');
    console.log('   Email: maria@email.com | Senha: password123 (Usuário Premium)');

  } catch (error) {
    console.error('❌ Erro no seed de usuários:', error);
  } finally {
    process.exit(0);
  }
}

// Executar seed se chamado diretamente
if (require.main === module) {
  seedUsers();
}

module.exports = seedUsers;
