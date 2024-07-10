import { Text } from 'react-native';
import React, { memo } from 'react';
import { ComponentID, ElementID, PageID } from '../../../../enum';
import useConfig from '../../../../hook/useConfig';
import { useUiKitConfig } from '../../../../hook';
import { useStyles } from './styles/styles';

const Description = () => {
  const { excludes } = useConfig();
  const styles = useStyles();
  const title = useUiKitConfig({
    keys: ['text'],
    page: PageID.social_home_page,
    component: ComponentID.empty_newsfeed,
    element: ElementID.description,
  }) as string[];

  if (excludes.includes('social_home_page/empty_newsfeed/description'))
    return null;
  return <Text style={styles.description}>{title[0]}</Text>;
};

export default memo(Description);
