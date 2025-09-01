import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface CreateDonationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (donationData: any) => void;
}

export function CreateDonationModal({ visible, onClose, onSubmit }: CreateDonationModalProps) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    endDate: '',
    pixKey: '',
    category: 'general',
  });

  const categories = [
    { id: 'general', label: 'Geral', icon: 'heart' },
    { id: 'construction', label: 'Reforma', icon: 'hammer' },
    { id: 'social', label: 'Ação Social', icon: 'people' },
    { id: 'mission', label: 'Missão', icon: 'airplane' },
    { id: 'equipment', label: 'Equipamentos', icon: 'hardware-chip' },
  ];

  const handleSubmit = () => {
    if (!formData.title || !formData.goal || !formData.pixKey) {
      Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios');
      return;
    }

    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      goal: '',
      endDate: '',
      pixKey: '',
      category: 'general',
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
      maxHeight: '80%',
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
    categoriesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    categoryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    categoryButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryText: {
      fontSize: 12,
      color: colors.foreground,
      marginLeft: 6,
    },
    categoryTextActive: {
      color: colors.primaryForeground,
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

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modal}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Nova Campanha de Doação</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título da Campanha *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData({...formData, title: text})}
                placeholder="Ex: Reforma do Telhado"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoria</Text>
              <View style={styles.categoriesContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      formData.category === category.id && styles.categoryButtonActive
                    ]}
                    onPress={() => setFormData({...formData, category: category.id})}
                  >
                    <Ionicons 
                      name={category.icon as any} 
                      size={14} 
                      color={formData.category === category.id ? colors.primaryForeground : colors.foreground} 
                    />
                    <Text style={[
                      styles.categoryText,
                      formData.category === category.id && styles.categoryTextActive
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({...formData, description: text})}
                placeholder="Descreva o objetivo da campanha..."
                placeholderTextColor={colors.mutedForeground}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Meta de Arrecadação (R$) *</Text>
              <TextInput
                style={styles.input}
                value={formData.goal}
                onChangeText={(text) => setFormData({...formData, goal: text})}
                placeholder="Ex: 50000"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="numeric"
              />
            </View>

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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Chave PIX *</Text>
              <TextInput
                style={styles.input}
                value={formData.pixKey}
                onChangeText={(text) => setFormData({...formData, pixKey: text})}
                placeholder="Digite a chave PIX"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
              <Text style={[styles.buttonText, styles.submitButtonText]}>Criar Campanha</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}