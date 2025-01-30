import { TextProps, Text } from 'react-native';
import React, { FC, memo } from 'react';
import { ComponentID, ElementID, PageID } from '../../enum/enumUIKitID';
import { useAmityElement, useUiKitConfig } from '../../hooks';

type TextElementType = Partial<TextProps> & {
  pageID: PageID;
  componentID: ComponentID;
  elementID: ElementID;
};

const TextKeyElement: FC<TextElementType> = ({
  pageID = PageID.WildCardPage,
  componentID = ComponentID.WildCardComponent,
  elementID,
  ...props
}) => {
  const { isExcluded, accessibilityId } = useAmityElement({
    pageId: pageID,
    componentId: componentID,
    elementId: elementID,
  });

  const [configText] = useUiKitConfig({
    page: pageID,
    component: componentID,
    element: elementID,
    keys: ['text'],
  }) as string[];
  if (isExcluded) return null;
  return (
    <Text
      testID={accessibilityId}
      accessibilityLabel={accessibilityId}
      {...props}
    >
      {configText}
    </Text>
  );
};

export default memo(TextKeyElement);
