import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { CreateEventModal } from '../../components/modals/CreateEventModal';
import { useEvents } from '../../hooks/useApi';
import { apiService } from '../../services/api';

export function ChurchEventsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, today, week, month
  
  const { data: eventsData, loading, error, refetch } = useEvents({ filter });
  const events = eventsData || [];

  const filters = [
    { id: 'all', label: 'Todos', icon: 'list' },
    { id: 'today', label: 'Hoje', icon: 'today' },
    { id: 'week', label: 'Semana', icon: 'calendar' },
    { id: 'month', label: 'Mês', icon: 'calendar-outline' }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'culto': return colors.primary;
      case 'estudo': return colors.success;
      case 'jovens': return colors.gold;
      default: return colors.mutedForeground;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return colors.success;
      case 'pending': return colors.warning;
      case 'cancelled': return colors.destructive;
      default: return colors.mutedForeground;
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
      marginBottom: 16,
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
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    eventCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    eventTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.foreground,
      flex: 1,
      marginRight: 12,
    },
    eventStatus: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    eventStatusText: {
      fontSize: 12,
      fontWeight: '500',
    },
    eventDescription: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginBottom: 12,
    },
    eventDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    eventDateTime: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventDateTimeText: {
      fontSize: 14,
      color: colors.foreground,
      marginLeft: 6,
    },
    eventAttendees: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventAttendeesText: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginLeft: 6,
    },
    eventActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      marginHorizontal: 4,
      borderRadius: 6,
    },
    editButton: {
      backgroundColor: colors.primary + '20',
    },
    deleteButton: {
      backgroundColor: colors.destructive + '20',
    },
    shareButton: {
      backgroundColor: colors.success + '20',
    },
    actionButtonText: {
      fontSize: 12,
      fontWeight: '500',
      marginTop: 4,
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

  const handleCreate = async (eventData: any) => {
  	await apiService.createEvent(eventData);
  	setShowCreateModal(false);
  	refetch();
  };

  const handleEdit = async (item: any) => {
  	await apiService.updateEvent(item.id, { ...item });
  	refetch();
  };

  const handleDelete = async (item: any) => {
  	await apiService.deleteEvent(item.id);
  	refetch();
  };

  const renderEventCard = ({ item }: { item: any }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventCardHeader}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={[
          styles.eventStatus,
          { backgroundColor: getStatusColor(item.status) + '20' }
        ]}>
          <Text style={[
            styles.eventStatusText,
            { color: getStatusColor(item.status) }
          ]}>
            {item.status === 'confirmed' ? 'Confirmado' : 
             item.status === 'pending' ? 'Pendente' : 'Cancelado'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.eventDescription}>{item.description}</Text>
      
      <View style={styles.eventDetails}>
        <View style={styles.eventDateTime}>
          <Ionicons name="calendar" size={16} color={colors.primary} />
          <Text style={styles.eventDateTimeText}>
            {item.date} às {item.time}
          </Text>
        </View>
        
        <View style={styles.eventAttendees}>
          <Ionicons name="people" size={16} color={colors.mutedForeground} />
          <Text style={styles.eventAttendeesText}>
            {item.attendees} confirmados
          </Text>
        </View>
      </View>

      <View style={styles.eventActions}>
        <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => handleEdit(item)}>
          <Ionicons name="create" size={16} color={colors.primary} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}
          >
            Editar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.shareButton]}>
          <Ionicons name="share" size={16} color={colors.success} />
          <Text style={[styles.actionButtonText, { color: colors.success }]}
          >
            Compartilhar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={() => handleDelete(item)}>
          <Ionicons name="trash" size={16} color={colors.destructive} />
          <Text style={[styles.actionButtonText, { color: colors.destructive }]}
          >
            Excluir
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Agenda de Eventos</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Ionicons name="add" size={20} color={colors.primaryForeground} />
            <Text style={styles.createButtonText}>Criar</Text>
          </TouchableOpacity>
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
                filter === filterItem.id ? styles.filterTextActive : {}
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
              Crie seu primeiro evento para começar a organizar sua comunidade
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Ionicons name="add" size={20} color={colors.primaryForeground} />
              <Text style={styles.createButtonText}>Criar Evento</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <CreateEventModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
      />
    </SafeAreaView>
  );
}