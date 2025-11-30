import { Html, Head, Main, NextScript } from "next/document";
import { GoogleAnalytics } from '@next/third-parties/google';

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
      <Head />
      <body className="antialiased">
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
        <Main />
        <NextScript />
        <GoogleAnalytics gaId="GA-N968HFGN36" />
      </body>
    </Html>
  );
}
