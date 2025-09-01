import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { VideoPlayer } from '../../components/VideoPlayer';

export function UserTransmissionsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [filter, setFilter] = useState('all'); // all, live, recorded
  
  const [transmissions] = useState([
    {
      id: 1,
      title: 'Culto Dominical - Ao Vivo',
      church: 'Igreja Batista Central',
      description: 'Transmissão ao vivo do culto dominical',
      thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=200&fit=crop',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      platform: 'youtube',
      isLive: true,
      viewers: 245,
      duration: null,
      createdAt: '2025-01-12T19:00:00Z'
    },
    {
      id: 2,
      title: 'Estudo Bíblico - João 3:16',
      church: 'Igreja Assembleia',
      description: 'Estudo sobre o amor de Deus',
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      platform: 'youtube',
      isLive: false,
      viewers: 89,
      duration: '45:30',
      createdAt: '2025-01-10T20:00:00Z'
    },
    {
      id: 3,
      title: 'Louvor e Adoração',
      church: 'Paróquia São José',
      description: 'Momento de louvor com o ministério',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
      url: 'https://www.facebook.com/watch?v=123456789',
      platform: 'facebook',
      isLive: false,
      viewers: 156,
      duration: '32:15',
      createdAt: '2025-01-08T19:30:00Z'
    },
    {
      id: 4,
      title: 'Oração da Manhã',
      church: 'Igreja Batista Central',
      description: 'Momento de oração matinal',
      thumbnail: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=300&h=200&fit=crop',
      url: 'https://www.instagram.com/tv/ABC123',
      platform: 'instagram',
      isLive: false,
      viewers: 67,
      duration: '15:45',
      createdAt: '2025-01-07T07:00:00Z'
    }
  ]);

  const filters = [
    { id: 'all', label: 'Todas', icon: 'list' },
    { id: 'live', label: 'Ao Vivo', icon: 'radio' },
    { id: 'recorded', label: 'Gravadas', icon: 'videocam' }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return 'logo-youtube';
      case 'facebook': return 'logo-facebook';
      case 'instagram': return 'logo-instagram';
      case 'tiktok': return 'logo-tiktok';
      default: return 'videocam';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'youtube': return '#FF0000';
      case 'facebook': return '#1877F2';
      case 'instagram': return '#E4405F';
      case 'tiktok': return '#000000';
      default: return colors.primary;
    }
  };

  const handleShare = (transmission: any) => {
    Alert.alert(
      'Compartilhar',
      `Compartilhar "${transmission.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Compartilhar', onPress: () => console.log('Compartilhando:', transmission) }
      ]
    );
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
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.foreground,
    },
    filtersContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
      flexDirection: 'row',
      alignItems: 'center',
    },
    filterButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.foreground,
      marginLeft: 6,
    },
    filterTextActive: {
      color: colors.primaryForeground,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    transmissionCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
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
    liveDot: {
      width: 8,
      height: 8,
      backgroundColor: 'white',
      borderRadius: 4,
    },
    platformIndicator: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: 'rgba(0,0,0,0.7)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
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
      marginBottom: 4,
    },
    transmissionChurch: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
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
      marginBottom: 12,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statText: {
      fontSize: 12,
      color: colors.mutedForeground,
      marginLeft: 6,
    },
    transmissionActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
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
    },
  });

  const filteredTransmissions = transmissions.filter(transmission => {
    if (filter === 'live') return transmission.isLive;
    if (filter === 'recorded') return !transmission.isLive;
    return true;
  });

  const renderTransmissionCard = ({ item }: { item: any }) => (
    <View style={styles.transmissionCard}>
      <TouchableOpacity 
        style={styles.thumbnailContainer}
        onPress={() => setSelectedVideo(item.url)}
      >
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        
        {item.isLive && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>AO VIVO</Text>
          </View>
        )}
        
        <View style={styles.platformIndicator}>
          <Ionicons 
            name={getPlatformIcon(item.platform)} 
            size={16} 
            color={getPlatformColor(item.platform)} 
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
        <Text style={styles.transmissionChurch}>{item.church}</Text>
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
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setSelectedVideo(item.url)}
          >
            <Ionicons name="play" size={16} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              Assistir
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleShare(item)}
          >
            <Ionicons name="share" size={16} color={colors.success} />
            <Text style={[styles.actionButtonText, { color: colors.success }]}>
              Compartilhar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={16} color={colors.gold} />
            <Text style={[styles.actionButtonText, { color: colors.gold }]}>
              Salvar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleShare = (transmission: any) => {
    Alert.alert(
      'Compartilhar',
      `Compartilhar "${transmission.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Compartilhar', onPress: () => console.log('Compartilhando:', transmission) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Transmissões</Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {filters.map((filterItem) => (
            <TouchableOpacity
              key={filterItem.id}
              style={[
                styles.filterButton,
                filter === filterItem.id && styles.filterButtonActive
              ]}
              onPress={() => setFilter(filterItem.id)}
            >
              <Ionicons 
                name={filterItem.icon as any} 
                size={16} 
                color={filter === filterItem.id ? colors.primaryForeground : colors.foreground} 
              />
              <Text style={[
                styles.filterText,
                filter === filterItem.id && styles.filterTextActive
              ]}>
                {filterItem.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {filteredTransmissions.length > 0 ? (
          <FlatList
            data={filteredTransmissions}
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
            <Text style={styles.emptyStateTitle}>Nenhuma transmissão encontrada</Text>
            <Text style={styles.emptyStateText}>
              Siga algumas igrejas para ver suas transmissões
            </Text>
          </View>
        )}
      </View>

      {selectedVideo && (
        <VideoPlayer
          url={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </SafeAreaView>
  );
}