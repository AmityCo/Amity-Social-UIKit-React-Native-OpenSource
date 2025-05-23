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


type ImageElementType = Partial<ImageProps> & {
  pageID?: PageID;
  componentID?: ComponentID;
  elementID: ElementID;
  configKey?: keyof UiKitConfigKeys;
};

const ImageElement: FC<ImageElementType> = ({
  pageID = '*',
  componentID = '*',
  elementID,
  configKey,
  ...props
}) => {
  const { excludes } = useConfig();
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
    <Image
      testID={configId}
      accessibilityLabel={configId}
      source={props.source ?? imageSource}
      {...props}
    />
  );
};

export default memo(ImageElement);
