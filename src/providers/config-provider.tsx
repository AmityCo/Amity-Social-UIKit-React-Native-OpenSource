import React, { createContext, ReactNode } from 'react';
import {
  IConfigRaw,
  IUIKitConfig,
  IUIKitConfigOptions,
} from '~/v4/types/config.interface';

interface IConfigProviderProps {
  children: ReactNode;
  configs: IConfigRaw;
}

export const ConfigContext = createContext<IUIKitConfig>({
  globalTheme: {},
  excludes: [],
  getConfig: () => ({}),
  getUiKitConfig: () => ({}),
});

export const ConfigProvider = ({ children, configs }: IConfigProviderProps) => {
  const getConfig = (id: string) => {
    const value = configs.customizations[id];
    return value;
  };

  const getCorrectIDs = ({
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
    correctIds: string[]
  ): Record<string, string | string[] | Record<string, string>> => {
    for (let i = 0; i < correctIds.length; i++) {
      const correctId = correctIds[i];
      const correctConfig = configs.customizations[correctId];
      if (correctConfig) return correctConfig;
    }
  };

  const getUiKitConfig = ({
    page,
    component,
    element,
  }: IUIKitConfigOptions) => {
    const correctIds = getCorrectIDs({ page, component, element });
    const correctConfig = getCorrectConfig(correctIds);
    return correctConfig;
  };

  const globalTheme = configs.theme;
  const excludes = configs.excludes;

  return (
    <ConfigContext.Provider
      value={{ globalTheme, excludes, getConfig, getUiKitConfig }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
