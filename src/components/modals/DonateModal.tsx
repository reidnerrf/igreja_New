import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { paymentService } from '../../services/paymentService';

interface DonateModalProps {
  visible: boolean;
  onClose: () => void;
  campaign: any;
  onSuccess: (donationData: any) => void;
}

export function DonateModal({ visible, onClose, campaign, onSuccess }: DonateModalProps) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    amount: '',
    message: '',
    isAnonymous: false,
    paymentMethod: 'pix',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const predefinedAmounts = [10, 25, 50, 100, 200];

  const handleAmountSelect = (amount: number) => {
    setFormData({...formData, amount: amount.toString()});
  };

  const handleDonate = async () => {
    const amount = parseFloat(formData.amount);
    
    if (!amount || amount <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido');
      return;
    }

    if (campaign?.minDonation && amount < campaign.minDonation) {
      Alert.alert('Erro', `Valor mínimo de doação: R$ ${campaign.minDonation.toFixed(2)}`);
      return;
    }

    if (campaign?.maxDonation && amount > campaign.maxDonation) {
      Alert.alert('Erro', `Valor máximo de doação: R$ ${campaign.maxDonation.toFixed(2)}`);
      return;
    }

    setIsProcessing(true);

    try {
      let paymentResult;
      
      if (formData.paymentMethod === 'pix') {
        paymentResult = await paymentService.processPixPayment({
          amount,
          description: `Doação para ${campaign.title}`,
          pixKey: campaign.church.pixKey,
          payerName: 'Usuário ConnectFé',
          payerEmail: 'user@connectfe.com'
        });
      } else {
        // Implementar pagamento com cartão
        Alert.alert('Em Desenvolvimento', 'Pagamento com cartão será implementado em breve');
        setIsProcessing(false);
        return;
      }

      if (paymentResult.success) {
        onSuccess({
          ...formData,
          amount,
          campaignId: campaign.id,
          transactionId: paymentResult.transactionId,
          qrCode: paymentResult.qrCode,
          pixCode: paymentResult.pixCode
        });
        
        setFormData({
          amount: '',
          message: '',
          isAnonymous: false,
          paymentMethod: 'pix',
        });
        
        Alert.alert(
          'Doação Iniciada',
          'Use o QR Code ou código PIX para finalizar sua doação',
          [{ text: 'OK', onPress: onClose }]
        );
      } else {
        Alert.alert('Erro', paymentResult.error || 'Erro ao processar doação');
      }
    } catch (error) {
      console.error('Erro na doação:', error);
      Alert.alert('Erro', 'Erro ao processar doação. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: '90%',
      maxHeight: '85%',
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
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.foreground,
    },
    closeButton: {
      padding: 8,
    },
    campaignInfo: {
      backgroundColor: colors.muted,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    campaignTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 8,
    },
    campaignProgress: {
      fontSize: 14,
      color: colors.mutedForeground,
    },
    form: {
      flex: 1,
    },
    amountContainer: {
      marginBottom: 20,
    },
    amountLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: 12,
    },
    predefinedAmounts: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
    },
    amountButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    amountButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    amountButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.foreground,
    },
    amountButtonTextActive: {
      color: colors.primaryForeground,
    },
    customAmountInput: {
      backgroundColor: colors.input,
      borderRadius: 8,
      padding: 12,
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.foreground,
      borderWidth: 1,
      borderColor: colors.border,
      textAlign: 'center',
    },
    messageContainer: {
      marginBottom: 20,
    },
    messageLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: 8,
    },
    messageInput: {
      backgroundColor: colors.input,
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      color: colors.foreground,
      borderWidth: 1,
      borderColor: colors.border,
      height: 80,
      textAlignVertical: 'top',
    },
    optionsContainer: {
      marginBottom: 20,
    },
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    switchLabel: {
      fontSize: 14,
      color: colors.foreground,
      flex: 1,
    },
    paymentMethodContainer: {
      marginBottom: 20,
    },
    paymentMethodLabel: {
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
    donateButton: {
      backgroundColor: colors.success,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: colors.foreground,
    },
    donateButtonText: {
      color: 'white',
    },
  });

  if (!campaign) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modal}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Fazer Doação</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Campaign Info */}
            <View style={styles.campaignInfo}>
              <Text style={styles.campaignTitle}>{campaign.title}</Text>
              <Text style={styles.campaignProgress}>
                R$ {campaign.raised.toLocaleString()} de R$ {campaign.goal.toLocaleString()} ({progress.toFixed(0)}%)
              </Text>
            </View>

            {/* Amount */}
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Valor da Doação</Text>
              
              <View style={styles.predefinedAmounts}>
                {predefinedAmounts.map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.amountButton,
                      formData.amount === amount.toString() && styles.amountButtonActive
                    ]}
                    onPress={() => handleAmountSelect(amount)}
                  >
                    <Text style={[
                      styles.amountButtonText,
                      formData.amount === amount.toString() && styles.amountButtonTextActive
                    ]}>
                      R$ {amount}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TextInput
                style={styles.customAmountInput}
                value={formData.amount}
                onChangeText={(text) => setFormData({...formData, amount: text})}
                placeholder="R$ 0,00"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="numeric"
              />
            </View>

            {/* Message */}
            <View style={styles.messageContainer}>
              <Text style={styles.messageLabel}>Mensagem (Opcional)</Text>
              <TextInput
                style={styles.messageInput}
                value={formData.message}
                onChangeText={(text) => setFormData({...formData, message: text})}
                placeholder="Deixe uma mensagem de apoio..."
                placeholderTextColor={colors.mutedForeground}
                multiline
              />
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Doação anônima</Text>
                <Switch
                  value={formData.isAnonymous}
                  onValueChange={(value) => setFormData({...formData, isAnonymous: value})}
                  trackColor={{ false: colors.muted, true: colors.primary }}
                  thumbColor={colors.card}
                />
              </View>
            </View>

            {/* Payment Method */}
            <View style={styles.paymentMethodContainer}>
              <Text style={styles.paymentMethodLabel}>Método de Pagamento</Text>
              <View style={styles.paymentMethods}>
                <TouchableOpacity
                  style={[
                    styles.paymentMethod,
                    formData.paymentMethod === 'pix' && styles.paymentMethodActive
                  ]}
                  onPress={() => setFormData({...formData, paymentMethod: 'pix'})}
                >
                  <Ionicons 
                    name="phone-portrait" 
                    size={20} 
                    color={formData.paymentMethod === 'pix' ? colors.primaryForeground : colors.foreground} 
                  />
                  <Text style={[
                    styles.paymentMethodText,
                    formData.paymentMethod === 'pix' && styles.paymentMethodTextActive
                  ]}>
                    PIX
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.paymentMethod,
                    formData.paymentMethod === 'card' && styles.paymentMethodActive
                  ]}
                  onPress={() => setFormData({...formData, paymentMethod: 'card'})}
                >
                  <Ionicons 
                    name="card" 
                    size={20} 
                    color={formData.paymentMethod === 'card' ? colors.primaryForeground : colors.foreground} 
                  />
                  <Text style={[
                    styles.paymentMethodText,
                    formData.paymentMethod === 'card' && styles.paymentMethodTextActive
                  ]}>
                    Cartão
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.donateButton]} 
              onPress={handleDonate}
              disabled={isProcessing}
            >
              <Text style={[styles.buttonText, styles.donateButtonText]}>
                {isProcessing ? 'Processando...' : 'Doar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}