import React, { FC, memo, useCallback, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import useAuth from '../../../../hooks/useAuth';
import { useStyle } from './styles';
import { amityPostsFormatter } from '../../../../util/postDataFormatter';
import { useDispatch, useSelector } from 'react-redux';
import globalFeedSlice from '../../../../redux/slices/globalfeedSlice';
import { RootState } from '../../../../redux/store';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshControl } from 'react-native';
import AmityPostContentComponent from '../AmityPostContentComponent/AmityPostContentComponent';
import { ComponentID, PageID } from '../../../enum/enumUIKitID';
import { useAmityComponent } from '../../../hook/useUiKitReference';
import { AmityPostContentComponentStyleEnum } from '../../../enum/AmityPostContentComponentStyle';
import AmityStoryTabComponent from '../AmityStoryTabComponent/AmityStoryTabComponent';
import { AmityStoryTabComponentEnum } from '../../types';
import { FeedRepository, PostRepository } from '@amityco/ts-sdk-react-native';

type AmityGlobalFeedComponentType = {
  pageId?: PageID;
};

const AmityGlobalFeedComponent: FC<AmityGlobalFeedComponentType> = ({
  pageId,
}) => {
  const componentId = ComponentID.global_feed_component;
  const { isExcluded, themeStyles, accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });
  const { postList } = useSelector((state: RootState) => state.globalFeed);
  const [refreshing, setRefreshing] = useState(false);
  const { updateGlobalFeed, clearFeed } = globalFeedSlice.actions;
  const dispatch = useDispatch();
  const styles = useStyle(themeStyles);
  const { isConnected } = useAuth();
  const [postData, setPostData] = useState<{ data: any; nextPage: string }>();
  const { data: posts = [], nextPage } = postData ?? {};
  const flatListRef = useRef(null);

  const getGlobalFeedList = async (queryToken?: string) => {
    const {
      data,
      paging: { next },
    } = await FeedRepository.getCustomRankingGlobalFeed({
      queryToken,
      limit: 20,
    });
    if (data) {
      setPostData({ data, nextPage: next });
    }
  };
  const handleLoadMore = () => {
    if (nextPage) {
      getGlobalFeedList(nextPage);
    }
  };
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(clearFeed());
    await getGlobalFeedList();
    setRefreshing(false);
  }, [clearFeed, dispatch]);

  useFocusEffect(
    useCallback(() => {
      if (isConnected) {
        FeedRepository.getCustomRankingGlobalFeed({
          limit: 20,
        }).then(({ data, paging: { next } }) => {
          setPostData({ data, nextPage: next });
        });
      }
    }, [isConnected])
  );
  const getPostList = useCallback(async () => {
    if (posts.length > 0) {
      //filter image and video post. remove this later
      const results = await Promise.all(
        posts.map((post) => {
          if (post?.children.length > 0) {
            return new Promise((resolve) => {
              PostRepository.getPost(
                post?.children[0],
                ({ error, loading, data }) => {
                  if (!error && !loading) {
                    if (
                      data?.dataType === 'image' ||
                      data?.dataType === 'video'
                    ) {
                      resolve(post);
                    } else {
                      resolve(null);
                    }
                  } else {
                    resolve(null);
                  }
                }
              );
            });
          } else {
            return post;
          }
        })
      );
      const filteredResult = results.filter((result) => result !== null);
      const formattedPostList = await amityPostsFormatter(filteredResult);
      dispatch(updateGlobalFeed(formattedPostList));
    }
  }, [dispatch, posts, updateGlobalFeed]);
  useFocusEffect(
    useCallback(() => {
      posts && getPostList();
    }, [getPostList, posts])
  );

  if (isExcluded) return null;

  return (
    <FlatList
      initialNumToRender={20}
      testID={accessibilityId}
      accessibilityLabel={accessibilityId}
      style={styles.feedWrap}
      data={postList}
      renderItem={({ item }) => (
        <AmityPostContentComponent
          post={item}
          AmityPostContentComponentStyle={
            AmityPostContentComponentStyleEnum.feed
          }
        />
      )}
      keyExtractor={(item) => item.postId.toString()}
      onEndReachedThreshold={0.5}
      onEndReached={handleLoadMore}
      ref={flatListRef}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['lightblue']}
          tintColor="lightblue"
        />
      }
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        !refreshing && (
          <AmityStoryTabComponent
            type={AmityStoryTabComponentEnum.globalFeed}
          />
        )
      }
    />
  );
};

export default memo(AmityGlobalFeedComponent);
