import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';

export function PrivacySettingsScreen() {
  const { colors } = useTheme();
  const [sharePosts, setSharePosts] = useState(true);
  const [showProfile, setShowProfile] = useState(true);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.card, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    title: { fontSize: 20, fontWeight: 'bold', color: colors.foreground },
    content: { flex: 1, padding: 20 },
    row: { backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    label: { color: colors.foreground, fontWeight: '500' }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Privacidade</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Permitir que igrejas compartilhem minhas postagens</Text>
          <Switch value={sharePosts} onValueChange={setSharePosts} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Exibir meu perfil publicamente</Text>
          <Switch value={showProfile} onValueChange={setShowProfile} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

