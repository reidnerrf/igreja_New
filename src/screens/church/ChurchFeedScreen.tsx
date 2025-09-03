import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { FeedCard } from '../../components/FeedCard';
import { CreatePostModal } from '../../components/modals/CreatePostModal';
import { usePosts } from '../../hooks/useApi';
import { apiService } from '../../services/api';

export function ChurchFeedScreen() {
  const { colors } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const { data: postsData, loading, error, refetch } = usePosts({ scope: 'church' });
  const posts = postsData || [];

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
          <Text style={styles.title}>Feed da Igreja</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowModal(true)}>
            <Ionicons name="add" size={18} color={colors.primaryForeground} />
            <Text style={styles.actionText}>Novo Post</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.content}>
        {posts.map((post: any) => (
          <FeedCard key={post.id || post._id} post={post} onLike={()=>{}} onComment={()=>{}} onShare={()=>{}} />
        ))}
      </ScrollView>
      <CreatePostModal visible={showModal} onClose={() => setShowModal(false)} onSubmit={async (data) => { await apiService.createPost({ ...data, scope: 'church' }); setShowModal(false); refetch(); }} userType={'church'} />
    </SafeAreaView>
  );
}

