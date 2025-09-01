import React, { useRef } from 'react';
import { Animated, Pressable, ViewStyle } from 'react-native';

type Props = React.ComponentProps<typeof Pressable> & { scale?: number; style?: ViewStyle };

export function PressableScale({ scale = 0.97, style, children, ...props }: Props) {
  const anim = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      {...props}
      onPressIn={(e) => {
        Animated.spring(anim, { toValue: scale, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
        props.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
        props.onPressOut?.(e);
      }}
    >
      <Animated.View style={[{ transform: [{ scale: anim }] }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

