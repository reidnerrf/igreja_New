import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { useTheme } from './ThemeProvider';
import { PremiumBadge } from './PremiumBadge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BottomNavigation } from './BottomNavigation';
import {
  BarChart3,
  Calendar,
  Users,
  Radio,
  DollarSign,
  Gift,
  Bell,
  MessageCircle,
  Settings,
  Plus,
  Eye,
  TrendingUp,
  Heart,
  Moon,
  Sun,
  Crown,
  Edit,
  Trash2,
  Send,
  Filter,
  Share2,
  Play,
  Pause,
  Upload,
  Link,
  CheckCircle,
  Clock,
  CreditCard,
  PiggyBank,
  Target,
  Image as ImageIcon,
  Video,
  Camera,
  Mic,
  Hash,
  MapPin,
  Phone,
  Mail,
  Globe,
  Copy,
  QrCode
} from 'lucide-react';

interface ChurchDashboardProps {
  onLogout: () => void;
}

export function ChurchDashboard({ onLogout }: ChurchDashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPremium, setIsPremium] = useState(true); // Simular conta premium
  const [agendaFilter, setAgendaFilter] = useState('todos');
  const [newEventDialog, setNewEventDialog] = useState(false);
  const [newRaffleDialog, setNewRaffleDialog] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);

  const stats = [
    { title: 'Membros Ativos', value: '1,234', icon: Users, trend: '+12%', color: 'text-blue-600' },
    { title: 'Eventos este Mês', value: '8', icon: Calendar, trend: '+2', color: 'text-green-600' },
    { title: 'Transmissões', value: '24', icon: Radio, trend: '+4', color: 'text-purple-600' },
    { title: 'Doações (R$)', value: '45,320', icon: DollarSign, trend: '+18%', color: 'text-yellow-600' }
  ];

  const recentEvents = [
    { id: 1, title: 'Culto Domingo', date: '2025-01-12', time: '19:00', attendees: 350 },
    { id: 2, title: 'Estudo Bíblico', date: '2025-01-14', time: '20:00', attendees: 80 },
    { id: 3, title: 'Reunião de Jovens', date: '2025-01-16', time: '19:30', attendees: 120 }
  ];

  const liveStreams = [
    { id: 1, title: 'Culto Dominical', viewers: 248, status: 'live' },
    { id: 2, title: 'Estudo da Palavra', viewers: 89, status: 'scheduled' }
  ];

  const donations = [
    { id: 1, donor: 'João Silva', amount: 150, type: 'dízimo', date: '2025-01-12' },
    { id: 2, donor: 'Maria Santos', amount: 200, type: 'oferta', date: '2025-01-12' },
    { id: 3, donor: 'Pedro Costa', amount: 500, type: 'construção', date: '2025-01-11' }
  ];

  const agendaEvents = [
    { 
      id: 1, 
      title: 'Missa Dominical', 
      type: 'missa',
      date: '2025-01-12', 
      time: '08:00', 
      description: 'Celebração dominical',
      attendees: 150,
      category: 'liturgia'
    },
    { 
      id: 2, 
      title: 'Novena de São João', 
      type: 'novena',
      date: '2025-01-15', 
      time: '19:00', 
      description: 'Novena em honra a São João',
      attendees: 80,
      category: 'devoção'
    },
    { 
      id: 3, 
      title: 'Festa Junina', 
      type: 'festa',
      date: '2025-06-24', 
      time: '18:00', 
      description: 'Festa tradicional junina',
      attendees: 300,
      category: 'celebração'
    }
  ];

  const prayerRequests = [
    { 
      id: 1, 
      request: 'Pela recuperação da minha mãe que está internada', 
      author: 'Maria Silva',
      email: 'maria@email.com',
      date: '2025-01-10',
      status: 'em_oracao',
      category: 'saude'
    },
    { 
      id: 2, 
      request: 'Pelo sucesso no novo emprego', 
      author: 'João Santos',
      email: 'joao@email.com',
      date: '2025-01-11',
      status: 'atendido',
      category: 'trabalho'
    },
    { 
      id: 3, 
      request: 'Pela paz na família', 
      author: 'Ana Costa',
      email: 'ana@email.com',
      date: '2025-01-12',
      status: 'em_oracao',
      category: 'familia'
    }
  ];

  const activeRaffles = [
    {
      id: 1,
      title: 'Rifa do Notebook',
      prize: 'Notebook Dell Inspiron 15',
      ticketPrice: 20,
      totalTickets: 100,
      soldTickets: 67,
      goal: 2000,
      raised: 1340,
      endDate: '2025-02-15',
      image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400'
    }
  ];

  const donationCampaigns = [
    {
      id: 1,
      title: 'Reforma do Telhado',
      description: 'Campanha para reforma do telhado da igreja',
      goal: 25000,
      raised: 18500,
      contributors: 45,
      endDate: '2025-03-31',
      type: 'construção'
    },
    {
      id: 2,
      title: 'Cesta Básica - Natal',
      description: 'Arrecadação para distribuição de cestas básicas',
      goal: 5000,
      raised: 4200,
      contributors: 28,
      endDate: '2025-12-20',
      type: 'social'
    }
  ];

  const announcements = [
    {
      id: 1,
      title: 'Horário especial para confissões',
      content: 'Durante a Quaresma, teremos horário especial para confissões às quintas-feiras das 19h às 21h.',
      type: 'aviso',
      priority: 'alta',
      date: '2025-01-10',
      published: true
    },
    {
      id: 2,
      title: 'Inscrições abertas para catequese',
      content: 'Estão abertas as inscrições para a catequese de primeira comunhão. Procurem a secretaria paroquial.',
      type: 'inscricoes',
      priority: 'media',
      date: '2025-01-08',
      published: true
    }
  ];

  const churchFeed = [
    {
      id: 1,
      type: 'photo',
      content: 'Celebração de domingo foi abençoada! Gratidão por todos que participaram.',
      image: 'https://images.unsplash.com/photo-1585584318452-cca4858fea76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBldmVudCUyMG1hc3N8ZW58MXx8fHwxNzU2NDczOTcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      date: '2025-01-12',
      likes: 34,
      comments: 8
    },
    {
      id: 2,
      type: 'video',
      content: 'Momentos especiais da nossa festa junina comunitária',
      thumbnail: 'https://images.unsplash.com/photo-1585584318452-cca4858fea76?w=400',
      date: '2025-01-10',
      likes: 28,
      comments: 12
    }
  ];

  const chatMessages = [
    {
      id: 1,
      author: 'Maria Silva',
      message: 'Que bela celebração hoje! Parabéns padre!',
      time: '14:30',
      avatar: '/placeholder-user.jpg'
    },
    {
      id: 2,
      author: 'João Santos', 
      message: 'Alguém sabe o horário da novena amanhã?',
      time: '15:45',
      avatar: '/placeholder-user.jpg'
    },
    {
      id: 3,
      author: 'Ana Costa',
      message: 'João, a novena é às 19h! 🙏',
      time: '16:02',
      avatar: '/placeholder-user.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl">Igreja Batista Central</h1>
                  {isPremium && <PremiumBadge />}
                </div>
                <p className="text-sm text-muted-foreground">Dashboard Administrativo</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4" />
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                <Moon className="w-4 h-4" />
              </div>
              
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Avisos
              </Button>
              
              <Avatar>
                <AvatarImage src="/placeholder-pastor.jpg" />
                <AvatarFallback>PT</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          <TabsContent value="dashboard" className="mt-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Dialog open={newEventDialog} onOpenChange={setNewEventDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                    <Plus className="w-6 h-6" />
                    <span className="text-sm">Criar Evento</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Evento</DialogTitle>
                    <DialogDescription>
                      Crie um novo evento para sua comunidade
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="event-title">Título do Evento</Label>
                      <Input id="event-title" placeholder="Ex: Missa Dominical" />
                    </div>
                    <div>
                      <Label htmlFor="event-type">Tipo de Evento</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="missa">Missa</SelectItem>
                          <SelectItem value="novena">Novena</SelectItem>
                          <SelectItem value="festa">Festa</SelectItem>
                          <SelectItem value="retiro">Retiro</SelectItem>
                          <SelectItem value="catequese">Catequese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="event-date">Data</Label>
                        <Input id="event-date" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="event-time">Horário</Label>
                        <Input id="event-time" type="time" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="event-description">Descrição</Label>
                      <Textarea id="event-description" placeholder="Descrição do evento..." />
                    </div>
                    <Button className="w-full">Criar Evento</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Bell className="w-6 h-6" />
                <span className="text-sm">Novo Aviso</span>
              </Button>

              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <DollarSign className="w-6 h-6" />
                <span className="text-sm">Nova Doação</span>
              </Button>

              {isPremium && (
                <Dialog open={newRaffleDialog} onOpenChange={setNewRaffleDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 border-yellow-300 bg-yellow-50 dark:bg-yellow-950">
                      <Gift className="w-6 h-6 text-yellow-600" />
                      <span className="text-sm text-yellow-600">Nova Rifa</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Gift className="w-5 h-5" />
                        <span>Nova Rifa Premium</span>
                        <PremiumBadge />
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Título da rifa" />
                      <Input placeholder="Descrição do prêmio" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Valor do número" type="number" />
                        <Input placeholder="Quantidade de números" type="number" />
                      </div>
                      <Input placeholder="Data do sorteio" type="date" />
                      <Button className="w-full">Criar Rifa</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-semibold">{stat.value}</p>
                          <div className="flex items-center mt-2">
                            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                            <span className="text-sm text-green-600">{stat.trend}</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-800`}>
                          <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Próximos Eventos */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Próximos Eventos</CardTitle>
                  <Button size="sm" onClick={() => setActiveTab('agenda')}>
                    Ver Todos
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {event.date} às {event.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{event.attendees} confirmados</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Rifas Ativas */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="w-5 h-5" />
                    <span>Rifas Ativas</span>
                    {isPremium && <PremiumBadge />}
                  </CardTitle>
                  <Button size="sm" onClick={() => setActiveTab('rifas')}>
                    Ver Todas
                  </Button>
                </CardHeader>
                <CardContent>
                  {isPremium && activeRaffles.length > 0 ? (
                    <div className="space-y-4">
                      {activeRaffles.map((raffle) => (
                        <div key={raffle.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{raffle.title}</h4>
                              <p className="text-sm text-muted-foreground">{raffle.prize}</p>
                            </div>
                            <Badge variant="secondary">R$ {raffle.ticketPrice}</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Vendidos: {raffle.soldTickets}/{raffle.totalTickets}</span>
                              <span>R$ {raffle.raised}</span>
                            </div>
                            <Progress value={(raffle.soldTickets / raffle.totalTickets) * 100} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Gift className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        {isPremium ? 'Nenhuma rifa ativa' : 'Upgrade para Premium para criar rifas'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="doacoes" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Configuração de Pagamento */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5" />
                      <span>Configurar Pagamentos</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-2 mb-3">
                          <QrCode className="w-5 h-5 text-green-600" />
                          <h3 className="font-medium">PIX</h3>
                        </div>
                        <Input placeholder="Chave PIX da igreja" className="mb-2" />
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Copy className="w-4 h-4 mr-1" />
                            Copiar
                          </Button>
                          <Button size="sm" variant="outline">
                            <QrCode className="w-4 h-4 mr-1" />
                            QR Code
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-2 mb-3">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          <h3 className="font-medium">Cartão de Crédito</h3>
                        </div>
                        <Input placeholder="Chave da API de pagamento" className="mb-2" />
                        <Button size="sm" variant="outline" className="w-full">
                          Configurar Gateway
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Campanhas de Arrecadação */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Campanhas de Arrecadação</CardTitle>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Campanha
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {donationCampaigns.map((campaign) => (
                        <Card key={campaign.id} className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-medium">{campaign.title}</h3>
                                  <Badge variant="outline">{campaign.type}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  {campaign.description}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span>{campaign.contributors} contribuições</span>
                                  <span>Até {campaign.endDate}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Share2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Arrecadado: R$ {campaign.raised.toLocaleString()}</span>
                                <span>Meta: R$ {campaign.goal.toLocaleString()}</span>
                              </div>
                              <Progress value={(campaign.raised / campaign.goal) * 100} />
                              <p className="text-xs text-muted-foreground">
                                {Math.round((campaign.raised / campaign.goal) * 100)}% da meta alcançada
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Doações Recentes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Doações Recentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {donations.map((donation) => (
                        <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                              <Heart className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{donation.donor}</h4>
                              <p className="text-sm text-muted-foreground">
                                {donation.type} • {donation.date}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">R$ {donation.amount}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Relatórios Premium */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5" />
                      <span>Relatórios</span>
                      {isPremium && <PremiumBadge />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isPremium ? (
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-2xl font-semibold text-green-600">R$ 23.840</p>
                          <p className="text-sm text-muted-foreground">Total este mês</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-2xl font-semibold">156</p>
                          <p className="text-sm text-muted-foreground">Doações este mês</p>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <p className="text-2xl font-semibold">R$ 153</p>
                          <p className="text-sm text-muted-foreground">Média por doação</p>
                        </div>
                        <Separator />
                        <Button variant="outline" className="w-full">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Relatório Completo
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Crown className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-medium mb-2">Relatórios Premium</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Acesse relatórios detalhados das doações
                        </p>
                        <Button variant="outline">Upgrade para Premium</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rifas" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="w-5 h-5" />
                    <span>Rifas Premium</span>
                    <PremiumBadge />
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Gerencie rifas e sorteios da igreja
                  </p>
                </div>
                {isPremium && (
                  <Button onClick={() => setNewRaffleDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Rifa
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isPremium ? (
                  activeRaffles.length > 0 ? (
                    <div className="space-y-6">
                      {activeRaffles.map((raffle) => (
                        <Card key={raffle.id} className="border-l-4 border-l-yellow-500">
                          <CardContent className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              <div className="lg:col-span-2">
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h3 className="font-medium text-lg mb-2">{raffle.title}</h3>
                                    <p className="text-muted-foreground mb-3">{raffle.prize}</p>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                      <span>R$ {raffle.ticketPrice} por número</span>
                                      <span>Sorteio: {raffle.endDate}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button size="sm" variant="outline">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <Share2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <div className="flex justify-between text-sm">
                                    <span>Números vendidos: {raffle.soldTickets}/{raffle.totalTickets}</span>
                                    <span>Arrecadado: R$ {raffle.raised}</span>
                                  </div>
                                  <Progress value={(raffle.soldTickets / raffle.totalTickets) * 100} />
                                  
                                  <div className="grid grid-cols-3 gap-4 mt-4">
                                    <div className="text-center p-3 bg-muted rounded-lg">
                                      <p className="text-xl font-semibold">{raffle.soldTickets}</p>
                                      <p className="text-xs text-muted-foreground">Vendidos</p>
                                    </div>
                                    <div className="text-center p-3 bg-muted rounded-lg">
                                      <p className="text-xl font-semibold">{raffle.totalTickets - raffle.soldTickets}</p>
                                      <p className="text-xs text-muted-foreground">Disponíveis</p>
                                    </div>
                                    <div className="text-center p-3 bg-muted rounded-lg">
                                      <p className="text-xl font-semibold text-green-600">R$ {raffle.raised}</p>
                                      <p className="text-xs text-muted-foreground">Arrecadado</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                                  <ImageWithFallback
                                    src={raffle.image}
                                    alt={raffle.prize}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Button className="w-full" size="sm">
                                    <Users className="w-4 h-4 mr-2" />
                                    Lista de Participantes
                                  </Button>
                                  <Button variant="outline" className="w-full" size="sm">
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    Dashboard de Vendas
                                  </Button>
                                  <Button variant="outline" className="w-full" size="sm">
                                    <Hash className="w-4 h-4 mr-2" />
                                    Números Vendidos
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Gift className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Nenhuma rifa ativa</h3>
                      <p className="text-muted-foreground mb-6">
                        Crie sua primeira rifa para arrecadar fundos para a igreja
                      </p>
                      <Button onClick={() => setNewRaffleDialog(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeira Rifa
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <Crown className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Funcionalidade Premium</h3>
                    <p className="text-muted-foreground mb-6">
                      Upgrade para o plano Premium para criar rifas e ações entre amigos
                    </p>
                    <Button>
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade para Premium
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="oracoes" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Pedidos de Oração</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Gerencie as intenções enviadas pelos fiéis
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prayerRequests.map((request) => (
                    <Card key={request.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {request.category}
                              </Badge>
                              <Badge 
                                variant={request.status === 'atendido' ? 'default' : 'secondary'} 
                                className="text-xs"
                              >
                                {request.status === 'atendido' ? 'Atendido' : 'Em Oração'}
                              </Badge>
                            </div>
                            <p className="text-sm mb-3">{request.request}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Por: {request.author}</span>
                              <span>{request.email}</span>
                              <span>{request.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {request.status === 'em_oracao' ? (
                              <Button size="sm" variant="outline" className="text-green-600">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Marcar como Atendido
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" className="text-blue-600">
                                <Clock className="w-4 h-4 mr-1" />
                                Voltar para Oração
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="agenda" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Agenda de Eventos</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Gerencie missas, novenas, festas e outros eventos
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={agendaFilter} onValueChange={setAgendaFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="hoje">Hoje</SelectItem>
                      <SelectItem value="semana">Esta Semana</SelectItem>
                      <SelectItem value="mes">Este Mês</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setNewEventDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Evento
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agendaEvents.map((event) => (
                    <Card key={event.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium">{event.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {event.type}
                              </Badge>
                              {isPremium && (
                                <Badge variant="secondary" className="text-xs">
                                  {event.category}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {event.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {event.time}
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {event.attendees} pessoas
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {isPremium && (
                  <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Crown className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-medium">Recursos Premium</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Com o plano Premium, você tem acesso a categorias extras, relatórios detalhados e integração com calendário.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transmissoes" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Controles de Transmissão */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Radio className="w-5 h-5" />
                      <span>Central de Transmissões</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Live Stream Controls */}
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">Transmissão ao Vivo</h3>
                          <p className="text-sm text-muted-foreground">
                            {isLiveStreaming ? 'Transmitindo agora' : 'Pronto para transmitir'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isLiveStreaming && (
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                              <span className="text-sm text-red-500">AO VIVO</span>
                            </div>
                          )}
                          <Button
                            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                            variant={isLiveStreaming ? "destructive" : "default"}
                          >
                            {isLiveStreaming ? (
                              <>
                                <Pause className="w-4 h-4 mr-2" />
                                Parar
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Iniciar Live
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      {isPremium ? (
                        <div className="space-y-4">
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                {isLiveStreaming ? 'Transmissão nativa ativa' : 'Clique em "Iniciar Live" para começar'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <Button size="sm" variant="outline">
                              <Mic className="w-4 h-4 mr-2" />
                              Audio
                            </Button>
                            <Button size="sm" variant="outline">
                              <Camera className="w-4 h-4 mr-2" />
                              Vídeo
                            </Button>
                            <Button size="sm" variant="outline">
                              <Settings className="w-4 h-4 mr-2" />
                              Configurações
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Crown className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="font-medium mb-2">Transmissão Nativa Premium</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Upgrade para transmitir direto pelo app
                          </p>
                          <Button variant="outline">Upgrade para Premium</Button>
                        </div>
                      )}
                    </div>

                    {/* YouTube/Facebook Integration */}
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-4">Upload de Transmissões</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <Input placeholder="Título da transmissão" />
                        </div>
                        <div className="flex items-center space-x-3">
                          <Link className="w-5 h-5 text-muted-foreground" />
                          <Input placeholder="Link do YouTube ou Facebook" />
                        </div>
                        <Button className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Adicionar Transmissão
                        </Button>
                      </div>
                    </div>

                    {/* Transmissões Salvas */}
                    <div>
                      <h3 className="font-medium mb-4">Transmissões Anteriores</h3>
                      <div className="space-y-3">
                        {liveStreams.map((stream) => (
                          <div key={stream.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                                <Play className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm">{stream.title}</h4>
                                <p className="text-xs text-muted-foreground">{stream.viewers} visualizações</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Estatísticas */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-semibold">248</p>
                      <p className="text-sm text-muted-foreground">Visualizações hoje</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-semibold">1,234</p>
                      <p className="text-sm text-muted-foreground">Total de seguidores</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-semibold">45min</p>
                      <p className="text-sm text-muted-foreground">Tempo médio</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="avisos" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Central de Avisos</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Crie posts e notificações para seus fiéis
                  </p>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Aviso
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Criar Novo Aviso */}
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="aviso-titulo">Título do Aviso</Label>
                        <Input id="aviso-titulo" placeholder="Ex: Horário especial para confissões" />
                      </div>
                      
                      <div>
                        <Label htmlFor="aviso-tipo">Tipo de Aviso</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aviso">Aviso Geral</SelectItem>
                            <SelectItem value="urgente">Urgente</SelectItem>
                            <SelectItem value="inscricoes">Inscrições</SelectItem>
                            <SelectItem value="evento">Evento</SelectItem>
                            <SelectItem value="celebracao">Celebração</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="aviso-conteudo">Conteúdo</Label>
                        <Textarea 
                          id="aviso-conteudo" 
                          placeholder="Digite o conteúdo do aviso..."
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button size="sm" variant="outline">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Imagem
                          </Button>
                          <Button size="sm" variant="outline">
                            <Video className="w-4 h-4 mr-2" />
                            Vídeo
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            Salvar Rascunho
                          </Button>
                          <Button size="sm">
                            <Send className="w-4 h-4 mr-2" />
                            Publicar e Notificar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Avisos Publicados */}
                <div className="space-y-4">
                  <h3 className="font-medium">Avisos Publicados</h3>
                  {announcements.map((announcement) => (
                    <Card key={announcement.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium">{announcement.title}</h4>
                              <Badge 
                                variant={announcement.priority === 'alta' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {announcement.priority}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {announcement.type}
                              </Badge>
                              {announcement.published && (
                                <Badge variant="default" className="text-xs bg-green-600">
                                  Publicado
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {announcement.content}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Publicado em: {announcement.date}</span>
                              <span>Visualizações: 234</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feed" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Feed da Igreja</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Galeria de fotos e vídeos dos eventos da igreja
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Criar Nova Postagem */}
                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <Textarea placeholder="Compartilhe um momento especial..." rows={3} />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="outline">
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Foto
                              </Button>
                              <Button size="sm" variant="outline">
                                <Video className="w-4 h-4 mr-2" />
                                Vídeo
                              </Button>
                              <Button size="sm" variant="outline">
                                <Camera className="w-4 h-4 mr-2" />
                                Câmera
                              </Button>
                            </div>
                            <Button size="sm">Publicar</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Posts do Feed */}
                    <div className="space-y-6">
                      {churchFeed.map((post) => (
                        <Card key={post.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3 mb-3">
                              <Avatar>
                                <AvatarImage src="/church-logo.jpg" />
                                <AvatarFallback>IC</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4 className="font-medium">Igreja Batista Central</h4>
                                <p className="text-sm text-muted-foreground">{post.date}</p>
                              </div>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <p className="text-sm mb-4">{post.content}</p>
                            
                            {post.type === 'photo' && post.image && (
                              <div className="mb-4 rounded-lg overflow-hidden">
                                <ImageWithFallback
                                  src={post.image}
                                  alt="Post da igreja"
                                  className="w-full h-64 object-cover"
                                />
                              </div>
                            )}
                            
                            {post.type === 'video' && post.thumbnail && (
                              <div className="mb-4 rounded-lg overflow-hidden relative">
                                <ImageWithFallback
                                  src={post.thumbnail}
                                  alt="Thumbnail do vídeo"
                                  className="w-full h-64 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                  <Play className="w-12 h-12 text-white" />
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between pt-3 border-t">
                              <div className="flex items-center space-x-4">
                                <Button size="sm" variant="ghost">
                                  <Heart className="w-4 h-4 mr-2" />
                                  {post.likes}
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  {post.comments}
                                </Button>
                              </div>
                              <Button size="sm" variant="ghost">
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-semibold">1,234</p>
                      <p className="text-sm text-muted-foreground">Seguidores</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-semibold">856</p>
                      <p className="text-sm text-muted-foreground">Curtidas este mês</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-semibold">24</p>
                      <p className="text-sm text-muted-foreground">Posts este mês</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Posts Populares</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-muted rounded overflow-hidden">
                        <ImageWithFallback
                          src={churchFeed[0].image}
                          alt="Post popular"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">Celebração de domingo...</p>
                        <p className="text-xs text-muted-foreground">34 curtidas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Lista de Conversas */}
              <Card>
                <CardHeader>
                  <CardTitle>Conversas</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3 p-3 hover:bg-muted cursor-pointer border-r-2 border-blue-500">
                      <Avatar>
                        <AvatarFallback>GM</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">Grupo Mural</h4>
                        <p className="text-xs text-muted-foreground">124 membros</p>
                      </div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 hover:bg-muted cursor-pointer">
                      <Avatar>
                        <AvatarFallback>MS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">Maria Silva</h4>
                        <p className="text-xs text-muted-foreground">Obrigada pela oração</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 hover:bg-muted cursor-pointer">
                      <Avatar>
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">João Santos</h4>
                        <p className="text-xs text-muted-foreground">Sobre a novena...</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chat Principal */}
              <div className="lg:col-span-3">
                <Card className="h-96">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>GM</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">Grupo Mural</h3>
                        <p className="text-sm text-muted-foreground">124 membros ativos</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Users className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 p-4">
                    <div className="flex flex-col h-72">
                      {/* Mensagens */}
                      <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                        {chatMessages.map((message) => (
                          <div key={message.id} className="flex items-start space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={message.avatar} />
                              <AvatarFallback>{message.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm font-medium">{message.author}</span>
                                <span className="text-xs text-muted-foreground">{message.time}</span>
                              </div>
                              <p className="text-sm">{message.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Input de Mensagem */}
                      <div className="flex items-center space-x-2">
                        <Input placeholder="Digite sua mensagem..." className="flex-1" />
                        <Button size="sm">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ferramentas de Moderação */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Ferramentas de Moderação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <Button size="sm" variant="outline">
                        <Users className="w-4 h-4 mr-2" />
                        Gerenciar Membros
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurações do Grupo
                      </Button>
                      <Button size="sm" variant="outline">
                        <Bell className="w-4 h-4 mr-2" />
                        Notificações
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Configurações Tab */}
          <TabsContent value="configuracoes" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dados da Igreja</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome-igreja">Nome da Igreja</Label>
                      <Input id="nome-igreja" defaultValue="Igreja Batista Central" />
                    </div>
                    <div>
                      <Label htmlFor="denominacao">Denominação</Label>
                      <Input id="denominacao" defaultValue="Batista" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input id="endereco" defaultValue="Rua das Flores, 123 - Centro" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input id="telefone" defaultValue="(11) 9999-9999" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue="contato@igrejabatista.com" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="www.igrejabatista.com" />
                  </div>
                  
                  <Button>Salvar Alterações</Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Plano Atual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6">
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <Crown className="w-8 h-8 text-yellow-600" />
                        <h3 className="text-xl font-semibold">Premium</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Acesso completo a todas as funcionalidades
                      </p>
                      <Button variant="outline">Gerenciar Plano</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Preferências</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notificacoes">Notificações Push</Label>
                      <Switch id="notificacoes" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notif">Notificações por Email</Label>
                      <Switch id="email-notif" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="modo-escuro">Tema Escuro</Label>
                      <Switch id="modo-escuro" checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}