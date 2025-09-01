import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { chatService } from '../../services/chatService';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export function CommunityChatScreen({ route }: any) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Array<any>>([]);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);
  const churchId = route?.params?.churchId || 'global';
  const room = `community:${churchId}`;

  useEffect(() => {
    chatService.connect();
    chatService.join(room);
    const handler = (msg: any) => setMessages(prev => [...prev, msg]);
    chatService.onMessage(handler);
    apiService['request'](`/chat/history?room=${encodeURIComponent(room)}&limit=50`, { method: 'GET' } as any)
      .then(setMessages)
      .catch(() => {});
    return () => { chatService.offMessage(handler); };
  }, [room]);

  const send = async () => {
    if (!text.trim()) return;
    await chatService.send(room, text.trim());
    setText('');
    listRef.current?.scrollToEnd({ animated: true });
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.card, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    title: { fontSize: 20, fontWeight: 'bold', color: colors.foreground },
    messageList: { flex: 1, padding: 16 },
    inputBar: { flexDirection: 'row', alignItems: 'center', padding: 8, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.card },
    input: { flex: 1, backgroundColor: colors.input, color: colors.foreground, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
    send: { backgroundColor: colors.primary, borderRadius: 12, padding: 10 }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat da Comunidade</Text>
      </View>
      <FlatList
        ref={listRef}
        style={styles.messageList}
        data={messages}
        keyExtractor={item => item.id || item._id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, marginBottom: 8 }}>
            <Text style={{ color: colors.foreground }}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputBar}>
        <TextInput value={text} onChangeText={setText} placeholder="Mensagem" placeholderTextColor={colors.mutedForeground} style={styles.input} />
        <TouchableOpacity style={styles.send} onPress={send}>
          <Ionicons name="send" size={18} color={colors.primaryForeground} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

