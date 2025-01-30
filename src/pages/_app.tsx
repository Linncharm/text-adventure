// pages/_app.tsx
import React, { useEffect } from 'react';
import '../styles/styles.css'; // 这里导入全局样式
import {appWithTranslation} from 'next-i18next';
import {AppProps} from 'next/app'
import '../locales/index'

import { ThemeProvider } from 'next-themes';

import Layout from "@/components/Layout";

function MyApp({Component, pageProps}: AppProps) {

  return (
    <ThemeProvider>
      <Layout>
        <div className="transition-background-color duration-200 ease-in-out min-h-screen">
          <Component {...pageProps} />
        </div>
      </Layout>
    </ThemeProvider>

)
}

export default appWithTranslation(MyApp);
