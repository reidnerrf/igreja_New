import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { useTheme } from './ThemeProvider';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PremiumBadge } from './PremiumBadge';
import { BottomNavigation } from './BottomNavigation';
import {
  MapPin,
  Calendar,
  Radio,
  Heart,
  DollarSign,
  Gift,
  MessageCircle,
  Search,
  Plus,
  Play,
  Users,
  Clock,
  Moon,
  Sun,
  Star,
  Navigation,
  BookOpen,
  User,
  Bell,
  History,
  CreditCard,
  Crown,
  Settings,
  CheckCircle,
  Hash,
  TrendingUp,
  Share2,
  Send,
  Camera
} from 'lucide-react';

interface UserDashboardProps {
  onLogout: () => void;
}

export function UserDashboard({ onLogout }: UserDashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPremium, setIsPremium] = useState(false); // Usuário free por padrão

  const nearbyChurches = [
    {
      id: 1,
      name: 'Igreja Batista Central',
      distance: '0.8 km',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1644221967423-151b418d9659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBidWlsZGluZyUyMG1vZGVybnxlbnwxfHx8fDE3NTY0MTM0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      nextService: 'Dom 19:00'
    },
    {
      id: 2,
      name: 'Igreja Assembleia de Deus',
      distance: '1.2 km',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1644221967423-151b418d9659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBidWlsZGluZyUyMG1vZGVybnxlbnwxfHx8fDE3NTY0MTM0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      nextService: 'Qui 20:00'
    }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Culto Dominical', church: 'Igreja Batista Central', time: '19:00', date: 'Hoje' },
    { id: 2, title: 'Estudo Bíblico', church: 'Igreja Assembleia', time: '20:00', date: 'Amanhã' },
    { id: 3, title: 'Reunião de Jovens', church: 'Igreja Batista Central', time: '19:30', date: 'Sex' }
  ];

  const liveStreams = [
    {
      id: 1,
      title: 'Culto de Domingo - Ao Vivo',
      church: 'Igreja Batista Central',
      viewers: 248,
      isLive: true
    },
    {
      id: 2,
      title: 'Estudo da Palavra',
      church: 'Igreja Assembleia',
      viewers: 89,
      isLive: false,
      startTime: '20:00'
    }
  ];

  const prayerRequests = [
    { id: 1, request: 'Oração pela família Silva em momento difícil', author: 'Ana Maria', time: '2h' },
    { id: 2, request: 'Gratidão pela cura recebida', author: 'João Pedro', time: '4h' },
    { id: 3, request: 'Sabedoria para decisões importantes', author: 'Maria Santos', time: '6h' }
  ];

  const donations = [
    { id: 1, title: 'Construção do Novo Templo', church: 'Igreja Batista Central', goal: 50000, raised: 32000 },
    { id: 2, title: 'Ação Social - Cesta Básica', church: 'Igreja Assembleia', goal: 10000, raised: 8500 }
  ];

  const dailyVerse = {
    text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.",
    reference: "Jeremias 29:11"
  };

  const userPrayerHistory = [
    { id: 1, request: 'Pela saúde da minha família', date: '2025-01-10', status: 'ativa' },
    { id: 2, request: 'Gratidão pela nova oportunidade', date: '2025-01-08', status: 'respondida' },
    { id: 3, request: 'Sabedoria para decisões importantes', date: '2025-01-05', status: 'ativa' }
  ];

  const userDonationHistory = [
    { id: 1, church: 'Igreja Batista Central', amount: 50, type: 'dízimo', date: '2025-01-12' },
    { id: 2, church: 'Igreja Assembleia', amount: 100, type: 'oferta especial', date: '2025-01-10' }
  ];

  const availableRaffles = [
    {
      id: 1,
      title: 'Rifa do Notebook',
      church: 'Igreja Batista Central',
      prize: 'Notebook Dell Inspiron 15',
      ticketPrice: 20,
      totalTickets: 100,
      soldTickets: 67,
      drawDate: '2025-02-15'
    }
  ];

  const userNotifications = [
    {
      id: 1,
      title: 'Nova transmissão ao vivo',
      message: 'Igreja Batista Central está transmitindo agora',
      time: '10 min',
      type: 'live',
      read: false
    },
    {
      id: 2,
      title: 'Evento amanhã',
      message: 'Não esqueça: Estudo Bíblico às 20h',
      time: '2h',
      type: 'event',
      read: false
    }
  ];

  const communityFeed = [
    {
      id: 1,
      author: 'Maria Silva',
      church: 'Igreja Batista Central',
      content: 'Momentos especiais do retiro de jovens! 🙏',
      image: 'https://images.unsplash.com/photo-1585584318452-cca4858fea76?w=400',
      likes: 24,
      comments: 8,
      time: '2h'
    },
    {
      id: 2,
      author: 'João Santos',
      church: 'Igreja Assembleia',
      content: 'Gratidão pela cura recebida! Deus é fiel! ✨',
      likes: 42,
      comments: 15,
      time: '4h'
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
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">FaithConnect</h1>
                <p className="text-sm text-muted-foreground">Sua comunidade de fé</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4" />
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                <Moon className="w-4 h-4" />
              </div>
              
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          
          {/* Dashboard Principal */}
          <TabsContent value="dashboard" className="mt-6">
            <div className="space-y-6">
              {/* Cartão de Boas-vindas */}
              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl mb-2">Bem-vindo à FaithConnect! 🙏</h2>
                      <p className="text-blue-100">Conecte-se com sua comunidade de fé</p>
                    </div>
                    <div className="text-right">
                      <Heart className="w-12 h-12 text-blue-100 mb-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cards de Ações Rápidas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => setActiveTab('mapa')}
                >
                  <MapPin className="w-6 h-6" />
                  <span className="text-sm">Encontrar Igrejas</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => setActiveTab('transmissoes')}
                >
                  <Radio className="w-6 h-6" />
                  <span className="text-sm">Lives</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => setActiveTab('oracoes')}
                >
                  <Heart className="w-6 h-6" />
                  <span className="text-sm">Orações</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => setActiveTab('doacoes')}
                >
                  <DollarSign className="w-6 h-6" />
                  <span className="text-sm">Doações</span>
                </Button>
              </div>

              {/* Próximos Eventos */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Próximos Eventos</CardTitle>
                  <Button size="sm" onClick={() => setActiveTab('agenda')}>
                    Ver Todos
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <p className="text-xs text-muted-foreground">{event.church}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">{event.date}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Versículo do Dia */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Versículo do Dia</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
                    <blockquote className="text-sm italic mb-3">
                      "{dailyVerse.text}"
                    </blockquote>
                    <cite className="text-xs text-muted-foreground">{dailyVerse.reference}</cite>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="mapa" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mapa */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5" />
                      <span>Igrejas Próximas</span>
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Input placeholder="Buscar por denominação ou nome..." className="flex-1" />
                      <Button size="sm">
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1661969455654-fe4255de592e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBtYXAlMjBsb2NhdGlvbnxlbnwxfHx8fDE3NTY0NzM1NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Mapa de igrejas"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="text-white text-center">
                          <Navigation className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Mapa Interativo</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de Igrejas */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Igrejas Encontradas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {nearbyChurches.map((church) => (
                      <div key={church.id} className="p-4 border rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden">
                            <ImageWithFallback
                              src={church.image}
                              alt={church.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{church.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{church.distance}</span>
                              <div className="flex items-center">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-muted-foreground ml-1">{church.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center mt-2">
                              <Clock className="w-3 h-3 text-muted-foreground mr-1" />
                              <span className="text-xs text-muted-foreground">{church.nextService}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" className="w-full mt-3">
                          <Navigation className="w-3 h-3 mr-2" />
                          Navegar
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="agenda" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Minha Agenda</CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Evento
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.church}</p>
                        <div className="flex items-center mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">{event.date} às {event.time}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{event.date}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transmissoes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Radio className="w-5 h-5" />
                  <span>Transmissões ao Vivo</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {liveStreams.map((stream) => (
                  <div key={stream.id} className="p-4 border rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-12 bg-muted rounded-lg flex items-center justify-center relative">
                        <Play className="w-6 h-6 text-muted-foreground" />
                        {stream.isLive && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{stream.title}</h4>
                        <p className="text-sm text-muted-foreground">{stream.church}</p>
                        <div className="flex items-center mt-2 space-x-4">
                          {stream.isLive ? (
                            <Badge variant="destructive" className="text-xs">
                              <Radio className="w-3 h-3 mr-1" />
                              AO VIVO
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Inicia às {stream.startTime}
                            </Badge>
                          )}
                          <div className="flex items-center">
                            <Users className="w-3 h-3 text-muted-foreground mr-1" />
                            <span className="text-xs text-muted-foreground">{stream.viewers}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant={stream.isLive ? "default" : "outline"}>
                        <Play className="w-4 h-4 mr-2" />
                        {stream.isLive ? 'Assistir' : 'Agendar'}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="oracoes" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Versículo do Dia */}
                <Card>
                  <CardHeader>
                    <CardTitle>Versículo do Dia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                      <blockquote className="text-lg italic mb-4">
                        "{dailyVerse.text}"
                      </blockquote>
                      <cite className="text-sm text-muted-foreground">{dailyVerse.reference}</cite>
                    </div>
                    <div className="mt-4 text-center">
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartilhar
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Pedidos Comunitários */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Pedidos de Oração da Comunidade</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Novo Pedido
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Novo Pedido de Oração</DialogTitle>
                          <DialogDescription>
                            Compartilhe sua intenção com a comunidade
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="prayer-request">Seu pedido</Label>
                            <Textarea 
                              id="prayer-request" 
                              placeholder="Descreva sua intenção de oração..."
                              rows={4}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="anonymous" />
                            <Label htmlFor="anonymous">Enviar anonimamente</Label>
                          </div>
                          <Button className="w-full">
                            <Send className="w-4 h-4 mr-2" />
                            Enviar Pedido
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {prayerRequests.map((prayer) => (
                      <div key={prayer.id} className="p-4 border rounded-lg">
                        <p className="text-sm mb-2">{prayer.request}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Por {prayer.author}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">{prayer.time}</span>
                            <Button size="sm" variant="outline">
                              <Heart className="w-3 h-3 mr-1" />
                              Orar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Notificação Diária */}
                <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-yellow-600" />
                      <div className="flex-1">
                        <h4 className="font-medium">Notificação Diária</h4>
                        <p className="text-sm text-muted-foreground">
                          Receba o versículo do dia e reflexões
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <History className="w-5 h-5" />
                      <span>Meus Pedidos</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {userPrayerHistory.map((prayer) => (
                      <div key={prayer.id} className="p-3 border rounded-lg">
                        <p className="text-sm mb-2">{prayer.request}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{prayer.date}</span>
                          <Badge 
                            variant={prayer.status === 'respondida' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {prayer.status === 'respondida' ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Respondida
                              </>
                            ) : (
                              'Ativa'
                            )}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Reflexões */}
                <Card>
                  <CardHeader>
                    <CardTitle>Reflexões</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <h4 className="text-sm font-medium mb-1">Confiança em Deus</h4>
                        <p className="text-xs text-muted-foreground">
                          Mesmo nos momentos difíceis, podemos confiar...
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <h4 className="text-sm font-medium mb-1">O Poder da Oração</h4>
                        <p className="text-xs text-muted-foreground">
                          A oração não muda apenas as circunstâncias...
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="doacoes" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5" />
                      <span>Campanhas de Doação</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {donations.map((donation) => (
                      <Card key={donation.id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-medium">{donation.title}</h4>
                              <p className="text-sm text-muted-foreground">{donation.church}</p>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm">
                                  <Heart className="w-4 h-4 mr-2" />
                                  Doar
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Fazer Doação</DialogTitle>
                                  <DialogDescription>
                                    {donation.title} - {donation.church}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="amount">Valor da Doação (R$)</Label>
                                    <Input 
                                      id="amount" 
                                      type="number" 
                                      placeholder="0,00" 
                                      min="1"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="payment-method">Forma de Pagamento</Label>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                      <Button variant="outline" className="justify-start">
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        PIX
                                      </Button>
                                      <Button variant="outline" className="justify-start">
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Cartão
                                      </Button>
                                    </div>
                                  </div>
                                  <Button className="w-full">
                                    Confirmar Doação
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Arrecadado: R$ {donation.raised.toLocaleString()}</span>
                              <span>Meta: R$ {donation.goal.toLocaleString()}</span>
                            </div>
                            <Progress value={(donation.raised / donation.goal) * 100} />
                            <p className="text-xs text-muted-foreground">
                              {Math.round((donation.raised / donation.goal) * 100)}% da meta alcançada
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Histórico de Doações */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <History className="w-5 h-5" />
                      <span>Minhas Doações</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {userDonationHistory.length > 0 ? (
                      userDonationHistory.map((donation) => (
                        <div key={donation.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium">{donation.church}</h4>
                            <span className="text-sm font-semibold text-green-600">
                              R$ {donation.amount}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{donation.type}</span>
                            <span>{donation.date}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <Heart className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Nenhuma doação ainda
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Doação Rápida */}
                <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-green-800 dark:text-green-200">Doação Rápida</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <Button size="sm" variant="outline" className="h-12">
                        R$ 10
                      </Button>
                      <Button size="sm" variant="outline" className="h-12">
                        R$ 25
                      </Button>
                      <Button size="sm" variant="outline" className="h-12">
                        R$ 50
                      </Button>
                    </div>
                    <Input placeholder="Outro valor" type="number" />
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Doar Agora
                    </Button>
                  </CardContent>
                </Card>

                {/* Premium Feature */}
                {!isPremium && (
                  <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                    <CardContent className="p-4 text-center">
                      <Crown className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                      <h3 className="font-medium mb-2">Premium</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Histórico avançado e doações recorrentes
                      </p>
                      <Button size="sm" variant="outline">
                        Upgrade
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rifas" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Gift className="w-5 h-5" />
                        <span>Rifas Disponíveis</span>
                        <PremiumBadge />
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Participe das rifas das igrejas que você segue
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isPremium ? (
                      availableRaffles.length > 0 ? (
                        <div className="space-y-6">
                          {availableRaffles.map((raffle) => (
                            <Card key={raffle.id} className="border-l-4 border-l-yellow-500">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h3 className="font-medium">{raffle.title}</h3>
                                    <p className="text-sm text-muted-foreground">{raffle.church}</p>
                                    <p className="text-sm text-muted-foreground">{raffle.prize}</p>
                                  </div>
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                    R$ {raffle.ticketPrice}
                                  </Badge>
                                </div>
                                
                                <div className="space-y-3 mb-4">
                                  <div className="flex justify-between text-sm">
                                    <span>Vendidos: {raffle.soldTickets}/{raffle.totalTickets}</span>
                                    <span>Sorteio: {raffle.drawDate}</span>
                                  </div>
                                  <Progress value={(raffle.soldTickets / raffle.totalTickets) * 100} />
                                </div>

                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button className="w-full">
                                      <Hash className="w-4 h-4 mr-2" />
                                      Escolher Números
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Escolher Números - {raffle.title}</DialogTitle>
                                      <DialogDescription>
                                        Selecione os números desejados (R$ {raffle.ticketPrice} cada)
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Números disponíveis</Label>
                                        <div className="grid grid-cols-10 gap-2 mt-2 max-h-48 overflow-y-auto">
                                          {Array.from({ length: raffle.totalTickets }, (_, i) => i + 1).map((number) => (
                                            <Button
                                              key={number}
                                              size="sm"
                                              variant="outline"
                                              className="h-8 text-xs"
                                              disabled={number <= raffle.soldTickets}
                                            >
                                              {number.toString().padStart(2, '0')}
                                            </Button>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm">Total: R$ 0,00</span>
                                        <Button>Confirmar Compra</Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Gift className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">Nenhuma rifa disponível</h3>
                          <p className="text-muted-foreground">
                            Fique atento às próximas rifas das igrejas que você segue
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-12">
                        <Crown className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Funcionalidade Premium</h3>
                        <p className="text-muted-foreground mb-6">
                          Upgrade para participar das rifas das igrejas
                        </p>
                        <Button>
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade para Premium
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Minhas Participações */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <History className="w-5 h-5" />
                      <span>Minhas Participações</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isPremium ? (
                      <div className="text-center py-4">
                        <Gift className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Nenhuma participação ainda
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Crown className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Upgrade para Premium
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Próximos Sorteios */}
                <Card>
                  <CardHeader>
                    <CardTitle>Próximos Sorteios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <h4 className="text-sm font-medium">Rifa do Notebook</h4>
                        <p className="text-xs text-muted-foreground">Igreja Batista Central</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">15/02/2025</span>
                          <Badge variant="outline" className="text-xs">Em breve</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="avisos" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Avisos & Notificações</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userNotifications.map((notification) => (
                  <div key={notification.id} className={`p-4 border rounded-lg ${!notification.read ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {notification.type === 'live' && (
                          <Badge variant="destructive" className="text-xs">
                            <Radio className="w-3 h-3 mr-1" />
                            AO VIVO
                          </Badge>
                        )}
                        {notification.type === 'event' && (
                          <Badge variant="secondary" className="text-xs">
                            <Calendar className="w-3 h-3 mr-1" />
                            Evento
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feed" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Feed da Comunidade</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Compartilhe e veja momentos especiais da comunidade
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Criar Post */}
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <Textarea placeholder="Compartilhe um momento especial ou testemunho..." rows={3} />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Camera className="w-4 h-4 mr-2" />
                            Foto
                          </Button>
                          <Button size="sm" variant="outline">
                            <MapPin className="w-4 h-4 mr-2" />
                            Marcar Igreja
                          </Button>
                        </div>
                        <Button size="sm">Publicar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts do Feed */}
                <div className="space-y-6">
                  {communityFeed.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3 mb-3">
                          <Avatar>
                            <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-sm">{post.author}</h4>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{post.church}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{post.time}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm mb-4">{post.content}</p>
                        
                        {post.image && (
                          <div className="mb-4 rounded-lg overflow-hidden">
                            <ImageWithFallback
                              src={post.image}
                              alt="Post da comunidade"
                              className="w-full h-64 object-cover"
                            />
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
          </TabsContent>

          <TabsContent value="perfil" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Dados Pessoais</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center mb-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                    <Button size="sm" variant="outline">
                      Alterar Foto
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome</Label>
                      <Input id="nome" defaultValue="João da Silva" />
                    </div>
                    <div>
                      <Label htmlFor="sobrenome">Sobrenome</Label>
                      <Input id="sobrenome" defaultValue="Santos" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="joao@email.com" />
                  </div>
                  
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" defaultValue="(11) 99999-9999" />
                  </div>
                  
                  <Button>Salvar Alterações</Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {/* Plano Atual */}
                <Card>
                  <CardHeader>
                    <CardTitle>Plano Atual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6">
                      {isPremium ? (
                        <>
                          <Crown className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                          <h3 className="font-semibold mb-2">Premium</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Acesso completo a todas as funcionalidades
                          </p>
                        </>
                      ) : (
                        <>
                          <User className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <h3 className="font-semibold mb-2">Gratuito</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Funcionalidades básicas disponíveis
                          </p>
                          <Button onClick={() => setIsPremium(true)}>
                            <Crown className="w-4 h-4 mr-2" />
                            Upgrade para Premium
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Estatísticas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Minhas Atividades</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="text-sm">Igrejas seguidas</span>
                      </div>
                      <span className="font-semibold">3</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Heart className="w-5 h-5 text-red-600" />
                        <span className="text-sm">Orações feitas</span>
                      </div>
                      <span className="font-semibold">42</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Total doado</span>
                      </div>
                      <span className="font-semibold">R$ 150</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Configurações */}
                <Card>
                  <CardHeader>
                    <CardTitle>Preferências</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notificacoes-push">Notificações Push</Label>
                      <Switch id="notificacoes-push" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-avisos">Avisos por Email</Label>
                      <Switch id="email-avisos" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tema-escuro">Tema Escuro</Label>
                      <Switch id="tema-escuro" checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="oracao-diaria">Oração do Dia</Label>
                      <Switch id="oracao-diaria" defaultChecked />
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