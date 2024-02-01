import { useContext } from 'react';
import { ConfigContext } from '../providers/config-provider';

interface IUIKitConfig {
  globalTheme: Record<string, any>;
  excludes: string[];
  getConfig: (key: string) => any;
}
const useConfig = (): IUIKitConfig => {
  const { globalTheme, excludes, getConfig } = useContext(ConfigContext);

  return {
    globalTheme,
    excludes,
    getConfig,
  };
};

export default useConfig;
