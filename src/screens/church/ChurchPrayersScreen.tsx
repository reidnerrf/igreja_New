import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { PremiumBadge } from '../../components/PremiumBadge';
import { CreatePrayerModal } from '../../components/modals/CreatePrayerModal';
import { usePrayers } from '../../hooks/useApi';
import { apiService } from '../../services/api';

export function ChurchPrayersScreen() {
  const { colors } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: prayersData, loading, error, refetch } = usePrayers();
  const prayers = prayersData || [];

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.card, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { fontSize: 20, fontWeight: 'bold', color: colors.foreground },
    content: { flex: 1, padding: 20 },
    actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
    actionText: { color: colors.primaryForeground, fontWeight: '600', marginLeft: 8 },
    item: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: 16, borderRadius: 12, marginBottom: 12 },
    itemTitle: { color: colors.foreground, fontWeight: '600', marginBottom: 6 },
    itemMeta: { color: colors.mutedForeground, fontSize: 12 },
    itemActions: { flexDirection: 'row', marginTop: 12, gap: 12 },
    smallButton: { backgroundColor: colors.input, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
    smallButtonText: { color: colors.foreground, fontSize: 12, fontWeight: '500' }
  });

  const markStatus = async (id: string, status: 'pending' | 'praying' | 'answered') => {
    await apiService.updatePrayerStatus(id, status);
    refetch();
    Alert.alert('Status atualizado', `Marcado como ${status === 'answered' ? 'Atendido' : 'Em oração'}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Pedidos de Oração</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowCreateModal(true)}>
            <Ionicons name="add" size={18} color={colors.primaryForeground} />
            <Text style={styles.actionText}>Novo Pedido</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.content}>
        {prayers.map((item: any) => (
          <View key={item.id || item._id} style={styles.item}>
            <Text style={styles.itemTitle}>{item.title || item.request}</Text>
            <Text style={styles.itemMeta}>Status: {item.status === 'answered' ? 'Atendido' : 'Em oração'}</Text>
            <View style={styles.itemActions}>
              <TouchableOpacity style={styles.smallButton} onPress={() => markStatus(item.id || item._id, 'praying')}>
                <Text style={styles.smallButtonText}>Em oração</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallButton} onPress={() => markStatus(item.id || item._id, 'answered')}>
                <Text style={styles.smallButtonText}>Atendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <PremiumBadge />
      </ScrollView>
      <CreatePrayerModal visible={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={async (data) => { await apiService.createPrayer(data); setShowCreateModal(false); refetch(); }} />
    </SafeAreaView>
  );
}

