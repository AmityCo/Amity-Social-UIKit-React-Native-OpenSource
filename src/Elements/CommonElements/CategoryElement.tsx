import { TextProps, Text } from 'react-native';
import React, { FC, memo, useLayoutEffect, useState } from 'react';
import { ComponentID, ElementID, PageID } from '../../enum';
import { CategoryRepository } from '@amityco/ts-sdk-react-native';
import useConfig from '../../hooks/useConfig';

type CategoryElementType = Partial<TextProps> & {
  pageID: PageID;
  componentID: ComponentID;
  elementID: ElementID;
  categoryId: Amity.Category['categoryId'];
};

const CategoryElement: FC<CategoryElementType> = ({
  pageID = '*',
  componentID = '*',
  elementID,
  categoryId,
  ...props
}) => {
  const { excludes } = useConfig();
  const [categoryData, setCategoryData] = useState<Amity.Category>(null);
  useLayoutEffect(() => {
    CategoryRepository.getCategory(categoryId).then(({ data }) =>
      setCategoryData(data)
    );
  }, [categoryId]);

  const configId = `${pageID}/${componentID}/${elementID}`;

  if (excludes.includes(configId)) return null;
  return (
    <Text testID={configId} accessibilityLabel={configId} numberOfLines={1} {...props}>
      {categoryData?.name}
    </Text>
  );
};

export default memo(CategoryElement);
