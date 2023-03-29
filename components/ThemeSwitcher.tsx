// components/ThemeSwitcher.tsx
import {HiMoon, HiSun} from 'react-icons/hi';
import {useTheme} from '../context/ThemeContext';


const ThemeSwitcher = () => {
  const {theme, setTheme} = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    localStorage.setItem('theme', newTheme);

    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="bg-gray-300 dark:bg-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <span className="sr-only">Toggle theme</span>
      {theme === 'dark' ? <HiMoon size={24}/> : <HiSun size={24}/>}
    </button>
  );
};

export default ThemeSwitcher;
