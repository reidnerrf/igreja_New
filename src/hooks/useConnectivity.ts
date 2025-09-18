import { useEffect, useState } from 'react';

export function useConnectivity(pingUrl: string = '/health', intervalMs = 5000) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let timer: any;
    const ping = async () => {
      try {
        const res = await fetch(pingUrl, { cache: 'no-store' } as any);
        setIsOnline(res.ok);
      } catch {
        setIsOnline(false);
      }
    };
    ping();
    timer = setInterval(ping, intervalMs);
    return () => clearInterval(timer);
  }, [pingUrl, intervalMs]);

  return { isOnline };
}

