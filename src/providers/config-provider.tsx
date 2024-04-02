import React, { createContext, ReactNode } from 'react';
import { IConfigRaw, IUIKitConfig } from '~/v4/types/config.interface';

interface IConfigProviderProps {
  children: ReactNode;
  configs: IConfigRaw;
}

export const ConfigContext = createContext<IUIKitConfig>({
  globalTheme: {},
  excludes: [],
  getConfig: () => ({}),
});

export const ConfigProvider = ({ children, configs }: IConfigProviderProps) => {
  const configFile = configs;
  const getConfig = (id: string) => {
    const value = configFile.customizations[id];
    return value;
  };

  const globalTheme = configFile.theme;
  const excludes = configFile.excludes;

  return (
    <ConfigContext.Provider value={{ globalTheme, excludes, getConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
