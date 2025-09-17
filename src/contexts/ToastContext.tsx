import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType, durationMs?: number) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true })
    ]).start();
  }, [opacity, translateY]);

  const animateOut = useCallback((onEnd?: () => void) => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 80, duration: 200, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 180, easing: Easing.in(Easing.cubic), useNativeDriver: true })
    ]).start(() => onEnd && onEnd());
  }, [opacity, translateY]);

  const showToast = useCallback((message: string, type: ToastType = 'info', durationMs = 3000) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts([{ id, message, type }]);
    animateIn();
    const timeout = setTimeout(() => {
      animateOut(() => setToasts([]));
      clearTimeout(timeout);
    }, durationMs);
  }, [animateIn, animateOut]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  const colorByType = (type: ToastType) => {
    switch (type) {
      case 'success': return '#16a34a';
      case 'error': return '#dc2626';
      default: return '#2563eb';
    }
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center' }}>
        {toasts.map(t => (
          <Animated.View
            key={t.id}
            style={{
              transform: [{ translateY }],
              opacity,
              backgroundColor: '#111827',
              borderLeftWidth: 4,
              borderLeftColor: colorByType(t.type),
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 10,
              shadowColor: '#000',
              shadowOpacity: 0.12,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
              elevation: 3,
              maxWidth: '92%'
            }}
          >
            <Text style={{ color: 'white', fontSize: 14 }}>{t.message}</Text>
          </Animated.View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

