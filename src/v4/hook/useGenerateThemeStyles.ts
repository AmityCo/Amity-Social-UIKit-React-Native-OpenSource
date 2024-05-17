import { validateConfigColor } from '../../util/colorUtil';
import { IConfigRaw } from '../types/config.interface';
import useConfig from './useConfig';
import { useColorScheme } from 'react-native';

export const useGenerateThemeStyles = (config: IConfigRaw) => {
  const { preferred_theme } = useConfig();
  const colorScheme = useColorScheme();
  const isDarkTheme =
    preferred_theme === 'dark' ||
    (preferred_theme === 'default' && colorScheme === 'dark');
  let themeColor: typeof config.theme.dark;
  if (isDarkTheme) {
    themeColor = config.theme.dark;
  } else {
    themeColor = config.theme.light;
  }
  return {
    primary: validateConfigColor(themeColor?.primary_color),
    secondary: validateConfigColor(themeColor?.secondary_color),
    background: validateConfigColor(themeColor?.background_color),
    base: validateConfigColor(themeColor?.base_color),
    baseShade1: validateConfigColor(themeColor?.base_shade1_color),
    baseShade2: validateConfigColor(themeColor?.base_shade2_color),
    baseShade3: validateConfigColor(themeColor?.base_shade3_color),
    baseShade4: validateConfigColor(themeColor?.base_shade4_color),
    alert: validateConfigColor(themeColor?.alert_color),
  };
};
