import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';

export function MyPrayersScreen() {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.card, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    title: { fontSize: 20, fontWeight: 'bold', color: colors.foreground },
    content: { flex: 1, padding: 20 },
    item: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: 16, borderRadius: 12, marginBottom: 12 },
    itemTitle: { color: colors.foreground, fontWeight: '600', marginBottom: 6 },
    itemMeta: { color: colors.mutedForeground, fontSize: 12 }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Pedidos de Oração</Text>
      </View>
      <ScrollView style={styles.content}>
        {[{ id: '1', title: 'Minha família', status: 'Em oração' }].map(item => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemMeta}>Status: {item.status}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

