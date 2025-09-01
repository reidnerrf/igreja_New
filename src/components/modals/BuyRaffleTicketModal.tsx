import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface BuyRaffleTicketModalProps {
  visible: boolean;
  onClose: () => void;
  raffle: any;
  onPurchase: (ticketNumbers: number[], paymentMethod: string) => void;
}

export function BuyRaffleTicketModal({ visible, onClose, raffle, onPurchase }: BuyRaffleTicketModalProps) {
  const { colors } = useTheme();
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('pix');

  if (!raffle) return null;

  const availableNumbers = Array.from({ length: raffle.totalTickets }, (_, i) => i + 1)
    .filter(num => !raffle.soldNumbers?.includes(num));

  const toggleNumber = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else {
      if (selectedNumbers.length < 10) { // Limite de 10 bilhetes por compra
        setSelectedNumbers([...selectedNumbers, number]);
      } else {
        Alert.alert('Limite atingido', 'Você pode comprar no máximo 10 bilhetes por vez');
      }
    }
  };

  const selectRandomNumbers = (quantity: number) => {
    const available = availableNumbers.filter(n => !selectedNumbers.includes(n));
    const random = available.sort(() => 0.5 - Math.random()).slice(0, quantity);
    setSelectedNumbers([...selectedNumbers, ...random].slice(0, 10));
  };

  const handlePurchase = () => {
    if (selectedNumbers.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um número');
      return;
    }

    const total = selectedNumbers.length * raffle.ticketPrice;
    
    Alert.alert(
      'Confirmar Compra',
      `Comprar ${selectedNumbers.length} bilhete(s) por R$ ${total.toFixed(2).replace('.', ',')}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            onPurchase(selectedNumbers, paymentMethod);
            setSelectedNumbers([]);
            onClose();
          }
        }
      ]
    );
  };

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: '95%',
      maxHeight: '90%',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.foreground,
    },
    closeButton: {
      padding: 8,
    },
    raffleInfo: {
      marginBottom: 20,
    },
    raffleTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 8,
    },
    prizeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    prizeImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: 12,
    },
    prizeInfo: {
      flex: 1,
    },
    prizeText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.foreground,
      marginBottom: 4,
    },
    priceText: {
      fontSize: 14,
      color: colors.success,
      fontWeight: 'bold',
    },
    quickSelectContainer: {
      marginBottom: 20,
    },
    quickSelectTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: 12,
    },
    quickSelectButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    quickSelectButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    quickSelectText: {
      color: colors.primaryForeground,
      fontSize: 12,
      fontWeight: '500',
      marginLeft: 4,
    },
    numbersContainer: {
      marginBottom: 20,
    },
    numbersTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: 12,
    },
    numbersGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    numberButton: {
      width: 40,
      height: 40,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    numberButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    numberButtonSold: {
      backgroundColor: colors.muted,
      borderColor: colors.muted,
      opacity: 0.5,
    },
    numberText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.foreground,
    },
    numberTextSelected: {
      color: colors.primaryForeground,
    },
    numberTextSold: {
      color: colors.mutedForeground,
    },
    paymentContainer: {
      marginBottom: 20,
    },
    paymentTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: 12,
    },
    paymentMethods: {
      flexDirection: 'row',
      gap: 12,
    },
    paymentMethod: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    paymentMethodActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    paymentMethodText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.foreground,
      marginLeft: 8,
    },
    paymentMethodTextActive: {
      color: colors.primaryForeground,
    },
    summaryCard: {
      backgroundColor: colors.muted,
      borderRadius: 8,
      padding: 16,
      marginBottom: 20,
    },
    summaryTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: 8,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    summaryLabel: {
      fontSize: 14,
      color: colors.mutedForeground,
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.foreground,
    },
    summaryTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    summaryTotalLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.foreground,
    },
    summaryTotalValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.success,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 4,
    },
    cancelButton: {
      backgroundColor: colors.muted,
    },
    purchaseButton: {
      backgroundColor: colors.success,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: colors.foreground,
    },
    purchaseButtonText: {
      color: colors.primaryForeground,
    },
  });

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modal}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Comprar Bilhetes</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Informações da Rifa */}
            <View style={styles.raffleInfo}>
              <Text style={styles.raffleTitle}>{raffle.title}</Text>
              <View style={styles.prizeContainer}>
                {raffle.prizeImage && (
                  <Image source={{ uri: raffle.prizeImage }} style={styles.prizeImage} />
                )}
                <View style={styles.prizeInfo}>
                  <Text style={styles.prizeText}>{raffle.prize}</Text>
                  <Text style={styles.priceText}>
                    R$ {raffle.ticketPrice.toFixed(2).replace('.', ',')} por bilhete
                  </Text>
                </View>
              </View>
            </View>

            {/* Seleção Rápida */}
            <View style={styles.quickSelectContainer}>
              <Text style={styles.quickSelectTitle}>Seleção Rápida</Text>
              <View style={styles.quickSelectButtons}>
                <TouchableOpacity 
                  style={styles.quickSelectButton}
                  onPress={() => selectRandomNumbers(1)}
                >
                  <Ionicons name="shuffle" size={14} color={colors.primaryForeground} />
                  <Text style={styles.quickSelectText}>1 número</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quickSelectButton}
                  onPress={() => selectRandomNumbers(3)}
                >
                  <Ionicons name="shuffle" size={14} color={colors.primaryForeground} />
                  <Text style={styles.quickSelectText}>3 números</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.quickSelectButton}
                  onPress={() => selectRandomNumbers(5)}
                >
                  <Ionicons name="shuffle" size={14} color={colors.primaryForeground} />
                  <Text style={styles.quickSelectText}>5 números</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Grade de Números */}
            <View style={styles.numbersContainer}>
              <Text style={styles.numbersTitle}>
                Escolha seus números ({selectedNumbers.length}/10 selecionados)
              </Text>
              <View style={styles.numbersGrid}>
                {Array.from({ length: raffle.totalTickets }, (_, i) => i + 1).map((number) => {
                  const isSelected = selectedNumbers.includes(number);
                  const isSold = raffle.soldNumbers?.includes(number);
                  
                  return (
                    <TouchableOpacity
                      key={number}
                      style={[
                        styles.numberButton,
                        isSelected && styles.numberButtonSelected,
                        isSold && styles.numberButtonSold
                      ]}
                      onPress={() => !isSold && toggleNumber(number)}
                      disabled={isSold}
                    >
                      <Text style={[
                        styles.numberText,
                        isSelected && styles.numberTextSelected,
                        isSold && styles.numberTextSold
                      ]}>
                        {number.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Método de Pagamento */}
            <View style={styles.paymentContainer}>
              <Text style={styles.paymentTitle}>Método de Pagamento</Text>
              <View style={styles.paymentMethods}>
                <TouchableOpacity
                  style={[
                    styles.paymentMethod,
                    paymentMethod === 'pix' && styles.paymentMethodActive
                  ]}
                  onPress={() => setPaymentMethod('pix')}
                >
                  <Ionicons 
                    name="phone-portrait" 
                    size={20} 
                    color={paymentMethod === 'pix' ? colors.primaryForeground : colors.foreground} 
                  />
                  <Text style={[
                    styles.paymentMethodText,
                    paymentMethod === 'pix' && styles.paymentMethodTextActive
                  ]}>
                    PIX
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.paymentMethod,
                    paymentMethod === 'card' && styles.paymentMethodActive
                  ]}
                  onPress={() => setPaymentMethod('card')}
                >
                  <Ionicons 
                    name="card" 
                    size={20} 
                    color={paymentMethod === 'card' ? colors.primaryForeground : colors.foreground} 
                  />
                  <Text style={[
                    styles.paymentMethodText,
                    paymentMethod === 'card' && styles.paymentMethodTextActive
                  ]}>
                    Cartão
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Resumo da Compra */}
            {selectedNumbers.length > 0 && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Resumo da Compra</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Números selecionados:</Text>
                  <Text style={styles.summaryValue}>{selectedNumbers.length}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Preço unitário:</Text>
                  <Text style={styles.summaryValue}>
                    R$ {raffle.ticketPrice.toFixed(2).replace('.', ',')}
                  </Text>
                </View>
                <View style={styles.summaryTotal}>
                  <Text style={styles.summaryTotalLabel}>Total:</Text>
                  <Text style={styles.summaryTotalValue}>
                    R$ {(selectedNumbers.length * raffle.ticketPrice).toFixed(2).replace('.', ',')}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.purchaseButton]} 
              onPress={handlePurchase}
              disabled={selectedNumbers.length === 0}
            >
              <Text style={[styles.buttonText, styles.purchaseButtonText]}>
                Comprar ({selectedNumbers.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}