import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useOfflineSync() {
  const syncingRef = useRef(false);

  useEffect(() => {
    const handler = () => {
      if (navigator.onLine) {
        flushQueue();
      }
    };
    window.addEventListener('online', handler);
    flushQueue();
    return () => window.removeEventListener('online', handler);
  }, []);

  const flushQueue = async () => {
    if (syncingRef.current) return;
    syncingRef.current = true;
    try {
      const raw = (await AsyncStorage.getItem('offline_queue')) || '[]';
      const queue: Array<{ endpoint: string; options: RequestInit }> = JSON.parse(raw);
      if (!Array.isArray(queue) || queue.length === 0) return;
      const remaining: typeof queue = [];
      for (const item of queue) {
        try {
          await fetch(item.endpoint.startsWith('http') ? item.endpoint : item.endpoint, item.options);
        } catch {
          remaining.push(item);
        }
      }
      await AsyncStorage.setItem('offline_queue', JSON.stringify(remaining));
    } catch {}
    syncingRef.current = false;
  };

  return { flushQueue };
}

