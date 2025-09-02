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
import { useAuth } from '../contexts/AuthContext';

interface RaffleCardProps {
  raffle: {
    id: string;
    title: string;
    prize: string;
    prizeImage?: string;
    ticketPrice: number;
    totalTickets: number;
    soldTickets: number;
    endDate: string;
    church: {
      name: string;
      profileImage?: string;
    };
    status: string;
  };
  onPress: () => void;
  showChurchInfo?: boolean;
}

export function RaffleCard({ raffle, onPress, showChurchInfo = true }: RaffleCardProps) {
  const { colors } = useTheme();
  const { user } = useAuth();

  const progress = (raffle.soldTickets / raffle.totalTickets) * 100;
  const remainingTickets = raffle.totalTickets - raffle.soldTickets;
  const daysRemaining = Math.ceil((new Date(raffle.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const getStatusColor = () => {
    switch (raffle.status) {
      case 'active': return colors.success;
      case 'sold_out': return colors.warning;
      case 'drawn': return colors.primary;
      case 'cancelled': return colors.destructive;
      default: return colors.mutedForeground;
    }
  };

  const getStatusText = () => {
    switch (raffle.status) {
      case 'active': return 'Ativa';
      case 'sold_out': return 'Esgotada';
      case 'drawn': return 'Sorteada';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconhecido';
    }
  };

  const handlePress = () => {
    if (raffle.status !== 'active') {
      Alert.alert('Rifa Indisponível', 'Esta rifa não está mais disponível para compra');
      return;
    }

    if (!user?.isPremium && user?.type === 'user') {
      Alert.alert(
        'Recurso Premium',
        'Participar de rifas é um recurso premium. Faça upgrade para participar!',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ver Planos', onPress: () => console.log('Mostrar planos premium') }
        ]
      );
      return;
    }

    onPress();
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
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: 16,
      paddingBottom: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.foreground,
      flex: 1,
      marginRight: 12,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
    },
    churchInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 12,
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
    prizeContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    prizeImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      backgroundColor: colors.muted,
      marginRight: 12,
    },
    prizeInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    prizeTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: 4,
    },
    prizePrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.success,
      marginBottom: 4,
    },
    prizeTickets: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
    progressContainer: {
      paddingHorizontal: 16,
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
      height: 6,
      backgroundColor: colors.muted,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.success,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
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
    buyButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    buyButtonDisabled: {
      backgroundColor: colors.muted,
    },
    buyButtonText: {
      color: colors.primaryForeground,
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 6,
    },
    buyButtonTextDisabled: {
      color: colors.mutedForeground,
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{raffle.title}</Text>
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
      </View>

      {/* Church Info */}
      {showChurchInfo && (
        <View style={styles.churchInfo}>
          <View style={styles.churchAvatar}>
            {raffle.church.profileImage ? (
              <Image source={{ uri: raffle.church.profileImage }} style={styles.churchAvatar} />
            ) : (
              <Ionicons name="business" size={12} color={colors.mutedForeground} />
            )}
          </View>
          <Text style={styles.churchName}>{raffle.church.name}</Text>
        </View>
      )}

      {/* Prize */}
      <View style={styles.prizeContainer}>
        <View style={styles.prizeImage}>
          {raffle.prizeImage ? (
            <Image source={{ uri: raffle.prizeImage }} style={styles.prizeImage} />
          ) : (
            <View style={[styles.prizeImage, { justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="gift" size={32} color={colors.mutedForeground} />
            </View>
          )}
        </View>
        
        <View style={styles.prizeInfo}>
          <Text style={styles.prizeTitle}>{raffle.prize}</Text>
          <Text style={styles.prizePrice}>
            R$ {raffle.ticketPrice.toFixed(2).replace('.', ',')}
          </Text>
          <Text style={styles.prizeTickets}>
            {remainingTickets} de {raffle.totalTickets} disponíveis
          </Text>
        </View>
      </View>

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
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.remainingText}>
            {remainingTickets} bilhetes restantes
          </Text>
          <Text style={styles.daysText}>
            {daysRemaining > 0 ? `${daysRemaining} dias restantes` : 'Encerrada'}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.buyButton,
            raffle.status !== 'active' && styles.buyButtonDisabled
          ]}
          onPress={handlePress}
          disabled={raffle.status !== 'active'}
        >
          <Ionicons 
            name="ticket" 
            size={16} 
            color={raffle.status === 'active' ? colors.primaryForeground : colors.mutedForeground} 
          />
          <Text style={[
            styles.buyButtonText,
            raffle.status !== 'active' && styles.buyButtonTextDisabled
          ]}>
            {raffle.status === 'active' ? 'Comprar' : 'Indisponível'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}