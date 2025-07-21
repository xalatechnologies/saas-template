import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { no } from './locales/no';
import { en } from './locales/en';
import { fr } from './locales/fr';
import { ar } from './locales/ar';

const resources = {
  no: { translation: no },
  en: { translation: en },
  fr: { translation: fr },
  ar: { translation: ar },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'no', // Default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;