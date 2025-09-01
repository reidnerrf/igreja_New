import React from 'react';
import { View } from 'react-native';

export function Skeleton({ width = '100%', height = 16, radius = 8, style = {} as any }) {
  return (
    <View style={{
      width,
      height,
      borderRadius: radius,
      backgroundColor: '#e5e7eb',
      overflow: 'hidden',
      ...style,
    }} />
  );
}

