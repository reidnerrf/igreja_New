import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { CreateAnnouncementModal } from '../../components/modals/CreateAnnouncementModal';
import { apiService } from '../../services/api';
import { notificationService } from '../../services/notificationService';

export function ChurchAnnouncementsScreen() {
  const { colors } = useTheme();
  const [showModal, setShowModal] = useState(false);

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
    itemMeta: { color: colors.mutedForeground, fontSize: 12 }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Avisos e Notícias</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowModal(true)}>
            <Ionicons name="megaphone" size={18} color={colors.primaryForeground} />
            <Text style={styles.actionText}>Novo Aviso</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.content}>
        {[{ id: '1', title: 'Mutirão de Limpeza Sábado', meta: 'Publicado 2h atrás' }, { id: '2', title: 'Campanha de Inverno', meta: 'Publicado ontem' }].map(item => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemMeta}>{item.meta}</Text>
          </View>
        ))}
      </ScrollView>
      <CreateAnnouncementModal visible={showModal} onClose={() => setShowModal(false)} onSubmit={async (payload) => {
        await apiService.createPost({ ...payload, type: 'announcement' });
        const token = await notificationService.getExpoPushToken();
        if (token) {
          await notificationService.scheduleLocalNotification('Novo aviso', payload.title);
        }
        setShowModal(false);
      }} />
    </SafeAreaView>
  );
}

