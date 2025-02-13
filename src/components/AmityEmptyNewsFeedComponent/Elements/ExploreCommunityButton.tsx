import {  Text, TouchableOpacity } from 'react-native';
import React, { FC, memo } from 'react';
import { useUiKitConfig } from '../../../hooks/useUiKitConfig';
import { ComponentID, ElementID, PageID } from '../../../enum';
import useConfig from '../../../hooks/useConfig';
import { useStyles } from './styles/styles';

type ExploreCommunityButtonType = {
  onPressExploreCommunity?: () => void;
};

const ExploreCommunityButton: FC<ExploreCommunityButtonType> = ({
  onPressExploreCommunity,
}) => {
  const { excludes } = useConfig();
  const styles = useStyles();

  const [text] = useUiKitConfig({
    keys: ['text'],
    page: PageID.social_home_page,
    component: ComponentID.empty_newsfeed,
    element: ElementID.explore_communities_button,
  }) as string[];


  if (
    excludes.includes(
      'social_home_page/empty_newsfeed/explore_communitties_button'
    )
  )
    return null;

  return (
    <TouchableOpacity
      style={styles.exploreBtn}
      onPress={() => onPressExploreCommunity && onPressExploreCommunity()}
    >

      <Text style={styles.exploreText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default memo(ExploreCommunityButton);
