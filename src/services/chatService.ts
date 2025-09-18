import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ChatService {
  private socket: Socket | null = null;

  async connect() {
    if (!this.socket) {
      const base = API_BASE_URL.replace('/api','');
      const token = await AsyncStorage.getItem('auth_token');
      this.socket = io(base, {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 500,
        auth: { token: token ? `Bearer ${token}` : '' }
      });

      // Buffer de mensagens durante reconexão
      const pending: any[] = [];
      const emitOriginal = this.socket.emit.bind(this.socket);
      this.socket.emit = ((event: string, ...args: any[]) => {
        if (this.socket && this.socket.connected) return emitOriginal(event, ...args);
        pending.push([event, ...args]);
        return this.socket;
      }) as any;
      this.socket.on('connect', () => {
        while (pending.length) {
          const [evt, ...rest] = pending.shift();
          emitOriginal(evt, ...rest);
        }
      });
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
    this.socket?.emit('message', { room, text });
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

