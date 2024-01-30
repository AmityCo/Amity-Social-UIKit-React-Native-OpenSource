import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';

// import { useTranslation } from 'react-i18next';

import { FlatList, View } from 'react-native';
import PostList from '../../components/Social/PostList';
import { getStyles } from './styles';
import {
  CommunityRepository,
  PostRepository,
  SubscriptionLevels,
  UserRepository,
  getCommunityTopic,
  getUserTopic,
  subscribeTopic,
} from '@amityco/ts-sdk-react-native';
import type { FeedRefType } from '../CommunityHome';
import { deletePostById } from '../../providers/Social/feed-sdk';
import { amityPostsFormatter } from '../../util/postDataFormatter';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import feedSlice from '../../redux/slices/feedSlice';
import { useFocusEffect } from '@react-navigation/native';

interface IFeed {
  targetId: string;
  targetType: string;
}
function Feed({ targetId, targetType }: IFeed, ref: React.Ref<FeedRefType>) {
  const styles = getStyles();
  const [postData, setPostData] =
    useState<Amity.LiveCollection<Amity.Post<any>>>();
  const { postList } = useSelector((state: RootState) => state.feed);
  const { clearFeed, updateFeed, deleteByPostId } = feedSlice.actions;
  const { data: posts, onNextPage, hasNextPage } = postData ?? {};
  const [unSubFunc, setUnSubPageFunc] = useState<() => void>();
  const dispatch = useDispatch();

  const disposers: Amity.Unsubscriber[] = [];
  let isSubscribed = false;

  const subscribePostTopic = useCallback((type: string, id: string) => {
    if (isSubscribed) return;

    if (type === 'user') {
      let user = {} as Amity.User; // use getUser to get user by targetId
      UserRepository.getUser(id, ({ data }) => {
        user = data;
      });
      disposers.push(
        subscribeTopic(getUserTopic(user, SubscriptionLevels.POST), () => {
          // use callback to handle errors with event subscription
        })
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isSubscribed = true;
      return;
    }

    if (type === 'community') {
      CommunityRepository.getCommunity(id, (data) => {
        if (data.data) {
          subscribeTopic(getCommunityTopic(data.data, SubscriptionLevels.POST));
        }
      });
    }
  }, []);
  const getFeed = useCallback(() => {
    const unsubscribe = PostRepository.getPosts(
      {
        targetId,
        targetType,
        sortBy: 'lastCreated',
        limit: 10,
        feedType: 'published',
      },
      (data) => {
        setPostData(data);
        subscribePostTopic(targetType, targetId);
      }
    );
    setUnSubPageFunc(() => unsubscribe());
  }, [subscribePostTopic, targetId, targetType]);
  const handleLoadMore = () => {
    if (hasNextPage) {
      onNextPage && onNextPage();
    }
  };
  useFocusEffect(
    useCallback(() => {
      getFeed();
      return () => {
        unSubFunc && unSubFunc();
        dispatch(clearFeed());
      };
    }, [clearFeed, dispatch, getFeed, unSubFunc])
  );

  const getPostList = useCallback(async () => {
    if (posts.length > 0) {
      const formattedPostList = await amityPostsFormatter(posts);
      dispatch(updateFeed(formattedPostList));
    }
  }, [dispatch, posts, updateFeed]);

  useFocusEffect(
    useCallback(() => {
      posts && getPostList();
    }, [posts, getPostList])
  );

  useImperativeHandle(ref, () => ({
    handleLoadMore,
  }));

  const onDeletePost = async (postId: string) => {
    const isDeleted = await deletePostById(postId);
    if (isDeleted) {
      dispatch(deleteByPostId({ postId }));
    }
  };
  return (
    <View style={styles.feedWrap}>
      <FlatList
        scrollEnabled={false}
        data={postList}
        renderItem={({ item, index }) => (
          <PostList
            onDelete={onDeletePost}
            postDetail={item}
            isGlobalfeed={false}
            postIndex={index}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
        extraData={postList}
      />
    </View>
  );
}
export default forwardRef(Feed);
