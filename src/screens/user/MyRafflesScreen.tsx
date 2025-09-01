import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { RaffleCard } from '../../components/RaffleCard';
import { BuyRaffleTicketModal } from '../../components/modals/BuyRaffleTicketModal';
import { useAuth } from '../../contexts/AuthContext';

export function MyRafflesScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [buyModal, setBuyModal] = useState(false);

  const openBuy = () => {
    if (!user?.isPremium) {
      Alert.alert('Recurso Premium', 'Assine para participar de rifas.');
      return;
    }
    setBuyModal(true);
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.card, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { fontSize: 20, fontWeight: 'bold', color: colors.foreground },
    content: { flex: 1, padding: 20 },
    actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
    actionText: { color: colors.primaryForeground, fontWeight: '600', marginLeft: 8 }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Minhas Rifas</Text>
          <TouchableOpacity style={styles.actionButton} onPress={openBuy}>
            <Ionicons name="ticket" size={18} color={colors.primaryForeground} />
            <Text style={styles.actionText}>Comprar Número</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.content}>
        {[1].map(i => (
          <RaffleCard key={i} raffle={{ id: String(i), title: `Rifa da Paróquia`, price: 20, totalNumbers: 200, soldNumbers: 50 }} />
        ))}
      </ScrollView>
      <BuyRaffleTicketModal visible={buyModal} onClose={() => setBuyModal(false)} onSubmit={() => setBuyModal(false)} />
    </SafeAreaView>
  );
}

