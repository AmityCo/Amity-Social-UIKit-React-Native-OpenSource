import * as React from 'react';
import { Provider } from 'react-redux';
import AuthContextProvider from './auth-provider';
import { DefaultTheme, PaperProvider, type MD3Theme } from 'react-native-paper';
import { store } from '../redux/store';
export type CusTomTheme = typeof DefaultTheme;
export interface IAmityUIkitProvider {
  userId: string;
  displayName: string;
  apiKey: string;
  apiRegion?: string;
  apiEndpoint?: string;
  children: any;
  theme?: CustomColors;
  darkMode?: boolean;
}

interface CustomColors {
  primary?: string;
  secondary?: string;
  background?: string;
  border?: string;
  base?: string;
  baseShade1?: string;
  baseShade2?: string;
  baseShade3?: string;
  screenBackground?: string;
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
  theme,
  darkMode = false,
}: IAmityUIkitProvider) {
  const customizedTheme: MyMD3Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme?.primary ?? '#1054DE',
      secondary: theme?.secondary ?? '#EBECEF',
      background: theme?.background ?? '#FFFFFF',
      border: theme?.border ?? '#EBECEF',
      base: theme?.base ?? '#292B32',
      baseShade1: theme?.baseShade1 ?? '#636878',
      baseShade2: theme?.baseShade2 ?? '#898E9E',
      baseShade3: theme?.baseShade3 ?? '#A5A9B5',
      screenBackground: theme?.screenBackground ?? '#EBECEF',
    },
  };

  const defaultDarkTheme: MyMD3Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#1054DE', // Primary color for main elements
      secondary: '#636878', // Secondary color UI elements e.g comment bubble, input bar
      background: '#1E1E1E', // Background color for the overall theme
      border: '#EBECEF', // Border color for elements
      base: '#FFFFFF', // Base color for main text, Title, input text
      baseShade1: '#EBECEF', // Base color for Sub Text, Sub Title, TimeStamp Text
      baseShade2: '#EBECEF', // Base color for comments, like text
      baseShade3: '#EBECEF', // Base color for placeHolder
      screenBackground: '#000000',
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
      >
        <PaperProvider theme={darkMode ? defaultDarkTheme : customizedTheme}>
          {children}
        </PaperProvider>
      </AuthContextProvider>
    </Provider>
  );
}
