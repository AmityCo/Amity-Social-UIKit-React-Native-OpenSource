import { DefaultConfigID, PREFERRED_THEME, THEME_COLORS } from '../enum';
import { IConfigRaw } from '../types/config.interface';

const useValidateConfig = (config: IConfigRaw | undefined) => {
  if (!config) return false;
  if (!config.preferred_theme || !PREFERRED_THEME[config.preferred_theme]) {
    console.error(
      "Config Json Error: `preferred_theme` shoud be one of 'dark', 'light' or 'default'. please check `IConfigRaw` Interface"
    );
    return false;
  }
  if (
    !config.theme ||
    !Object.keys(config.theme).some((item) => ['dark', 'light'].includes(item))
  ) {
    console.error(
      'Config Json Error: `theme` should have both dark and light color scheme. please check `IConfigRaw` Interface'
    );
    return false;
  }
  if (
    !config.theme ||
    !Object.keys(THEME_COLORS).every(
      (item) =>
        config.theme &&
        Object.keys(config.theme.dark).includes(item) &&
        Object.keys(config.theme.light).includes(item)
    )
  ) {
    console.error(
      'Config Json Error: `theme` should have both dark and light color scheme. please check `ITheme` Interface'
    );
    return false;
  }
  if (!config.excludes || !Array.isArray(config.excludes)) {
    console.error(
      'Config Json Error: `excluded` should be string array. please check `IConfigRaw` Interface'
    );
    return false;
  }
  if (
    !config.customizations ||
    !Object.values(DefaultConfigID).every((item) =>
      Object.keys(config.customizations).includes(item)
    )
  ) {
    console.error(
      'Config Json Error: `customizations` should be Object data type. please check `IConfigRaw` Interface'
    );
    return false;
  }
  return true;
};

export default useValidateConfig;
