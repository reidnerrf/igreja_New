const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DonationCampaign',
    default: null
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  method: {
    type: String,
    enum: ['pix', 'card', 'cash', 'bank_transfer'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Dados do pagamento
  paymentData: {
    transactionId: String,
    pixKey: String,
    qrCode: String,
    pixCode: String,
    cardLast4: String,
    cardBrand: String,
    receiptUrl: String
  },
  
  // Informações adicionais
  message: {
    type: String,
    trim: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'yearly'],
      default: null
    },
    nextPayment: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  
  // Processamento
  processedAt: {
    type: Date,
    default: null
  },
  failureReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Schema para campanhas de doação
const donationCampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  description: {
    type: String,
    trim: true
  },
  church: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goal: {
    type: Number,
    required: true,
    min: 1
  },
  raised: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['general', 'construction', 'social', 'mission', 'equipment', 'emergency'],
    default: 'general'
  },
  
  // Datas
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'active'
  },
  
  // Configurações
  minDonation: {
    type: Number,
    default: 1
  },
  maxDonation: {
    type: Number,
    default: null
  },
  allowAnonymous: {
    type: Boolean,
    default: true
  },
  
  // Imagens
  images: [String],
  
  // Estatísticas
  stats: {
    totalDonors: { type: Number, default: 0 },
    averageDonation: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Índices
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ church: 1, status: 1, createdAt: -1 });
donationSchema.index({ campaign: 1, status: 1 });
donationSchema.index({ method: 1, status: 1 });

donationCampaignSchema.index({ church: 1, status: 1 });
donationCampaignSchema.index({ endDate: 1, status: 1 });
donationCampaignSchema.index({ category: 1, status: 1 });
donationCampaignSchema.index({ slug: 1 }, { unique: true, sparse: true });

// Middleware para atualizar campanha quando doação é processada
donationSchema.post('save', async function() {
  if (this.campaign && this.status === 'completed') {
    const Campaign = mongoose.model('DonationCampaign');
    const campaign = await Campaign.findById(this.campaign);
    
    if (campaign) {
      // Recalcular total arrecadado
      const Donation = mongoose.model('Donation');
      const donations = await Donation.find({
        campaign: this.campaign,
        status: 'completed'
      });
      
      const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0);
      const totalDonors = new Set(donations.map(d => d.donor.toString())).size;
      const averageDonation = totalDonors > 0 ? totalRaised / totalDonors : 0;
      
      campaign.raised = totalRaised;
      campaign.stats.totalDonors = totalDonors;
      campaign.stats.averageDonation = averageDonation;
      
      // Verificar se atingiu a meta
      if (campaign.raised >= campaign.goal && campaign.status === 'active') {
        campaign.status = 'completed';
      }
      
      await campaign.save();
    }
  }
});

// Método para calcular progresso da campanha
donationCampaignSchema.methods.getProgress = function() {
  return Math.min((this.raised / this.goal) * 100, 100);
};

// Método para verificar se campanha está ativa
donationCampaignSchema.methods.isActive = function() {
  return this.status === 'active' && this.endDate > new Date();
};

const Donation = mongoose.model('Donation', donationSchema);
const DonationCampaign = mongoose.model('DonationCampaign', donationCampaignSchema);

module.exports = { Donation, DonationCampaign };