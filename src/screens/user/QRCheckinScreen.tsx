import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { apiService } from '../../services/api';

export function QRCheckinScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [Scanner, setScanner] = useState<any>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        try {
          const mod = await import('expo-barcode-scanner');
          const BarCodeScanner = (mod as any).BarCodeScanner;
          if (mounted) {
            setScanner(() => BarCodeScanner);
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
          }
        } catch (e) {
          if (mounted) setHasPermission(false);
        }
      } else {
        if (mounted) setHasPermission(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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

  if (hasPermission === null) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: colors.mutedForeground }}>Solicitando permissão…</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: colors.mutedForeground }}>Sem acesso à câmera</Text></View>;
  }

  return (
    <View style={{ flex: 1 }}>
      {Scanner ? (
        <Scanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      ) : null}
      {scanned && (
        <TouchableOpacity onPress={() => setScanned(false)} style={{ position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }}>
          <Text style={{ color: colors.primaryForeground, fontWeight: '600' }}>Escanear novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

