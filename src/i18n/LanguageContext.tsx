import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SupportedLanguage } from '../types';
import { translations } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('trustchain_lang');
    return (saved === 'ta' || saved === 'hi' || saved === 'en') ? (saved as SupportedLanguage) : 'en';
  });

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('trustchain_lang', lang);
      document.documentElement.lang = lang;
      window.dispatchEvent(new CustomEvent('trustchain_language_changed', { detail: lang }));
    } catch (e) {
      console.warn('Failed to persist language:', e);
    }
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch (e) {
      // ignore
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'trustchain_lang' && (e.newValue === 'en' || e.newValue === 'ta' || e.newValue === 'hi')) {
        setLanguageState(e.newValue as SupportedLanguage);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [language]);

  const t = useCallback(
    (key: string): string => {
      return translations[language]?.[key] || translations.en[key] || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
