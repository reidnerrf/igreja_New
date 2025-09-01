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
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../contexts/ThemeContext';

interface CreateRaffleModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (raffleData: any) => void;
}

export function CreateRaffleModal({ visible, onClose, onSubmit }: CreateRaffleModalProps) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prize: '',
    ticketPrice: '',
    totalTickets: '',
    endDate: '',
    prizeImage: null as string | null,
  });

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à galeria para adicionar imagens');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData({...formData, prizeImage: result.assets[0].uri});
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.prize || !formData.ticketPrice || !formData.totalTickets) {
      Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios');
      return;
    }

    const ticketPrice = parseFloat(formData.ticketPrice);
    const totalTickets = parseInt(formData.totalTickets);

    if (isNaN(ticketPrice) || ticketPrice <= 0) {
      Alert.alert('Erro', 'Preço do bilhete deve ser um valor válido');
      return;
    }

    if (isNaN(totalTickets) || totalTickets <= 0) {
      Alert.alert('Erro', 'Quantidade de bilhetes deve ser um número válido');
      return;
    }

    const totalValue = ticketPrice * totalTickets;

    onSubmit({
      ...formData,
      ticketPrice,
      totalTickets,
      totalValue,
      soldTickets: 0,
      status: 'active'
    });

    setFormData({
      title: '',
      description: '',
      prize: '',
      ticketPrice: '',
      totalTickets: '',
      endDate: '',
      prizeImage: null,
    });
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
    form: {
      flex: 1,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.input,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.foreground,
      borderWidth: 1,
      borderColor: colors.border,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    imagePreview: {
      width: '100%',
      height: 150,
      borderRadius: 8,
      marginBottom: 12,
    },
    imagePlaceholder: {
      width: '100%',
      height: 150,
      backgroundColor: colors.muted,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
    },
    imageButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    imageButtonText: {
      color: colors.primaryForeground,
      fontWeight: '500',
      marginLeft: 8,
    },
    priceContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    priceInput: {
      flex: 1,
    },
    calculationCard: {
      backgroundColor: colors.primary + '10',
      borderRadius: 8,
      padding: 12,
      marginTop: 8,
    },
    calculationText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
      textAlign: 'center',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
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
    submitButton: {
      backgroundColor: colors.success,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: colors.foreground,
    },
    submitButtonText: {
      color: colors.primaryForeground,
    },
  });

  const ticketPrice = parseFloat(formData.ticketPrice) || 0;
  const totalTickets = parseInt(formData.totalTickets) || 0;
  const totalValue = ticketPrice * totalTickets;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modal}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Nova Rifa</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título da Rifa *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData({...formData, title: text})}
                placeholder="Ex: Rifa do Notebook"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prêmio *</Text>
              <TextInput
                style={styles.input}
                value={formData.prize}
                onChangeText={(text) => setFormData({...formData, prize: text})}
                placeholder="Ex: Notebook Dell Inspiron 15"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>

            <View style={styles.imageContainer}>
              <Text style={styles.label}>Foto do Prêmio</Text>
              {formData.prizeImage ? (
                <Image source={{ uri: formData.prizeImage }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera" size={32} color={colors.mutedForeground} />
                  <Text style={{ color: colors.mutedForeground, marginTop: 8 }}>
                    Adicionar foto do prêmio
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.imageButton} onPress={handleImagePicker}>
                <Ionicons name="camera" size={16} color={colors.primaryForeground} />
                <Text style={styles.imageButtonText}>
                  {formData.prizeImage ? 'Alterar Foto' : 'Adicionar Foto'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({...formData, description: text})}
                placeholder="Descrição do prêmio e regras da rifa..."
                placeholderTextColor={colors.mutedForeground}
                multiline
              />
            </View>

            <View style={styles.priceContainer}>
              <View style={[styles.inputGroup, styles.priceInput]}>
                <Text style={styles.label}>Preço do Bilhete (R$) *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.ticketPrice}
                  onChangeText={(text) => setFormData({...formData, ticketPrice: text})}
                  placeholder="Ex: 5.00"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, styles.priceInput]}>
                <Text style={styles.label}>Quantidade de Bilhetes *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.totalTickets}
                  onChangeText={(text) => setFormData({...formData, totalTickets: text})}
                  placeholder="Ex: 100"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {totalValue > 0 && (
              <View style={styles.calculationCard}>
                <Text style={styles.calculationText}>
                  Total a arrecadar: R$ {totalValue.toFixed(2).replace('.', ',')}
                </Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data de Encerramento</Text>
              <TextInput
                style={styles.input}
                value={formData.endDate}
                onChangeText={(text) => setFormData({...formData, endDate: text})}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
              <Text style={[styles.buttonText, styles.submitButtonText]}>Criar Rifa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}