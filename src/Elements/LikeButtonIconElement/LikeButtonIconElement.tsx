import { ImageProps } from 'react-native';
import React, { FC, memo } from 'react';
import {
  ComponentID,
  ElementID,
  PageID,
} from '../../enum';


import useConfig from '../../hooks/useConfig';
import { LikeIcon } from '../../svg/LikeIcon';

type LikeButtonIconElementType = Partial<ImageProps> & {
  pageID?: PageID;
  componentID?: ComponentID;
};

const LikeButtonIconElement: FC<LikeButtonIconElementType> = ({
  pageID = '*',
  componentID = '*',

}) => {
  const { excludes } = useConfig();
  const elementID = ElementID.reaction_button;
  const configId = `${pageID}/${componentID}/${elementID}`;

  if (excludes.includes(configId)) return null;
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
