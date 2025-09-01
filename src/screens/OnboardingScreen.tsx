import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      title: 'Bem-vindo ao ConnectFé',
      subtitle: 'Conectando corações e comunidades de fé',
      description: 'Uma plataforma completa para igrejas e fiéis se conectarem, compartilharem e crescerem juntos na fé.',
      image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=300&fit=crop',
      icon: 'heart'
    },
    {
      title: 'Para Igrejas',
      subtitle: 'Gerencie sua comunidade',
      description: 'Dashboard completo, gestão de eventos, transmissões ao vivo, sistema de doações e muito mais.',
      image: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=400&h=300&fit=crop',
      icon: 'business'
    },
    {
      title: 'Para Fiéis',
      subtitle: 'Conecte-se com sua fé',
      description: 'Encontre igrejas próximas, participe de eventos, acompanhe transmissões e fortaleça sua comunidade.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
      icon: 'people'
    },
    {
      title: 'Recursos Premium',
      subtitle: 'Desbloqueie todo o potencial',
      description: 'Funcionalidades avançadas como rifas, relatórios detalhados, transmissões HD e muito mais.',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
      icon: 'star'
    }
  ];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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
    },
    imageContainer: {
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 40,
    },
    image: {
      width: width - 80,
      height: 200,
      borderRadius: 16,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    textContainer: {
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.foreground,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 18,
      color: colors.primary,
      textAlign: 'center',
      marginBottom: 16,
      fontWeight: '600',
    },
    description: {
      fontSize: 16,
      color: colors.mutedForeground,
      textAlign: 'center',
      lineHeight: 24,
    },
    footer: {
      paddingHorizontal: 24,
      paddingBottom: 40,
    },
    progressContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 32,
    },
    progressDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    button: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      marginHorizontal: 8,
    },
    primaryButtonText: {
      color: colors.primaryForeground,
    },
    secondaryButtonText: {
      color: colors.foreground,
    },
  });

  const currentStepData = onboardingSteps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={currentStepData.icon as any} 
              size={40} 
              color={colors.primaryForeground} 
            />
          </View>
          <Image 
            source={{ uri: currentStepData.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentStepData.title}</Text>
          <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>
          <Text style={styles.description}>{currentStepData.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                {
                  backgroundColor: index <= currentStep ? colors.primary : colors.border
                }
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentStep > 0 ? (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={prevStep}
            >
              <Ionicons name="chevron-back" size={20} color={colors.foreground} />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Voltar
              </Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={nextStep}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              {currentStep === onboardingSteps.length - 1 ? 'Começar' : 'Próximo'}
            </Text>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={colors.primaryForeground} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}