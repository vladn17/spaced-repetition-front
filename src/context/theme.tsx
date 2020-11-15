import * as React from 'react';

type Context = {
  theme: string;
  setTheme: (theme: string) => void;
};

const ThemeContext = React.createContext<Context | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState(
    () => localStorage.getItem('theme') || 'auto'
  );

  React.useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'auto') {
      document.documentElement.classList.remove('dark', 'light');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else if (theme === 'dark') {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): Context => {
  const ctx = React.useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return ctx;
};
