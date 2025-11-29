import "@/styles/globals.css";
import 'katex/dist/katex.min.css';
import { ThemeProvider } from "@/components/ThemeProvider";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      storageKey="theme"
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
