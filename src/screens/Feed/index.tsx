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
import useAuth from '../../hooks/useAuth';
import PostList, { type IPost } from '../../components/Social/PostList';
import { getStyles } from './styles';
import { PostRepository } from '@amityco/ts-sdk-react-native';
import type { FeedRefType } from '../CommunityHome';
import { deletePostById } from '../../providers/Social/feed-sdk';
import { amityPostsFormatter } from '../../util/postDataFormatter';

interface IFeed {
  targetId: string;
  targetType: string;
}
function Feed({ targetId, targetType }: IFeed, ref: React.Ref<FeedRefType>) {

  const styles = getStyles();
  const { client } = useAuth();
  const [postData, setPostData] =
    useState<Amity.LiveCollection<Amity.Post<any>>>();
  const [postList, setPostList] = useState<IPost[]>([]);
  const { data: posts, onNextPage, hasNextPage } = postData ?? {};
  const flatListRef = useRef(null);

  async function getFeed(): Promise<void> {
    const unsubscribe = PostRepository.getPosts(
      { targetId, targetType, sortBy: 'lastCreated' },
      (data) => {
        setPostData(data);
      }
    );
    unsubscribe();
  }
  const handleLoadMore = () => {
    if (hasNextPage) {
      console.log('hasNextPage:', hasNextPage)
      onNextPage && onNextPage();
    }
  };
  useEffect(() => {
    return () => {
      setPostData(undefined);
      setPostList([]);
    };
  }, []);
  useEffect(() => {
    getFeed();
  }, [client]);

  const getPostList = useCallback(async () => {
    if (posts && posts.length > 0) {
      const formattedPostList = await amityPostsFormatter(posts);
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
      <FlatList
        data={postList}
        renderItem={({ item }) => (
          <PostList onDelete={onDeletePost} postDetail={item} />
        )}
        keyExtractor={(item) => item.postId.toString()}
        onEndReachedThreshold={0.8}
        onEndReached={handleLoadMore}
        ref={flatListRef}
        scrollEnabled={false}
      />
    </View>
  );
}
export default forwardRef(Feed);
