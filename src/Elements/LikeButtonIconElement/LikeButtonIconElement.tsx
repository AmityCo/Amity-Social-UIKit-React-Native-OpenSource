import { ImageProps, Image } from 'react-native';
import React, { FC, memo } from 'react';
import {
  ComponentID,
  ElementID,
  PageID,
  UiKitConfigKeys,
} from '../../enum';


import useConfig from '../../hooks/useConfig';
import { useConfigImageUri } from '../../hooks/useConfigImageUri';
import { LikeIcon } from '../../svg/LikeIcon';

type LikeButtonIconElementType = Partial<ImageProps> & {
  pageID?: PageID;
  componentID?: ComponentID;
};

const LikeButtonIconElement: FC<LikeButtonIconElementType> = ({
  pageID = '*',
  componentID = '*',
  ...props
}) => {
  const { excludes } = useConfig();
  const elementID = ElementID.reaction_button;
  const configKey: keyof UiKitConfigKeys = 'icon';
  const configId = `${pageID}/${componentID}/${elementID}`;
  const imageSource = useConfigImageUri({
    configPath: {
      page: pageID,
      component: componentID,
      element: elementID,
    },
    configKey: configKey,
  });
  if (excludes.includes(configId)) return null;
  console.log('imageSource: ', imageSource);
  return (
    // <Image
    //   testID={configId}
    //   accessibilityLabel={configId}
    //   source={props.source ?? imageSource}
    //   {...props}
    // />
    <LikeIcon/>
  );
};

export default memo(LikeButtonIconElement);
