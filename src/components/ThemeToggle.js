import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const current = theme === 'system' ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="ml-4 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-gray-800 cursor-pointer"
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
    </button>
  );
}
