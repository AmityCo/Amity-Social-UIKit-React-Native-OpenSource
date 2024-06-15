import { MyMD3Theme } from '../providers/amity-ui-kit-provider';
import { IConfigRaw } from '../types/config.interface';
import { useDarkMode } from './useDarkMode';
import { useTheme } from 'react-native-paper';

export const mergeTheme = (obj1: any, obj2: Object) => {
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key) && obj1.hasOwnProperty(key)) {
      obj1[key] = obj2[key];
    }
  }
  return obj1;
};

export const useGenerateThemeStyles = (config: IConfigRaw): MyMD3Theme => {
  const theme = useTheme() as MyMD3Theme;
  const { isDarkTheme } = useDarkMode();
  if (!config?.theme?.dark || !config?.theme.light) return theme;
  let themeColor: typeof config.theme.dark;
  if (isDarkTheme) {
    themeColor = config.theme.dark;
  } else {
    themeColor = config.theme.light;
  }
  const mergedTheme = mergeTheme(theme.colors, themeColor);
  return { colors: mergedTheme } as MyMD3Theme;
};
