import React, { createContext, ReactNode } from 'react';
import { IUIKitConfig } from '../types/config.interface';
import config from '../../uikit.config.json';

interface IConfigProviderProps {
  children: ReactNode;
}

export const ConfigContext = createContext<IUIKitConfig>({
  globalTheme: {},
  excludes: [],
  getConfig: () => ({}), // Assuming getConfig returns an object of type IConfig.
});

export const ConfigProvider = ({ children }: IConfigProviderProps) => {
  const configFile = config;
  const getConfig = (id: string) => {
    const value = configFile.customizations[id];
    return value;
  };
  const globalTheme = configFile.global_theme;
  const excludes = configFile.excludes;

  return (
    <ConfigContext.Provider value={{ globalTheme, excludes, getConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
