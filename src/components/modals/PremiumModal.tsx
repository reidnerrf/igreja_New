import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  userType: 'church' | 'user';
  onUpgrade: () => void;
}

export function PremiumModal({ visible, onClose, userType, onUpgrade }: PremiumModalProps) {
  const { colors } = useTheme();

  const churchFeatures = [
    { icon: 'gift', title: 'Rifas Ilimitadas', description: 'Crie quantas rifas quiser' },
    { icon: 'bar-chart', title: 'Relatórios Avançados', description: 'Analytics detalhados' },
    { icon: 'videocam', title: 'Transmissão Nativa', description: 'Transmita direto pelo app' },
    { icon: 'people', title: 'Gestão de Membros', description: 'Sistema completo de membros' },
    { icon: 'megaphone', title: 'Campanhas Especiais', description: 'Campanhas avançadas de doação' },
    { icon: 'cloud-upload', title: 'Upload Ilimitado', description: 'Sem limite de fotos e vídeos' },
  ];

  const userFeatures = [
    { icon: 'gift', title: 'Acesso a Rifas', description: 'Participe de todas as rifas' },
    { icon: 'book', title: 'Devocionais Premium', description: 'Conteúdo exclusivo diário' },
    { icon: 'camera', title: 'Posts Ilimitados', description: 'Poste sem limitações' },
    { icon: 'notifications', title: 'Notificações Personalizadas', description: 'Alertas customizados' },
    { icon: 'star', title: 'Conteúdo Exclusivo', description: 'Acesso a transmissões especiais' },
    { icon: 'analytics', title: 'Histórico Avançado', description: 'Relatórios de participação' },
  ];

  const features = userType === 'church' ? churchFeatures : userFeatures;
  const price = userType === 'church' ? 'R$ 49,90/mês' : 'R$ 19,90/mês';

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: '90%',
      maxHeight: '85%',
      backgroundColor: colors.card,
      borderRadius: 20,
      overflow: 'hidden',
    },
    header: {
      backgroundColor: `linear-gradient(135deg, ${colors.primary}, ${colors.gold})`,
      padding: 20,
      alignItems: 'center',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: 16,
      right: 16,
      padding: 8,
    },
    crownIcon: {
      marginBottom: 12,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: 'rgba(255,255,255,0.9)',
      textAlign: 'center',
    },
    price: {
      fontSize: 32,
      fontWeight: 'bold',
      color: 'white',
      marginTop: 12,
    },
    priceSubtext: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.8)',
    },
    content: {
      padding: 20,
    },
    featuresTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 16,
      textAlign: 'center',
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    featureIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    featureContent: {
      flex: 1,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: 4,
    },
    featureDescription: {
      fontSize: 14,
      color: colors.mutedForeground,
    },
    footer: {
      padding: 20,
      paddingTop: 0,
    },
    upgradeButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 12,
    },
    upgradeButtonText: {
      color: colors.primaryForeground,
      fontSize: 18,
      fontWeight: 'bold',
    },
    cancelButton: {
      paddingVertical: 12,
      alignItems: 'center',
    },
    cancelButtonText: {
      color: colors.mutedForeground,
      fontSize: 16,
    },
    trialText: {
      textAlign: 'center',
      fontSize: 12,
      color: colors.mutedForeground,
      marginBottom: 16,
    },
  });

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modal}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <Ionicons name="diamond" size={48} color="white" style={styles.crownIcon} />
            <Text style={styles.headerTitle}>ConnectFé Premium</Text>
            <Text style={styles.headerSubtitle}>
              Desbloqueie todo o potencial da sua {userType === 'church' ? 'igreja' : 'experiência'}
            </Text>
            <Text style={styles.price}>{price}</Text>
            <Text style={styles.priceSubtext}>Cancele quando quiser</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.featuresTitle}>O que você ganha:</Text>
            
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon as any} size={20} color={colors.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.trialText}>
              Experimente grátis por 7 dias, depois {price}
            </Text>
            
            <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
              <Text style={styles.upgradeButtonText}>Começar Teste Grátis</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Talvez mais tarde</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}