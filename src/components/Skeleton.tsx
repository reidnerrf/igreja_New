import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export function Skeleton({ width = '100%', height = 16, radius = 8, style = {} as any }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true
      })
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  const translateX = shimmer.interpolate({ inputRange: [0, 1], outputRange: [-100, 200] });

  return (
    <View style={{ width, height, borderRadius: radius, backgroundColor: '#e5e7eb', overflow: 'hidden', ...style }}>
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 100,
          transform: [{ translateX }],
          backgroundColor: 'rgba(255,255,255,0.35)'
        }}
      />
    </View>
  );
}

