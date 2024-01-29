import { PostRepository } from '@amityco/ts-sdk-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, View, Text } from 'react-native';
import { getStyles } from './styles';
import CloseButton from '../../components/BackButton';
import useAuth from '../../hooks/useAuth';
import { RootStackParamList } from 'src/routes/RouteParamList';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { amityPostsFormatter } from '../../util/postDataFormatter';
import { IPost } from '../../components/Social/PostList';
import PendingPostList from '../../components/Social/PendingPostList';
export default function PendingPosts() {
  const route = useRoute<RouteProp<RootStackParamList, 'PendingPosts'>>();

  const { communityId, isModerator } = route.params;
  const [postList, setPostList] = useState<IPost[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { client } = useAuth();

  const styles = getStyles();

  React.useLayoutEffect(() => {
    // Set the headerRight component to a TouchableOpacity
    navigation.setOptions({
      headerLeft: () => <CloseButton />,
    });
  }, [navigation]);

  const getPendingPosts = async () => {
    const unsubscribe = PostRepository.getPosts(
      {
        targetId: communityId,
        targetType: 'community',
        feedType: 'reviewing',
        limit: 30,
      },
      async ({ data: posts }) => {
        let pendingPost = await amityPostsFormatter(posts);
        if (!isModerator && client) {
          pendingPost = pendingPost.filter(
            (item) => item.user.userId === (client as Amity.Client).userId
          );
        }
        setPostList(pendingPost);
      }
    );
    unsubscribe();
  };

  useEffect(() => {
    getPendingPosts();
  }, [communityId]);

  const removePostfromList = (postId: string) => {
    const prevPostList: IPost[] = [...postList];
    const updatedPostList: IPost[] = prevPostList.filter(
      (item) => item.postId !== postId
    );
    setPostList(updatedPostList);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.declineWarningText}>
        Decline pending post will permanently delete the selected post from
        community.
      </Text>
      <FlatList
        data={postList}
        renderItem={({ item }) => (
          <PendingPostList
            postDetail={item}
            onAcceptDecline={removePostfromList}
            isModerator={isModerator}
          />
        )}
        keyExtractor={(item) => item.postId.toString()}
        extraData={postList}
      />
    </View>
  );
}
