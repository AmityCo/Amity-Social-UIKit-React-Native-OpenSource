import React, { useCallback, useEffect, useRef, useState } from 'react';

// import { useTranslation } from 'react-i18next';

import { FlatList, ScrollView, View } from 'react-native';
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
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../routes/RouteParamList';
import { PostRepository } from '@amityco/ts-sdk-react-native';
import { amityPostsFormatter } from '../../util/postDataFormatter';
import { useDispatch, useSelector } from 'react-redux'
import globalFeedSlice from '../../redux/slices/globalfeedSlice';
import { RootState } from 'src/redux/store';

export default function GlobalFeed() {
  const route = useRoute<RouteProp<RootStackParamList, 'Home'>>();
  const { postIdCallBack } = route?.params || {}


  const { postList } = useSelector((state: RootState) => state.globalFeed)
  	console.log('postList:', postList)

  const { updateGlobalFeed, deleteByPostId, updateByPostId } = globalFeedSlice.actions
  const dispatch = useDispatch() // ()=> dispatch(updateGlobalFeed())

  const styles = getStyles();
  const { client, isConnected } = useAuth();
  const [postData, setPostData] = useState<IGlobalFeedRes>();


  // console.log('postList:', postList)
  const { data: posts = [], nextPage } = postData ?? {};



  // const getPost = (postId: string) => {
  //   const unsubscribePost = PostRepository.getPost(
  //     postId,
  //     async ({ data }) => {
  //       // console.log('data:', data)
  //       const formattedPostList = await amityPostsFormatter([data])
  //       // console.log('formattedPostList:', formattedPostList)
  //       const oldPostList = [...postList]
  //       const updatedPostList = oldPostList.map((item: IPost) => {
  //         if (item.postId === formattedPostList[0].postId) {

  //           return formattedPostList[0]
  //         } else {
  //           return item
  //         }
  //       })
  //       // setPostList(updatedPostList)



  //     }
  //   );
  //   unsubscribePost();
  // };



  const flatListRef = useRef(null);

  // useFocusEffect(
  //   useCallback(
  //     () => {
  //       if (postIdCallBack) {

  //         getPost(postIdCallBack)
  //       }
  //     },
  //     [postIdCallBack],
  //   )

  // )
  // useEffect(() => {
  //   if (postIdCallBack) {

  //     getPost(postIdCallBack)
  //   }

  // }, [postIdCallBack])

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
  const getPostList = async () => {
    if (posts.length > 0) {
      const formattedPostList = await amityPostsFormatter(posts)
      console.log('formattedPostList:', formattedPostList)
      dispatch(updateGlobalFeed(formattedPostList))
      // setPostList((prev) => [...prev, ...formattedPostList]);
    }
  }

  useEffect(() => {
    getPostList();
  }, [posts]);

  const onDeletePost = async (postId: string) => {
    const isDeleted = await deletePostById(postId);
    if (isDeleted) {
      dispatch(deleteByPostId({ postId }))
      // const prevPostList: IPost[] = [...postList];
      // const updatedPostList: IPost[] = prevPostList.filter(
      //   (item) => item.postId !== postId
      // );
      // setPostList(updatedPostList);
    }
  };
  const onPostChange = (post: IPost) => {
    console.log('post:', post)
    // dispatch(updateByPostId({ postId: post.postId, postDetail: post }))

  }

  return (
    <View style={styles.feedWrap}>
      <View style={styles.feedWrap}>

        <FlatList
          data={postList}
          renderItem={({ item, index }) => (
            <PostList onDelete={onDeletePost} postDetail={item} onChange={onPostChange} postIndex={index} />
          )}
          keyExtractor={(item) => item.postId.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          ref={flatListRef}
          ListHeaderComponent={<MyCommunity />}
          extraData={postList}
        />

      </View>
    </View>
  );
}
