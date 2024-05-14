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
import useConfig from '../../../hook/useConfig';

type AmityEmptyNewsFeedComponentType = {
  onPressExploreCommunity: () => void;
};

const AmityEmptyNewsFeedComponent: FC<AmityEmptyNewsFeedComponentType> = ({
  onPressExploreCommunity,
}) => {
  const { excludes } = useConfig();
  const styles = useStyles();
  if (excludes.includes('social_home_page/empty_newsfeed/*')) return null;
  return (
    <View style={styles.container}>
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
