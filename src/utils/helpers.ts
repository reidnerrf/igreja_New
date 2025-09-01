import { Alert, Linking, Platform } from 'react-native';
import * as Calendar from 'expo-calendar';
import * as Location from 'expo-location';

// Formatação de data e hora
export const formatDate = (date: string | Date, format: 'short' | 'long' | 'time' = 'short') => {
  const d = new Date(date);
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString('pt-BR');
    case 'long':
      return d.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'time':
      return d.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    default:
      return d.toLocaleDateString('pt-BR');
  }
};

// Formatação de valores monetários
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Formatação de números
export const formatNumber = (value: number, compact = false) => {
  if (compact && value >= 1000) {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
  }
  return value.toLocaleString('pt-BR');
};

// Calcular tempo relativo
export const getTimeAgo = (date: string | Date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'agora';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}sem`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mês`;
  return `${Math.floor(diffInSeconds / 31536000)}ano`;
};

// Validações
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string) => {
  const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
};

export const validatePixKey = (pixKey: string) => {
  // Validação básica para chave PIX
  return pixKey.length > 0 && pixKey.length <= 77;
};

// Formatação de telefone
export const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

// Abrir direções no mapa
export const openDirections = async (address: string, coordinates?: { latitude: number; longitude: number }) => {
  try {
    let url = '';
    
    if (coordinates) {
      if (Platform.OS === 'ios') {
        url = `maps://app?daddr=${coordinates.latitude},${coordinates.longitude}`;
      } else {
        url = `google.navigation:q=${coordinates.latitude},${coordinates.longitude}`;
      }
    } else {
      const encodedAddress = encodeURIComponent(address);
      if (Platform.OS === 'ios') {
        url = `maps://app?daddr=${encodedAddress}`;
      } else {
        url = `google.navigation:q=${encodedAddress}`;
      }
    }

    const supported = await Linking.canOpenURL(url);
    
    if (supported) {
      await Linking.openURL(url);
    } else {
      // Fallback para Google Maps web
      const webUrl = coordinates 
        ? `https://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      
      await Linking.openURL(webUrl);
    }
  } catch (error) {
    console.error('Erro ao abrir direções:', error);
    Alert.alert('Erro', 'Não foi possível abrir as direções');
  }
};

// Adicionar evento ao calendário
export const addToCalendar = async (event: {
  title: string;
  date: string;
  time: string;
  location?: string;
  notes?: string;
}) => {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso ao calendário');
      return;
    }

    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const defaultCalendar = calendars.find(cal => cal.source.name === 'Default') || calendars[0];

    if (!defaultCalendar) {
      Alert.alert('Erro', 'Nenhum calendário disponível');
      return;
    }

    const eventDate = new Date(`${event.date}T${event.time}`);
    const endDate = new Date(eventDate.getTime() + (2 * 60 * 60 * 1000)); // 2 horas depois

    await Calendar.createEventAsync(defaultCalendar.id, {
      title: event.title,
      startDate: eventDate,
      endDate: endDate,
      location: event.location,
      notes: event.notes,
      timeZone: 'America/Sao_Paulo',
    });

    Alert.alert('Sucesso', 'Evento adicionado ao calendário');
  } catch (error) {
    console.error('Erro ao adicionar ao calendário:', error);
    Alert.alert('Erro', 'Não foi possível adicionar ao calendário');
  }
};

// Obter localização atual
export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permissão de localização negada');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Erro ao obter localização:', error);
    throw error;
  }
};

// Calcular distância entre dois pontos
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

// Formatar distância
export const formatDistance = (distance: number) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

// Gerar cores aleatórias para avatars
export const generateAvatarColor = (name: string) => {
  const colors = [
    '#2563eb', '#dc2626', '#059669', '#d97706',
    '#7c3aed', '#db2777', '#0891b2', '#65a30d'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Truncar texto
export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Debounce function
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Verificar se URL é válida
export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Extrair ID do YouTube
export const extractYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Gerar thumbnail do YouTube
export const getYouTubeThumbnail = (videoId: string, quality: 'default' | 'medium' | 'high' = 'medium') => {
  return `https://img.youtube.com/vi/${videoId}/${quality === 'high' ? 'maxresdefault' : quality === 'medium' ? 'mqdefault' : 'default'}.jpg`;
};

// Compartilhar conteúdo
export const shareContent = async (title: string, message: string, url?: string) => {
  try {
    const { Share } = require('react-native');
    
    const content = {
      title,
      message: url ? `${message}\n\n${url}` : message,
    };

    await Share.share(content);
  } catch (error) {
    console.error('Erro ao compartilhar:', error);
  }
};

// Gerar código de referência único
export const generateReferenceCode = (prefix: string = '') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${random}`.toUpperCase();
};