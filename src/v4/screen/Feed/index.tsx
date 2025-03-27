import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import { FlatList, View } from 'react-native';
import PostList from '../../../components/Social/PostList';
import { useStyles } from './styles';
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
import { deletePostById } from '../../../providers/Social/feed-sdk';
import { amityPostsFormatter } from '../../../util/postDataFormatter';
import { useFocusEffect } from '@react-navigation/native';
import { usePaginatorApi } from '../../hook/usePaginator';
import { usePostImpression } from '../../../v4/hook/usePostImpression';
import { isAmityAd } from '../../../v4/hook/useCustomRankingGlobalFeed';
import PostAdComponent from '../../component/PostAdComponent/PostAdComponent';

interface IFeed {
  targetId: string;
  targetType: string;
}

const pageLimit = 10;

function Feed({ targetId, targetType }: IFeed, ref: React.Ref<FeedRefType>) {
  const styles = useStyles();
  const [postData, setPostData] = useState<Amity.Post>([]);
  const [onNextPage, setOnNextPage] = useState(null);
  const disposers: Amity.Unsubscriber[] = useMemo(() => [], []);

  const { itemWithAds } = usePaginatorApi<Amity.Post | Amity.Ad>({
    items: postData as Amity.Post[],
    placement: 'feed' as Amity.AdPlacement,
    pageSize: pageLimit,
    getItemId: (item) =>
      isAmityAd(item) ? item?.adId.toString() : item?.postId.toString(),
  });

  const shouldShowAds = targetType !== 'user';
  const feedItems = shouldShowAds ? itemWithAds : postData;

  const { handleViewChange } = usePostImpression(
    itemWithAds.filter(
      (item: Amity.Post | Amity.Ad) =>
        !!(isAmityAd(item) ? item?.adId : item?.postId)
    ) as (Amity.Post | Amity.Ad)[]
  );

  let isSubscribed = false;

  const subscribePostTopic = useCallback((type: string, id: string) => {
    if (isSubscribed) return;

    if (type === 'user') {
      let user = {} as Amity.User;
      UserRepository.getUser(id, ({ data }) => {
        user = data;
      });
      disposers.push(
        subscribeTopic(getUserTopic(user, SubscriptionLevels.POST))
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isSubscribed = true;
      return;
    }
    if (type === 'community') {
      CommunityRepository.getCommunity(id, (data) => {
        if (data.data) {
          disposers.push(
            subscribeTopic(
              getCommunityTopic(data.data, SubscriptionLevels.POST)
            )
          );
        }
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      disposers.forEach((fn) => fn());
    };
  }, [disposers]);

  const handleLoadMore = () => {
    if (onNextPage) {
      onNextPage();
    }
  };
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = PostRepository.getPosts(
        {
          targetId,
          targetType,
          sortBy: 'lastCreated',
          limit: 10,
          feedType: 'published',
        },
        async ({ data, error, loading, hasNextPage, onNextPage: nextPage }) => {
          if (!error && !loading) {
            const filterData: any[] = data.map((item) => {
              if (item.dataType === 'text') return item;
            });

            setOnNextPage(hasNextPage ? () => nextPage : null);
            const formattedPostList = await amityPostsFormatter(filterData);
            setPostData(formattedPostList);
            subscribePostTopic(targetType, targetId);
          }
        }
      );
      return () => {
        unsubscribe();
      };
    }, [subscribePostTopic, targetId, targetType])
  );

  useImperativeHandle(ref, () => ({
    handleLoadMore,
  }));

  const onDeletePost = async (postId: string) => {
    await deletePostById(postId);
  };
  return (
    <View style={styles.feedWrap}>
      <FlatList
        scrollEnabled={false}
        data={feedItems ?? []}
        renderItem={({ item, index }) => {
          if (isAmityAd(item)) return <PostAdComponent ad={item as Amity.Ad} />;

          return (
            <PostList
              onDelete={onDeletePost}
              postDetail={item}
              isGlobalfeed={false}
              postIndex={index}
            />
          );
        }}
        keyExtractor={(item, index) =>
          isAmityAd(item)
            ? item.adId.toString() + index
            : item.postId.toString()
        }
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 60 }}
        onViewableItemsChanged={handleViewChange}
        extraData={itemWithAds}
      />
    </View>
  );
}
export default forwardRef(Feed);
