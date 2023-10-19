import React, { useCallback, useEffect, useRef, useState } from 'react';

// import { useTranslation } from 'react-i18next';

import { FlatList, View } from 'react-native';
import {
  deletePostById,
  getGlobalFeed,
  type IGlobalFeedRes,
} from '../../providers/Social/feed-sdk';
import useAuth from '../../hooks/useAuth';
import PostList, { type IPost } from '../../components/Social/PostList';
import { getStyles } from './styles';
import { getAmityUser } from '../../providers/user-provider';
import type { UserInterface } from '../../types/user.interface';
import MyCommunity from '../../components/MyCommunity';


export default function GlobalFeed() {

  const styles = getStyles();
  const { client, isConnected } = useAuth();
  const [postData, setPostData] = useState<IGlobalFeedRes>();
  const [postList, setPostList] = useState<IPost[]>([]);
  const { data: posts = [], nextPage } = postData ?? {};


  const flatListRef = useRef(null);
  async function getGlobalFeedList(
    page: Amity.Page<number> = { after: 0, limit: 8 }
  ): Promise<void> {
    const feedObject = await getGlobalFeed(page);
    if (feedObject) {
      setPostData(feedObject);
    }
  }
  const handleLoadMore = () => {
    if (nextPage) {
      getGlobalFeedList(nextPage);
    }
  };
  useEffect(() => {
    if (isConnected) {
      getGlobalFeedList();
    }

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
            targetType: item.targetType,
            targetId: item.targetId,
            childrenPosts: item.children,
          };
        })
      );
      setPostList((prev) => [...prev, ...formattedPostList]);
    }
  }, [posts]);
  useEffect(() => {
    getPostList();
  }, [getPostList]);

  const onDeletePost = async (postId: string) => {
    const isDeleted = await deletePostById(postId);
    if (isDeleted) {
      const prevPostList: IPost[] = [...postList];
      const updatedPostList: IPost[] = prevPostList.filter(
        (item) => item.postId !== postId
      );
      setPostList(updatedPostList);
    }
  };
  return (
    <View style={styles.feedWrap}>
      <View style={styles.feedWrap}>

        <FlatList
          data={postList}
          renderItem={({ item }) => (
            <PostList onDelete={onDeletePost} postDetail={item} />
          )}
          keyExtractor={(item) => item.postId.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          ref={flatListRef}
          ListHeaderComponent={<MyCommunity />}
        />
      </View>
    </View>
  );
}
