import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ChevronRight, Church, User, Heart, Calendar, Radio, Gift } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OnboardingProps {
  onComplete: (userType: 'church' | 'user') => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState<'church' | 'user' | null>(null);

  const onboardingSteps = [
    {
      title: 'Bem-vindo ao FaithConnect',
      subtitle: 'Conectando corações e comunidades de fé',
      image: 'https://images.unsplash.com/photo-1644221967423-151b418d9659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBidWlsZGluZyUyMG1vZGVybnxlbnwxfHx8fDE3NTY0MTM0NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      content: 'Uma plataforma completa para igrejas e fiéis se conectarem, compartilharem e crescerem juntos na fé.'
    },
    {
      title: 'Quem você é?',
      subtitle: 'Selecione seu perfil para personalizarmos sua experiência',
      content: null
    },
    {
      title: 'Recursos Premium',
      subtitle: 'Desbloqueie todo o potencial da plataforma',
      content: 'Funcionalidades avançadas disponíveis com nossos planos premium'
    }
  ];

  const userTypes = [
    {
      type: 'church' as const,
      title: 'Igreja',
      description: 'Gerencie sua comunidade, eventos e transmissões',
      icon: Church,
      features: ['Dashboard completo', 'Gestão de eventos', 'Transmissões ao vivo', 'Sistema de doações', 'Chat com membros']
    },
    {
      type: 'user' as const,
      title: 'Usuário',
      description: 'Encontre igrejas, participe de eventos e conecte-se',
      icon: User,
      features: ['Mapa de igrejas', 'Agenda pessoal', 'Transmissões', 'Orações', 'Comunidade']
    }
  ];

  const premiumFeatures = [
    { icon: Radio, title: 'Transmissões HD', description: 'Qualidade superior para suas lives' },
    { icon: Gift, title: 'Rifas Premium', description: 'Sistema avançado de rifas' },
    { icon: Heart, title: 'Doações Recorrentes', description: 'Facilite doações regulares' },
    { icon: Calendar, title: 'Eventos Ilimitados', description: 'Crie quantos eventos quiser' }
  ];

  const nextStep = () => {
    if (step < onboardingSteps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(selectedType!);
    }
  };

  const selectUserType = (type: 'church' | 'user') => {
    setSelectedType(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            {/* Progress Indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-2">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= step ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {step === 0 && (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                  <ImageWithFallback
                    src={onboardingSteps[0].image}
                    alt="Igreja"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="mb-2">{onboardingSteps[0].title}</h1>
                <p className="text-muted-foreground mb-6">{onboardingSteps[0].subtitle}</p>
                <p className="text-sm text-muted-foreground mb-8">{onboardingSteps[0].content}</p>
              </div>
            )}

            {step === 1 && (
              <div>
                <div className="text-center mb-8">
                  <h1 className="mb-2">{onboardingSteps[1].title}</h1>
                  <p className="text-muted-foreground">{onboardingSteps[1].subtitle}</p>
                </div>
                
                <div className="space-y-4">
                  {userTypes.map((userType) => {
                    const Icon = userType.icon;
                    return (
                      <Card
                        key={userType.type}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedType === userType.type
                            ? 'ring-2 ring-blue-600 bg-blue-50 dark:bg-blue-950'
                            : ''
                        }`}
                        onClick={() => selectUserType(userType.type)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                              <Icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="mb-1">{userType.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{userType.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {userType.features.slice(0, 3).map((feature, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="text-center mb-8">
                  <h1 className="mb-2">{onboardingSteps[2].title}</h1>
                  <p className="text-muted-foreground">{onboardingSteps[2].subtitle}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {premiumFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800 rounded-lg">
                          <Icon className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="text-sm">{feature.title}</h4>
                          <p className="text-xs text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    Experimente grátis por 30 dias
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Voltar
                </Button>
              )}
              
              <Button 
                onClick={nextStep}
                disabled={step === 1 && !selectedType}
                className="ml-auto flex items-center space-x-2"
              >
                <span>{step === onboardingSteps.length - 1 ? 'Começar' : 'Próximo'}</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}