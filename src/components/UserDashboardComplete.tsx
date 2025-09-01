import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { useTheme } from './ThemeProvider';
import { BottomNavigation } from './BottomNavigation';
import {
  MapPin,
  Calendar,
  Radio,
  Heart,
  DollarSign,
  Gift,
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
  Settings,
  CheckCircle,
  Share2
} from 'lucide-react';

interface UserDashboardProps {
  onLogout: () => void;
}

export function UserDashboard({ onLogout }: UserDashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPremium, setIsPremium] = useState(false);

  const upcomingEvents = [
    { id: 1, title: 'Culto Dominical', church: 'Igreja Batista Central', time: '19:00', date: 'Hoje' },
    { id: 2, title: 'Estudo Bíblico', church: 'Igreja Assembleia', time: '20:00', date: 'Amanhã' },
    { id: 3, title: 'Reunião de Jovens', church: 'Igreja Batista Central', time: '19:30', date: 'Sex' }
  ];

  const dailyVerse = {
    text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.",
    reference: "Jeremias 29:11"
  };

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

          {/* Outras abas simplificadas */}
          <TabsContent value="mapa">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Mapa de Igrejas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Funcionalidade de mapa em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agenda">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Minha Agenda</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Funcionalidade de agenda em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transmissoes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Radio className="w-5 h-5" />
                  <span>Transmissões ao Vivo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Funcionalidade de transmissões em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="oracoes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Pedidos de Oração</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Funcionalidade de orações em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doacoes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Doações</span>
                </CardTitle>
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
        userType="user"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
        isPremium={isPremium}
      />
    </div>
  );
}