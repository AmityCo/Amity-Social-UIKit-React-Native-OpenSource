import { TextProps, Text } from 'react-native';
import React, { FC, memo } from 'react';

import useConfig from '../../hooks/useConfig';

import { ComponentID, ElementID, PageID } from '../../enum';
import { useTimeDifference } from '../../hooks/useTimeDifference';

type TimeStampElementType = Partial<TextProps> & {
  pageID?: PageID;
  componentID?: ComponentID;
  createdAt: string;
};

const TimeStampElement: FC<TimeStampElementType> = ({
  pageID = '*',
  componentID = '*',
  createdAt,
  ...props
}) => {
  const { excludes } = useConfig();
  const elementID = ElementID.timestamp;
  const configId = `${pageID}/${componentID}/${elementID}`;
  const text = useTimeDifference(createdAt);
  if (excludes.includes(configId)) return null;
  return (
    <Text testID={configId} accessibilityLabel={configId} {...props}>
      {text}
    </Text>
  );
};

export default memo(TimeStampElement);
