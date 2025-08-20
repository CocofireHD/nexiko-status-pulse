import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, TranslationKey } from '@/lib/translations';
import { LanguageContext } from '@/types/status';

const LanguageContextProvider = createContext<LanguageContext | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'de'>('en');

  useEffect(() => {
    const saved = localStorage.getItem('nexiko-language') as 'en' | 'de';
    if (saved && (saved === 'en' || saved === 'de')) {
      setLanguage(saved);
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('de')) {
        setLanguage('de');
      }
    }
  }, []);

  const handleSetLanguage = (lang: 'en' | 'de') => {
    setLanguage(lang);
    localStorage.setItem('nexiko-language', lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContextProvider.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContextProvider.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContextProvider);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}