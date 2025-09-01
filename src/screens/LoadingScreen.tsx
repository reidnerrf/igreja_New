import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export function LoadingScreen() {
  const { colors } = useTheme();

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background
    }}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{
        marginTop: 16,
        fontSize: 16,
        color: colors.foreground,
        fontWeight: '500'
      }}>
        Carregando ConnectFé...
      </Text>
    </View>
  );
}