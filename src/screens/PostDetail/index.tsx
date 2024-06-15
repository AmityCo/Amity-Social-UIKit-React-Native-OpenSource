/* eslint-disable react-hooks/exhaustive-deps */
import {
  type RouteProp,
  useRoute,
  useNavigation,
} from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  FlatList,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';

import type { RootStackParamList } from '../../routes/RouteParamList';
import PostList, { IPost } from '../../components/Social/PostList';
import { useStyles } from './styles';
import type { IComment } from '../../components/Social/CommentList';
import type { UserInterface } from '../../types/user.interface';
import { getAmityUser } from '../../providers/user-provider';
import CommentList from '../../components/Social/CommentList';
import {
  CommentRepository,
  CommunityRepository,
  PostRepository,
  SubscriptionLevels,
  getPostTopic,
  subscribeTopic,
} from '@amityco/ts-sdk-react-native';
import {
  createComment,
  createReplyComment,
  deleteCommentById,
} from '../../providers/Social/comment-sdk';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { IMentionPosition } from '../CreatePost';
import { SvgXml } from 'react-native-svg';
import { closeIcon } from '../../svg/svg-xml-list';
import AmityMentionInput from '../../components/MentionInput/AmityMentionInput';
import { TSearchItem } from '../../hooks/useSearch';
import globalFeedSlice from '../../redux/slices/globalfeedSlice';
import { useDispatch } from 'react-redux';
import feedSlice from '../../redux/slices/feedSlice';
import postDetailSlice from '../../redux/slices/postDetailSlice';
import { deletePostById } from '../../providers/Social/feed-sdk';

