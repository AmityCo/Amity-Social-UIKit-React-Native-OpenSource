import { type RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  FlatList,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  Button,
} from 'react-native';

import type { RootStackParamList } from 'src/routes/RouteParamList';
import PostList, { IPost, IPostList } from '../../components/Social/PostList';

import { getStyles } from './styles';
import type { IComment } from '../../components/Social/CommentList';
import type { UserInterface } from '../../types/user.interface';
import { getAmityUser } from '../../providers/user-provider';
import CommentList from '../../components/Social/CommentList';
import { CommentRepository, CommunityRepository, PostRepository, SubscriptionLevels, UserRepository, getCommunityTopic, getPostTopic, getUserTopic, subscribeTopic } from '@amityco/ts-sdk-react-native';
import {
  createComment,
  deleteCommentById,
} from '../../providers/Social/comment-sdk';

import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackButton from '../../components/BackButton';
import globalFeedSlice from '../../redux/slices/globalfeedSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import postDetailSlice from '../../redux/slices/postDetailSlice';
import PostListForDetailPage from '../../components/Social/PostListForDetailPage';



const PostDetail = () => {

  const theme = useTheme() as MyMD3Theme;
  const styles = getStyles();
  const route = useRoute<RouteProp<RootStackParamList, 'PostDetail'>>();

  const {
    postId,
    postIndex
  } = route.params;

  console.log('postId:', postId)
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [commentList, setCommentList] = useState<IComment[]>([]);
  const [commentCollection, setCommentCollection] = useState<Amity.LiveCollection<Amity.Comment>>();
  const { data: comments, hasNextPage, onNextPage } = commentCollection ?? {};
  const [unSubscribeComment, setUnSubscribeComment] = useState<() => void>();
  console.log('unSubscribeComment:', unSubscribeComment)
  const [unSubscribePost, setUnSubscribePost] = useState<() => void>();
  // console.log('unSubscribePost:', unSubscribePost)
  const [inputMessage, setInputMessage] = useState('');
  const [communityObject, setCommunityObject] = useState<Amity.Community>()
  const [userObject, setUserObject] = useState<Amity.User>()

  const flatListRef = useRef(null);
  let isSubscribed = false;
  const disposers: Amity.Unsubscriber[] = [];

  const [postCollection, setPostCollection] = useState<Amity.Post<any>>();

  const [loading, setLoading] = useState<boolean>(true)
  const { currentPostdetail } = useSelector((state: RootState) => state.postDetail)
  	// console.log('currentPostdetail:', currentPostdetail)
  // console.log('currentIndex:', currentIndex)
  // console.log('postList:', postList)
  const { postList } = useSelector((state: RootState) => state.globalFeed)



  const { updateByPostId } = globalFeedSlice.actions
  const { updatePostDetail } = postDetailSlice.actions
  const dispatch = useDispatch()


  // useEffect(() => {
  //   if (postDetail) {
  //     setPostData(postDetail)
  //   }

  // }, [route.params])

  const onBackPress = () => {
    // navigation.navigate('Home', { postIdCallBack: postData.postId })
    // navigation.goBack()


    navigation.goBack()

  }
  navigation.setOptions({
    headerLeft: () => <BackButton onPress={onBackPress} goBack={false} />,
    title: ''

  });

  const getPost = (postId: string) => {
    const unsubscribePost = PostRepository.getPost(
      postId,
      async ({ data }) => {
        console.log('data========:', data)
        setPostCollection(data);
      }
    );
    console.log('unSubscribePost:', unsubscribePost)
    setUnSubscribePost(() => unsubscribePost);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 100);
    getPost(postId)

  }, [postId])

  // useEffect(() => {
  //   // setPostData(postList[])
  //   const index = postList.findIndex(item => item.postId === postId);

  // }, [postList])


  const formattedPostCollection = async () => {
    const item = postCollection
    const { userObject } = await getAmityUser(item.postedUserId);
    let formattedUserObject: UserInterface;

    formattedUserObject = {
      userId: userObject.data.userId,
      displayName: userObject.data.displayName,
      avatarFileId: userObject.data.avatarFileId,
    };
    const post = {
      postId: item.postId,
      data: item.data as Record<string, any>,
      dataType: item.dataType,
      myReactions: item.myReactions as string[],
      reactionCount: item.reactions as Record<string, number>,
      commentsCount: item.commentsCount,
      editedAt: item.editedAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      targetType: item.targetType,
      targetId: item.targetId,
      childrenPosts: item.children,
      user: formattedUserObject


    }
    // dispatch(updatePostDetail(post))
    // setPostData(post)


  }
  useEffect(() => {
    if (postCollection) {
      console.log('postCollection:', postCollection)
      formattedPostCollection()
      subscribeTopic(getPostTopic(postCollection));
    }
  }, [postCollection]);


  const subscribeCommentTopic = (targetType: string) => {
    if (isSubscribed) return;

    if (targetType === 'user') {
      const user = userObject as Amity.User; // use getUser to get user by targetId
      disposers.push(
        subscribeTopic(getUserTopic(user, SubscriptionLevels.COMMENT), () => {
          // use callback to handle errors with event subscription
        }),
      );
      isSubscribed = true;
      return;
    }

    if (targetType === 'community') {
      const community = communityObject as Amity.Community; // use getCommunity to get community by targetId
      disposers.push(
        subscribeTopic(getCommunityTopic(community, SubscriptionLevels.COMMENT), () => {
          // use callback to handle errors with event subscription
        }),
      );
      isSubscribed = true;
    }
  };
  function getCommentsByPostId(postId: string) {
    const unsubscribe = CommentRepository.getComments(
      {
        dataTypes: { matchType: 'any', values: ['text', 'image'] },
        referenceId: postId,
        referenceType: 'post',
      },
      (data: Amity.LiveCollection<Amity.Comment>) => {
        if (data.error) throw data.error;
        if (!data.loading) {
          setCommentCollection(data);
        }
      }
    );
    setUnSubscribeComment(() => unsubscribe);
  }

  useEffect(() => {
    if (communityObject || userObject) {
      subscribeCommentTopic(postList[postIndex]?.targetType as string);
    }

  }, [communityObject, userObject])

  useEffect(() => {

    if (postList[postIndex] && postList[postIndex].targetType === 'community') {
      CommunityRepository.getCommunity(postList[postIndex].targetId, ({ data: community }) => {
        setCommunityObject(community)
      });
    } else if (postList[postIndex] && postList[postIndex].targetType === 'user') {
      UserRepository.getUser(postList[postIndex].targetId, ({ data: user }) => {
        setUserObject(user)
      });
    }
    getCommentsByPostId(postList[postIndex]?.postId);
  }, []);

  const queryComment = useCallback(async () => {
    if (comments && comments.length > 0) {
      const formattedCommentList = await Promise.all(
        comments.map(async (item: Amity.Comment) => {
          const { userObject } = await getAmityUser(item.userId);
          let formattedUserObject: UserInterface;

          formattedUserObject = {
            userId: userObject.data.userId,
            displayName: userObject.data.displayName,
            avatarFileId: userObject.data.avatarFileId,
          };

          return {
            commentId: item.commentId,
            data: item.data as Record<string, any>,
            dataType: item.dataType || 'text',
            myReactions: item.myReactions as string[],
            reactions: item.reactions as Record<string, number>,
            user: formattedUserObject as UserInterface,
            updatedAt: item.updatedAt,
            editedAt: item.editedAt,
            createdAt: item.createdAt,
            childrenComment: item.children,
            referenceId: item.referenceId,
          };
        })
      );
      setCommentList([...formattedCommentList]);
    }
  }, [comments]);

  useEffect(() => {
    if (commentCollection) {
      queryComment();
    }
  }, [commentCollection, queryComment]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isScrollEndReached =
      layoutMeasurement.height + contentOffset.y + 250 >= contentSize.height;

    if (isScrollEndReached) {
      if (onNextPage && hasNextPage) {
        onNextPage();
      }
    }
  };
  const handleSend: () => Promise<void> = async () => {
    if (inputMessage.trim() === '') {
      return;
    }
    Keyboard.dismiss();
    setInputMessage('');
    await createComment(inputMessage, postId);
    setInputMessage('');
  };
  const onDeleteComment = async (commentId: string) => {
    const isDeleted = await deleteCommentById(commentId);
    if (isDeleted) {
      const prevCommentList: IComment[] = [...commentList];
      const updatedCommentList: IComment[] = prevCommentList.filter(
        (item) => item.commentId !== commentId
      );
      setCommentList(updatedCommentList);
    }
  };

  const onPostChange = (post: IPost) => {
    console.log('post:', post)
    // dispatch(updateByPostId({ postId: post.postId, postDetail: post }))



  }



  return (
    loading ? <View>

    </View> :
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 80, android: 80 })}
        style={styles.AllInputWrap}
      >
        <ScrollView onScroll={handleScroll} style={styles.container}>
        <PostList
            onChange={onPostChange}
            postDetail={currentPostdetail as IPost}
          />

          <View style={styles.commentListWrap}>
            <FlatList
              data={commentList}
              renderItem={({ item }) => (
                <CommentList onDelete={onDeleteComment} commentDetail={item} />
              )}
              keyExtractor={(item) => item.commentId.toString()}
              onEndReachedThreshold={0.8}
              ref={flatListRef}
            />
          </View>
        </ScrollView>
        <View style={styles.InputWrap}>
          <TextInput
            onChangeText={(text) => setInputMessage(text)}
            style={styles.input}
            placeholder="Say something nice..."
            value={inputMessage}
            placeholderTextColor={theme.colors.baseShade3}
          />
          <TouchableOpacity
            disabled={inputMessage.length > 0 ? false : true}
            onPress={handleSend}
          >
            <Text
              style={
                inputMessage.length > 0 ? styles.postBtn : styles.postDisabledBtn
              }
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
  );
};
export default PostDetail;


