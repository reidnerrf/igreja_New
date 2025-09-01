import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { VideoPlayer } from '../../components/VideoPlayer';
import { CreateTransmissionModal } from '../../components/modals/CreateTransmissionModal';
import { useTransmissions } from '../../hooks/useApi';
import { apiService } from '../../services/api';

export function ChurchTransmissionsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  const { data: transmissionsData, loading, error, refetch } = useTransmissions();
  const transmissions = transmissionsData || [];

  const handleCreateTransmission = () => {
    if (!user?.isPremium) {
      Alert.alert(
        'Recurso Premium',
        'Transmissões nativas são um recurso premium. Faça upgrade para acessar.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ver Planos', onPress: () => console.log('Mostrar planos premium') }
        ]
      );
      return;
    }
    setShowCreateModal(true);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return 'logo-youtube';
      case 'facebook': return 'logo-facebook';
      case 'instagram': return 'logo-instagram';
      case 'tiktok': return 'logo-tiktok';
      default: return 'videocam';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.card,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.foreground,
    },
    createButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    createButtonText: {
      color: colors.primaryForeground,
      fontWeight: '600',
      marginLeft: 8,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    transmissionCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    thumbnailContainer: {
      position: 'relative',
      height: 200,
      backgroundColor: colors.muted,
    },
    thumbnail: {
      width: '100%',
      height: '100%',
    },
    liveIndicator: {
      position: 'absolute',
      top: 12,
      left: 12,
      backgroundColor: colors.destructive,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
    },
    liveText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
      marginLeft: 4,
    },
    platformIndicator: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: 'rgba(0,0,0,0.7)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    duration: {
      position: 'absolute',
      bottom: 12,
      right: 12,
      backgroundColor: 'rgba(0,0,0,0.7)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    durationText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '500',
    },
    playButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -25 }, { translateY: -25 }],
      width: 50,
      height: 50,
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardContent: {
      padding: 16,
    },
    transmissionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 8,
    },
    transmissionDescription: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginBottom: 12,
    },
    transmissionStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statText: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginLeft: 6,
    },
    transmissionActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    actionButtonText: {
      fontSize: 12,
      fontWeight: '500',
      marginLeft: 6,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyStateIcon: {
      marginBottom: 16,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 8,
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.mutedForeground,
      textAlign: 'center',
      marginBottom: 24,
    },
  });

  const renderTransmissionCard = ({ item }: { item: any }) => (
    <View style={styles.transmissionCard}>
      <TouchableOpacity 
        style={styles.thumbnailContainer}
        onPress={() => setSelectedVideo(item.url)}
      >
        <View style={styles.thumbnail}>
          {/* Placeholder para thumbnail */}
          <View style={{ 
            flex: 1, 
            backgroundColor: colors.muted,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Ionicons name="videocam" size={48} color={colors.mutedForeground} />
          </View>
        </View>
        
        {item.isLive && (
          <View style={styles.liveIndicator}>
            <View style={{
              width: 8,
              height: 8,
              backgroundColor: 'white',
              borderRadius: 4,
            }} />
            <Text style={styles.liveText}>AO VIVO</Text>
          </View>
        )}
        
        <View style={styles.platformIndicator}>
          <Ionicons 
            name={getPlatformIcon(item.platform)} 
            size={16} 
            color="white" 
          />
        </View>
        
        {item.duration && (
          <View style={styles.duration}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
        )}
        
        {!item.isLive && (
          <View style={styles.playButton}>
            <Ionicons name="play" size={24} color="white" />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <Text style={styles.transmissionTitle}>{item.title}</Text>
        <Text style={styles.transmissionDescription}>{item.description}</Text>
        
        <View style={styles.transmissionStats}>
          <View style={styles.statItem}>
            <Ionicons name="eye" size={16} color={colors.mutedForeground} />
            <Text style={styles.statText}>
              {item.viewers} {item.isLive ? 'assistindo' : 'visualizações'}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="time" size={16} color={colors.mutedForeground} />
            <Text style={styles.statText}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.transmissionActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create" size={16} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}> 
              Editar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share" size={16} color={colors.success} />
            <Text style={[styles.actionButtonText, { color: colors.success }]}>
              Compartilhar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="analytics" size={16} color={colors.gold} />
            <Text style={[styles.actionButtonText, { color: colors.gold }]}>
              Estatísticas
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Transmissões</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateTransmission}
          >
            <Ionicons name="add" size={20} color={colors.primaryForeground} />
            <Text style={styles.createButtonText}>Nova</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {transmissions.length > 0 ? (
          <FlatList
            data={transmissions}
            renderItem={renderTransmissionCard}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons 
              name="videocam-outline" 
              size={64} 
              color={colors.mutedForeground}
              style={styles.emptyStateIcon}
            />
            <Text style={styles.emptyStateTitle}>Nenhuma transmissão</Text>
            <Text style={styles.emptyStateText}>
              Crie sua primeira transmissão para alcançar mais pessoas
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateTransmission}
            >
              <Ionicons name="add" size={20} color={colors.primaryForeground} />
              <Text style={styles.createButtonText}>Nova Transmissão</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <CreateTransmissionModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={async (transmissionData) => {
          await apiService.createTransmission(transmissionData);
          setShowCreateModal(false);
          refetch();
        }}
      />

      {selectedVideo && (
        <VideoPlayer
          url={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </SafeAreaView>
  );
}