import React, { useRef } from 'react';
import { Animated, Pressable, ViewStyle, PressableStateCallbackType } from 'react-native';

type Props = Omit<React.ComponentProps<typeof Pressable>, 'children'> & {
  scale?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
};

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

