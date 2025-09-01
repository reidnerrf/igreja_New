const mongoose = require('mongoose');
const Raffle = require('../models/Raffle');
const User = require('../models/User');

const demoComplianceData = {
  localRegulations: {
    state: 'SP',
    city: 'São Paulo',
    regulationNumber: '12345/2024',
    authority: 'Prefeitura Municipal de São Paulo',
    complianceDocument: 'https://exemplo.com/regulamento.pdf',
    maxPrizeValue: 50000,
    ageRestriction: 18,
    taxRate: 0.15,
    requiresNotary: true,
    requiresInsurance: true
  },
  transparency: {
    drawMethod: 'notary_supervised',
    witnesses: [
      {
        name: 'João Silva',
        document: '123.456.789-00',
        role: 'testemunha'
      },
      {
        name: 'Maria Santos',
        document: '987.654.321-00',
        role: 'representante'
      }
    ],
    videoRecording: {
      url: 'https://exemplo.com/video-sorteio.mp4',
      required: true
    },
    publicAnnouncement: {
      method: 'website',
      date: new Date(),
      proof: 'https://exemplo.com/prova-anuncio.pdf'
    }
  },
  audit: {
    auditor: {
      name: 'Auditoria XYZ Ltda',
      company: 'Auditoria XYZ Ltda',
      license: 'CRT-123456'
    },
    auditReport: 'https://exemplo.com/relatorio-auditoria.pdf',
    auditDate: new Date(),
    complianceStatus: 'approved',
    notes: 'Rifa aprovada após auditoria completa'
  },
  limits: {
    maxTicketsPerPerson: 5,
    maxRevenue: 100000,
    minParticipants: 10,
    geographicRestriction: {
      allowedStates: ['SP', 'RJ', 'MG'],
      allowedCities: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte']
    }
  },
  requiredDocuments: {
    regulationApproval: true,
    taxDeclaration: true,
    insurancePolicy: true,
    notaryDeed: true
  }
};

async function demoCompliance() {
  try {
    console.log('🚀 Iniciando demonstração de compliance de rifas...');

    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/igreja-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Buscar uma rifa existente ou criar uma de exemplo
    let raffle = await Raffle.findOne();

    if (!raffle) {
      console.log('📝 Criando rifa de exemplo...');

      // Buscar um usuário igreja
      const churchUser = await User.findOne({ userType: 'church' });

      if (!churchUser) {
        console.log('❌ Nenhum usuário igreja encontrado. Execute o seed primeiro.');
        return;
      }

      raffle = new Raffle({
        title: 'Rifa Beneficente - Compliance Demo',
        description: 'Rifa de demonstração com compliance completo',
        church: churchUser._id,
        prize: 'Viagem para Aparecida',
        prizeValue: 25000,
        ticketPrice: 50,
        totalTickets: 1000,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        compliance: demoComplianceData
      });

      await raffle.save();
      console.log('✅ Rifa de exemplo criada!');
    }

    console.log('🔍 Aplicando dados de compliance...');

    // Aplicar dados de compliance
    raffle.compliance = demoComplianceData;

    // Adicionar entrada no histórico
    raffle.complianceHistory.push({
      action: 'created',
      performedBy: raffle.church,
      details: 'Dados de compliance aplicados para demonstração',
      timestamp: new Date()
    });

    await raffle.save();

    console.log('✅ Dados de compliance aplicados com sucesso!');
    console.log('📊 Resumo da configuração:');
    console.log(`   - Estado: ${raffle.compliance.localRegulations.state}`);
    console.log(`   - Cidade: ${raffle.compliance.localRegulations.city}`);
    console.log(`   - Método de sorteio: ${raffle.compliance.transparency.drawMethod}`);
    console.log(`   - Status da auditoria: ${raffle.compliance.audit.complianceStatus}`);
    console.log(`   - Testemunhas: ${raffle.compliance.transparency.witnesses.length}`);
    console.log(`   - Documentos obrigatórios: ${Object.values(raffle.compliance.requiredDocuments).filter(Boolean).length}/${Object.keys(raffle.compliance.requiredDocuments).length}`);

    console.log('\n🎯 Funcionalidades de compliance disponíveis:');
    console.log('   - GET /api/raffles/:id/compliance - Ver status de compliance');
    console.log('   - PUT /api/raffles/:id/compliance - Atualizar dados de compliance');
    console.log('   - POST /api/raffles/:id/audit - Registrar auditoria');
    console.log('   - POST /api/raffles/:id/draw-compliant - Sortear com compliance');
    console.log('   - POST /api/raffles/:id/validate-compliance - Validar compliance');

    console.log('\n🎉 Demonstração concluída!');

  } catch (error) {
    console.error('❌ Erro na demonstração:', error);
  } finally {
    process.exit(0);
  }
}

// Executar demonstração se chamado diretamente
if (require.main === module) {
  demoCompliance();
}

module.exports = demoCompliance;
