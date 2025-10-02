import { useEffect, useState } from 'react';
import { translationService } from '@/services/translationService';
import { generalSettingsService } from '@/services/generalSettingsService';

// Global state to prevent multiple simultaneous requests
let isInitializing = false;
let initializationPromise: Promise<void> | null = null;
let isInitialized = false;

export const useLanguageInitialization = () => {
  const [localIsInitialized, setLocalIsInitialized] = useState(isInitialized);
  const [isLoading, setIsLoading] = useState(!isInitialized);

  useEffect(() => {
    const initializeLanguage = async () => {
      // If already initialized, return immediately
      if (isInitialized) {
        setLocalIsInitialized(true);
        setIsLoading(false);
        return;
      }

      // If already initializing, wait for the existing promise
      if (isInitializing && initializationPromise) {
        try {
          await initializationPromise;
          setLocalIsInitialized(true);
          setIsLoading(false);
        } catch (error) {
          console.error('Error waiting for language initialization:', error);
          setLocalIsInitialized(true);
          setIsLoading(false);
        }
        return;
      }

      // Start initialization
      isInitializing = true;
      setIsLoading(true);

      initializationPromise = (async () => {
        try {
          // Get the language setting from the database
          const settings = await generalSettingsService.getGeneralSettings();
          
          // Set the language in the translation service
          if (settings.language) {
            translationService.setLanguage(settings.language);
          }
          
          isInitialized = true;
          setLocalIsInitialized(true);
        } catch (error) {
          console.error('Error initializing language:', error);
          // Fallback to English if there's an error
          translationService.setLanguage('English');
          isInitialized = true;
          setLocalIsInitialized(true);
        } finally {
          isInitializing = false;
          setIsLoading(false);
        }
      })();

      await initializationPromise;
    };

    initializeLanguage();
  }, []);

  return { isInitialized: localIsInitialized, isLoading };
};