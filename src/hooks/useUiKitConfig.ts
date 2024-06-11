import { useMemo } from 'react';

import useConfig from './useConfig';
import { UiKitConfigKeys } from '../enum/enumUIKitID';
import { IUIKitConfigOptions } from '../types/config.interface';

type UIKitConfigT = IUIKitConfigOptions & { keys: (keyof UiKitConfigKeys)[] };

export const useUiKitConfig = ({ keys, ...rest }: UIKitConfigT) => {
  const { getUiKitConfig } = useConfig();
  const config = useMemo(() => {
    return keys.map((key) => {
      return getUiKitConfig(rest)?.[key];
    });
  }, [getUiKitConfig, keys, rest]);
  return config;
};
