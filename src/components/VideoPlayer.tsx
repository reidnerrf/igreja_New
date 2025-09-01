import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { WebView } from 'react-native-webview';

interface VideoPlayerProps {
  url: string;
  onClose: () => void;
}

function toEmbed(url: string) {
  if (url.includes('youtube.com/watch')) {
    const id = url.split('v=')[1]?.split('&')[0];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }
  if (url.includes('facebook.com')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`;
  }
  return url;
}

export function VideoPlayer({ url, onClose }: VideoPlayerProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: '90%',
      height: '60%',
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.foreground,
    },
    closeButton: {
      padding: 8,
    },
    videoContainer: {
      flex: 1,
      backgroundColor: '#000',
    },
  });

  const embedUrl = toEmbed(url);

  return (
    <Modal visible={true} animationType="fade" transparent>
      <View style={styles.modal}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Reproduzindo Vídeo</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>
          <View style={styles.videoContainer}>
            <WebView source={{ uri: embedUrl }} allowsInlineMediaPlayback mediaPlaybackRequiresUserAction={false} />
          </View>
        </View>
      </View>
    </Modal>
  );
}