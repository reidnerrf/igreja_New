export const APP_CONFIG = {
  name: 'ConnectFé',
  version: '1.0.0',
  description: 'Conectando corações e comunidades de fé',
};

export const COLORS = {
  primary: '#2563eb',
  secondary: '#f8fafc',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  gold: '#fbbf24',
};

export const PREMIUM_FEATURES = {
  church: [
    'Rifas ilimitadas',
    'Relatórios avançados',
    'Transmissão nativa',
    'Gestão de membros',
    'Campanhas especiais',
    'Upload ilimitado',
  ],
  user: [
    'Acesso a rifas',
    'Devocionais premium',
    'Posts ilimitados',
    'Notificações personalizadas',
    'Conteúdo exclusivo',
    'Histórico avançado',
  ],
};

export const PREMIUM_PRICES = {
  user: 19.90,
  church: 49.90,
};

export const EVENT_CATEGORIES = [
  { id: 'missa', label: 'Missa', icon: 'church' },
  { id: 'novena', label: 'Novena', icon: 'book' },
  { id: 'festa', label: 'Festa', icon: 'musical-notes' },
  { id: 'retiro', label: 'Retiro', icon: 'mountain' },
  { id: 'catequese', label: 'Catequese', icon: 'school' },
  { id: 'jovens', label: 'Reunião de Jovens', icon: 'people' },
  { id: 'estudo', label: 'Estudo Bíblico', icon: 'book-open' },
  { id: 'culto', label: 'Culto', icon: 'heart' },
];

export const PRAYER_CATEGORIES = [
  { id: 'personal', label: 'Pessoal', icon: 'person' },
  { id: 'family', label: 'Família', icon: 'people' },
  { id: 'health', label: 'Saúde', icon: 'medical' },
  { id: 'work', label: 'Trabalho', icon: 'briefcase' },
  { id: 'gratitude', label: 'Gratidão', icon: 'heart' },
  { id: 'community', label: 'Comunidade', icon: 'home' },
];

export const DONATION_CATEGORIES = [
  { id: 'general', label: 'Geral', icon: 'heart' },
  { id: 'construction', label: 'Reforma', icon: 'hammer' },
  { id: 'social', label: 'Ação Social', icon: 'people' },
  { id: 'mission', label: 'Missão', icon: 'airplane' },
  { id: 'equipment', label: 'Equipamentos', icon: 'hardware-chip' },
  { id: 'emergency', label: 'Emergência', icon: 'alert-circle' },
];

export const TRANSMISSION_PLATFORMS = [
  { id: 'youtube', label: 'YouTube', icon: 'logo-youtube', color: '#FF0000' },
  { id: 'facebook', label: 'Facebook', icon: 'logo-facebook', color: '#1877F2' },
  { id: 'instagram', label: 'Instagram', icon: 'logo-instagram', color: '#E4405F' },
  { id: 'tiktok', label: 'TikTok', icon: 'logo-tiktok', color: '#000000' },
  { id: 'native', label: 'Transmissão Nativa', icon: 'videocam', color: '#2563eb' },
];

export const NOTIFICATION_TYPES = {
  EVENT_REMINDER: 'event_reminder',
  NEW_EVENT: 'new_event',
  PRAYER_APPROVED: 'prayer_approved',
  PRAYER_ANSWERED: 'prayer_answered',
  DONATION_RECEIVED: 'donation_received',
  RAFFLE_WINNER: 'raffle_winner',
  NEW_ANNOUNCEMENT: 'new_announcement',
  DAILY_DEVOTIONAL: 'daily_devotional',
  CHURCH_POST: 'church_post',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  PASTOR: 'pastor',
  MEMBER: 'member',
  VISITOR: 'visitor',
};

export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  pixKey: /^[a-zA-Z0-9@._-]+$/,
  password: {
    minLength: 6,
    requireUppercase: false,
    requireNumbers: false,
    requireSpecialChars: false,
  },
};

export const IMAGE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
};

export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 100,
};

export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  CHURCHES: 'churches',
  EVENTS: 'events',
  NOTIFICATIONS: 'notifications',
  THEME: 'theme',
  NOTIFICATION_SETTINGS: 'notification_settings',
};