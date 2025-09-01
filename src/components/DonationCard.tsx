import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface DonationCardProps {
  campaign: {
    id: string;
    title: string;
    description: string;
    goal: number;
    raised: number;
    endDate: string;
    church: {
      name: string;
      profileImage?: string;
    };
    images?: string[];
    status: string;
    category: string;
  };
  onDonate: () => void;
  showChurchInfo?: boolean;
}

export function DonationCard({ campaign, onDonate, showChurchInfo = true }: DonationCardProps) {
  const { colors } = useTheme();

  const progress = (campaign.raised / campaign.goal) * 100;
  const remaining = campaign.goal - campaign.raised;
  const daysRemaining = Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'construction': return 'hammer';
      case 'social': return 'people';
      case 'mission': return 'airplane';
      case 'equipment': return 'hardware-chip';
      case 'emergency': return 'alert-circle';
      default: return 'heart';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'construction': return 'Reforma';
      case 'social': return 'Ação Social';
      case 'mission': return 'Missão';
      case 'equipment': return 'Equipamentos';
      case 'emergency': return 'Emergência';
      default: return 'Geral';
    }
  };

  const handleDonate = () => {
    if (campaign.status !== 'active') {
      Alert.alert('Campanha Indisponível', 'Esta campanha não está mais ativa');
      return;
    }

    if (daysRemaining <= 0) {
      Alert.alert('Campanha Encerrada', 'O prazo para doações já expirou');
      return;
    }

    onDonate();
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    imageContainer: {
      height: 160,
      backgroundColor: colors.muted,
      position: 'relative',
    },
    campaignImage: {
      width: '100%',
      height: '100%',
    },
    imagePlaceholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoryBadge: {
      position: 'absolute',
      top: 12,
      left: 12,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.7)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    categoryText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '500',
      marginLeft: 4,
    },
    statusBadge: {
      position: 'absolute',
      top: 12,
      right: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
      color: 'white',
    },
    content: {
      padding: 16,
    },
    header: {
      marginBottom: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      color: colors.mutedForeground,
      lineHeight: 20,
    },
    churchInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    churchAvatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.muted,
      marginRight: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    churchName: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '500',
    },
    progressContainer: {
      marginBottom: 16,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    progressLabel: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
    progressValue: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.foreground,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.muted,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.success,
    },
    progressText: {
      fontSize: 12,
      color: colors.mutedForeground,
      textAlign: 'center',
      marginTop: 8,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    footerInfo: {
      flex: 1,
    },
    remainingText: {
      fontSize: 12,
      color: colors.mutedForeground,
      marginBottom: 2,
    },
    daysText: {
      fontSize: 12,
      color: colors.warning,
      fontWeight: '500',
    },
    donateButton: {
      backgroundColor: colors.success,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    donateButtonDisabled: {
      backgroundColor: colors.muted,
    },
    donateButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 6,
    },
    donateButtonTextDisabled: {
      color: colors.mutedForeground,
    },
  });

  return (
    <View style={styles.card}>
      {/* Image */}
      <View style={styles.imageContainer}>
        {campaign.images && campaign.images.length > 0 ? (
          <Image source={{ uri: campaign.images[0] }} style={styles.campaignImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="heart" size={48} color={colors.mutedForeground} />
          </View>
        )}
        
        <View style={styles.categoryBadge}>
          <Ionicons 
            name={getCategoryIcon(campaign.category)} 
            size={12} 
            color="white" 
          />
          <Text style={styles.categoryText}>
            {getCategoryLabel(campaign.category)}
          </Text>
        </View>
        
        <View style={[
          styles.statusBadge,
          { backgroundColor: campaign.status === 'active' ? colors.success : colors.muted }
        ]}>
          <Text style={styles.statusText}>
            {campaign.status === 'active' ? 'Ativa' : 
             campaign.status === 'completed' ? 'Concluída' : 'Encerrada'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{campaign.title}</Text>
          <Text style={styles.description}>{campaign.description}</Text>
        </View>

        {/* Church Info */}
        {showChurchInfo && (
          <View style={styles.churchInfo}>
            <View style={styles.churchAvatar}>
              {campaign.church.profileImage ? (
                <Image source={{ uri: campaign.church.profileImage }} style={styles.churchAvatar} />
              ) : (
                <Ionicons name="business" size={12} color={colors.mutedForeground} />
              )}
            </View>
            <Text style={styles.churchName}>{campaign.church.name}</Text>
          </View>
        )}

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progresso</Text>
            <Text style={styles.progressValue}>{progress.toFixed(0)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill,
              { width: `${Math.min(progress, 100)}%` }
            ]} />
          </View>
          <Text style={styles.progressText}>
            R$ {campaign.raised.toLocaleString()} de R$ {campaign.goal.toLocaleString()}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <Text style={styles.remainingText}>
              Faltam R$ {remaining.toLocaleString()}
            </Text>
            <Text style={styles.daysText}>
              {daysRemaining > 0 ? `${daysRemaining} dias restantes` : 'Encerrada'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.donateButton,
              (campaign.status !== 'active' || daysRemaining <= 0) && styles.donateButtonDisabled
            ]}
            onPress={handleDonate}
            disabled={campaign.status !== 'active' || daysRemaining <= 0}
          >
            <Ionicons 
              name="heart" 
              size={16} 
              color={campaign.status === 'active' && daysRemaining > 0 ? 'white' : colors.mutedForeground} 
            />
            <Text style={[
              styles.donateButtonText,
              (campaign.status !== 'active' || daysRemaining <= 0) && styles.donateButtonTextDisabled
            ]}>
              {campaign.status === 'active' && daysRemaining > 0 ? 'Doar' : 'Encerrada'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}