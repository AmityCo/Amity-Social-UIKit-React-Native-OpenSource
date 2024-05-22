import { useColorScheme } from 'react-native';
import useConfig from './useConfig';
import { useMemo } from 'react';
export const useDarkMode = () => {
  const { preferred_theme } = useConfig();
  const colorScheme = useColorScheme();
  const isDarkTheme = useMemo(() => {
    return (
      preferred_theme === 'dark' ||
      (preferred_theme === 'default' && colorScheme === 'dark')
    );
  }, [colorScheme, preferred_theme]);
  return { isDarkTheme };
};
