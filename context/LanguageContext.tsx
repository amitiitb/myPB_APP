import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { en } from '../locales/en';
import { hi } from '../locales/hi';

type LanguageType = 'en' | 'hi';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => Promise<void>;
  t: (path: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'app_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Load language preference from AsyncStorage on app launch
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedLanguage === 'en' || savedLanguage === 'hi') {
          setLanguageState(savedLanguage);
        }
      } catch (error) {
        console.log('Error loading language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  // Save language preference to AsyncStorage
  const setLanguage = async (lang: LanguageType) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lang);
      setLanguageState(lang);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  };

  // Translation function: gets translation by dot notation path
  // Example: t('dashboard.totalOrders') or t('common.add')
  const t = (path: string): string => {
    const translations = language === 'hi' ? hi : en;
    const keys = path.split('.');
    let value: any = translations;

    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) {
        console.warn(`Translation key not found: ${path}`);
        return path; // Return the path if key not found
      }
    }

    return typeof value === 'string' ? value : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
