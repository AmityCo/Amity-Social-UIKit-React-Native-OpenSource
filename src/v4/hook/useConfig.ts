import { useContext } from 'react';
import { ConfigContext } from '../../providers/config-provider';
import { IUIKitConfigOptions } from '../types/config.interface';

interface IUIKitConfig {
  globalTheme: Record<string, any>;
  excludes: string[];
  getConfig: (key: string) => any;
  getUiKitConfig: (
    arg: IUIKitConfigOptions
  ) => Record<string, string | string[] | Record<string, string>> | null;
}
const useConfig = (): IUIKitConfig => {
  const { globalTheme, excludes, getConfig, getUiKitConfig } =
    useContext(ConfigContext);

  return {
    globalTheme,
    excludes,
    getConfig,
    getUiKitConfig,
  };
};

export default useConfig;
