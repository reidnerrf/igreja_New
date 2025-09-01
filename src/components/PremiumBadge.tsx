import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export function PremiumBadge() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.gold + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    text: {
      fontSize: 10,
      fontWeight: 'bold',
      color: colors.gold,
      marginLeft: 4,
    },
  });

  return (
    <View style={styles.badge}>
      <Ionicons name="star" size={12} color={colors.gold} />
      <Text style={styles.text}>PREMIUM</Text>
    </View>
  );
}