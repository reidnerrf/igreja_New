import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { apiService } from '../../services/api';

export function NextLiveWidget() {
  const { colors } = useTheme();
  const [live, setLive] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiService.getTransmissions({ period: 'today', limit: 10 });
        const list = res?.transmissions || res || [];
        const upcoming = list.find((t: any) => t.isLive || t.scheduledAt);
        setLive(upcoming || null);
      } catch {}
    })();
  }, []);

  if (!live) {
    return <Text style={{ color: colors.mutedForeground }}>Nenhuma live programada hoje.</Text>;
  }

  return (
    <View>
      <Text style={{ color: colors.foreground, fontWeight: '600', marginBottom: 4 }}>Próxima Live</Text>
      <Text style={{ color: colors.mutedForeground }}>{live.title || 'Transmissão'}</Text>
      {live.scheduledAt ? (
        <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>Agendada: {new Date(live.scheduledAt).toLocaleString()}</Text>
      ) : (
        <Text style={{ color: colors.success, fontSize: 12 }}>Ao vivo agora</Text>
      )}
    </View>
  );
}