const PostDetail = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = useStyles();
  const route = useRoute<RouteProp<RootStackParamList, 'PostDetail'>>();
  const { postId, postIndex, isFromGlobalfeed } = route.params;
  const [commentList, setCommentList] = useState<IComment[]>([]);
  const [commentCollection, setCommentCollection] =
    useState<Amity.LiveCollection<Amity.Comment>>();
  const { data: comments, hasNextPage, onNextPage } = commentCollection ?? {};
  const [inputMessage, setInputMessage] = useState('');
  const [communityObject, setCommunityObject] = useState<Amity.Community>();
  const privateCommunityId =
    !communityObject?.isPublic && communityObject?.communityId;
  const [initialInputText, setInitialInputText] = useState('');
  const [resetValue, setResetValue] = useState(false);
  const flatListRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {
    updateByPostId: updateByPostIdGlobalFeed,
    deleteByPostId: deleteByPostIdGlobalFeed,
  } = globalFeedSlice.actions;
  const { updateByPostId, deleteByPostId } = feedSlice.actions;

  const [postCollection, setPostCollection] = useState<Amity.Post<any>>();

  const [loading, setLoading] = useState<boolean>(true);
  const { currentPostdetail } = useSelector(
    (state: RootState) => state.postDetail
  );
  const { updatePostDetail } = postDetailSlice.actions;

  const { postList: postListGlobal } = useSelector(
    (state: RootState) => state.globalFeed
  );
  const { postList: postListFeed } = useSelector(
    (state: RootState) => state.feed
  );

  const [mentionNames, setMentionNames] = useState<TSearchItem[]>([]);
  const [mentionsPosition, setMentionsPosition] = useState<IMentionPosition[]>(
    []
  );

  const [replyUserName, setReplyUserName] = useState<string>('');
  const [replyCommentId, setReplyCommentId] = useState<string>('');

  useEffect(() => {
    const checkMentionNames = mentionNames.filter((item) => {
      return inputMessage.includes(item.displayName);
    });
    const checkMentionPosition = mentionsPosition.filter((item) => {
      return inputMessage.includes(item.displayName as string);
    });
    setMentionNames(checkMentionNames);
    setMentionsPosition(checkMentionPosition);
  }, [inputMessage]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 100);
    const unsub =
      postId &&
      PostRepository.getPost(postId, async ({ data }) => {
        setPostCollection(data);
      });
    return () => unsub && unsub();
  }, [postId]);

  useEffect(() => {
    const unsub =
      postCollection &&
      subscribeTopic(getPostTopic(postCollection, SubscriptionLevels.COMMENT));
    return () => unsub && unsub();
  }, [postCollection]);

  function getCommentsByPostId(postId: string) {
    CommentRepository.getComments(
      {
        dataTypes: { matchType: 'any', values: ['text', 'image'] },
        referenceId: postId,
        referenceType: 'post',
        limit: 8,
      },
      (data: Amity.LiveCollection<Amity.Comment>) => {
        if (data.error) throw data.error;
        if (!data.loading) {
          setCommentCollection(data);
        }
      }
    );
  }

  useEffect(() => {
    const postList = isFromGlobalfeed ? postListGlobal : postListFeed;
    if (postList[postIndex] && postList[postIndex].targetType === 'community') {
      CommunityRepository.getCommunity(
        postList[postIndex].targetId,
        ({ data: community }) => {
          setCommunityObject(community);
        }
      );
    }
    getCommentsByPostId(postList[postIndex]?.postId);
  }, []);

  const queryComment = async () => {
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
            childrenNumber: item.childrenNumber,
            referenceId: item.referenceId,
            mentionPosition: item?.metadata?.mentioned ?? [],
          };
        })
      );
      setCommentList([...formattedCommentList]);
    }
  };

  useEffect(() => {
    if (commentCollection) {
      queryComment();
    }
  }, [commentCollection]);

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
    setResetValue(false);
    if (inputMessage.trim() === '') {
      return;
    }
    Keyboard.dismiss();
    setInputMessage('');
    if (replyCommentId.length > 0) {
      await createReplyComment(
        inputMessage,
        postId,
        replyCommentId,
        mentionNames?.map((item) => item.id),
        mentionsPosition,
        'post'
      );
    } else {
      await createComment(
        inputMessage,
        postId,
        mentionNames?.map((item) => item.id),
        mentionsPosition,
        'post'
      );
    }
    setInitialInputText('');
    setInputMessage('');
    setMentionNames([]);
    setMentionsPosition([]);
    onCloseReply();
    setResetValue(true);
    const updatedPost = {
      ...currentPostdetail,
      commentsCount: isNaN(currentPostdetail.commentsCount)
        ? 1
        : currentPostdetail.commentsCount + 1,
    };
    dispatch(
      updatePostDetail({
        ...updatedPost,
      })
    );
    dispatch(
      updateByPostIdGlobalFeed({ postId: postId, postDetail: updatedPost })
    );
    dispatch(updateByPostId({ postId: postId, postDetail: updatedPost }));
  };
  const onDeleteComment = async (commentId: string) => {
    const isDeleted = await deleteCommentById(commentId);
    if (isDeleted) {
      const prevCommentList: IComment[] = [...commentList];
      const updatedCommentList: IComment[] = prevCommentList.filter(
        (item) => item.commentId !== commentId
      );
      setCommentList(updatedCommentList);
      const updatedPost = {
        ...currentPostdetail,
        commentsCount: currentPostdetail.commentsCount - 1,
      };
      dispatch(
        updatePostDetail({
          ...updatedPost,
        })
      );
      dispatch(
        updateByPostIdGlobalFeed({ postId: postId, postDetail: updatedPost })
      );
      dispatch(updateByPostId({ postId: postId, postDetail: updatedPost }));
    }
  };

  const onDeletePost = useCallback(async (postid) => {
    const isDeleted = await deletePostById(postid);
    if (isDeleted) {
      dispatch(deleteByPostId({ postId: postid }));
      dispatch(deleteByPostIdGlobalFeed({ postId: postid }));
      navigation.goBack();
    }
  }, []);

  const handleClickReply = (user: UserInterface, commentId: string) => {
    setReplyUserName(user.displayName);
    setReplyCommentId(commentId);
  };
  const onCloseReply = () => {
    setReplyUserName('');
    setReplyCommentId('');
  };

  return loading ? (
    <View />
  ) : (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 80, android: 80 })}
      style={styles.AllInputWrap}
    >
      <ScrollView onScroll={handleScroll} style={styles.container}>
        <PostList
          onDelete={onDeletePost}
          postDetail={currentPostdetail as IPost}
          isGlobalfeed={isFromGlobalfeed}
        />

        <View style={styles.commentListWrap}>
          <FlatList
            data={commentList}
            renderItem={({ item }) => (
              <CommentList
                onDelete={onDeleteComment}
                commentDetail={item}
                onClickReply={handleClickReply}
              />
            )}
            keyExtractor={(item, index) => item.commentId + index}
            onEndReachedThreshold={0.8}
            onEndReached={onNextPage}
            ref={flatListRef}
          />
        </View>
      </ScrollView>
      {replyUserName.length > 0 && (
        <View style={styles.replyLabelWrap}>
          <Text style={styles.replyLabel}>
            Replying to{' '}
            <Text style={styles.userNameLabel}>{replyUserName}</Text>
          </Text>
          <TouchableOpacity>
            <TouchableOpacity onPress={onCloseReply}>
              <SvgXml
                style={styles.closeIcon}
                xml={closeIcon(theme.colors.baseShade2)}
                width={20}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.InputWrap}>
        <View style={styles.inputContainer}>
          <AmityMentionInput
            resetValue={resetValue}
            initialValue={initialInputText}
            privateCommunityId={privateCommunityId}
            multiline
            placeholder="Say something nice..."
            placeholderTextColor={theme.colors.baseShade3}
            mentionUsers={mentionNames}
            setInputMessage={setInputMessage}
            setMentionUsers={setMentionNames}
            mentionsPosition={mentionsPosition}
            setMentionsPosition={setMentionsPosition}
            isBottomMentionSuggestionsRender={false}
          />
        </View>

        <TouchableOpacity
          disabled={inputMessage.length > 0 ? false : true}
          onPress={handleSend}
          style={styles.postBtn}
        >
          <Text
            style={
              inputMessage.length > 0
                ? styles.postBtnText
                : styles.postDisabledBtn
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
