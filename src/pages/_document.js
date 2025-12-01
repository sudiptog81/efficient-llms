import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  const setInitialTheme = `
(function() {
  try {
    const storageKey = 'theme';
    const theme = localStorage.getItem(storageKey);
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`.trim();

  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <Script async id="google-analytics-script"
          src={`https://www.googletagmanager.com/gtag/js?id=G-N968HFGN36`} strategy="afterInteractive">
        </Script>
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N968HFGN36');
          `}
        </Script>
        <Script id="script-setTheme" dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
        <meta name="og:image" content="/parmanu.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
