import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { apiService } from '../../services/api';
import { EmptyState } from '../../components/EmptyState';

export function NotificationsInboxScreen() {
  const { colors } = useTheme();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiService.getNotifications();
      setItems(res.notifications || []);
    } catch {
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: colors.mutedForeground }}>Carregando…</Text></View>;
  }

  if (!items.length) {
    return <EmptyState title="Nenhuma notificação" subtitle="Você verá novidades por aqui." />;
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={async () => { if (!item.readAt) { await apiService.markNotificationAsRead(item._id); load(); } }} style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: item.readAt ? colors.background : colors.card }}>
          <Text style={{ color: colors.foreground, fontWeight: '600' }}>{item.title}</Text>
          <Text style={{ color: colors.mutedForeground }}>{item.body}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

