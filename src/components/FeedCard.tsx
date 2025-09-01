import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface FeedCardProps {
  post: {
    id: string;
    author: {
      name: string;
      profileImage?: string;
      userType: 'church' | 'user';
    };
    content: string;
    images?: string[];
    createdAt: string;
    likes: number;
    comments: number;
    shares: number;
    isLiked?: boolean;
    eventTag?: {
      event: string;
      church: string;
    };
  };
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
}

export function FeedCard({ post, onLike, onComment, onShare }: FeedCardProps) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [imageIndex, setImageIndex] = useState(0);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return postDate.toLocaleDateString();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.content}\n\nCompartilhado via ConnectFé`,
        title: `Post de ${post.author.name}`,
      });
      onShare(post.id);
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      paddingBottom: 12,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.muted,
      marginRight: 12,
    },
    authorInfo: {
      flex: 1,
    },
    authorName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: 2,
    },
    authorType: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
    timestamp: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
    content: {
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    contentText: {
      fontSize: 14,
      color: colors.foreground,
      lineHeight: 20,
    },
    eventTag: {
      backgroundColor: colors.primary + '10',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginTop: 8,
      alignSelf: 'flex-start',
    },
    eventTagText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '500',
    },
    imagesContainer: {
      marginBottom: 12,
    },
    imageWrapper: {
      position: 'relative',
    },
    postImage: {
      width: '100%',
      height: 250,
      backgroundColor: colors.muted,
    },
    imageCounter: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: 'rgba(0,0,0,0.7)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    imageCounterText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '500',
    },
    imageNavigation: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 8,
      gap: 4,
    },
    imageDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.muted,
    },
    imageDotActive: {
      backgroundColor: colors.primary,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    actionButtonActive: {
      backgroundColor: colors.primary + '10',
    },
    actionText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.mutedForeground,
      marginLeft: 6,
    },
    actionTextActive: {
      color: colors.primary,
    },
  });

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          {post.author.profileImage ? (
            <Image source={{ uri: post.author.profileImage }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons 
                name={post.author.userType === 'church' ? 'business' : 'person'} 
                size={20} 
                color={colors.mutedForeground} 
              />
            </View>
          )}
        </View>
        
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.author.name}</Text>
          <Text style={styles.authorType}>
            {post.author.userType === 'church' ? 'Igreja' : 'Membro da comunidade'}
          </Text>
        </View>
        
        <Text style={styles.timestamp}>{formatTimeAgo(post.createdAt)}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.contentText}>{post.content}</Text>
        
        {post.eventTag && (
          <View style={styles.eventTag}>
            <Text style={styles.eventTagText}>📍 {post.eventTag.event}</Text>
          </View>
        )}
      </View>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <View style={styles.imagesContainer}>
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: post.images[imageIndex] }} 
              style={styles.postImage}
              resizeMode="cover"
            />
            
            {post.images.length > 1 && (
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {imageIndex + 1}/{post.images.length}
                </Text>
              </View>
            )}
          </View>
          
          {post.images.length > 1 && (
            <View style={styles.imageNavigation}>
              {post.images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setImageIndex(index)}
                >
                  <View style={[
                    styles.imageDot,
                    index === imageIndex && styles.imageDotActive
                  ]} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            post.isLiked && styles.actionButtonActive
          ]}
          onPress={() => onLike(post.id)}
        >
          <Ionicons 
            name={post.isLiked ? 'heart' : 'heart-outline'} 
            size={20} 
            color={post.isLiked ? colors.primary : colors.mutedForeground} 
          />
          <Text style={[
            styles.actionText,
            post.isLiked && styles.actionTextActive
          ]}>
            {post.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onComment(post.id)}
        >
          <Ionicons name="chatbubble-outline" size={20} color={colors.mutedForeground} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={20} color={colors.mutedForeground} />
          <Text style={styles.actionText}>{post.shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}