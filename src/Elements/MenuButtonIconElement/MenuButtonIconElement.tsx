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
import { SvgXml } from 'react-native-svg';
import { ThreeDotsIcon } from '../../svg/ThreeDotsIcon';


type MenuButtonIconElementType = Partial<ImageProps> & {
  pageID?: PageID;
  componentID?: ComponentID;
};

const MenuButtonIconElement: FC<MenuButtonIconElementType> = ({
  pageID = '*',
  componentID = '*',
  ...props
}) => {
  const { excludes } = useConfig();
  const elementID = ElementID.menu_button;
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
    <ThreeDotsIcon {...props} />
  );
};

export default memo(MenuButtonIconElement);
