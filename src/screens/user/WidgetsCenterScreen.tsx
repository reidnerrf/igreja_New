import React, { useEffect, useState } from 'react';
import { View, Text, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../contexts/ThemeContext';

type Prefs = { upcomingEvents: boolean; nextLive: boolean };

export function WidgetsCenterScreen() {
  const { colors } = useTheme();
  const [prefs, setPrefs] = useState<Prefs>({ upcomingEvents: true, nextLive: true });

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('widgets_prefs');
      if (raw) setPrefs(JSON.parse(raw));
    })();
  }, []);

  const toggle = async (key: keyof Prefs, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    await AsyncStorage.setItem('widgets_prefs', JSON.stringify(next));
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: colors.background }}>
      <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 18, marginBottom: 16 }}>Widgets</Text>
      <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: colors.foreground }}>Próximos Eventos</Text>
        <Switch value={prefs.upcomingEvents} onValueChange={(v) => toggle('upcomingEvents', v)} />
      </View>
      <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: colors.foreground }}>Próxima Live</Text>
        <Switch value={prefs.nextLive} onValueChange={(v) => toggle('nextLive', v)} />
      </View>
    </View>
  );
}

