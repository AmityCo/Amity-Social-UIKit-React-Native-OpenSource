import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

import type { RootStackParamList } from 'src/routes/RouteParamList';
import PostList from '../../components/Social/PostList';

import { styles } from './styles';
import type { IComment } from '../../components/Social/CommentList';
import type { UserInterface } from '../../types/user.interface';
import { getAmityUser } from '../../providers/user-provider';
import CommentList from '../../components/Social/CommentList';
import { CommentRepository, CommunityRepository, SubscriptionLevels, UserRepository, getCommunityTopic, getUserTopic, subscribeTopic } from '@amityco/ts-sdk';
import {
  createComment,
  deleteCommentById,
} from '../../providers/Social/comment-sdk';

const PostDetail = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'PostDetail'>>();
  const {
    postDetail,
    initImagePosts,
    initVideoPosts,
    initVideoPostsFullSize,
    initImagePostsFullSize,
  } = route.params;
  const [commentList, setCommentList] = useState<IComment[]>([]);
  const [commentCollection, setCommentCollection] =useState<Amity.LiveCollection<Amity.Comment<any>>>();
  const { data: comments, hasNextPage, onNextPage } = commentCollection ?? {};
  console.log('comments:', comments)
  const [unSubscribeFunc, setUnSubscribeFunc] = useState<() => void>();
  const [inputMessage, setInputMessage] = useState('');
  const [communityObject, setCommunityObject] = useState<Amity.Community>()
  const [userObject, setUserObject] = useState<Amity.User>()
  console.log('unSubscribeFunc: ', unSubscribeFunc);
  console.log('postDetail:', postDetail)
  const flatListRef = useRef(null);
  let isSubscribed = false;
  const disposers: Amity.Unsubscriber[] = [];
  
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
      console.log('communityObject:', communityObject)
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
      (data: Amity.LiveCollection<Amity.Comment<any>>) => {
        if (data.error) throw data.error;
        if (!data.loading) {
          setCommentCollection(data);
        }
      }
    );
    setUnSubscribeFunc(() => unsubscribe);
  }
  useEffect(() => {
    if(communityObject || userObject){
    console.log('postDetail.targetType:', postDetail.targetType)
      subscribeCommentTopic(postDetail.targetType as string);
    }
 
  }, [communityObject,userObject])
  
  useEffect(() => {

    if(postDetail.targetType === 'community'){
      CommunityRepository.getCommunity(postDetail.targetId, ({data: community})=>{
        setCommunityObject(community)
      });
    }else if(postDetail.targetType === 'user'){
      UserRepository.getUser(postDetail.targetId, ({data: user})=>{
        setUserObject(user)
      });
    }
    getCommentsByPostId(postDetail.postId);
  }, [postDetail]);

  const queryComment = useCallback(async () => {
    if (comments && comments.length > 0) {
      const formattedCommentList = await Promise.all(
        comments.map(async (item: Amity.Comment<any>) => {
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
    await createComment(inputMessage, postDetail.postId);
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
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 80, android: 80 })}
      style={styles.AllInputWrap}
    >
      <ScrollView onScroll={handleScroll} style={styles.container}>
        {postDetail && (
          <PostList
            postDetail={postDetail}
            initImagePosts={initImagePosts}
            initVideoPosts={initVideoPosts}
            initImagePostsFullSize={initImagePostsFullSize}
            initVideoPostsFullSize={initVideoPostsFullSize}
          />
        )}

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
