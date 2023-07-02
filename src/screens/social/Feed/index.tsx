import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

// import { useTranslation } from 'react-i18next';

import { FlatList, View } from 'react-native';
import {
  getGlobalFeed,
  IGlobalFeedRes,
} from '../../../providers/Social/feed-sdk';
import useAuth from '../../../hooks/useAuth';
import PostList, { IPost } from '../../../components/Social/PostList';
import styles from './styles';
import { getAmityUser } from '../../../providers/user-provider';
import type { UserInterface } from '../../../types/user.interface';
import { PostRepository } from '@amityco/ts-sdk';
import type { FeedRefType } from '../CommunityHome';

interface IFeed {
  targetId: string;
  targetType: string;
}
function Feed({ targetId, targetType }: IFeed, ref: React.Ref<FeedRefType>) {
  console.log('targetId: ', targetId);
  const { client } = useAuth();
  const [postData, setPostData] =
    useState<Amity.LiveCollection<Amity.Post<any>>>();
  const [postList, setPostList] = useState<IPost[]>([]);
  console.log('postList: ', postList);
  console.log('postList: ', postList.length);
  // console.log('postList: ', postList);

  const {
    data: posts,
    onNextPage,
    hasNextPage,
    loading,
    error,
  } = postData ?? {};
  // console.log('nextPage: ', nextPage);
  // console.log('posts: ', posts);
  const flatListRef = useRef(null);
  async function getFeed(): Promise<void> {
    const unsubscribe = PostRepository.getPosts(
      { targetId, targetType },
      (data) => {
        console.log('data: ', data);
        setPostData(data);
        /*
         * this is only required if you want real time updates for each
         * community in the collection
         */
      }
    );
  }
  const handleLoadMore = () => {
    console.log('ending5555');
    if (hasNextPage) {
      onNextPage && onNextPage();
    }
  };
  useEffect(() => {
    getFeed();
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
      setPostList([...formattedPostList]);
    }
  }, [posts]);
  useEffect(() => {
    if (posts) {
      getPostList();
    }
  }, [posts]);

  useImperativeHandle(ref, () => ({
    handleLoadMore,
  }));

  return (
    <View style={styles.feedWrap}>
      <FlatList
        data={postList}
        renderItem={({ item }) => <PostList postDetail={item} />}
        keyExtractor={(item) => item.postId.toString()}
        onEndReachedThreshold={0.8}
        // onEndReached={handleLoadMore}
        ref={flatListRef}
        scrollEnabled={false}
      />
    </View>
  );
}
export default forwardRef(Feed);
