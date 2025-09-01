import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

export function UserProfileScreen() {
  const { colors } = useTheme();
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.card, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    title: { fontSize: 20, fontWeight: 'bold', color: colors.foreground },
    content: { flex: 1, padding: 20 },
    label: { color: colors.mutedForeground, marginBottom: 8, marginTop: 16 },
    input: { backgroundColor: colors.input, color: colors.foreground, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, borderWidth: 1, borderColor: colors.border }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Perfil</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} onEndEditing={() => updateUser({ name })} />
        <Text style={styles.label}>Email</Text>
        <View style={{ backgroundColor: colors.card, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.mutedForeground }}>{user?.email}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

