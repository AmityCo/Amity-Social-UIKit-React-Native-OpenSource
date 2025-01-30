import { ImageProps, Image } from 'react-native';
import React, { FC, memo } from 'react';
import {
  ComponentID,
  ElementID,
  PageID,
  UiKitConfigKeys,
} from '../../enum/enumUIKitID';
import { useAmityElement, useConfigImageUri } from '../../hooks';

type ImageKeyElementType = Partial<ImageProps> & {
  pageID?: PageID;
  componentID?: ComponentID;
  elementID?: ElementID;
};

const ImageKeyElement: FC<ImageKeyElementType> = ({
  pageID = PageID.WildCardPage,
  componentID = ComponentID.WildCardComponent,
  elementID = ElementID.WildCardElement,
  ...props
}) => {
  const configKey: keyof UiKitConfigKeys = 'image';
  const { accessibilityId, isExcluded } = useAmityElement({
    pageId: pageID,
    componentId: componentID,
    elementId: elementID,
  });
  const imageSource = useConfigImageUri({
    configPath: {
      page: pageID,
      component: componentID,
      element: elementID,
    },
    configKey: configKey,
  });
  if (isExcluded) return null;

  return (
    <Image
      testID={accessibilityId}
      accessibilityLabel={accessibilityId}
      source={props.source ?? imageSource}
      {...props}
    />
  );
};

export default memo(ImageKeyElement);
