import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export function ConnectivityBanner({ isOnline }: { isOnline: boolean }) {
  const { colors } = useTheme();
  if (isOnline) return null;
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: colors.destructive, paddingVertical: 6, alignItems: 'center', zIndex: 50 }}>
      <Text style={{ color: 'white', fontWeight: '600' }}>Sem conexão com o servidor… tentando reconectar</Text>
    </View>
  );
}

