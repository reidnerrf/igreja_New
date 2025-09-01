import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface PrayerCardProps {
  prayer: {
    id: string;
    title?: string;
    content: string;
    author: {
      name: string;
      profileImage?: string;
    };
    category: string;
    isAnonymous: boolean;
    isUrgent: boolean;
    status: string;
    prayers: number;
    createdAt: string;
    hasPrayed?: boolean;
  };
  onPray: (prayerId: string) => void;
  onModerate?: (prayerId: string, action: 'approve' | 'reject') => void;
  showModerationActions?: boolean;
}

export function PrayerCard({ 
  prayer, 
  onPray, 
  onModerate, 
  showModerationActions = false 
}: PrayerCardProps) {
  const { colors } = useTheme();
  const { user } = useAuth();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personal': return 'person';
      case 'family': return 'people';
      case 'health': return 'medical';
      case 'work': return 'briefcase';
      case 'gratitude': return 'heart';
      case 'community': return 'home';
      default: return 'heart';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'personal': return 'Pessoal';
      case 'family': return 'Família';
      case 'health': return 'Saúde';
      case 'work': return 'Trabalho';
      case 'gratitude': return 'Gratidão';
      case 'community': return 'Comunidade';
      default: return 'Geral';
    }
  };

  const getStatusColor = () => {
    switch (prayer.status) {
      case 'approved': return colors.success;
      case 'pending': return colors.warning;
      case 'in_prayer': return colors.primary;
      case 'answered': return colors.gold;
      case 'rejected': return colors.destructive;
      default: return colors.mutedForeground;
    }
  };

  const getStatusText = () => {
    switch (prayer.status) {
      case 'approved': return 'Aprovado';
      case 'pending': return 'Pendente';
      case 'in_prayer': return 'Em oração';
      case 'answered': return 'Atendido';
      case 'rejected': return 'Rejeitado';
      default: return 'Desconhecido';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const prayerDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - prayerDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return prayerDate.toLocaleDateString();
  };

  const handlePray = () => {
    if (prayer.hasPrayed) {
      Alert.alert('Já orou', 'Você já orou por este pedido');
      return;
    }
    
    Alert.alert(
      'Orar por este pedido',
      'Deseja adicionar este pedido às suas orações?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Orar', onPress: () => onPray(prayer.id) }
      ]
    );
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    urgentCard: {
      borderColor: colors.destructive,
      borderWidth: 2,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    headerLeft: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 4,
    },
    authorInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    authorName: {
      fontSize: 12,
      color: colors.mutedForeground,
      marginRight: 8,
    },
    categoryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '10',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    categoryText: {
      fontSize: 10,
      color: colors.primary,
      fontWeight: '500',
      marginLeft: 4,
    },
    statusContainer: {
      alignItems: 'flex-end',
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginBottom: 4,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
    },
    timestamp: {
      fontSize: 10,
      color: colors.mutedForeground,
    },
    urgentIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.destructive + '10',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginBottom: 8,
      alignSelf: 'flex-start',
    },
    urgentText: {
      fontSize: 12,
      color: colors.destructive,
      fontWeight: 'bold',
      marginLeft: 4,
    },
    content: {
      marginBottom: 16,
    },
    contentText: {
      fontSize: 14,
      color: colors.foreground,
      lineHeight: 20,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    prayButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    prayButtonPrayed: {
      backgroundColor: colors.success,
    },
    prayButtonText: {
      color: colors.primaryForeground,
      fontSize: 12,
      fontWeight: '500',
      marginLeft: 6,
    },
    prayCount: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    prayCountText: {
      fontSize: 12,
      color: colors.mutedForeground,
      marginLeft: 6,
    },
    moderationActions: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    moderationButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      borderRadius: 6,
    },
    approveButton: {
      backgroundColor: colors.success + '20',
    },
    rejectButton: {
      backgroundColor: colors.destructive + '20',
    },
    moderationButtonText: {
      fontSize: 12,
      fontWeight: '500',
      marginLeft: 6,
    },
  });

  return (
    <View style={[
      styles.card,
      prayer.isUrgent && styles.urgentCard
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {prayer.title && (
            <Text style={styles.title}>{prayer.title}</Text>
          )}
          
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>
              {prayer.isAnonymous ? 'Anônimo' : prayer.author.name}
            </Text>
            <View style={styles.categoryBadge}>
              <Ionicons 
                name={getCategoryIcon(prayer.category)} 
                size={10} 
                color={colors.primary} 
              />
              <Text style={styles.categoryText}>
                {getCategoryLabel(prayer.category)}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor() + '20' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: getStatusColor() }
            ]}>
              {getStatusText()}
            </Text>
          </View>
          <Text style={styles.timestamp}>{formatTimeAgo(prayer.createdAt)}</Text>
        </View>
      </View>

      {/* Urgent Indicator */}
      {prayer.isUrgent && (
        <View style={styles.urgentIndicator}>
          <Ionicons name="alert-circle" size={12} color={colors.destructive} />
          <Text style={styles.urgentText}>URGENTE</Text>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.contentText}>{prayer.content}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.prayButton,
            prayer.hasPrayed && styles.prayButtonPrayed
          ]}
          onPress={handlePray}
          disabled={prayer.hasPrayed}
        >
          <Ionicons 
            name={prayer.hasPrayed ? 'checkmark' : 'heart'} 
            size={16} 
            color={colors.primaryForeground} 
          />
          <Text style={styles.prayButtonText}>
            {prayer.hasPrayed ? 'Orando' : 'Orar'}
          </Text>
        </TouchableOpacity>

        <View style={styles.prayCount}>
          <Ionicons name="people" size={16} color={colors.mutedForeground} />
          <Text style={styles.prayCountText}>
            {prayer.prayers} {prayer.prayers === 1 ? 'pessoa orando' : 'pessoas orando'}
          </Text>
        </View>
      </View>

      {/* Moderation Actions */}
      {showModerationActions && prayer.status === 'pending' && onModerate && (
        <View style={styles.moderationActions}>
          <TouchableOpacity
            style={[styles.moderationButton, styles.approveButton]}
            onPress={() => onModerate(prayer.id, 'approve')}
          >
            <Ionicons name="checkmark" size={16} color={colors.success} />
            <Text style={[
              styles.moderationButtonText,
              { color: colors.success }
            ]}>
              Aprovar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.moderationButton, styles.rejectButton]}
            onPress={() => onModerate(prayer.id, 'reject')}
          >
            <Ionicons name="close" size={16} color={colors.destructive} />
            <Text style={[
              styles.moderationButtonText,
              { color: colors.destructive }
            ]}>
              Rejeitar
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}