import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { apiService } from '../../services/api';

export function UserMapScreen() {
  const { colors } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [userLocation, setUserLocation] = useState<any>(null);
  const [selectedChurch, setSelectedChurch] = useState<any>(null);
  const [showChurchModal, setShowChurchModal] = useState(false);
  const [nextEvents, setNextEvents] = useState<any[]>([]);

  const [churches] = useState([
    {
      id: 1,
      name: 'Igreja Batista Central',
      address: 'Rua das Flores, 123 - Centro',
      denomination: 'Batista',
      phone: '(11) 99999-9999',
      coordinate: { latitude: -23.5505, longitude: -46.6333 },
      followers: 1234,
      nextEvent: { title: 'Culto Dominical', date: 'Hoje', time: '19:00' },
      isFollowing: true
    },
    {
      id: 2,
      name: 'Paróquia São José',
      address: 'Av. Principal, 456 - Vila Nova',
      denomination: 'Católica',
      phone: '(11) 88888-8888',
      coordinate: { latitude: -23.5525, longitude: -46.6355 },
      followers: 2341,
      nextEvent: { title: 'Missa Dominical', date: 'Amanhã', time: '08:00' },
      isFollowing: false
    },
    {
      id: 3,
      name: 'Igreja Assembleia de Deus',
      address: 'Rua da Paz, 789 - Jardim',
      denomination: 'Pentecostal',
      phone: '(11) 77777-7777',
      coordinate: { latitude: -23.5485, longitude: -46.6311 },
      followers: 856,
      nextEvent: { title: 'Culto de Oração', date: 'Hoje', time: '20:00' },
      isFollowing: true
    }
  ]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos da localização para mostrar igrejas próximas');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.error('Erro ao obter localização:', error);
    }
  };

  const handleMarkerPress = async (church: any) => {
    setSelectedChurch(church);
    setShowChurchModal(true);
    try {
      const res = await apiService.getEvents({ church: String(church.id), period: 'week', limit: 3 });
      const events = res?.events || res || [];
      setNextEvents(events.map((e: any) => ({
        id: e._id || e.id,
        title: e.title,
        date: e.date ? new Date(e.date).toLocaleDateString() : '',
        time: e.time || ''
      })));
    } catch (e) {
      setNextEvents([]);
    }
  };

  const handleFollowChurch = async (churchId: string | number) => {
    try {
      await apiService.followChurch(String(churchId));
      Alert.alert('Seguindo', 'Você receberá notificações desta igreja');
      setSelectedChurch((prev: any) => prev ? { ...prev, isFollowing: true } : prev);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível seguir agora');
    }
  };

  const handleUnfollowChurch = async (churchId: string | number) => {
    try {
      await apiService.unfollowChurch(String(churchId));
      Alert.alert('Parou de seguir', 'Você não receberá mais notificações desta igreja');
      setSelectedChurch((prev: any) => prev ? { ...prev, isFollowing: false } : prev);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível deixar de seguir agora');
    }
  };

  const openDirections = (church: any) => {
    Alert.alert(
      'Abrir Direções',
      `Abrir direções para ${church.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir', onPress: () => console.log('Abrindo direções para:', church.name) }
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
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 16,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.input,
      borderRadius: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchIcon: {
      marginRight: 12,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.foreground,
    },
    mapContainer: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
    locationButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: 50,
      height: 50,
      backgroundColor: colors.primary,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '70%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.foreground,
    },
    closeButton: {
      padding: 8,
    },
    churchInfo: {
      marginBottom: 20,
    },
    churchName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 8,
    },
    churchDetail: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    churchDetailText: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginLeft: 8,
    },
    nextEventCard: {
      backgroundColor: colors.primary + '10',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    nextEventTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
      marginBottom: 8,
    },
    nextEventDetails: {
      fontSize: 14,
      color: colors.foreground,
    },
    actionsContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    followButton: {
      backgroundColor: colors.primary,
    },
    directionsButton: {
      backgroundColor: colors.success,
    },
    actionButtonText: {
      color: 'white',
      fontWeight: '600',
      marginLeft: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mapa de Igrejas</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.mutedForeground} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar igrejas..."
            placeholderTextColor={colors.mutedForeground}
          />
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={userLocation || {
            latitude: -23.5505,
            longitude: -46.6333,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {churches.map((church) => (
            <Marker
              key={church.id}
              coordinate={church.coordinate}
              onPress={() => handleMarkerPress(church)}
            >
              <View style={{
                backgroundColor: colors.primary,
                padding: 8,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: 'white',
              }}>
                <Ionicons name="business" size={20} color="white" />
              </View>
              <Callout>
                <View style={{ width: 200 }}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>
                    {church.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666' }}>
                    {church.address}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        <TouchableOpacity 
          style={styles.locationButton}
          onPress={getCurrentLocation}
        >
          <Ionicons name="locate" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal de Detalhes da Igreja */}
      <Modal
        visible={showChurchModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowChurchModal(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes da Igreja</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowChurchModal(false)}
              >
                <Ionicons name="close" size={24} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            {selectedChurch && (
              <>
                <View style={styles.churchInfo}>
                  <Text style={styles.churchName}>{selectedChurch.name}</Text>
                  
                  <View style={styles.churchDetail}>
                    <Ionicons name="location" size={16} color={colors.mutedForeground} />
                    <Text style={styles.churchDetailText}>{selectedChurch.address}</Text>
                  </View>
                  
                  <View style={styles.churchDetail}>
                    <Ionicons name="call" size={16} color={colors.mutedForeground} />
                    <Text style={styles.churchDetailText}>{selectedChurch.phone}</Text>
                  </View>
                  
                  <View style={styles.churchDetail}>
                    <Ionicons name="people" size={16} color={colors.mutedForeground} />
                    <Text style={styles.churchDetailText}>
                      {selectedChurch.followers.toLocaleString()} seguidores
                    </Text>
                  </View>
                </View>

                <View style={styles.nextEventCard}>
                  <Text style={styles.nextEventTitle}>Próximos Eventos</Text>
                  {nextEvents.length === 0 ? (
                    <Text style={styles.nextEventDetails}>Sem eventos nos próximos dias</Text>
                  ) : (
                    nextEvents.map(ev => (
                      <Text key={ev.id} style={styles.nextEventDetails}>{ev.title} - {ev.date} {ev.time ? `às ${ev.time}` : ''}</Text>
                    ))
                  )}
                </View>

                <View style={styles.actionsContainer}>
                  {selectedChurch.isFollowing ? (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.followButton]}
                      onPress={() => handleUnfollowChurch(selectedChurch.id)}
                    >
                      <Ionicons name="heart" size={20} color="white" />
                      <Text style={styles.actionButtonText}>Seguindo</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.followButton]}
                      onPress={() => handleFollowChurch(selectedChurch.id)}
                    >
                      <Ionicons name="heart-outline" size={20} color="white" />
                      <Text style={styles.actionButtonText}>Seguir</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.directionsButton]}
                    onPress={() => openDirections(selectedChurch)}
                  >
                    <Ionicons name="navigate" size={20} color="white" />
                    <Text style={styles.actionButtonText}>Direções</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}