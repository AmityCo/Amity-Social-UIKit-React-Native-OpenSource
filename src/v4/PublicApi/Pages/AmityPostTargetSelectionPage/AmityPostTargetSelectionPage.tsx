import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useCommunities } from '~/v4/hook';
import CloseButtonIconElement from '../../Elements/CloseButtonIconElement/CloseButtonIconElement';
import PostTargetItem from './Components/PostTargetItem';
import { Divider } from 'react-native-paper';

const AmityPostTargetSelectionPage = () => {
  // TODO: add logic to fetch community data
  const { communities, onNextCommunityPage } = useCommunities();
  const renderItem = ({ item }) => {
    return (
      <PostTargetItem
        key={item.communityId}
        displayName={item.displayName}
        onSelect={() => {}}
      />
    );
  };

  return (
    <View>
      <View>
        <CloseButtonIconElement />
        <Text>Post to</Text>
      </View>
      <PostTargetItem displayName="My Timeline" onSelect={() => {}} />
      <Divider />
      <Text>My Communities</Text>
      <FlatList
        data={communities}
        renderItem={renderItem}
        onEndReached={onNextCommunityPage}
        onEndReachedThreshold={0.8}
        keyExtractor={(item) => item.communityId.toString()}
      />
      <View>
        {communities?.map((community) => {
          return (
            <PostTargetItem
              key={community.communityId}
              displayName={community.displayName}
              onSelect={() => {}}
            />
          );
        })}
      </View>
    </View>
  );
};

export default React.memo(AmityPostTargetSelectionPage);
