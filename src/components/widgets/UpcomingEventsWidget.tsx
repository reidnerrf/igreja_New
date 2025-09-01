import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { apiService } from '../../services/api';

export function UpcomingEventsWidget() {
  const { colors } = useTheme();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiService.getEvents({ following: 'true', period: 'today', limit: 5 });
        const events = res?.events || [];
        setItems(events.map((e: any) => ({
          id: e._id || e.id,
          title: e.title,
          church: e.church?.name || 'Igreja',
          time: e.time || '',
          image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=200&fit=crop'
        })));
      } catch {}
    })();
  }, []);

  if (!items.length) {
    return <Text style={{ color: colors.mutedForeground }}>Sem eventos hoje.</Text>;
  }

  return (
    <View>
      <Text style={{ color: colors.foreground, fontWeight: '600', marginBottom: 8 }}>Próximos Eventos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((e) => (
          <View key={e.id} style={{ width: 200, marginRight: 12 }}>
            <Image source={{ uri: e.image }} style={{ width: '100%', height: 100, borderRadius: 10, marginBottom: 6 }} />
            <Text style={{ color: colors.foreground, fontWeight: '600' }}>{e.title}</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{e.church} • {e.time}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

