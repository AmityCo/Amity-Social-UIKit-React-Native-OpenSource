import React, {
  forwardRef,
  useEffect,
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

  const subscribePostTopic = (targetType: string, targetId: string) => {
    if (isSubscribed) return;

    if (targetType === 'user') {
      let user = {} as Amity.User; // use getUser to get user by targetId
      UserRepository.getUser(targetId, ({ data }) => {
        user = data;
      });
      disposers.push(
        subscribeTopic(getUserTopic(user, SubscriptionLevels.POST), () => {
          // use callback to handle errors with event subscription
        })
      );
      isSubscribed = true;
      return;
    }

    if (targetType === 'community') {
      CommunityRepository.getCommunity(targetId, (data) => {
        if (data.data) {
          subscribeTopic(getCommunityTopic(data.data, SubscriptionLevels.POST));
        }
      });
    }
  };
  async function getFeed(): Promise<void> {
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
    setUnSubPageFunc(() => unsubscribe);
  }
  const handleLoadMore = () => {
    if (hasNextPage) {
      onNextPage && onNextPage();
    }
  };
  useEffect(() => {
    getFeed();
    return () => {
      unSubFunc && unSubFunc();
      dispatch(clearFeed());
    };
  }, []);

  const getPostList = async () => {
    if (posts.length > 0) {
      const formattedPostList = await amityPostsFormatter(posts);
      dispatch(updateFeed(formattedPostList));
    }
  };

  useEffect(() => {
    getPostList();
  }, [posts]);

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
        data={postList}
        renderItem={({ item, index }) => (
          <PostList
            onDelete={onDeletePost}
            postDetail={item}
            isGlobalfeed={false}
            postIndex={index}
          />
        )}
        keyExtractor={(item) => item.postId.toString()}
        extraData={postList}
      />
    </View>
  );
}
export default forwardRef(Feed);
