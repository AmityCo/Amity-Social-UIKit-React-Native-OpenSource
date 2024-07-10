import { Image } from 'react-native';
import React, { memo } from 'react';
import { useConfigImageUri } from '../../../../hook';
import { ComponentID, ElementID, PageID } from '../../../../enum';
import useConfig from '../../../../hook/useConfig';
import { useStyles } from './styles/styles';

const Illustration = () => {
  const { excludes } = useConfig();
  const styles = useStyles();
  const illustrationIcon = useConfigImageUri({
    configKey: 'icon',
    configPath: {
      page: PageID.social_home_page,
      component: ComponentID.empty_newsfeed,
      element: ElementID.illustration,
    },
  });

  if (excludes.includes('social_home_page/empty_newsfeed/illustration'))
    return null;

  return (
    <Image source={illustrationIcon} style={styles.icon} resizeMode="contain" />
  );
};

export default memo(Illustration);
