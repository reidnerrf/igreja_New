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
  const [isPremium, setIsPremium] = useState(true);
  const [newEventDialog, setNewEventDialog] = useState(false);
  
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
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 border-yellow-300 bg-yellow-50 dark:bg-yellow-950">
                  <Gift className="w-6 h-6 text-yellow-600" />
                  <span className="text-sm text-yellow-600">Nova Rifa</span>
                </Button>
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
                        <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
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

              {/* Actividade Recente */}
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nova oração cadastrada</p>
                      <p className="text-xs text-muted-foreground">há 2 minutos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Doação recebida - R$ 150</p>
                      <p className="text-xs text-muted-foreground">há 5 minutos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Novo membro cadastrado</p>
                      <p className="text-xs text-muted-foreground">há 1 hora</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Outras abas aqui */}
          <TabsContent value="agenda">
            <Card>
              <CardHeader>
                <CardTitle>Agenda de Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Funcionalidade de agenda em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transmissoes">
            <Card>
              <CardHeader>
                <CardTitle>Transmissões ao Vivo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Funcionalidade de transmissões em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doacoes">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Doações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Funcionalidade de doações em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>

      {/* Navegação Inferior */}
      <BottomNavigation
        userType="church"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
        isPremium={isPremium}
      />
    </div>
  );
}