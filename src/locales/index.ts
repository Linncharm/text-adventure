// src/i18n.js
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import { getCookie } from 'cookies-next';

const language = getCookie('i18nextLng') as string; // 从 cookie 中获取语言
console.log('i18n init language', language);

i18n
  .use(initReactI18next) // 初始化 react-i18next
  .init({
    resources: {
      en: {
        home: require('./en/home.json'), // 英文翻译文件
        common: require('./en/common.json'), // 英文翻译文件

      },
      zh: {
        home: require('./zh/home.json'), // 中文翻译文件
        common: require('./zh/common.json'), // 中文翻译文件
      },
    },
    lng: language || 'en', // 初始化时直接读取存储的语言
    fallbackLng: 'en', // 如果当前语言找不到翻译内容，回退到默认语言
    ns: ['common'],  // 设置你默认的命名空间
    defaultNS: 'common',  // 设置默认命名空间
    interpolation: {
      escapeValue: false, // React 会自动处理转义
    },
  });

export default i18n;
