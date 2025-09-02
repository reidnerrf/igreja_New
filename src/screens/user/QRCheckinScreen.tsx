import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
// Avoid static import to prevent Expo Go native module error
let BarCodeScanner: any = null;
import { useTheme } from '../../contexts/ThemeContext';
import { apiService } from '../../services/api';

export function QRCheckinScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    (async () => {
      try {
        if (!isWeb) {
          if (!BarCodeScanner) {
            const mod = await import('expo-barcode-scanner');
            BarCodeScanner = mod.BarCodeScanner;
          }
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        } else {
          setHasPermission(false);
        }
      } catch (e) {
        setHasPermission(false);
      }
    })();
  }, [isWeb]);

  const handleBarCodeScanned = async ({ data }: any) => {
    setScanned(true);
    try {
      // Espera-se um link com eventId (ex.: connectfe://event/checkin?id=...)
      const url = new URL(data);
      const eventId = url.searchParams.get('id');
      if (eventId) {
        await apiService.confirmAttendance(eventId);
        navigation.goBack();
      }
    } catch {
      setScanned(false);
    }
  };

  if (!isWeb && hasPermission === null) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: colors.mutedForeground }}>Solicitando permissão…</Text></View>;
  }
  if (isWeb || hasPermission === false) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: colors.mutedForeground }}>Sem acesso à câmera</Text></View>;
  }

  return (
    <View style={{ flex: 1 }}>
      {BarCodeScanner ? (
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />) : null}
      {scanned && (
        <TouchableOpacity onPress={() => setScanned(false)} style={{ position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }}>
          <Text style={{ color: colors.primaryForeground, fontWeight: '600' }}>Escanear novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

