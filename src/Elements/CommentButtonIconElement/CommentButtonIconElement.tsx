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
import CommentIcon from '../../svg/CommentIcon';

type CommentButtonIconElementType = Partial<ImageProps> & {
  pageID?: PageID;
  componentID?: ComponentID;
};

const CommentButtonIconElement: FC<CommentButtonIconElementType> = ({
  pageID = '*',
  componentID = '*',
  ...props
}) => {
  const { excludes } = useConfig();
  const elementID = ElementID.comment_button;
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

  return (
    // <Image
    //   testID={configId}
    //   accessibilityLabel={configId}
    //   source={props.source ?? imageSource}
    //   {...props}
    // />
    <CommentIcon  {...props}/>
  );
};

export default memo(CommentButtonIconElement);
