import Link from 'next/link';
import { useState } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import ThemeToggle from './ThemeToggle';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigation = [
    { name: 'Research', href: '/#research' },
    { name: 'Publications', href: '/papers' },
    { name: 'Our Lab', href: 'https://www.lcs2.in/' },
    { name: 'Join Us', href: '/#join' },
  ];

  return (
    <header className={`${geistSans.variable} ${geistMono.variable} top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-zinc-200 dark:border-gray-800 shadow-sm`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/" className={`${geistSans.variable} ${geistMono.variable} text-xl font-semibold`}>Efficient-LLMs</Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className={`${geistSans.variable} ${geistMono.variable} text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400 transition`}>
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button
            className="md:hidden p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {/* Menu Icon (Hamburger) */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-zinc-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-zinc-200 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
