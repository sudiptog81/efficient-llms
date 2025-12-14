import "@/styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Head from "next/head";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const canonicalUrl = `https://parmanu.lcs2.in${router.asPath.split('?')[0]}`;

  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        storageKey="theme"
        disableTransitionOnChange
      >
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
