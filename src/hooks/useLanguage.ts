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
    const previousLanguage = currentLanguage;
    
    try {
      // Update the language immediately for better UX
      translationService.setLanguage(language);
      // The language change will be handled by the listener
    } catch (error) {
      console.error('Error changing language:', error);
      // Revert to previous language if there was an error
      translationService.setLanguage(previousLanguage);
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
