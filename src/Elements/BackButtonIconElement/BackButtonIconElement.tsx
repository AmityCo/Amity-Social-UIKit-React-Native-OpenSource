import { ImageProps } from 'react-native';
import React, { FC, memo } from 'react';
import {
  ComponentID,
  ElementID,
  PageID,
  // UiKitConfigKeys,
} from '../../enum/enumUIKitID';

import useConfig from '../../hooks/useConfig';
// import { useConfigImageUri } from '../../hooks/useConfigImageUri';
import BackButton from '../../components/BackButton';

type BackButtonIconElementType = Partial<ImageProps> & {
  pageID?: PageID;
  componentID?: ComponentID;
};

const BackButtonIconElement: FC<BackButtonIconElementType> = ({
  pageID = '*',
  componentID = '*',
  ...props
}) => {
  const { excludes } = useConfig();
  const elementID = ElementID.back_button;
  // const configKey: keyof UiKitConfigKeys = 'icon';
  const configId = `${pageID}/${componentID}/${elementID}`;
  // const imageSource = useConfigImageUri({
  //   configPath: {
  //     page: pageID,
  //     component: componentID,
  //     element: elementID,
  //   },
  //   configKey: configKey,
  // });
  if (excludes.includes(configId)) return null;

  return (
    // <Image
    //   testID={configId}
    //   accessibilityLabel={configId}
    //   source={props.source ?? imageSource}
    //   {...props}
    // />
    <BackButton  {...props}/>
  );
};

export default memo(BackButtonIconElement);
