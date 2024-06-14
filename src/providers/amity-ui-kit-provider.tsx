import * as React from 'react';
import { useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import AuthContextProvider from './auth-provider';
import { DefaultTheme, PaperProvider, type MD3Theme } from 'react-native-paper';
import { store } from '../redux/store';
import { ConfigProvider } from './config-provider';
import { IConfigRaw } from '../v4/types/config.interface';
import { validateConfigColor } from '../util/colorUtil';
import useValidateConfig from '../v4/hook/useValidateConfig';
import fallBackConfig from '../../uikit.config.json';

export type CusTomTheme = typeof DefaultTheme;
export interface IAmityUIkitProvider {
  userId: string;
  displayName?: string;
  apiKey: string;
  apiRegion?: string;
  apiEndpoint?: string;
  children: any;
  authToken?: string;
  configs?: IConfigRaw;
  fcmToken?: string;
}

export interface CustomColors {
  primary?: string;
  secondary?: string;
  background?: string;
  base?: string;
  baseShade1?: string;
  baseShade2?: string;
  baseShade3?: string;
  baseShade4?: string;
  alert?: string;
}
export interface MyMD3Theme extends MD3Theme {
  colors: MD3Theme['colors'] & CustomColors;
}
export default function AmityUiKitProvider({
  userId,
  displayName,
  apiKey,
  apiRegion,
  apiEndpoint,
  children,
  authToken,
  configs,
  fcmToken,
}: IAmityUIkitProvider) {
  const colorScheme = useColorScheme();
  const isValidConfig = useValidateConfig(configs);
  const configData = isValidConfig ? configs : (fallBackConfig as IConfigRaw);
  const isDarkTheme =
    configData?.preferred_theme === 'dark' ||
    (configData?.preferred_theme === 'default' && colorScheme === 'dark');
  const themeColor = isDarkTheme
    ? configData.theme.dark
    : configData.theme.light;
  const globalTheme: MyMD3Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: validateConfigColor(themeColor?.primary_color),
      secondary: validateConfigColor(themeColor?.secondary_color),
      background: validateConfigColor(themeColor?.background_color),
      base: validateConfigColor(themeColor?.base_color),
      baseShade1: validateConfigColor(themeColor?.base_shade1_color),
      baseShade2: validateConfigColor(themeColor?.base_shade2_color),
      baseShade3: validateConfigColor(themeColor?.base_shade3_color),
      baseShade4: validateConfigColor(themeColor?.base_shade4_color),
      alert: validateConfigColor(themeColor?.alert_color),
    },
  };

  return (
    <Provider store={store}>
      <AuthContextProvider
        userId={userId}
        displayName={displayName || userId}
        apiKey={apiKey}
        apiRegion={apiRegion}
        apiEndpoint={apiEndpoint}
        authToken={authToken}
        fcmToken={fcmToken}
      >
        <ConfigProvider configs={configData}>
          <PaperProvider theme={globalTheme}>{children}</PaperProvider>
        </ConfigProvider>
      </AuthContextProvider>
    </Provider>
  );
}
