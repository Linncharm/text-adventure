// pages/_app.tsx
import React from 'react';
import '../styles/styles.css'; // 这里导入全局样式
import {appWithTranslation} from 'next-i18next';
import {AppProps} from 'next/app'
import '../locales/index'

import Layout from "@/components/Layout";

function MyApp({Component, pageProps}: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />;
    </Layout>
  )
}

export default appWithTranslation(MyApp);
