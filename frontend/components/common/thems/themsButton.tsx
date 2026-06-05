'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeButton() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="
        flex justify-center items-center p-2 border border-border rounded-lg 
        bg-card-secondary hover:bg-card-hover cursor-pointer"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {/* {theme === 'dark' ? <Moon /> : <Sun />} */}
      <Sun className="block dark:hidden w-4 h-4" />
      <Moon className="hidden dark:block w-4 h-4" />
    </button>
  );
}
