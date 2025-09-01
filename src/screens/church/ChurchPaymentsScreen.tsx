import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

export function ChurchPaymentsScreen() {
  const { colors } = useTheme();
  const { user, updateUser } = useAuth();
  const [pixKey, setPixKey] = useState(user?.churchData?.pixKey || '');

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
        <Text style={styles.title}>Formas de Pagamento</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.label}>Chave PIX</Text>
        <TextInput value={pixKey} onChangeText={setPixKey} placeholder="Digite a chave PIX" placeholderTextColor={colors.mutedForeground} style={styles.input} onEndEditing={() => updateUser({ churchData: { ...(user?.churchData||{}), pixKey }})} />
        <Text style={styles.label}>Cartão (Stripe) - em breve</Text>
        <View style={{ backgroundColor: colors.card, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ color: colors.mutedForeground }}>Integração de cartão será configurada posteriormente.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

