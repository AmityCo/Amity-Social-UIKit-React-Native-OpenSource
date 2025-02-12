
import React, { memo } from 'react';
import useConfig from '../../../hooks/useConfig';
import { useStyles } from './styles/styles';
import { Asset } from "expo-asset";
import { useDarkMode } from '../../../hooks/useDarkMode';
import { Image } from 'expo-image';
import { SvgXml } from 'react-native-svg';
import { emptyFeedIcon } from '../../../svg/svg-xml-list';
const Illustration = () => {
  const { excludes } = useConfig();
  const { isDarkTheme } = useDarkMode();
  const styles = useStyles();
  let image = isDarkTheme
  ? require('../../../configAssets/icons/emptyFeedIcon_dark.png')
  : require('../../../configAssets/icons/emptyFeedIcon_light.png');

  if (excludes.includes('social_home_page/empty_newsfeed/illustration'))
    return null;

  return (

<SvgXml xml={emptyFeedIcon()}/>
  );
};

export default memo(Illustration);