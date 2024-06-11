import { View } from 'react-native';
import React, { FC, memo } from 'react';
import { useStyles } from './styles';
import {
  Illustration,
  Title,
  Description,
  ExploreCommunityButton,
  CreateCommunityButton,
} from './Elements';


import useConfig from '../../hooks/useConfig';
import { ComponentID, PageID } from '../../enum';

type AmityEmptyNewsFeedComponentType = {
  pageId?: PageID;
  onPressExploreCommunity?: () => void;
};

const AmityEmptyNewsFeedComponent: FC<AmityEmptyNewsFeedComponentType> = ({
  onPressExploreCommunity,
  pageId = '*',
}) => {
  const { excludes } = useConfig();
  const styles = useStyles();
  const componentId = ComponentID.empty_newsfeed;
  const uiReference = `${pageId}/${componentId}/*}`;
  if (excludes.includes(uiReference)) return null;
  return (
    <View
      style={styles.container}
      testID={uiReference}
      accessibilityLabel={uiReference}
    >
      <Illustration />
      <Title />
      <Description />
      <ExploreCommunityButton
        onPressExploreCommunity={onPressExploreCommunity}
      />
      <CreateCommunityButton />
    </View>
  );
};

export default memo(AmityEmptyNewsFeedComponent);
