// ThemeContext.tsx
import React, {createContext, useContext, useEffect, useState} from 'react';

interface ThemeContextProps {
  theme: string;
  setTheme: (theme: string) => void;
  themeLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  setTheme: () => {},
  themeLoaded: false
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC = ({children}) => {
  const [theme, setTheme] = useState('light');
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
    setThemeLoaded(true);
  }, []);

  return (
    <ThemeContext.Provider value={{theme, setTheme, themeLoaded}}>
      {themeLoaded && children}
    </ThemeContext.Provider>
  );
};
