import "@/styles/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider
      attribute="class"
      enableSystem={true}
      defaultTheme="system"
      storageKey="theme"
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
