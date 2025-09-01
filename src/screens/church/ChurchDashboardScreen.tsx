import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/Card';
import { PremiumBadge } from '../../components/PremiumBadge';
import { CreateEventModal } from '../../components/modals/CreateEventModal';
import { CreateAnnouncementModal } from '../../components/modals/CreateAnnouncementModal';
import { CreateDonationModal } from '../../components/modals/CreateDonationModal';
import { apiService } from '../../services/api';
import { notificationService } from '../../services/notificationService';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '../../components/ui/chart';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts@2.15.2';

export function ChurchDashboardScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  
  const [stats, setStats] = useState({
    members: 1234,
    events: 8,
    transmissions: 24,
    donations: 45320
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'prayer', message: 'Nova oração cadastrada', time: '2 min' },
    { id: 2, type: 'donation', message: 'Doação recebida - R$ 150', time: '5 min' },
    { id: 3, type: 'member', message: 'Novo membro cadastrado', time: '1 hora' }
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    { id: 1, title: 'Culto Domingo', date: '2025-01-12', time: '19:00', attendees: 350 },
    { id: 2, title: 'Estudo Bíblico', date: '2025-01-14', time: '20:00', attendees: 80 },
    { id: 3, title: 'Reunião de Jovens', date: '2025-01-16', time: '19:30', attendees: 120 }
  ]);

  const [analytics, setAnalytics] = useState<any | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | '90d'>('month');

  useEffect(() => {
    if (user?.isPremium) {
      apiService.getAnalytics('church', period).then(setAnalytics).catch(() => {});
    }
  }, [user?.isPremium, period]);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (user?.isPremium) {
      try { setAnalytics(await apiService.getAnalytics('church', period)); } catch {}
    }
    setRefreshing(false);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'event':
        setShowEventModal(true);
        break;
      case 'announcement':
        setShowAnnouncementModal(true);
        break;
      case 'donation':
        setShowDonationModal(true);
        break;
      case 'raffle':
        if (!user?.isPremium) {
          Alert.alert(
            'Recurso Premium',
            'As rifas são um recurso premium. Faça upgrade para acessar.',
            [{ text: 'OK' }]
          );
          return;
        }
        break;
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
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    churchIcon: {
      width: 40,
      height: 40,
      backgroundColor: colors.primary,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.foreground,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.mutedForeground,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    quickActions: {
      marginBottom: 24,
    },
    quickActionsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 16,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    quickActionButton: {
      flex: 1,
      minWidth: '45%',
      height: 80,
      backgroundColor: colors.card,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickActionPremium: {
      borderColor: colors.gold,
      backgroundColor: colors.gold + '10',
    },
    quickActionIcon: {
      marginBottom: 8,
    },
    quickActionText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.foreground,
      textAlign: 'center',
    },
    quickActionTextPremium: {
      color: colors.gold,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
    statTrend: {
      fontSize: 12,
      color: colors.success,
      marginTop: 4,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.foreground,
    },
    seeAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.primary,
      borderRadius: 6,
    },
    seeAllText: {
      fontSize: 12,
      color: colors.primaryForeground,
      fontWeight: '500',
    },
    eventItem: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    eventHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    eventTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.foreground,
      flex: 1,
    },
    eventBadge: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    eventBadgeText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '500',
    },
    eventDetails: {
      fontSize: 14,
      color: colors.mutedForeground,
    },
    activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activityIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    activityContent: {
      flex: 1,
    },
    activityMessage: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.foreground,
      marginBottom: 4,
    },
    activityTime: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
  });

  const getActivityIconColor = (type: string) => {
    switch (type) {
      case 'prayer': return colors.primary + '20';
      case 'donation': return colors.success + '20';
      case 'member': return colors.gold + '20';
      default: return colors.muted;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'prayer': return 'heart';
      case 'donation': return 'card';
      case 'member': return 'person-add';
      default: return 'notifications';
    }
  };

  const series = [
    { name: 'Doações', dataKey: 'donationsTotal', stroke: colors.success },
    { name: 'Engajamento', dataKey: 'engagement', stroke: colors.primary },
    { name: 'Rifas', dataKey: 'raffleRevenue', stroke: colors.gold },
  ];

  const chartData = [
    { label: 'Sem.', donationsTotal: analytics?.donationsTotal || 0, engagement: analytics?.engagement || 0, raffleRevenue: analytics?.raffleRevenue || 0 },
  ];

  const pieData = [
    { name: 'Doações', value: analytics?.donationsTotal || 0, fill: colors.success },
    { name: 'Rifas', value: analytics?.raffleRevenue || 0, fill: colors.gold },
    { name: 'Engajamento', value: analytics?.engagement || 0, fill: colors.primary },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.churchIcon}>
              <Ionicons name="business" size={24} color={colors.primaryForeground} />
            </View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.headerTitle}>{user?.name || 'Igreja'}</Text>
                {user?.isPremium && <PremiumBadge />}
              </View>
              <Text style={styles.headerSubtitle}>Dashboard Administrativo</Text>
            </View>
          </View>
          
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Ações Rápidas */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Ações Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('event')}
            >
              <Ionicons 
                name="add-circle" 
                size={24} 
                color={colors.primary} 
                style={styles.quickActionIcon}
              />
              <Text style={styles.quickActionText}>Criar Evento</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('announcement')}
            >
              <Ionicons 
                name="megaphone" 
                size={24} 
                color={colors.primary} 
                style={styles.quickActionIcon}
              />
              <Text style={styles.quickActionText}>Novo Aviso</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => handleQuickAction('donation')}
            >
              <Ionicons 
                name="card" 
                size={24} 
                color={colors.primary} 
                style={styles.quickActionIcon}
              />
              <Text style={styles.quickActionText}>Nova Doação</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.quickActionButton,
                user?.isPremium ? styles.quickActionPremium : {}
              ]}
              onPress={() => handleQuickAction('raffle')}
            >
              <Ionicons 
                name="gift" 
                size={24} 
                color={user?.isPremium ? colors.gold : colors.mutedForeground} 
                style={styles.quickActionIcon}
              />
              <Text style={[
                styles.quickActionText,
                user?.isPremium ? styles.quickActionTextPremium : {}
              ]}>
                Nova Rifa {!user?.isPremium && '(Premium)'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.members.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Membros Ativos</Text>
            <Text style={styles.statTrend}>+12% este mês</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.events}</Text>
            <Text style={styles.statLabel}>Eventos este Mês</Text>
            <Text style={styles.statTrend}>+2 novos</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.transmissions}</Text>
            <Text style={styles.statLabel}>Transmissões</Text>
            <Text style={styles.statTrend}>+4 este mês</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>R$ {stats.donations.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Doações (R$)</Text>
            <Text style={styles.statTrend}>+18% este mês</Text>
          </View>
        </View>

        {/* Analytics Premium */}
        {user?.isPremium && analytics && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Relatórios (Premium)</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {(['week','month','90d'] as const).map(p => (
                  <TouchableOpacity key={p} onPress={() => setPeriod(p)} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: period===p ? colors.primary : colors.card, borderWidth: 1, borderColor: colors.border }}>
                    <Text style={{ color: period===p ? colors.primaryForeground : colors.foreground, fontSize: 12 }}>{p.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 12 }}>
              <Text style={{ color: colors.foreground, fontWeight: '600', marginBottom: 8 }}>Tendência</Text>
              <ChartContainer id="analytics-line" config={{}}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {series.map(s => (
                    <Line key={s.dataKey} type="monotone" dataKey={s.dataKey as any} name={s.name} stroke={s.stroke} dot={false} />
                  ))}
                  <ChartLegend content={<ChartLegendContent />} />
                </LineChart>
              </ChartContainer>
            </View>

            <View style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 12, marginTop: 12 }}>
              <Text style={{ color: colors.foreground, fontWeight: '600', marginBottom: 8 }}>Distribuição</Text>
              <ChartContainer id="analytics-pie" config={{}}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </View>
          </View>
        )}

        {/* Próximos Eventos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos Eventos</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Ver Todos</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingEvents.slice(0, 3).map((event) => (
            <View key={event.id} style={styles.eventItem}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventBadge}>
                  <Text style={styles.eventBadgeText}>
                    {event.attendees} confirmados
                  </Text>
                </View>
              </View>
              <Text style={styles.eventDetails}>
                {event.date} às {event.time}
              </Text>
            </View>
          ))}
        </View>

        {/* Atividade Recente */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Atividade Recente</Text>
          </View>
          
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[
                styles.activityIcon,
                { backgroundColor: getActivityIconColor(activity.type) }
              ]}>
                <Ionicons 
                  name={getActivityIcon(activity.type)} 
                  size={20} 
                  color={colors.primary} 
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityMessage}>{activity.message}</Text>
                <Text style={styles.activityTime}>há {activity.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modais */}
      <CreateEventModal
        visible={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSubmit={async (eventData) => {
          await apiService.createEvent(eventData);
          setShowEventModal(false);
          try { await notificationService.scheduleLocalNotification('Novo evento', eventData.title); } catch {}
        }}
      />

      <CreateAnnouncementModal
        visible={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
        onSubmit={async (announcementData) => {
          await apiService.createPost({ ...announcementData, type: 'announcement' });
          setShowAnnouncementModal(false);
          try { await notificationService.scheduleLocalNotification('Novo aviso', announcementData.title); } catch {}
        }}
      />

      <CreateDonationModal
        visible={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        onSubmit={async (donationData) => {
          await apiService.createDonationCampaign(donationData);
          setShowDonationModal(false);
        }}
      />
    </SafeAreaView>
  );
}