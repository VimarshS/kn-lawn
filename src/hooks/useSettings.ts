import { useSettingsContext } from '../context/SettingsContext';
import { SiteSettings } from '../types';

/** The current website settings (phone, email, hours...). They come from the server. */
export function useSettings(): SiteSettings {
  return useSettingsContext().settings;
}