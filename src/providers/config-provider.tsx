import React, { createContext, ReactNode } from 'react';
import defaultConfig from '../../uikit.config.json';
import {
  IConfigRaw,
  IUIKitConfig,
  IUIKitConfigOptions,
} from '../types/config.interface';

interface IConfigProviderProps {
  children: ReactNode;
  configs: IConfigRaw;
}

export const ConfigContext = createContext<IUIKitConfig>({
  preferred_theme: 'default',
  globalTheme: {},
  excludes: [],
  getConfig: () => ({}),
  getUiKitConfig: () => ({}),
  getDefaultConfig: () => ({}),
});

export const ConfigProvider = ({ children, configs }: IConfigProviderProps) => {
  const getConfig = (id: string) => {
    const value = configs.customizations[id];
    return value;
  };

  const getDefaultConfig = (id: string) => {
    const value = defaultConfig.customizations[id];
    return value;
  };

  const getPossibleIDs = ({
    page,
    component,
    element,
  }: IUIKitConfigOptions): string[] => {
    if (!component && !element) return [`${page}/*/*`];
    if (!element) return [`${page}/${component}/*`, `*/${component}/*`];
    return [
      `${page}/${component}/${element}`,
      `${page}/*/${element}`,
      `*/${component}/${element}`,
      `*/*/${element}`,
    ];
  };

  const getCorrectConfig = (
    possibleIDs: string[]
  ): Record<string, string | string[] | Record<string, string>> | undefined => {
    const correctId = possibleIDs.find((id) => !!configs.customizations[id]);
    const correctConfig = configs.customizations[correctId];
    if (correctConfig) return correctConfig;
    return undefined;
  };

  const getUiKitConfig = ({
    page,
    component,
    element,
  }: IUIKitConfigOptions) => {
    const possibleIDs = getPossibleIDs({ page, component, element });
    const correctConfig = getCorrectConfig(possibleIDs);
    return correctConfig;
  };

  const globalTheme = configs.theme;
  const excludes = configs.excludes;
  const preferred_theme = configs.preferred_theme as
    | 'light'
    | 'dark'
    | 'default';

  return (
    <ConfigContext.Provider
      value={{
        preferred_theme,
        globalTheme,
        excludes,
        getConfig,
        getUiKitConfig,
        getDefaultConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
