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

interface CreatePrayerModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (prayerData: any) => void;
}

export function CreatePrayerModal({ visible, onClose, onSubmit }: CreatePrayerModalProps) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'personal',
    isAnonymous: false,
    isUrgent: false,
  });

  const categories = [
    { id: 'personal', label: 'Pessoal', icon: 'person' },
    { id: 'family', label: 'Família', icon: 'people' },
    { id: 'health', label: 'Saúde', icon: 'medical' },
    { id: 'work', label: 'Trabalho', icon: 'briefcase' },
    { id: 'gratitude', label: 'Gratidão', icon: 'heart' },
    { id: 'community', label: 'Comunidade', icon: 'home' },
  ];

  const handleSubmit = () => {
    if (!formData.content.trim()) {
      Alert.alert('Erro', 'Por favor, descreva seu pedido de oração');
      return;
    }

    onSubmit({
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'pending',
      prayers: 0
    });

    setFormData({
      title: '',
      content: '',
      category: 'personal',
      isAnonymous: false,
      isUrgent: false,
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
      height: 120,
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
    switchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      marginBottom: 8,
    },
    switchLabel: {
      fontSize: 14,
      color: colors.foreground,
      flex: 1,
    },
    switchDescription: {
      fontSize: 12,
      color: colors.mutedForeground,
      marginTop: 4,
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
            <Text style={styles.title}>Pedido de Oração</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Título (Opcional)</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData({...formData, title: text})}
                placeholder="Ex: Oração pela família"
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
              <Text style={styles.label}>Seu Pedido *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.content}
                onChangeText={(text) => setFormData({...formData, content: text})}
                placeholder="Descreva seu pedido de oração..."
                placeholderTextColor={colors.mutedForeground}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.switchContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchLabel}>Pedido anônimo</Text>
                  <Text style={styles.switchDescription}>
                    Seu nome não será exibido publicamente
                  </Text>
                </View>
                <Switch
                  value={formData.isAnonymous}
                  onValueChange={(value) => setFormData({...formData, isAnonymous: value})}
                  trackColor={{ false: colors.muted, true: colors.primary }}
                  thumbColor={colors.card}
                />
              </View>

              <View style={styles.switchContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchLabel}>Pedido urgente</Text>
                  <Text style={styles.switchDescription}>
                    Será destacado para a igreja
                  </Text>
                </View>
                <Switch
                  value={formData.isUrgent}
                  onValueChange={(value) => setFormData({...formData, isUrgent: value})}
                  trackColor={{ false: colors.muted, true: colors.destructive }}
                  thumbColor={colors.card}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
              <Text style={[styles.buttonText, styles.submitButtonText]}>Enviar Pedido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}