import { DefaultConfigID } from '../enum';

export interface IUIKitConfig {
  globalTheme: Record<string, any>;
  excludes: string[];
  getConfig: (id: string) => any;
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

export interface IConfigRaw {
  preferred_theme?: string;
  theme?: ITheme;
  excludes?: string[];
  customizations?: Record<
    DefaultConfigID,
    {
      theme?: ITheme;
      title?: string;
      back_icon?: string;
      close_icon?: string;
      aspect_ratio_icon?: string;
      resolution?: string;
      background_color?: string;
      hyperlink_button_icon?: string;
      share_icon?: string;
      hide_avatar?: boolean;
      progress_color?: string | string[];
      overflow_menu_icon?: string;
      impression_icon?: string;
      reaction_icon?: string;
      create_new_story_icon?: string;
      mute_icon?: string;
      unmute_icon?: string;
      cancel_icon?: string;
      cancel_button_text?: string;
      save_icon?: string;
      save_button_text?: string;
      done_icon?: string;
      done_button_text?: string;
    }
  >;
}

export interface IUIKitConfigOptions {
  page?: string;
  component?: string;
  element?: string;
}
