import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './api';

// Configurar como as notificações devem ser tratadas quando recebidas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  } as any),
});

class NotificationService {
  private expoPushToken: string | null = null;

  async initialize() {
    // In Expo Go on SDK 53, getExpoPushTokenAsync is not supported. Guard to avoid runtime errors.
    const appOwnership = (Constants as any)?.appOwnership ?? 'standalone';
    const isRunningInExpoGo = appOwnership === 'expo';
    if (Device.isDevice && !isRunningInExpoGo) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Permissão de notificação negada');
        return null;
      }
      
      try {
        const tokenResponse = await Notifications.getExpoPushTokenAsync();
        this.expoPushToken = (tokenResponse as any)?.data ?? null;
        if (this.expoPushToken) {
          await AsyncStorage.setItem('expo_push_token', this.expoPushToken);
        }
      } catch (e) {
        // Swallow in Expo Go/unsupported contexts
        console.log('Push token not available in this environment');
      }
      
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2563eb',
        });
      }
      
      return this.expoPushToken;
    } else {
      console.log('Notificações push indisponíveis (Expo Go ou simulador)');
      return null;
    }
  }

  async getExpoPushToken(): Promise<string | null> {
    if (this.expoPushToken) {
      return this.expoPushToken;
    }
    
    const storedToken = await AsyncStorage.getItem('expo_push_token');
    if (storedToken) {
      this.expoPushToken = storedToken;
      return storedToken;
    }
    
    return await this.initialize();
  }

  async scheduleLocalNotification(title: string, body: string, data?: any, trigger?: any) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
      },
      trigger: trigger || null,
    });
  }

  async scheduleEventReminder(event: any, minutesBefore: number = 30) {
    const eventDate = new Date(event.date + 'T' + event.time);
    const reminderDate = new Date(eventDate.getTime() - (minutesBefore * 60 * 1000));
    
    if (reminderDate > new Date()) {
      await this.scheduleLocalNotification(
        `Lembrete: ${event.title}`,
        `O evento começará em ${minutesBefore} minutos`,
        { type: 'event_reminder', eventId: event.id },
        { date: reminderDate }
      );
    }
  }

  async scheduleDailyDevotional(hour: number = 7, minute: number = 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Devocional Diário 🙏',
        body: 'Sua reflexão diária está disponível',
        data: { type: 'daily_devotional' },
        sound: 'default',
      },
      trigger: { type: 'timeInterval', seconds: Math.max(1, (hour * 3600 + minute * 60)), repeats: true } as any,
    });
  }

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async cancelNotification(identifier: string) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }

  // Listener para notificações recebidas
  addNotificationReceivedListener(listener: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(listener);
  }

  // Listener para quando o usuário toca na notificação
  addNotificationResponseReceivedListener(listener: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  // Enviar notificação push para usuários específicos (via backend)
  async sendPushNotification(userTokens: string[], title: string, body: string, data?: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getExpoPushToken()}`,
        },
        body: JSON.stringify({
          tokens: userTokens,
          title,
          body,
          data,
        }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar notificação push:', error);
      throw error;
    }
  }

  // Configurações de notificação
  async updateNotificationSettings(settings: {
    events: boolean;
    prayers: boolean;
    donations: boolean;
    announcements: boolean;
    dailyDevotional: boolean;
    devotionalTime: { hour: number; minute: number };
  }) {
    await AsyncStorage.setItem('notification_settings', JSON.stringify(settings));
    
    // Cancelar notificações existentes
    await this.cancelAllNotifications();
    
    // Reagendar baseado nas novas configurações
    if (settings.dailyDevotional) {
      await this.scheduleDailyDevotional(
        settings.devotionalTime.hour,
        settings.devotionalTime.minute
      );
    }
  }

  async getNotificationSettings() {
    const settings = await AsyncStorage.getItem('notification_settings');
    return settings ? JSON.parse(settings) : {
      events: true,
      prayers: true,
      donations: true,
      announcements: true,
      dailyDevotional: true,
      devotionalTime: { hour: 7, minute: 0 },
    };
  }
}

export const notificationService = new NotificationService();