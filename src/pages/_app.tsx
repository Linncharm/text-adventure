// pages/_app.tsx
import React from 'react';

import '../styles/styles.css';

import {appWithTranslation} from 'next-i18next';
import {AppProps} from 'next/app'
import '../locales/index'

import { ThemeProvider } from 'next-themes';
import Head from 'next/head'

import Layout from "@/components/Layout";

function MyApp({Component, pageProps}: AppProps) {

  return (
    <ThemeProvider>
      <Head>
        <title>Text Adventure</title>
        <meta name="description" content="This is a description of my app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon1.ico"/>
      </Head>
      <Layout>
        <div className="transition-background-color duration-200 ease-in-out min-h-screen">
          <Component {...pageProps} />
        </div>
      </Layout>
    </ThemeProvider>

)
}

export default appWithTranslation(MyApp);
