import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Church, User, MapPin, Phone, Mail, Instagram, DollarSign, Image as ImageIcon, ArrowLeft, Lock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { API_BASE_URL } from '../services/api';
import { toast } from 'sonner';

interface DetailedSignupFormProps {
  userType: 'church' | 'user';
  onComplete: () => void;
  onBack: () => void;
}

export function DetailedSignupForm({ userType, onComplete, onBack }: DetailedSignupFormProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    city: '',
    denomination: '',
    phone: '',
    pixKey: '', // Apenas para igreja
    instagram: '', // Apenas para igreja
    profileImage: ''
  });

  const totalSteps = userType === 'church' ? 3 : 2;
  const progress = (step / totalSteps) * 100;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const maskPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) {
      return digits.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (m, a, b, c) => {
        return [a && `(${a})`, b, c && `-${c}`].filter(Boolean).join(' ');
      });
    }
    return digits.replace(/(\d{0,2})(\d{0,5})(\d{0,4})/, (m, a, b, c) => {
      return [a && `(${a})`, b, c && `-${c}`].filter(Boolean).join(' ');
    });
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < totalSteps) setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const setFieldError = (field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const clearFieldError = (field: string) => {
    setErrors(prev => { const { [field]: _, ...rest } = prev; return rest; });
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') value = maskPhone(value);
    clearFieldError(field);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        setFormData(prev => ({ ...prev, profileImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (currentStep: number) => {
    const e: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.name) e.name = 'Informe o nome';
      if (!formData.email || !emailRegex.test(formData.email)) e.email = 'Email inválido';
      if (!formData.password || formData.password.length < 6) e.password = 'Senha deve ter 6+ caracteres';
      if (userType === 'church' && !formData.address) e.address = 'Informe o endereço';
    } else if (currentStep === 2) {
      if (userType === 'church') {
        if (!formData.denomination) e.denomination = 'Selecione a denominação';
        if (!formData.phone) e.phone = 'Informe o telefone';
      } else {
        // usuário: cidade opcional, sem erros obrigatórios
      }
    } else if (currentStep === 3 && userType === 'church') {
      if (!formData.pixKey) e.pixKey = 'Informe a chave PIX';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    setIsLoading(true);
    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userType,
      };
      if (userType === 'church') {
        payload.churchData = {
          address: formData.address,
          pixKey: formData.pixKey,
          denomination: formData.denomination,
          phone: formData.phone,
          instagram: formData.instagram,
        };
      } else {
        if (formData.city) payload.city = formData.city;
      }
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Falha no cadastro');
      }
      toast.success('Cadastro realizado com sucesso!');
      onComplete();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Não foi possível finalizar o cadastro.');
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.name && emailRegex.test(formData.email) && formData.password.length >= 6 && (userType !== 'church' || !!formData.address);
    }
    if (step === 2) {
      if (userType === 'church') return !!formData.denomination && !!formData.phone;
      return true;
    }
    if (step === 3 && userType === 'church') {
      return !!formData.pixKey;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              {userType === 'church' ? (
                <Church className="w-full h-full text-blue-600" />
              ) : (
                <User className="w-full h-full text-blue-600" />
              )}
            </div>
            <CardTitle className="mb-2">
              {userType === 'church' ? 'Cadastro da Igreja' : 'Complete seu Perfil'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Etapa {step} de {totalSteps}
            </p>
            <Progress value={progress} className="w-full mt-3" />
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium">Informações Básicas</h3>
                  <p className="text-sm text-muted-foreground">
                    Vamos começar com suas informações principais
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    {userType === 'church' ? 'Nome da Igreja' : 'Nome Completo'}
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={userType === 'church' ? 'Ex: Igreja Batista Central' : 'Seu nome completo'}
                    required
                  />
                  {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="pl-10"
                      required
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="pl-10"
                      required
                    />
                  </div>
                  {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{userType==='church' ? 'Endereço Completo' : 'Endereço/Cidade (opcional)'}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder={userType==='church' ? 'Rua, número, bairro, cidade, estado' : 'Sua cidade (opcional)'}
                      className="pl-10"
                      required={userType==='church'}
                    />
                  </div>
                  {errors.address && <p className="text-xs text-red-600">{errors.address}</p>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium">{userType==='church' ? 'Contato e Denominação' : 'Seu Perfil'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {userType==='church' ? 'Informações de contato e denominação religiosa' : 'Personalize seu perfil'}
                  </p>
                </div>

                {userType==='church' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="denomination">Denominação</Label>
                      <Select onValueChange={(value) => handleInputChange('denomination', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione sua denominação" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="catolica">Católica</SelectItem>
                          <SelectItem value="batista">Batista</SelectItem>
                          <SelectItem value="pentecostal">Pentecostal</SelectItem>
                          <SelectItem value="presbiteriana">Presbiteriana</SelectItem>
                          <SelectItem value="metodista">Metodista</SelectItem>
                          <SelectItem value="luterana">Luterana</SelectItem>
                          <SelectItem value="adventista">Adventista</SelectItem>
                          <SelectItem value="assembleia">Assembleia de Deus</SelectItem>
                          <SelectItem value="universal">Universal</SelectItem>
                          <SelectItem value="outra">Outra</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.denomination && <p className="text-xs text-red-600">{errors.denomination}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="(11) 99999-9999"
                          className="pl-10"
                          required
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profile-image">Foto de Perfil</Label>
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                          {profileImage ? (
                            <AvatarImage src={profileImage} />
                          ) : (
                            <AvatarFallback>
                              <ImageIcon className="w-8 h-8 text-muted-foreground" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1">
                          <input
                            type="file"
                            id="profile-image"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('profile-image')?.click()}
                          >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Escolher Foto
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1">
                            JPG, PNG ou GIF (máx. 2MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Sua cidade"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profile-image">Foto de Perfil (opcional)</Label>
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16">
                          {profileImage ? (
                            <AvatarImage src={profileImage} />
                          ) : (
                            <AvatarFallback>
                              <ImageIcon className="w-8 h-8 text-muted-foreground" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1">
                          <input
                            type="file"
                            id="profile-image"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('profile-image')?.click()}
                          >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Escolher Foto
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1">
                            JPG, PNG ou GIF (máx. 2MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {step === 3 && userType === 'church' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium">Informações Adicionais</h3>
                  <p className="text-sm text-muted-foreground">
                    Configurações específicas para gestão da igreja
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pixKey">Chave PIX para Doações</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pixKey"
                      value={formData.pixKey}
                      onChange={(e) => handleInputChange('pixKey', e.target.value)}
                      placeholder="Digite a chave PIX da igreja"
                      className="pl-10"
                      required
                    />
                  </div>
                  {errors.pixKey && <p className="text-xs text-red-600">{errors.pixKey}</p>}
                  <p className="text-xs text-muted-foreground">
                    Esta chave será usada para receber doações online
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram (Opcional)</Label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="instagram"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                      placeholder="@suaigreja"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>

              <div className="space-x-2">
                {step < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed() || isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? 'Criando conta...' : 'Finalizar Cadastro'}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex justify-center space-x-2 pt-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i + 1 <= step ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}