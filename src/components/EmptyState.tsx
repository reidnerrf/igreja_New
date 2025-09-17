import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = { icon?: any; title: string; subtitle?: string; color?: string; ctaLabel?: string; onPressCta?: () => void };

export function EmptyState({ icon = 'sparkles', title, subtitle, color = '#6b7280', ctaLabel, onPressCta }: Props) {
  return (
    <View style={{ alignItems: 'center', padding: 24 }}>
      <Ionicons name={icon} size={32} color={color} />
      <Text style={{ marginTop: 12, fontWeight: '600', color: '#111827' }}>{title}</Text>
      {subtitle ? <Text style={{ marginTop: 6, color: '#6b7280', textAlign: 'center' }}>{subtitle}</Text> : null}
      {ctaLabel && onPressCta ? (
        <Pressable
          accessibilityRole="button"
          onPress={onPressCta}
          style={({ pressed }) => ({
            marginTop: 12,
            backgroundColor: '#2563eb',
            opacity: pressed ? 0.9 : 1,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 8
          })}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>{ctaLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

