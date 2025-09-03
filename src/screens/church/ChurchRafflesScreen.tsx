import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { RaffleCard } from '../../components/RaffleCard';
import { CreateRaffleModal } from '../../components/modals/CreateRaffleModal';
import { useAuth } from '../../contexts/AuthContext';
import { useRaffles } from '../../hooks/useApi';
import { apiService } from '../../services/api';
import { chatService } from '../../services/chatService';

export function ChurchRafflesScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const { data: rafflesData, loading, error, refetch } = useRaffles({ scope: 'church' });
  const raffles = rafflesData || [];

  useEffect(() => {
    chatService.connect();
    const handler = (p: any) => {
      Alert.alert('Sorteio Concluído', `Vencedor: número ${p?.winner?.ticket}`);
      refetch();
    };
    chatService.onRaffleDrawn(handler);
    return () => chatService.offRaffleDrawn(handler);
  }, []);

  const openCreate = () => {
    if (!user?.isPremium) {
      Alert.alert('Recurso Premium', 'Faça upgrade para criar rifas.');
      return;
    }
    setShowModal(true);
  };

  const startLiveDraw = async (raffleId: string) => {
    try {
      chatService.joinRaffle(raffleId);
      const draw = await fetch(`${apiServiceBase()}/raffles/${raffleId}/draw`, { method: 'POST', headers: { 'Content-Type': 'application/json' } }).catch(()=>null as any);
      // backend emitirá evento; UI ouvirá via socket
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível iniciar o sorteio agora.');
    }
  };

  const totalRevenue = raffles.reduce((sum: number, r: any) => sum + (r.price || 0) * (r.soldNumbers || 0), 0);
  const totalSold = raffles.reduce((sum: number, r: any) => sum + (r.soldNumbers || 0), 0);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.card, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { fontSize: 20, fontWeight: 'bold', color: colors.foreground },
    content: { flex: 1, padding: 20 },
    actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
    actionText: { color: colors.primaryForeground, fontWeight: '600', marginLeft: 8 },
    stats: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    stat: { flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, alignItems: 'center' },
    statValue: { color: colors.foreground, fontWeight: 'bold' },
    statLabel: { color: colors.mutedForeground, fontSize: 12 },
    drawButton: { marginTop: 8, alignSelf: 'flex-start', backgroundColor: colors.gold, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Rifas e Campanhas</Text>
          <TouchableOpacity style={styles.actionButton} onPress={openCreate}>
            <Ionicons name="add" size={18} color={colors.primaryForeground} />
            <Text style={styles.actionText}>Nova Rifa</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>R$ {totalRevenue.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Receita Estimada</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{totalSold}</Text>
            <Text style={styles.statLabel}>Números Vendidos</Text>
          </View>
        </View>
        {(raffles.length > 0 ? raffles : []).map((r: any) => (
          <View key={r.id || r._id}>
            <RaffleCard raffle={r} onPress={() => startLiveDraw(r._id || r.id)} />
            {user?.isPremium && (r.status==='active' || r.status==='sold_out') && (
              <TouchableOpacity style={styles.drawButton} onPress={() => startLiveDraw(r._id || r.id)}>
                <Text style={{ color: 'white', fontWeight: '600' }}>Iniciar Sorteio ao Vivo</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
      <CreateRaffleModal visible={showModal} onClose={() => setShowModal(false)} onSubmit={async (data) => { await apiService.createRaffle(data); setShowModal(false); refetch(); }} />
    </SafeAreaView>
  );
}

function apiServiceBase(): string {
  try {
    const mod = require('../../services/api');
    return mod.API_BASE_URL || '';
  } catch {
    return '';
  }
}

