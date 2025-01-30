import { ImageProps, Image } from 'react-native';
import React, { FC, memo } from 'react';
import {
  ComponentID,
  ElementID,
  PageID,
  UiKitConfigKeys,
} from '../../enum/enumUIKitID';
import { useAmityElement, useConfigImageUri } from '../../hooks';

type CloseButtonIconElementType = Partial<ImageProps> & {
  pageID?: PageID;
  componentID?: ComponentID;
};

const CloseButtonIconElement: FC<CloseButtonIconElementType> = ({
  pageID = PageID.WildCardPage,
  componentID = ComponentID.WildCardComponent,
  ...props
}) => {
  const elementID = ElementID.close_button;
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

export default memo(CloseButtonIconElement);
