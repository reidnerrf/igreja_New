import AsyncStorage from '@react-native-async-storage/async-storage';

// Vite/Expo web do not define __DEV__ at build-time the same way as React Native.
// Prefer environment variable with sensible fallbacks for local dev.
const isDev = (import.meta as any)?.env?.MODE === 'development' || (import.meta as any)?.env?.DEV || (globalThis as any)?.__DEV__;
const envApiBase = (import.meta as any)?.env?.VITE_API_BASE_URL;
export const API_BASE_URL = envApiBase || (isDev ? 'http://localhost:3001/api' : 'https://your-api.com/api');

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getAuthToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Offline queue wrapper for write operations
  async requestWithQueue(endpoint: string, options: RequestInit = {}) {
    try {
      return await this.request(endpoint, options);
    } catch (error) {
      try {
        const queueRaw = (await AsyncStorage.getItem('offline_queue')) || '[]';
        const queue = JSON.parse(queueRaw);
        queue.push({ endpoint, options, createdAt: Date.now() });
        await AsyncStorage.setItem('offline_queue', JSON.stringify(queue));
      } catch {}
      throw error;
    }
  }

  // Auth
  async login(email: string, password: string, userType: 'church' | 'user') {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, userType }),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async socialLogin(provider: string, token: string, userType: 'church' | 'user', userData?: any) {
    return this.request('/auth/social', {
      method: 'POST',
      body: JSON.stringify({ provider, token, userType, userData }),
    });
  }

  // Churches
  async getChurches(location?: { latitude: number; longitude: number }) {
    const params = location ? `?lat=${location.latitude}&lng=${location.longitude}` : '';
    return this.request(`/churches${params}`);
  }

  async getChurchById(id: string) {
    return this.request(`/churches/${id}`);
  }

  async followChurch(churchId: string) {
    return this.request(`/churches/${churchId}/follow`, {
      method: 'POST',
    });
  }

  async unfollowChurch(churchId: string) {
    return this.request(`/churches/${churchId}/follow`, {
      method: 'DELETE',
    });
  }

  // Events
  async getEvents(filters?: any) {
    const mapped: any = {};
    if (filters?.filter) {
      if (['today','week','month'].includes(filters.filter)) mapped.period = filters.filter;
    }
    const params = new URLSearchParams({ ...filters, ...mapped }).toString();
    return this.request(`/events?${params}`);
  }

  getEventIcsUrl(eventId: string) {
    return `${API_BASE_URL}/events-ics/${eventId}.ics`;
  }

  async createEvent(eventData: any) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id: string, eventData: any) {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id: string) {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  async confirmAttendance(eventId: string) {
    return this.requestWithQueue(`/events/${eventId}/attend`, {
      method: 'POST',
    });
  }

  // Transmissions
  async getTransmissions(filters?: any) {
    const mapped: any = {};
    if (filters?.filter) {
      if (['today','week','month'].includes(filters.filter)) mapped.period = filters.filter;
    }
    const params = new URLSearchParams({ ...filters, ...mapped }).toString();
    return this.request(`/transmissions?${params}`);
  }

  async createTransmission(transmissionData: any) {
    return this.request('/transmissions', {
      method: 'POST',
      body: JSON.stringify(transmissionData),
    });
  }

  // Donations
  async getDonations(filters?: any) {
    const mapped: any = {};
    if (filters?.filter) {
      if (['today','week','month'].includes(filters.filter)) mapped.period = filters.filter;
    }
    const params = new URLSearchParams({ ...filters, ...mapped }).toString();
    return this.request(`/donations?${params}`);
  }

  async createDonation(donationData: any) {
    return this.request('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  }

  async createDonationCampaign(campaignData: any) {
    return this.request('/donations/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  }

  async listDonationCampaigns(filters?: any) {
    const params = new URLSearchParams(filters || {}).toString();
    return this.request(`/donations/campaigns?${params}`);
  }

  async getDonationCampaign(id: string) {
    return this.request(`/donations/campaigns/${id}`);
  }

  async updateDonationCampaign(id: string, data: any) {
    return this.request(`/donations/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  }

  async deleteDonationCampaign(id: string) {
    return this.request(`/donations/campaigns/${id}`, { method: 'DELETE' });
  }

  async processDonation(donationId: string, paymentData: any) {
    return this.request(`/donations/${donationId}/process`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  getPublicCampaignUrl(slug: string) {
    return `${API_BASE_URL}/donations/public/${slug}`;
  }

  // PIX
  async generatePix(amount: number, church: string, campaign?: string, message?: string) {
    return this.request('/pix/generate', { method: 'POST', body: JSON.stringify({ amount, church, campaign, message }) });
  }

  async getPixStatus(txid: string) {
    return this.request(`/pix/status/${txid}`);
  }

  // Raffles
  async getRaffles(filters?: any) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/raffles?${params}`);
  }

  async createRaffle(raffleData: any) {
    return this.request('/raffles', {
      method: 'POST',
      body: JSON.stringify(raffleData),
    });
  }

  async buyRaffleTickets(raffleId: string, ticketNumbers: number[], paymentData: any) {
    return this.request(`/raffles/${raffleId}/buy`, {
      method: 'POST',
      body: JSON.stringify({ ticketNumbers, paymentData }),
    });
  }

  // Prayers
  async getPrayers(filters?: any) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/prayers?${params}`);
  }

  async createPrayer(prayerData: any) {
    return this.request('/prayers', {
      method: 'POST',
      body: JSON.stringify(prayerData),
    });
  }

  async updatePrayerStatus(id: string, status: string) {
    return this.request(`/prayers/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async prayForRequest(id: string) {
    return this.request(`/prayers/${id}/pray`, {
      method: 'POST',
    });
  }

  // Posts/Feed
  async getPosts(filters?: any) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/posts?${params}`);
  }

  async createPost(postData: any) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async likePost(postId: string) {
    return this.request(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async commentPost(postId: string, comment: string) {
    return this.request(`/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  }

  // Notifications
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async updateNotificationSettings(settings: any) {
    return this.request('/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // User Profile
  async updateProfile(profileData: any) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async uploadImage(imageUri: string, type: 'profile' | 'post' | 'event' | 'raffle') {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `${type}_${Date.now()}.jpg`,
    } as any);
    formData.append('type', type);

    return this.request('/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }

  // Analytics (Premium)
  async getAnalytics(type: 'church' | 'user', period: string) {
    return this.request(`/analytics/${type}?period=${period}`);
  }

  // Gamification
  async getMyGamification() {
    return this.request('/gamification/me');
  }

  async addPoints(points: number, type: string, context?: string) {
    return this.requestWithQueue('/gamification/me/points', {
      method: 'POST',
      body: JSON.stringify({ points, type, context }),
    });
  }

  async addBadge(id: string, name: string, icon?: string) {
    return this.requestWithQueue('/gamification/me/badges', {
      method: 'POST',
      body: JSON.stringify({ id, name, icon }),
    });
  }

  // Premium
  async subscribeToPremium(planId: string, paymentData: any) {
    return this.request('/premium/subscribe', {
      method: 'POST',
      body: JSON.stringify({ planId, paymentData }),
    });
  }

  async cancelPremium() {
    return this.request('/premium/cancel', {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();