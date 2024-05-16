import { TextProps, Text } from 'react-native';
import React, { FC, memo } from 'react';
import { ComponentID, ElementID, PageID } from '../../../enum/enumUIKitID';
import useConfig from '../../../hook/useConfig';

type TextElementType = Partial<TextProps> & {
  pageID: PageID;
  componentID: ComponentID;
  elementID: ElementID;
  text?: string;
};

const TextElement: FC<TextElementType> = ({
  pageID = '*',
  componentID = '*',
  elementID,
  text,
  ...props
}) => {
  const { excludes, getConfig } = useConfig();
  const configId = `${pageID}/${componentID}/${elementID}`;
  const config = getConfig(configId);
  const configText = config?.text ?? config?.title ?? '';
  if (excludes.includes(configId)) return null;
  return (
    <Text testID={configId} accessibilityLabel={configId} {...props}>
      {text ?? configText}
    </Text>
  );
};

export default memo(TextElement);
