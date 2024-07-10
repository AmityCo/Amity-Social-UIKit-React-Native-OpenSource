import uikit_config from '../../../uikit.config.json';

export type IConfigRaw = typeof uikit_config;
export interface IUIKitConfig {
  preferred_theme: 'dark' | 'light' | 'default';
  globalTheme: Record<string, any>;
  excludes: string[];
  getConfig: (id: string) => any;
  getDefaultConfig: (id: string) => any;
  getUiKitConfig?: ({
    element,
    page,
    component,
  }: IUIKitConfigOptions) => Record<
    string,
    string | string[] | Record<string, string>
  > | null;
}

export interface ITheme {
  light?: {
    primary_color?: string;
    secondary_color?: string;
    base_color?: string;
    base_shade1_color?: string;
    base_shade2_color?: string;
    base_shade3_color?: string;
    base_shade4_color?: string;
    alert_color?: string;
    background_color?: string;
  };
  dark?: {
    primary_color?: string;
    secondary_color?: string;
    base_color?: string;
    base_shade1_color?: string;
    base_shade2_color?: string;
    base_shade3_color?: string;
    base_shade4_color?: string;
    alert_color?: string;
    background_color?: string;
  };
}

export interface IUIKitConfigOptions {
  page?: string;
  component?: string;
  element?: string;
}
