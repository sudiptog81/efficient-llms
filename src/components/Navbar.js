import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function Navbar() {
  // 1. Initialize isDarkMode to null or undefined initially.
  // We'll determine the true initial state in a useEffect hook.
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 2. useEffect runs only on the client side after initial render
  useEffect(() => {
    // Check local storage for user preference first (optional but good practice)
    const userPreference = localStorage.getItem('theme');

    let initialIsDark = false;

    if (userPreference === 'dark') {
      initialIsDark = true;
    } else if (userPreference === 'light') {
      initialIsDark = false;
    } else if (typeof window !== 'undefined' && window.matchMedia) {
      // 3. Check system setting if no local storage preference is found
      initialIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    setIsDarkMode(initialIsDark);

    // Apply the class immediately to the HTML element
    if (initialIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []); // Empty dependency array ensures this runs once on mount

  const toggleDarkMode = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);

    if (newIsDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark'); // Save preference
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light'); // Save preference
    }

    // actually set the dark mode in browser
    
  };

  // Prevent rendering the button until the dark mode state is initialized
  // to avoid a potential flash of the wrong icon.
  if (isDarkMode === null) {
    return (
      <nav className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Efficient-LLMs
        </Link>
        <div className="w-9 h-9"></div> {/* Spacer for layout stability */}
      </nav>
    );
  }

  return (
    <nav className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-8 py-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Efficient-LLMs
      </Link>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" 
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-zinc-900" />
        )}
      </button>
    </nav>
  );
}
