import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = { icon?: any; title: string; subtitle?: string; color?: string };

export function EmptyState({ icon = 'sparkles', title, subtitle, color = '#6b7280' }: Props) {
  return (
    <View style={{ alignItems: 'center', padding: 24 }}>
      <Ionicons name={icon} size={32} color={color} />
      <Text style={{ marginTop: 12, fontWeight: '600', color: '#111827' }}>{title}</Text>
      {subtitle ? <Text style={{ marginTop: 6, color: '#6b7280', textAlign: 'center' }}>{subtitle}</Text> : null}
    </View>
  );
}

