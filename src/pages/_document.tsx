import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 添加以下 meta 标签来禁用 service worker 的自动注册 */}
        <meta name="apple-mobile-web-app-capable" content="no" />
        <meta name="mobile-web-app-capable" content="no" />
      </Head>
      <body>
      <Main />
      <NextScript />
      </body>
    </Html>
  )
}
