import { ImageProps, Image } from 'react-native';
import React, { FC, memo } from 'react';
import {
  ComponentID,
  ElementID,
  PageID,
  UiKitConfigKeys,
} from '../../../enum/enumUIKitID';
import { useAmityElement, useConfigImageUri } from '../../../hook';

type ImageElementType = Partial<ImageProps> & {
  pageID?: PageID;
  componentID?: ComponentID;
  elementID: ElementID;
  configKey?: keyof UiKitConfigKeys;
};

const ImageElement: FC<ImageElementType> = ({
  pageID = PageID.WildCardPage,
  componentID = ComponentID.WildCardComponent,
  elementID,
  configKey,
  ...props
}) => {
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

export default memo(ImageElement);
