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

export function UserEventsScreen() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState('all');
  
  const [events] = useState([
    {
      id: 1,
      title: 'Culto Dominical',
      church: 'Igreja Batista Central',
      description: 'Culto de adoração e palavra',
      date: '2025-01-12',
      time: '19:00',
      category: 'culto',
      image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=200&fit=crop',
      attendees: 350,
      isConfirmed: true,
      address: 'Rua das Flores, 123'
    },
    {
      id: 2,
      title: 'Estudo Bíblico',
      church: 'Igreja Assembleia',
      description: 'Estudo do livro de João',
      date: '2025-01-14',
      time: '20:00',
      category: 'estudo',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
      attendees: 80,
      isConfirmed: false,
      address: 'Av. Principal, 456'
    },
    {
      id: 3,
      title: 'Festa Junina',
      church: 'Paróquia São José',
      description: 'Festa tradicional com comidas típicas',
      date: '2025-01-20',
      time: '18:00',
      category: 'festa',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=200&fit=crop',
      attendees: 500,
      isConfirmed: true,
      address: 'Rua da Igreja, 789'
    }
  ]);

  const filters = [
    { id: 'all', label: 'Todos', icon: 'list' },
    { id: 'today', label: 'Hoje', icon: 'today' },
    { id: 'week', label: 'Semana', icon: 'calendar' },
    { id: 'confirmed', label: 'Confirmados', icon: 'checkmark-circle' }
  ];

  const handleConfirmAttendance = (eventId: number) => {
    Alert.alert(
      'Confirmar Presença',
      'Deseja confirmar sua presença neste evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => console.log('Confirmando presença:', eventId) }
      ]
    );
  };

  const addToCalendar = (event: any) => {
    Alert.alert(
      'Adicionar ao Calendário',
      `Adicionar "${event.title}" ao calendário do dispositivo?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Adicionar', onPress: () => console.log('Adicionando ao calendário:', event) }
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
    eventCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    eventImage: {
      width: '100%',
      height: 160,
      backgroundColor: colors.muted,
    },
    eventContent: {
      padding: 16,
    },
    eventHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    eventTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.foreground,
      flex: 1,
      marginRight: 12,
    },
    confirmationBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    confirmationBadgeConfirmed: {
      backgroundColor: colors.success + '20',
    },
    confirmationBadgePending: {
      backgroundColor: colors.warning + '20',
    },
    confirmationText: {
      fontSize: 12,
      fontWeight: '500',
    },
    confirmationTextConfirmed: {
      color: colors.success,
    },
    confirmationTextPending: {
      color: colors.warning,
    },
    eventChurch: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
      marginBottom: 4,
    },
    eventDescription: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginBottom: 12,
    },
    eventDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    eventDetail: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventDetailText: {
      fontSize: 12,
      color: colors.mutedForeground,
      marginLeft: 6,
    },
    eventActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    confirmButton: {
      backgroundColor: colors.primary,
    },
    calendarButton: {
      backgroundColor: colors.success,
    },
    shareButton: {
      backgroundColor: colors.gold,
    },
    actionButtonText: {
      color: 'white',
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

  const renderEventCard = ({ item }: { item: any }) => (
    <View style={styles.eventCard}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <View style={[
            styles.confirmationBadge,
            item.isConfirmed ? styles.confirmationBadgeConfirmed : styles.confirmationBadgePending
          ]}>
            <Text style={[
              styles.confirmationText,
              item.isConfirmed ? styles.confirmationTextConfirmed : styles.confirmationTextPending
            ]}>
              {item.isConfirmed ? 'Confirmado' : 'Pendente'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.eventChurch}>{item.church}</Text>
        <Text style={styles.eventDescription}>{item.description}</Text>
        
        <View style={styles.eventDetails}>
          <View style={styles.eventDetail}>
            <Ionicons name="calendar" size={16} color={colors.mutedForeground} />
            <Text style={styles.eventDetailText}>{item.date} às {item.time}</Text>
          </View>
          
          <View style={styles.eventDetail}>
            <Ionicons name="location" size={16} color={colors.mutedForeground} />
            <Text style={styles.eventDetailText}>{item.address}</Text>
          </View>
        </View>

        <View style={styles.eventActions}>
          {!item.isConfirmed && (
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={() => handleConfirmAttendance(item.id)}
            >
              <Ionicons name="checkmark" size={16} color="white" />
              <Text style={styles.actionButtonText}>Confirmar</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.actionButton, styles.calendarButton]}
            onPress={() => addToCalendar(item)}
          >
            <Ionicons name="calendar" size={16} color="white" />
            <Text style={styles.actionButtonText}>Calendário</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
          >
            <Ionicons name="share" size={16} color="white" />
            <Text style={styles.actionButtonText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minha Agenda</Text>
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
        {events.length > 0 ? (
          <FlatList
            data={events}
            renderItem={renderEventCard}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons 
              name="calendar-outline" 
              size={64} 
              color={colors.mutedForeground}
              style={styles.emptyStateIcon}
            />
            <Text style={styles.emptyStateTitle}>Nenhum evento encontrado</Text>
            <Text style={styles.emptyStateText}>
              Siga algumas igrejas para ver eventos em sua agenda
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}