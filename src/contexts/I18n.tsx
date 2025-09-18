import React, { createContext, useContext, useMemo, useState } from 'react';

type Messages = Record<string, string>;

const pt: Messages = {
  loading_app: 'Carregando ConnectFé...'
};

const en: Messages = {
  loading_app: 'Loading ConnectFé...'
};

type I18nContextValue = {
  t: (key: keyof typeof pt) => string;
  locale: 'pt' | 'en';
  setLocale: (loc: 'pt' | 'en') => void;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<'pt' | 'en'>('pt');

  const t = (key: keyof typeof pt) => {
    const dict = locale === 'pt' ? pt : en;
    return dict[key] || String(key);
  };

  const value = useMemo(() => ({ t, locale, setLocale }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

