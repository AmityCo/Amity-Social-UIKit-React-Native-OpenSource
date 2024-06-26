import { Image, ImageSourcePropType } from 'react-native';
import { defaultAvatarUri } from '../assets';
import { useMemo } from 'react';
import useConfig from './useConfig';
import { IUIKitConfigOptions } from '../types/config.interface';
import { UiKitConfigKeys } from '../enum';
import { useDarkMode } from './useDarkMode';

export const useConfigImageUri = ({
  configPath,
  configKey,
}: {
  configPath: IUIKitConfigOptions;
  configKey: keyof UiKitConfigKeys;
}): ImageSourcePropType => {
  const { getUiKitConfig } = useConfig();
  const { isDarkTheme } = useDarkMode();
  const configImageUri = useMemo(() => {
    if (!configPath || !configKey) return defaultAvatarUri;
    const fileUri = getUiKitConfig(configPath)?.[configKey] as string;
    if (!fileUri) return defaultAvatarUri;
    if (fileUri.includes('http')) return fileUri;
    let image: number | string = defaultAvatarUri;
    if (fileUri === 'mute.png') {
      image = require('../configAssets/icons/mute.png');
    }
    if (fileUri === 'unmute.png') {
      image = require('../configAssets/icons/unmute.png');
    }
    if (fileUri === 'aspect_ratio.png') {
      image = require('../configAssets/icons/aspect_ratio.png');
    }
    if (fileUri === 'hyperlink_button.png') {
      image = require('../configAssets/icons/hyperlink_button.png');
    }
    if (fileUri === 'searchButtonIcon') {
      image = require('../configAssets/icons/search.png');
    }
    if (fileUri === 'postCreationIcon') {
      image = require('../configAssets/icons/plus.png');
    }
    if (fileUri === 'search') {
      image = require('../configAssets/icons/search.png');
    }
    if (fileUri === 'clear') {
      image = require('../configAssets/icons/clear.png');
    }
    if (fileUri === 'lockIcon') {
      image = require('../configAssets/icons/lockIcon.png');
    }
    if (fileUri === 'officialBadgeIcon') {
      image = require('../configAssets/icons/officialBadgeIcon.png');
    }
    if (fileUri === 'emptyFeedIcon') {
      image = isDarkTheme
        ? require('../configAssets/icons/emptyFeedIcon_dark.png')
        : require('../configAssets/icons/emptyFeedIcon_light.png');
    }
    if (fileUri === 'exploreCommunityIcon') {
      image = require('../configAssets/icons/exploreCommunityIcon.png');
    }
    if (fileUri === 'badgeIcon') {
      image = require('../configAssets/icons/badgeIcon.png');
    }
    if (fileUri === 'backButtonIcon') {
      image = require('../configAssets/icons/backButtonIcon.png');
    }
    if (fileUri === 'menuIcon') {
      image = require('../configAssets/icons/menuIcon.png');
    }
    if (fileUri === 'likeButtonIcon') {
      image = require('../configAssets/icons/likeButtonIcon.png');
    }
    if (fileUri === 'commentButtonIcon') {
      image = require('../configAssets/icons/commentButtonIcon.png');
    }
    if (fileUri === 'shareButtonIcon') {
      image = require('../configAssets/icons/shareButtonIcon.png');
    }
    if (fileUri === 'create_post_button') {
      image = require('../configAssets/icons/create_post_button.png');
    }
    if (fileUri === 'create_story_button') {
      image = require('../configAssets/icons/create_story_button.png');
    }
    if (fileUri === 'create_poll_button') {
      image = require('../configAssets/icons/create_poll_button.png');
    }
    if (fileUri === 'create_livestream_button') {
      image = require('../configAssets/icons/create_livestream_button.png');
    }
    if (fileUri === 'close_button') {
      image = isDarkTheme
        ? require('../configAssets/icons/close_button_dark.png')
        : require('../configAssets/icons/close_button_light.png');
    }
    if (fileUri === 'image_button') {
      image = require('../configAssets/icons/image_button.png');
    }
    if (fileUri === 'video_button') {
      image = require('../configAssets/icons/video_button.png');
    }
    if (fileUri === 'camera_button') {
      image = require('../configAssets/icons/camera_button.png');
    }
    if (fileUri === 'file_button') {
      image = require('../configAssets/icons/file_button.png');
    }
    if (typeof image === 'number') {
      return Image.resolveAssetSource(image)?.uri ?? defaultAvatarUri;
    }
    return image;
  }, [configPath, configKey, getUiKitConfig, isDarkTheme]);
  return { uri: configImageUri };
};
