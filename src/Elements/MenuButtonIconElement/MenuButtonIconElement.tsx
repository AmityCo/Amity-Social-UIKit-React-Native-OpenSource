import { ImageProps } from 'react-native';
import React, { FC, memo } from 'react';
import {
  ComponentID,
  ElementID,
  PageID,
} from '../../enum';
import useConfig from '../../hooks/useConfig';
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
  const configId = `${pageID}/${componentID}/${elementID}`;

  if (excludes.includes(configId)) return null;

  return (
    <ThreeDotsIcon {...props} />
  );
};

export default memo(MenuButtonIconElement);
