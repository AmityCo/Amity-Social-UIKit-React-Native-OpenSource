import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useCommunities, useUser } from '~/v4/hook';
import CloseButtonIconElement from '../../Elements/CloseButtonIconElement/CloseButtonIconElement';
import PostTargetItem from './Components/PostTargetItem';
import { Divider } from 'react-native-paper';
import useAuth from '~/hooks/useAuth';

const AmityPostTargetSelectionPage = () => {
  const { client } = useAuth();
  const user = useUser((client as Amity.Client).userId);
  const { communities, onNextCommunityPage } = useCommunities();
  const renderItem = ({ item }: { item: Amity.Community }) => {
    return (
      <PostTargetItem
        key={item.communityId}
        displayName={item.displayName}
        onSelect={() => {}}
        avatarFileId={item.avatarFileId}
      />
    );
  };

  return (
    <View>
      <View>
        <CloseButtonIconElement />
        <Text>Post to</Text>
      </View>
      <PostTargetItem
        displayName="My Timeline"
        onSelect={() => {}}
        avatarFileId={user.avatarFileId}
      />
      <Divider />
      <Text>My Communities</Text>
      <FlatList
        data={communities}
        renderItem={renderItem}
        onEndReached={onNextCommunityPage}
        onEndReachedThreshold={0.8}
        keyExtractor={(item) => item.communityId.toString()}
      />
    </View>
  );
};

export default React.memo(AmityPostTargetSelectionPage);
