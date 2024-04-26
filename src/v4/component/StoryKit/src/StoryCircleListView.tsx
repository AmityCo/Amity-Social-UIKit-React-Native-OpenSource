import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import StoryCircleListItem from './StoryCircleListItem';
import { IUserStory, StoryCircleListViewProps } from './interfaces';

const StoryCircleListView = ({
  data,
  handleStoryItemPress,
  isCommunityStory = false,
}: StoryCircleListViewProps) => {
  return (
    <FlatList
      keyExtractor={(_item, index) => index.toString()}
      data={data as IUserStory[]}
      horizontal
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      ListFooterComponent={<View style={styles.footer} />}
      renderItem={({ item, index }) => (
        <StoryCircleListItem
          handleStoryItemPress={() =>
            handleStoryItemPress && handleStoryItemPress(item, index)
          }
          item={item}
          isCommunityStory={isCommunityStory}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  footer: {
    flex: 1,
    width: 8,
  },
});

export default StoryCircleListView;
