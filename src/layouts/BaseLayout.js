import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  important: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  important: true,
});

export default function BaseLayout({ children }) {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex flex-col min-h-screen items-center justify-start bg-white dark:bg-gray-950 text-zinc-900 dark:text-zinc-50`}
    >
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
