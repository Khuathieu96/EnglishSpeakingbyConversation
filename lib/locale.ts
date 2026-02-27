export type Locale = 'en' | 'vi';

export const DEFAULT_LOCALE: Locale = 'vi';
export const LOCALE_STORAGE_KEY = 'app-locale';

export const localeNames: Record<Locale, string> = {
  en: 'EN',
  vi: 'VI',
};

export const LOCALES: Locale[] = ['en', 'vi'];
