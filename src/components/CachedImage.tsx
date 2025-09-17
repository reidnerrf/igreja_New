import React from 'react';
import { Image } from 'expo-image';

type Props = {
  uri: string;
  width?: number | string;
  height?: number | string;
  placeholder?: string;
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  style?: any;
};

export function CachedImage({ uri, width = '100%', height = undefined, placeholder, contentFit = 'cover', style }: Props) {
  return (
    <Image
      source={{ uri }}
      style={[{ width, height, borderRadius: 10, backgroundColor: '#f3f4f6' }, style]}
      placeholder={placeholder}
      contentFit={contentFit}
      cachePolicy="memory-disk"
      transition={200}
    />
  );
}

