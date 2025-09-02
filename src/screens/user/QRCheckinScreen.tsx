import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { apiService } from '../../services/api';
import { Platform } from 'react-native';

export function QRCheckinScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [ScannerModule, setScannerModule] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      // Guard web since expo-barcode-scanner/camera may not be supported
      if (Platform.OS === 'web') {
        if (isMounted) {
          setHasPermission(false);
        }
        return;
      }

      try {
        const mod = await import('expo-barcode-scanner');
        if (!isMounted) return;
        setScannerModule(mod);
        const { status } = await mod.BarCodeScanner.requestPermissionsAsync();
        if (!isMounted) return;
        setHasPermission(status === 'granted');
      } catch (e) {
        if (isMounted) {
          setHasPermission(false);
        }
      }
    })();
    return () => {
      isMounted = false;
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

  const ScannerComponent = ScannerModule?.BarCodeScanner ?? null;

  return (
    <View style={{ flex: 1 }}>
      {ScannerComponent ? (
        <ScannerComponent
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.mutedForeground }}>Leitor de QR indisponível</Text>
        </View>
      )}
      {scanned && (
        <TouchableOpacity onPress={() => setScanned(false)} style={{ position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }}>
          <Text style={{ color: colors.primaryForeground, fontWeight: '600' }}>Escanear novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

