// 📂 pages/_app.tsx
import React from 'react';

import ProgressBar from "@/components/Layout/components/ProgressBar";
import Layout from "@/components/Layout";
import { LoadingProvider, useLoading } from '@/context/LoadingContext';

import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import Head from 'next/head';

import '../styles/styles.css';
import '../styles/reactflow-override.css'
import '../locales/index';

import { Toaster } from 'react-hot-toast';
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createClient } from '@/lib/supabase/client'


function MyApp({ Component, pageProps,router }: AppProps) {

  const supabase = createClient();
  return (
    <LoadingProvider>
      <SessionContextProvider supabaseClient={supabase}>
        <Content Component={Component} pageProps={pageProps} router={router} />
      </SessionContextProvider>
    </LoadingProvider>
  );
}

function Content({ Component, pageProps }:AppProps) {
  const { loading } = useLoading();
  return (
    <>
      <ProgressBar isLoading={loading} />
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
            <Toaster position="top-center" />
          </div>
        </Layout>
      </ThemeProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
