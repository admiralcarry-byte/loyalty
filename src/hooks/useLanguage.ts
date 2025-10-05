import { useState, useEffect } from 'react';
import { translationService } from '@/services/translationService';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(translationService.getLanguage());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Listen for language changes
    const handleLanguageChange = () => {
      setCurrentLanguage(translationService.getLanguage());
    };

    translationService.addLanguageChangeListener(handleLanguageChange);

    return () => {
      translationService.removeLanguageChangeListener(handleLanguageChange);
    };
  }, []);

  const changeLanguage = async (language: string) => {
    setIsLoading(true);
    try {
      translationService.setLanguage(language);
      // The language change will be handled by the listener
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const translate = (key: string): string => {
    return translationService.translate(key);
  };

  const getAvailableLanguages = () => {
    return translationService.getAvailableLanguages();
  };

  return {
    currentLanguage,
    changeLanguage,
    translate,
    getAvailableLanguages,
    isLoading
  };
};
