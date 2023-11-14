import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

// import { useTranslation } from 'react-i18next';

import { FlatList, View } from 'react-native';
import useAuth from '../../hooks/useAuth';
import PostList from '../../components/Social/PostList';
import { getStyles } from './styles';
import { PostRepository } from '@amityco/ts-sdk-react-native';
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
  const { client } = useAuth();
  const [postData, setPostData] = useState<Amity.LiveCollection<Amity.Post<any>>>();
  const { postList } = useSelector((state: RootState) => state.feed)
  const { clearFeed, updateFeed, deleteByPostId } = feedSlice.actions
  // const [postList, setPostList] = useState<IPost[]>([]);
  const { data: posts, onNextPage, hasNextPage } = postData ?? {};

  const dispatch = useDispatch()

  async function getFeed(): Promise<void> {
    const unsubscribe = PostRepository.getPosts(
      { targetId, targetType, sortBy: 'lastCreated', limit: 10 },
      (data) => {
        setPostData(data);
      }
    );
    unsubscribe();
  }
  const handleLoadMore = () => {
    if (hasNextPage) {
      onNextPage && onNextPage();
    }
  };
  useEffect(() => {
    return () => {
      setPostData(undefined);
      clearFeed()
    };
  }, []);
  useEffect(() => {
    getFeed();
  }, [client]);

  const getPostList = async () => {
    if (posts.length > 0) {
      const formattedPostList = await amityPostsFormatter(posts)
      dispatch(updateFeed(formattedPostList))
    }
  }

  useEffect(() => {
    getPostList();
  }, [posts]);

  useImperativeHandle(ref, () => ({
    handleLoadMore,
  }));

  const onDeletePost = async (postId: string) => {
    const isDeleted = await deletePostById(postId);
    if (isDeleted) {
      dispatch(deleteByPostId({ postId }))
    }
  };
  return (
    <View style={styles.feedWrap}>
      <FlatList
        data={postList}
        renderItem={({ item, index }) => (
          <PostList onDelete={onDeletePost} postDetail={item} isGlobalfeed={false} postIndex={index} />
        )}
        keyExtractor={(item) => item.postId.toString()}
        extraData={postList}
      />
    </View>
  );
}
export default forwardRef(Feed);
