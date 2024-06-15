import { ImageProps } from 'react-native';
import React, { FC, memo } from 'react';
import {
  ComponentID,
  ElementID,
  PageID,
} from '../../enum';
import useConfig from '../../hooks/useConfig';
// import { useConfigImageUri } from '../../hooks/useConfigImageUri';
import ShareIcon from '../../svg/ShareIcon';


type ShareButtonIconElementType = Partial<ImageProps> & {
  pageID?: PageID;
  componentID?: ComponentID;
};

const ShareButtonIconElement: FC<ShareButtonIconElementType> = ({
  pageID = '*',
  componentID = '*',
  ...props
}) => {
  const { excludes } = useConfig();
  const elementID = ElementID.share_button;

  const configId = `${pageID}/${componentID}/${elementID}`;

  if (excludes.includes(configId)) return null;

  return (
    // <Image
    //   testID={configId}
    //   accessibilityLabel={configId}
    //   source={props.source ?? imageSource}
    //   {...props}
    // />
    <ShareIcon {...props}/>
  );
};

export default memo(ShareButtonIconElement);
