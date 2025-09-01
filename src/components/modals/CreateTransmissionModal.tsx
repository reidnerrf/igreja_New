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

interface CreateTransmissionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (transmissionData: any) => void;
}

export function CreateTransmissionModal({ visible, onClose, onSubmit }: CreateTransmissionModalProps) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: 'youtube',
    url: '',
    scheduledDate: '',
    scheduledTime: '',
    isLive: false,
  });

  const platforms = [
    { id: 'youtube', label: 'YouTube', icon: 'logo-youtube' },
    { id: 'facebook', label: 'Facebook', icon: 'logo-facebook' },
    { id: 'instagram', label: 'Instagram', icon: 'logo-instagram' },
    { id: 'native', label: 'Transmissão Nativa', icon: 'videocam' },
  ];

  const handleSubmit = () => {
    if (!formData.title || (!formData.url && formData.platform !== 'native')) {
      Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios');
      return;
    }

    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      platform: 'youtube',
      url: '',
      scheduledDate: '',
      scheduledTime: '',
      isLive: false,
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
    platformsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    platformButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    platformButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    platformText: {
      fontSize: 12,
      color: colors.foreground,
      marginLeft: 6,
    },
    platformTextActive: {
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
      backgroundColor: colors.primary,
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
            <Text style={styles.title}>Nova Transmissão</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título *</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData({...formData, title: text})}
                placeholder="Ex: Culto Dominical"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Plataforma</Text>
              <View style={styles.platformsContainer}>
                {platforms.map((platform) => (
                  <TouchableOpacity
                    key={platform.id}
                    style={[
                      styles.platformButton,
                      formData.platform === platform.id && styles.platformButtonActive
                    ]}
                    onPress={() => setFormData({...formData, platform: platform.id})}
                  >
                    <Ionicons 
                      name={platform.icon as any} 
                      size={14} 
                      color={formData.platform === platform.id ? colors.primaryForeground : colors.foreground} 
                    />
                    <Text style={[
                      styles.platformText,
                      formData.platform === platform.id && styles.platformTextActive
                    ]}>
                      {platform.label}
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
                placeholder="Descrição da transmissão..."
                placeholderTextColor={colors.mutedForeground}
                multiline
              />
            </View>

            {formData.platform !== 'native' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>URL da Transmissão *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.url}
                  onChangeText={(text) => setFormData({...formData, url: text})}
                  placeholder="https://youtube.com/watch?v=..."
                  placeholderTextColor={colors.mutedForeground}
                  autoCapitalize="none"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data Agendada</Text>
              <TextInput
                style={styles.input}
                value={formData.scheduledDate}
                onChangeText={(text) => setFormData({...formData, scheduledDate: text})}
                placeholder="DD/MM/AAAA (opcional)"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Horário</Text>
              <TextInput
                style={styles.input}
                value={formData.scheduledTime}
                onChangeText={(text) => setFormData({...formData, scheduledTime: text})}
                placeholder="HH:MM (opcional)"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
              <Text style={[styles.buttonText, styles.submitButtonText]}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}