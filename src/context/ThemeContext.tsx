import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type FontSize = 'normal' | 'large';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  fontSize: FontSize;
  currency: string;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setFontSize: (size: FontSize) => void;
  setCurrency: (curr: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('campus_coin_theme') as ThemeMode) || 'light';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('campus_coin_fontsize') as FontSize) || 'normal';
  });

  const [currency, setCurrencyState] = useState<string>(() => {
    return localStorage.getItem('campus_coin_currency') || 'USD';
  });

  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = theme === 'dark' || (theme === 'system' && prefersDark);

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      root.classList.add('dark');
      root.setAttribute('data-bs-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-bs-theme', 'light');
    }

    if (fontSize === 'large') {
      root.classList.add('text-lg');
    } else {
      root.classList.remove('text-lg');
    }
  }, [theme, fontSize]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('campus_coin_theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem('campus_coin_fontsize', size);
  };

  const setCurrency = (curr: string) => {
    setCurrencyState(curr);
    localStorage.setItem('campus_coin_currency', curr);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        fontSize,
        currency,
        setTheme,
        toggleTheme,
        setFontSize,
        setCurrency,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
