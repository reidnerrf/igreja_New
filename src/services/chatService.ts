import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ChatService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      const base = API_BASE_URL.replace('/api','');
      this.socket = io(base, { transports: ['websocket'] });
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  join(room: string) {
    this.socket?.emit('join', room);
  }

  on(event: string, handler: (msg: any) => void) {
    this.socket?.on(event, handler);
  }

  off(event: string, handler: (msg: any) => void) {
    this.socket?.off(event, handler);
  }

  onMessage(handler: (msg: any) => void) {
    this.on('message', handler);
  }

  offMessage(handler: (msg: any) => void) {
    this.off('message', handler);
  }

  async send(room: string, text: string) {
    const userData = await AsyncStorage.getItem('user_data');
    const user = userData ? JSON.parse(userData) : null;
    this.socket?.emit('message', { room, userId: user?.id, text });
  }

  joinRaffle(raffleId: string) {
    this.join(`raffle:${raffleId}`);
  }

  onRaffleDrawn(handler: (payload: { raffleId: string; winner: any }) => void) {
    this.on('raffle_drawn', handler as any);
  }

  offRaffleDrawn(handler: (payload: { raffleId: string; winner: any }) => void) {
    this.off('raffle_drawn', handler as any);
  }
}

export const chatService = new ChatService();

