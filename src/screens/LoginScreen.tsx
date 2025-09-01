import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Facebook from 'expo-auth-session/providers/facebook';

WebBrowser.maybeCompleteAuthSession();

interface LoginScreenProps {
  onLogin: (type: 'church' | 'user') => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const { colors } = useTheme();
  const { login, loginWithToken } = useAuth();
  const [userType, setUserType] = useState<'church' | 'user'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const FB_APP_ID = ((import.meta as any)?.env?.VITE_FACEBOOK_APP_ID) || (process as any)?.env?.EXPO_PUBLIC_FACEBOOK_APP_ID || 'FB_APP_ID_PLACEHOLDER';
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: FB_APP_ID,
    scopes: ['public_profile', 'email'],
    redirectUri,
  });

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password, userType);
      onLogin(userType);
    } catch (error) {
      Alert.alert('Erro', 'Falha no login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      const result = await fbPromptAsync({ useProxy: true });
      if (!result || result.type !== 'success' || !(result as any).authentication?.accessToken) {
        throw new Error('cancelled');
      }
      const accessToken = (result as any).authentication.accessToken as string;
      const profileResp = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`);
      const profile = await profileResp.json();
      const userData = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        picture: profile?.picture?.data?.url,
      };
      const apiResp = await apiService.socialLogin('facebook', accessToken, userType, userData);
      const mappedUser = { ...apiResp.user, type: apiResp.user?.userType ?? userType } as any;
      await loginWithToken(apiResp.token, mappedUser);
      onLogin(mappedUser.type);
    } catch (error) {
      Alert.alert('Erro', 'Falha no login com Facebook');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'Google' | 'Apple' | 'Facebook') => {
    setIsLoading(true);
    try {
      if (provider === 'Facebook') {
        setIsLoading(false);
        return await handleFacebookLogin();
      }
      const fakeToken = 'provider_token_demo';
      const fakeUserData = { id: 'prov_user_id_demo', name: `${provider} User`, email: `user@${provider.toLowerCase()}.com`, picture: undefined };
      await apiService.socialLogin(provider.toLowerCase(), fakeToken, userType, fakeUserData);
      await login(fakeUserData.email, 'social', userType);
      onLogin(userType);
    } catch (error) {
      Alert.alert('Erro', `Falha no login com ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.mutedForeground,
      textAlign: 'center',
    },
    userTypeContainer: {
      flexDirection: 'row',
      marginBottom: 32,
      backgroundColor: colors.muted,
      borderRadius: 12,
      padding: 4,
    },
    userTypeButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 8,
    },
    userTypeButtonActive: {
      backgroundColor: colors.primary,
    },
    userTypeText: {
      fontSize: 14,
      fontWeight: '600',
    },
    userTypeTextActive: {
      color: colors.primaryForeground,
    },
    userTypeTextInactive: {
      color: colors.mutedForeground,
    },
    form: {
      marginBottom: 24,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.input,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputIcon: {
      paddingLeft: 12,
    },
    input: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 12,
      fontSize: 16,
      color: colors.foreground,
    },
    passwordToggle: {
      paddingRight: 12,
    },
    loginButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
    },
    loginButtonText: {
      color: colors.primaryForeground,
      fontSize: 16,
      fontWeight: '600',
    },
    forgotPassword: {
      alignItems: 'center',
      marginBottom: 32,
    },
    forgotPasswordText: {
      color: colors.primary,
      fontSize: 14,
    },
    socialContainer: {
      marginBottom: 32,
    },
    socialTitle: {
      textAlign: 'center',
      color: colors.mutedForeground,
      marginBottom: 16,
      fontSize: 14,
    },
    socialButtons: {
      gap: 12,
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    socialButtonText: {
      marginLeft: 12,
      fontSize: 16,
      fontWeight: '500',
      color: colors.foreground,
    },
    signUpContainer: {
      alignItems: 'center',
    },
    signUpText: {
      color: colors.mutedForeground,
      fontSize: 14,
    },
    signUpLink: {
      color: colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons 
                name={userType === 'church' ? 'business' : 'person'} 
                size={40} 
                color={colors.primary} 
              />
            </View>
            <Text style={styles.title}>
              {userType === 'church' ? 'Acesso da Igreja' : 'Entrar na Comunidade'}
            </Text>
            <Text style={styles.subtitle}>
              {userType === 'church' 
                ? 'Gerencie sua comunidade de fé' 
                : 'Conecte-se com sua comunidade de fé'
              }
            </Text>
          </View>

          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'user' && styles.userTypeButtonActive
              ]}
              onPress={() => setUserType('user')}
            >
              <Text style={[
                styles.userTypeText,
                userType === 'user' ? styles.userTypeTextActive : styles.userTypeTextInactive
              ]}>
                Usuário
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'church' && styles.userTypeButtonActive
              ]}
              onPress={() => setUserType('church')}
            >
              <Text style={[
                styles.userTypeText,
                userType === 'church' ? styles.userTypeTextActive : styles.userTypeTextInactive
              ]}>
                Igreja
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons 
                  name="mail" 
                  size={20} 
                  color={colors.mutedForeground} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="seu@email.com"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWrapper}>
                <Ionicons 
                  name="lock-closed" 
                  size={20} 
                  color={colors.mutedForeground} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color={colors.mutedForeground} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleEmailLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Entrando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.socialContainer}>
            <Text style={styles.socialTitle}>Ou continue com</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Google')}
                disabled={isLoading}
              >
                <Ionicons name="logo-google" size={20} color="#4285F4" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Apple')}
                disabled={isLoading}
              >
                <Ionicons name="logo-apple" size={20} color={colors.foreground} />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('Facebook')}
                disabled={isLoading}
              >
                <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
              <Text 
                style={styles.signUpLink}
                onPress={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Entrar' : 'Criar conta grátis'}
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}