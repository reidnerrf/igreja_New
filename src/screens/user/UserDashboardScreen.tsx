import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/Card';
import { apiService } from '../../services/api';
import { PressableScale } from '../../components/PressableScale';
import { EmptyState } from '../../components/EmptyState';
import { VoiceRecorder } from '../../components/VoiceRecorder';
import { Card as BaseCard } from '../../components/Card';
import { UpcomingEventsWidget } from '../../components/widgets/UpcomingEventsWidget';
import { NextLiveWidget } from '../../components/widgets/NextLiveWidget';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function UserDashboardScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [gamification, setGamification] = useState<{ points: number; badges: any[] } | null>(null);
  const [widgetPrefs, setWidgetPrefs] = useState<{ upcomingEvents: boolean; nextLive: boolean }>({ upcomingEvents: true, nextLive: true });

  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [dailyVerse, setDailyVerse] = useState({ text: '', reference: '' });
  const [followedChurches] = useState([
    { id: 1, name: 'Igreja Batista Central', followers: 1234 },
    { id: 2, name: 'Igreja Assembleia', followers: 856 },
    { id: 3, name: 'Paróquia São José', followers: 2341 }
  ]);

  const quickActions = [
    { id: 'map', title: 'Encontrar Igrejas', icon: 'map', color: colors.primary },
    { id: 'live', title: 'Transmissões', icon: 'radio', color: colors.destructive },
    { id: 'prayers', title: 'Orações', icon: 'heart', color: colors.success },
    { id: 'donations', title: 'Doações', icon: 'card', color: colors.gold },
    { id: 'checkin', title: 'Check-in QR', icon: 'qr-code', color: colors.primary },
  ];

  const load = async () => {
    try {
      const ev = await apiService.getEvents({ following: 'true', period: 'today', limit: 5 });
      const events = ev?.events || ev || [];
      setUpcomingEvents(events.map((e: any) => ({
        id: e._id || e.id,
        title: e.title,
        church: e.church?.name || 'Igreja',
        time: e.time || '',
        date: new Date(e.date).toLocaleDateString(),
        image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=200&fit=crop'
      })));
      const devo = await fetch(`${apiServiceBase()}` as any).catch(()=>null);
    } catch {}
    try {
      const devoRes = await fetch(`${apiServiceBase()}` as any).then(r=>r.json()).catch(()=>null as any);
      if (devoRes?.text) setDailyVerse({ text: devoRes.text, reference: devoRes.gospel });
    } catch {}
    try {
      const g = await apiService.getMyGamification();
      if (g?.gamification) setGamification({ points: g.gamification.points || 0, badges: g.gamification.badges || [] });
    } catch {}
    try {
      const raw = await AsyncStorage.getItem('widgets_prefs');
      if (raw) setWidgetPrefs(JSON.parse(raw));
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
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
    appIcon: {
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
    welcomeCard: {
      backgroundColor: `linear-gradient(135deg, ${colors.primary}, ${colors.gold})`,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    welcomeContent: {
      flex: 1,
    },
    welcomeTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 8,
    },
    welcomeSubtitle: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.9)',
    },
    welcomeIcon: {
      marginLeft: 16,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 24,
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
    quickActionIcon: {
      marginBottom: 8,
    },
    quickActionText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.foreground,
      textAlign: 'center',
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
    eventCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    eventImage: {
      width: '100%',
      height: 120,
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
    eventChurch: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginBottom: 4,
    },
    eventTime: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
    verseCard: {
      backgroundColor: `linear-gradient(135deg, ${colors.primary}20, ${colors.success}20)`,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
    },
    verseIcon: {
      marginBottom: 16,
    },
    verseText: {
      fontSize: 16,
      fontStyle: 'italic',
      color: colors.foreground,
      textAlign: 'center',
      marginBottom: 12,
      lineHeight: 24,
    },
    verseReference: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    churchItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    churchIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    churchContent: {
      flex: 1,
    },
    churchName: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.foreground,
      marginBottom: 4,
    },
    churchFollowers: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
    followButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    followButtonText: {
      fontSize: 12,
      color: colors.primaryForeground,
      fontWeight: '500',
    },
  });

  const onQuickAction = (id: string, navigation?: any) => {
    switch (id) {
      case 'checkin':
        // @ts-ignore
        (navigation as any)?.navigate?.('QRCheckin');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.appIcon}>
              <Ionicons name="heart" size={24} color={colors.primaryForeground} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Olá, {user?.name?.split(' ')[0] || 'irmão(ã)'}!</Text>
              <Text style={styles.headerSubtitle}>Que a paz esteja com você</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Ações Rápidas com microinteração */}
        <View style={styles.section}>
          <View style={styles.quickActionsGrid}>
            {/* @ts-ignore navigation is available via parent stack props in runtime */}
            {quickActions.map((a) => (
              <PressableScale key={a.id} style={styles.quickActionButton} onPress={() => onQuickAction(a.id, ({} as any))}>
                <Ionicons name={a.icon as any} size={24} color={a.color} style={styles.quickActionIcon} />
                <Text style={styles.quickActionText}>{a.title}</Text>
              </PressableScale>
            ))}
          </View>
        </View>

        {/* Notas por voz (transcrição rápida) */}
        <Card>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.foreground, marginBottom: 8 }}>Nota Rápida por Voz</Text>
          <VoiceRecorder
            color={colors.primary}
            onTranscript={(text) => {
              // Aqui você pode salvar em um serviço de notas ou preencher um campo
              // Por ora, conceder pequenos pontos por uso de ditado
              apiService.addPoints(1, 'voice_note', text).catch(()=>{});
            }}
          />
        </Card>
        {/* Gamificação */}
        <BaseCard>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.foreground }}>Seu Progresso</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="trophy" size={16} color={colors.gold} />
              <Text style={{ color: colors.gold, marginLeft: 6, fontWeight: '600' }}>{gamification?.points ?? 0} pts</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            {(gamification?.badges || []).slice(0, 5).map((b, i) => (
              <View key={b.id || i} style={{ paddingHorizontal: 8, paddingVertical: 6, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 8, marginRight: 8 }}>
                <Text style={{ color: colors.foreground, fontSize: 12 }}>{b.name}</Text>
              </View>
            ))}
            {(!gamification?.badges || gamification?.badges.length === 0) && (
              <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>Sem conquistas ainda. Participe de eventos!</Text>
            )}
          </View>
        </BaseCard>
        {/* Widgets selecionados */}
        <Card>
          {widgetPrefs.upcomingEvents && (
            <View style={{ marginBottom: 16 }}>
              <UpcomingEventsWidget />
            </View>
          )}
          {widgetPrefs.nextLive && (
            <View style={{ marginBottom: 4 }}>
              <NextLiveWidget />
            </View>
          )}
          {!widgetPrefs.upcomingEvents && !widgetPrefs.nextLive && (
            <Text style={{ color: colors.mutedForeground }}>Nenhum widget ativo. Ative em Configurações → Widgets.</Text>
          )}
        </Card>

        {/* Devocional do Dia */}
        <Card>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.foreground, marginBottom: 8 }}>Evangelho do dia</Text>
          <Text style={{ color: colors.mutedForeground, marginBottom: 6 }}>{dailyVerse.text || '...'}</Text>
          <Text style={{ color: colors.mutedForeground, fontStyle: 'italic' }}>{dailyVerse.reference || ''}</Text>
        </Card>

        {/* Próximos Eventos das Igrejas Seguidas */}
        <Card>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.foreground, marginBottom: 12 }}>Hoje nas igrejas que você segue</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {upcomingEvents.map((e) => (
              <View key={e.id} style={{ width: 220, marginRight: 12 }}>
                <Image source={{ uri: e.image }} style={{ width: '100%', height: 120, borderRadius: 12, marginBottom: 8 }} />
                <Text style={{ color: colors.foreground, fontWeight: '600' }}>{e.title}</Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{e.church} • {e.time}</Text>
              </View>
            ))}
          </ScrollView>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function apiServiceBase(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('../../services/api');
    return mod.API_BASE_URL || '';
  } catch {
    return '';
  }
}