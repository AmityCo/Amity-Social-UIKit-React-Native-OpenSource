import { Text } from 'react-native';
import React, { memo } from 'react';
import { useUiKitConfig } from '../../../hooks/useUiKitConfig';
import { ComponentID, ElementID, PageID } from '../../../enum';
import useConfig from '../../../hooks/useConfig';
import { useStyles } from './styles/styles';

const Title = () => {
  const { excludes } = useConfig();
  const styles = useStyles();
  const title = useUiKitConfig({
    keys: ['text'],
    page: PageID.social_home_page,
    component: ComponentID.empty_newsfeed,
    element: ElementID.title,
  }) as string[];

  if (excludes.includes('social_home_page/empty_newsfeed/title')) return null;
  return <Text style={styles.title}>{title[0]}</Text>;
};

export default memo(Title);
