import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}

// Hook específico para eventos
export function useEvents(filters?: any) {
  return useApi(() => apiService.getEvents(filters), [filters]);
}

// Hook específico para igrejas
export function useChurches(location?: { latitude: number; longitude: number }) {
  return useApi(() => apiService.getChurches(location), [location]);
}

// Hook específico para transmissões
export function useTransmissions(filters?: any) {
  return useApi(() => apiService.getTransmissions(filters), [filters]);
}

// Hook específico para rifas
export function useRaffles(filters?: any) {
  return useApi(() => apiService.getRaffles(filters), [filters]);
}

// Hook específico para orações
export function usePrayers(filters?: any) {
  return useApi(() => apiService.getPrayers(filters), [filters]);
}

// Hook específico para posts
export function usePosts(filters?: any) {
  return useApi(() => apiService.getPosts(filters), [filters]);
}

// Hook específico para doações
export function useDonations(filters?: any) {
  return useApi(() => apiService.getDonations(filters), [filters]);
}