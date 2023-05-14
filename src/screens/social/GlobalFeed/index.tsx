import React, { useCallback, useEffect, useState } from 'react';

// import { useTranslation } from 'react-i18next';

import { FlatList, View } from 'react-native';
import {
  getGlobalFeed,
  IGlobalFeedRes,
} from '../../..//providers/Social/feed-sdk';
import useAuth from '../../..//hooks/useAuth';
import PostList, { IPost } from '../../../components/Social/PostList';
import styles from './styles';
import { getAmityUser } from '../../../providers/user-provider';
import type { UserInterface } from '../../../types/user.interface';

export default function GlobalFeed() {
  const { client } = useAuth();
  const [postData, setPostData] = useState<IGlobalFeedRes>();
  const [postList, setPostList] = useState<IPost[]>([]);
  console.log('postList: ', postList);

  const { data: posts = [], nextPage } = postData ?? {};


  async function getGlobalFeedList(): Promise<void> {
    const feedObject = await getGlobalFeed();
    if (feedObject) {
      setPostData(feedObject);
    }
  }

  useEffect(() => {
    getGlobalFeedList();
  }, [client]);
  const getPostList = useCallback(async () => {
    if (posts.length > 0) {
      const formattedPostList = await Promise.all(
        posts.map(async (item: Amity.Post<any>) => {
          const { userObject } = await getAmityUser(item.postedUserId);
          let formattedUserObject: UserInterface;

          formattedUserObject = {
            userId: userObject.data.userId,
            displayName: userObject.data.displayName,
            avatarFileId: userObject.data.avatarFileId,
          };

          return {
            postId: item.postId,
            data: item.data as Record<string, any>,
            dataType: item.dataType,
            myReactions: item.myReactions as string[],
            reactionCount: item.reactions as Record<string, number>,
            commentsCount: item.commentsCount,
            user: formattedUserObject as UserInterface,
            editedAt: item.editedAt,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          };
        })
      );
      setPostList(formattedPostList);
    }
  }, [posts]);
  useEffect(() => {
    getPostList();
  }, [getPostList]);

  return (
    <View style={styles.feedWrap}>
      <FlatList
        data={postList}
        renderItem={({ item }) => <PostList postDetail={item} />}
        keyExtractor={(item) => item.postId.toString()}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
