import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useCommunities, useUser } from '../../../../v4/hook';
import PostTargetItem from './Components/PostTargetItem';
import { Divider } from 'react-native-paper';
import useAuth from '../../../../hooks/useAuth';

const AmityPostTargetSelectionPage = ({ route, navigation }) => {
  const { client } = useAuth();
  const user = useUser((client as Amity.Client).userId);
  const { communities, onNextCommunityPage } = useCommunities();
  const { postType } = route.params;

  const onSelectFeed = ({
    targetId,
    targetName,
    targetType,
    isPublic,
    postSetting,
    needApprovalOnPostCreation,
  }: {
    targetId: string;
    targetName: string;
    targetType: string;
    isPublic?: boolean;
    postSetting?: ValueOf<
      Readonly<{
        ONLY_ADMIN_CAN_POST: 'ONLY_ADMIN_CAN_POST';
        ADMIN_REVIEW_POST_REQUIRED: 'ADMIN_REVIEW_POST_REQUIRED';
        ANYONE_CAN_POST: 'ANYONE_CAN_POST';
      }>
    >;
    needApprovalOnPostCreation?: string;
  }) => {
    const targetscreen = () => {
      if (postType === 'post') return 'CreatePost';
      if (postType === 'story') return 'CreateStory';
      if (postType === 'poll') return 'CreatePoll';
      if (postType === 'livestream') return 'CreateLivestream';
      return null;
    };

    navigation.navigate(targetscreen(), {
      targetId: targetId,
      targetName: targetName,
      targetType: targetType,
      postSetting: postSetting,
      isPublic: isPublic,
      needApprovalOnPostCreation: needApprovalOnPostCreation,
    });
  };

  const renderItem = ({ item }: { item: Amity.Community }) => {
    return (
      <PostTargetItem
        key={item.communityId}
        displayName={item.displayName}
        onSelect={() =>
          onSelectFeed({
            targetId: item.communityId,
            targetName: item.displayName,
            targetType: 'community',
          })
        }
        avatarFileId={item.avatarFileId}
      />
    );
  };

  return (
    <View>
      <PostTargetItem
        displayName="My Timeline"
        onSelect={() =>
          onSelectFeed({
            targetId: user.userId,
            targetName: 'My Timeline',
            targetType: 'user',
          })
        }
        avatarFileId={user?.avatarFileId}
      />
      <Divider />
      <Text>My Communities</Text>
      <FlatList
        data={communities}
        renderItem={renderItem}
        onEndReached={onNextCommunityPage}
        keyExtractor={(item) => item.communityId.toString()}
      />
    </View>
  );
};

export default React.memo(AmityPostTargetSelectionPage);
