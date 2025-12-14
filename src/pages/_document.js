import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="https://parmanu.lcs2.in/favicon.ico" />
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
        <Script id="bing-analytics" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ul9vrtk0zv");
          `}
        </Script>
        <meta name="og:image" content="https://parmanu.lcs2.in/parmanu.png" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content="https://parmanu.lcs2.in/logo-white.png" />
        <meta name="twitter:creator" content="@lcs2lab" />
        <meta name="google-site-verification" content="5fLWe0hlfS_S5PdTldFNbKv41Y1DW2rlRButlOKZ5EY" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
