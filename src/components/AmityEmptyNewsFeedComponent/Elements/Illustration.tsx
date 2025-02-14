
import React, { memo } from 'react';
import useConfig from '../../../hooks/useConfig';
import { SvgXml } from 'react-native-svg';
import { emptyFeedIcon } from '../../../svg/svg-xml-list';
const Illustration = () => {
  const { excludes } = useConfig();



  if (excludes.includes('social_home_page/empty_newsfeed/illustration'))
    return null;

  return (

<SvgXml xml={emptyFeedIcon()}/>
  );
};

export default memo(Illustration);