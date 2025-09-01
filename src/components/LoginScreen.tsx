import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Church, User, Mail, Lock, Facebook, Chrome, Smartphone } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DetailedSignupForm } from './DetailedSignupForm';

interface LoginScreenProps {
  userType: 'church' | 'user';
  onLogin: () => void;
  onBack: () => void;
}

export function LoginScreen({ userType, onLogin, onBack }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  
  // Se estiver mostrando o formulário de cadastro, renderizar ele
  if (showSignupForm) {
    return (
      <DetailedSignupForm
        userType={userType}
        onComplete={onLogin}
        onBack={() => setShowSignupForm(false)}
      />
    );
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    // Simular login
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular login
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const isChurch = userType === 'church';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              {isChurch ? (
                <Church className="w-full h-full text-blue-600" />
              ) : (
                <User className="w-full h-full text-blue-600" />
              )}
            </div>
            <h1 className="mb-2">
              {isChurch ? 'Acesso da Igreja' : 'Entrar na Comunidade'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isChurch 
                ? 'Gerencie sua comunidade de fé' 
                : 'Conecte-se com sua comunidade de fé'
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs defaultValue="social" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="social">Login Rápido</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
              </TabsList>

              <TabsContent value="social" className="space-y-4 mt-6">
                <Button
                  variant="outline"
                  className="w-full h-12 flex items-center justify-center space-x-3"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                >
                  <Chrome className="w-5 h-5" />
                  <span>Continuar com Google</span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-12 flex items-center justify-center space-x-3"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={isLoading}
                >
                  <Facebook className="w-5 h-5" />
                  <span>Continuar com Facebook</span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-12 flex items-center justify-center space-x-3"
                  onClick={() => handleSocialLogin('apple')}
                  disabled={isLoading}
                >
                  <Smartphone className="w-5 h-5" />
                  <span>Continuar com Apple</span>
                </Button>
              </TabsContent>

              <TabsContent value="email" className="mt-6">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12" disabled={isLoading}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <Button variant="link" className="text-sm text-muted-foreground">
                    Esqueceu sua senha?
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowSignupForm(true)}
              >
                Criar conta grátis
              </Button>
            </div>

            <div className="text-center">
              <Button variant="link" onClick={onBack} className="text-sm">
                Voltar à seleção de perfil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}