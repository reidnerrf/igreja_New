import { Camera } from 'expo-camera';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { apiService } from '../../services/api';

export function QRCheckinScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
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
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <TouchableOpacity onPress={() => setScanned(false)} style={{ position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 }}>
          <Text style={{ color: colors.primaryForeground, fontWeight: '600' }}>Escanear novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

