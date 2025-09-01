import React, { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Home,
  Calendar,
  Radio,
  Heart,
  DollarSign,
  Gift,
  Bell,
  MessageCircle,
  Settings,
  Plus,
  LogOut,
  Users,
  MapPin,
  User,
  BarChart3,
  Image as ImageIcon
} from 'lucide-react';

interface BottomNavigationProps {
  userType: 'church' | 'user';
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isPremium?: boolean;
}

export function BottomNavigation({ 
  userType, 
  activeTab, 
  onTabChange, 
  onLogout, 
  isPremium = false 
}: BottomNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Definir as abas principais baseadas no tipo de usuário
  const mainTabs = userType === 'church' 
    ? [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'agenda', label: 'Eventos', icon: Calendar },
        { id: 'transmissoes', label: 'Live', icon: Radio },
        { id: 'doacoes', label: 'Doações', icon: DollarSign }
      ]
    : [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'mapa', label: 'Igrejas', icon: MapPin },
        { id: 'agenda', label: 'Eventos', icon: Calendar },
        { id: 'transmissoes', label: 'Lives', icon: Radio }
      ];

  // Definir itens do menu expandido baseado no tipo de usuário
  const menuItems = userType === 'church'
    ? [
        { id: 'oracoes', label: 'Orações', icon: Heart },
        { id: 'rifas', label: 'Rifas', icon: Gift, premium: true },
        { id: 'avisos', label: 'Avisos', icon: Bell },
        { id: 'feed', label: 'Feed', icon: ImageIcon },
        { id: 'chat', label: 'Chat', icon: MessageCircle },
        { id: 'relatorios', label: 'Relatórios', icon: BarChart3, premium: true },
        { id: 'membros', label: 'Membros', icon: Users, premium: true },
        { id: 'configuracoes', label: 'Configurações', icon: Settings }
      ]
    : [
        { id: 'oracoes', label: 'Orações', icon: Heart },
        { id: 'doacoes', label: 'Doações', icon: DollarSign },
        { id: 'rifas', label: 'Rifas', icon: Gift },
        { id: 'feed', label: 'Feed', icon: ImageIcon },
        { id: 'perfil', label: 'Meu Perfil', icon: User },
        { id: 'configuracoes', label: 'Configurações', icon: Settings }
      ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Navegação Inferior Fixa */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            {/* Abas Principais */}
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex flex-col items-center justify-center h-14 px-3 ${
                    isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs">{tab.label}</span>
                </Button>
              );
            })}

            {/* Botão Menu Expandido */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center justify-center h-14 px-3 text-muted-foreground hover:text-foreground"
                >
                  <div className="relative">
                    <Plus className="w-5 h-5 mb-1" />
                    {/* Indicador de notificações */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-xs">Mais</span>
                </Button>
              </SheetTrigger>
              
              <SheetContent side="bottom" className="h-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Menu Principal</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Fechar
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-3 gap-4">
                      {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        const isDisabled = item.premium && !isPremium;

                        return (
                          <Button
                            key={item.id}
                            variant="ghost"
                            onClick={() => handleTabClick(item.id)}
                            disabled={isDisabled}
                            className={`h-20 flex flex-col items-center justify-center space-y-2 ${
                              isActive 
                                ? 'text-primary bg-primary/10' 
                                : isDisabled
                                  ? 'text-muted-foreground/50'
                                  : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <div className="relative">
                              <Icon className="w-6 h-6" />
                              {item.premium && (
                                <Badge 
                                  variant="secondary" 
                                  className="absolute -top-2 -right-2 text-xs px-1 py-0 h-4 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                >
                                  PRO
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-center">{item.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <Separator className="my-4" />
                  
                  {/* Área de Logout */}
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={onLogout}
                      className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair da Conta</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Espaçamento para evitar sobreposição */}
      <div className="h-16"></div>
    </>
  );
}