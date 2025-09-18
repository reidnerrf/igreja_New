import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Skeleton } from '../components/Skeleton';
import { useI18n } from '../contexts/I18n';
import { useTheme } from '../contexts/ThemeContext';

export function LoadingScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();

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
        {t('loading_app')}
      </Text>
      <View style={{ width: '86%', marginTop: 20 }}>
        <Skeleton height={16} style={{ marginBottom: 12 }} />
        <Skeleton height={16} style={{ marginBottom: 12 }} />
        <Skeleton height={16} />
      </View>
    </View>
  );
}