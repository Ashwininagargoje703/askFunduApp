import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import translation from "../locales/hi/translation.json";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources: {
    hi: {
      translation: translation,
    },
  },
  fallbackLng: "en",
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
