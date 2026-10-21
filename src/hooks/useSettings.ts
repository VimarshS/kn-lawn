import { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import { SiteSettings } from '../types';

/**
 * Gives a component the current website settings (phone, email, etc.)
 * and re-renders the component automatically when the owner changes them.
 */
export function useSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(() => dataService.getSettings());

  useEffect(() => {
    // subscribe() returns a function that stops listening; React calls it on cleanup
    const unsubscribe = dataService.subscribe(() => {
      setSettings(dataService.getSettings());
    });
    return unsubscribe;
  }, []);

  return settings;
}