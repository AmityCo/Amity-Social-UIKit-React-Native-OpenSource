import { ImageProps } from 'react-native';
import React, { FC, memo } from 'react';
import {
  ComponentID,
  ElementID,
  PageID,

} from '../../enum/enumUIKitID';
import { useAmityElement } from '../../hooks';
import BackButton from '../../components/BackButton';

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
  const { isExcluded } = useAmityElement({
    pageId: pageID,
    componentId: componentID,
    elementId: elementID,
  });

  if (isExcluded) return null;

  return (
    <BackButton {...props}/>
  );
};

export default memo(CloseButtonIconElement);
