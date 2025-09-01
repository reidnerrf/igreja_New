import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  color?: string;
  onTranscript: (text: string) => void;
};

export function VoiceRecorder({ color = '#2563eb', onTranscript }: Props) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (SR) {
        const rec = new SR();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'pt-BR';
        rec.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const chunk = event.results[i][0].transcript;
            transcript += chunk;
          }
          if (transcript.trim()) onTranscript(transcript.trim());
        };
        recognitionRef.current = rec;
        setSupported(true);
      }
    }
  }, [onTranscript]);

  const toggle = async () => {
    if (!supported) return;
    if (!recording) {
      try { recognitionRef.current?.start(); } catch {}
      setRecording(true);
    } else {
      try { recognitionRef.current?.stop(); } catch {}
      setRecording(false);
    }
  };

  if (!supported) {
    return (
      <View style={{ padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' }}>
        <Text style={{ color: '#6b7280', fontSize: 12 }}>Reconhecimento de voz não disponível neste dispositivo.</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={toggle} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' }}>
      <Ionicons name={recording ? 'mic' : 'mic-outline'} size={18} color={recording ? '#ef4444' : color} />
      <Text style={{ marginLeft: 8, color: recording ? '#ef4444' : '#111827', fontWeight: '600' }}>
        {recording ? 'Gravando...' : 'Ditado por voz'}
      </Text>
    </TouchableOpacity>
  );
}

