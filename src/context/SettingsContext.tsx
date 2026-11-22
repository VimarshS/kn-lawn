import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { SiteSettings } from '../types';

// Used only while the real settings are loading. It contains no invented business details.
const EMPTY_SETTINGS: SiteSettings = {
  lawnName: '',
  description: '',
  address: '',
  ownerName: '',
  phone: '',
  whatsapp: '',
  email: '',
  mapsEmbedUrl: '',
  directionsUrl: '',
  businessHours: '',
  socialLinks: {},
  heroHeading: '',
  heroDescription: '',
  heroImageUrl: '',
  aboutStory: '',
  facilities: [],
  enquiryInstructions: '',
};

type SettingsStatus = 'loading' | 'ready' | 'error';

interface SettingsContextValue {
  settings: SiteSettings;
  status: SettingsStatus;
  reload: () => void;
  /** Used after the owner saves, so every page shows the new values at once. */
  applySettings: (settings: SiteSettings) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(EMPTY_SETTINGS);
  const [status, setStatus] = useState<SettingsStatus>('loading');
  const [attempt, setAttempt] = useState(0); // goes up by one each time "Try again" is pressed

  useEffect(() => {
    let ignore = false; // set on cleanup, so a late answer is ignored
    setStatus('loading');
    api
      .get<{ settings: SiteSettings }>('/settings')
      .then((data) => {
        if (ignore) return;
        setSettings(data.settings);
        setStatus('ready');
      })
      .catch(() => {
        if (!ignore) setStatus('error');
      });
    return () => {
      ignore = true;
    };
  }, [attempt]);

  const reload = () => setAttempt((count) => count + 1);
  
  const applySettings = (next: SiteSettings) => {
    setSettings(next);
    setStatus('ready');
  };

  return (
    <SettingsContext.Provider value={{ settings, status, reload , applySettings}}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return ctx;
};