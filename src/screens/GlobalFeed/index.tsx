import React, { useCallback, useEffect, useRef, useState } from 'react';

// import { useTranslation } from 'react-i18next';

import { FlatList, View } from 'react-native';
import {
  deletePostById,
  getGlobalFeed,
  type IGlobalFeedRes,
} from '../../providers/Social/feed-sdk';
import useAuth from '../../hooks/useAuth';
import PostList from '../../components/Social/PostList';
import { getStyles } from './styles';

import { amityPostsFormatter } from '../../util/postDataFormatter';
import { useDispatch, useSelector } from 'react-redux';
import globalFeedSlice from '../../redux/slices/globalfeedSlice';
import { RootState } from '../../redux/store';
import useConfig from '../../hooks/useConfig';

import { ComponentID } from '../../util/enumUIKitID';
import MyCommunity from '../../components/MyCommunity';
import { useFocusEffect } from '@react-navigation/native';

export default function GlobalFeed() {
  const { postList } = useSelector((state: RootState) => state.globalFeed);


  const { excludes } = useConfig()
  const { updateGlobalFeed, deleteByPostId } = globalFeedSlice.actions
  const dispatch = useDispatch()

  const styles = getStyles();
  const { isConnected } = useAuth();
  const [postData, setPostData] = useState<IGlobalFeedRes>();

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
  useFocusEffect(
    useCallback(() => {
      if (isConnected) {
        getGlobalFeedList();
      }
    }, [isConnected])
  );
  const getPostList = useCallback(async () => {
    if (posts.length > 0) {
      const formattedPostList = await amityPostsFormatter(posts);
      dispatch(updateGlobalFeed(formattedPostList));
    }
  }, [dispatch, posts, updateGlobalFeed]);
  useFocusEffect(
    useCallback(() => {
      posts && getPostList();
    }, [getPostList, posts])
  );

  const onDeletePost = async (postId: string) => {
    const isDeleted = await deletePostById(postId);
    if (isDeleted) {
      dispatch(deleteByPostId({ postId }));
    }
  };

  return (
    <View style={styles.feedWrap}>
      <View style={styles.feedWrap}>
        <FlatList
          data={postList}
          renderItem={({ item, index }) => (
            <PostList onDelete={onDeletePost} postDetail={item} postIndex={index} />
          )}
          keyExtractor={(item) => item.postId.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          ref={flatListRef}
          extraData={postList}
          ListHeaderComponent={excludes.includes(ComponentID.StoryTab) && <MyCommunity />}
        />
      </View>
    </View>
  );
}
