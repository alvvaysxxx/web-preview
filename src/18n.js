import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector"; // Правильный импорт
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend)
  .use(LanguageDetector) // Используйте правильное имя переменной
  .use(initReactI18next)
  .init({
    fallbackLng: "ru",
    debug: false,
    detection: {
      order: ["queryString", "cookie"],
      cache: ["cookie"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
