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
import { apiService } from '../../services/api';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (postData: any) => void;
  userType: 'church' | 'user';
}

export function CreatePostModal({ visible, onClose, onSubmit, userType }: CreatePostModalProps) {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    content: '',
    images: [] as string[],
    type: 'text', // text, image, video
    eventTag: '',
  });

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à galeria para adicionar imagens');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setFormData({
        ...formData, 
        images: [...formData.images, ...newImages].slice(0, 5),
        type: 'image'
      });
    }
  };

  const handleCameraPicker = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à câmera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFormData({
        ...formData,
        images: [...formData.images, result.assets[0].uri].slice(0, 5),
        type: 'image'
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages,
      type: newImages.length > 0 ? 'image' : 'text'
    });
  };

  const handleSubmit = async () => {
    if (!formData.content.trim() && formData.images.length === 0) {
      Alert.alert('Erro', 'Adicione um texto ou imagem para publicar');
      return;
    }

    // Upload de imagens (se houver)
    let uploadedUrls: string[] = [];
    if (formData.images.length > 0) {
      const uploads = await Promise.all(
        formData.images.map(uri => apiService.uploadImage(uri, 'post'))
      );
      uploadedUrls = uploads.map(u => u.url || u.location || u.path || u); // aceitar diferentes formatos de resposta
    }

    onSubmit({
      ...formData,
      images: uploadedUrls.length > 0 ? uploadedUrls : formData.images,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0
    });

    setFormData({
      content: '',
      images: [],
      type: 'text',
      eventTag: '',
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
    textInput: {
      backgroundColor: colors.input,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.foreground,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 120,
      textAlignVertical: 'top',
      marginBottom: 16,
    },
    mediaContainer: {
      marginBottom: 16,
    },
    mediaButtons: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    mediaButton: {
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
    mediaButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.foreground,
      marginLeft: 8,
    },
    imagesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    imagePreview: {
      width: 80,
      height: 80,
      borderRadius: 8,
      position: 'relative',
    },
    removeImageButton: {
      position: 'absolute',
      top: -8,
      right: -8,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.destructive,
      justifyContent: 'center',
      alignItems: 'center',
    },
    eventTagContainer: {
      marginBottom: 16,
    },
    eventTagLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: 8,
    },
    eventTagInput: {
      backgroundColor: colors.input,
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      color: colors.foreground,
      borderWidth: 1,
      borderColor: colors.border,
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
            <Text style={styles.title}>Nova Publicação</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <TextInput
              style={styles.textInput}
              value={formData.content}
              onChangeText={(text) => setFormData({...formData, content: text})}
              placeholder={userType === 'church' 
                ? "Compartilhe uma mensagem com sua comunidade..." 
                : "Compartilhe sua experiência de fé..."
              }
              placeholderTextColor={colors.mutedForeground}
              multiline
            />

            <View style={styles.mediaContainer}>
              <View style={styles.mediaButtons}>
                <TouchableOpacity style={styles.mediaButton} onPress={handleImagePicker}>
                  <Ionicons name="images" size={20} color={colors.primary} />
                  <Text style={styles.mediaButtonText}>Galeria</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.mediaButton} onPress={handleCameraPicker}>
                  <Ionicons name="camera" size={20} color={colors.primary} />
                  <Text style={styles.mediaButtonText}>Câmera</Text>
                </TouchableOpacity>
              </View>

              {formData.images.length > 0 && (
                <View style={styles.imagesGrid}>
                  {formData.images.map((image, index) => (
                    <View key={index} style={{ position: 'relative' }}>
                      <Image source={{ uri: image }} style={styles.imagePreview} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <Ionicons name="close" size={12} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {userType === 'user' && (
              <View style={styles.eventTagContainer}>
                <Text style={styles.eventTagLabel}>Marcar Evento (Opcional)</Text>
                <TextInput
                  style={styles.eventTagInput}
                  value={formData.eventTag}
                  onChangeText={(text) => setFormData({...formData, eventTag: text})}
                  placeholder="Ex: Culto Dominical"
                  placeholderTextColor={colors.mutedForeground}
                />
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
              <Text style={[styles.buttonText, styles.submitButtonText]}>Publicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}