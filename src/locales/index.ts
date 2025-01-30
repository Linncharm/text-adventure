// src/i18n.js
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import enTranslation from './en/common.json'; // 英文翻译文件
import zhTranslation from './zh/common.json'

i18n
  .use(initReactI18next) // 初始化 react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation, // 英文翻译文件
      },
      zh: {
        translation: zhTranslation, // 中文翻译文件
      },
    },
    lng: 'en', // 默认语言
    fallbackLng: 'en', // 如果当前语言找不到翻译内容，回退到默认语言
    interpolation: {
      escapeValue: false, // React 会自动处理转义
    },
  });

export default i18n;
