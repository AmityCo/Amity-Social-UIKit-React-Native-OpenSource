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
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  FlatList,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';

import type { RootStackParamList } from 'src/routes/RouteParamList';
import PostList, { IPost } from '../../components/Social/PostList';

import { getStyles } from './styles';
import type { IComment } from '../../components/Social/CommentList';
import type { UserInterface } from '../../types/user.interface';
import { getAmityUser } from '../../providers/user-provider';
import CommentList from '../../components/Social/CommentList';
import {
  CommentRepository,
  CommunityRepository,
  PostRepository,
  SubscriptionLevels,
  UserRepository,
  getCommunityTopic,
  getPostTopic,
  getUserTopic,
  subscribeTopic,
} from '@amityco/ts-sdk-react-native';
import {
  createComment,
  deleteCommentById,
} from '../../providers/Social/comment-sdk';

import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackButton from '../../components/BackButton';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ISearchItem } from '../../components/SearchItem';
import MentionPopup from '../../components/MentionPopup';
import { IMentionPosition } from '../CreatePost';
import _ from 'lodash';

const PostDetail = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = getStyles();
  const route = useRoute<RouteProp<RootStackParamList, 'PostDetail'>>();

  const { postId, postIndex, isFromGlobalfeed } = route.params;

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [commentList, setCommentList] = useState<IComment[]>([]);
  const [commentCollection, setCommentCollection] =
    useState<Amity.LiveCollection<Amity.Comment>>();
  const { data: comments, onNextPage: onNextComment } = commentCollection ?? {};
  const [inputMessage, setInputMessage] = useState('');
  const [communityObject, setCommunityObject] = useState<Amity.Community>();
  const [userObject, setUserObject] = useState<Amity.User>();

  const flatListRef = useRef(null);
  let isSubscribed = false;
  const disposers: Amity.Unsubscriber[] = [];

  const [postCollection, setPostCollection] = useState<Amity.Post<any>>();

  const [loading, setLoading] = useState<boolean>(true);
  const { currentPostdetail } = useSelector(
    (state: RootState) => state.postDetail
  );

  const { postList: postListGlobal } = useSelector(
    (state: RootState) => state.globalFeed
  );
  const { postList: postListFeed } = useSelector(
    (state: RootState) => state.feed
  );

  const [isShowMention, setIsShowMention] = useState<boolean>(false);
  const [mentionNames, setMentionNames] = useState<ISearchItem[]>([]);
  const [currentSearchUserName, setCurrentSearchUserName] = useState<string>();
  const [cursorIndex, setCursorIndex] = useState<number>(0);
  const [mentionsPosition, setMentionsPosition] = useState<IMentionPosition[]>(
    []
  );

  useEffect(() => {
    const checkMentionNames = mentionNames.filter((item) => {
      return inputMessage.includes(item.displayName);
    });
    const checkMentionPosition = mentionsPosition.filter((item) => {
      return inputMessage.includes(item.displayName);
    });
    setMentionNames(checkMentionNames);
    setMentionsPosition(checkMentionPosition);
  }, [inputMessage]);

  const onBackPress = () => {
    // navigation.navigate('Home', { postIdCallBack: postData.postId })
    // navigation.goBack()

    navigation.goBack();
  };
  navigation.setOptions({
    headerLeft: () => <BackButton onPress={onBackPress} goBack={false} />,
    title: '',
  });

  const getPost = (postId: string) => {
    const unsubscribePost = PostRepository.getPost(postId, async ({ data }) => {
      setPostCollection(data);
    });
    console.log('unSubscribePost:', unsubscribePost);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 100);
    getPost(postId);
  }, [postId]);

  useEffect(() => {
    if (postCollection) {
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
        })
      );
      isSubscribed = true;
      return;
    }

    if (targetType === 'community') {
      const community = communityObject as Amity.Community; // use getCommunity to get community by targetId
      disposers.push(
        subscribeTopic(
          getCommunityTopic(community, SubscriptionLevels.COMMENT),
          () => {
            // use callback to handle errors with event subscription
          }
        )
      );
      isSubscribed = true;
    }
  };
  function getCommentsByPostId(postId: string) {
    CommentRepository.getComments(
      {
        dataTypes: { matchType: 'any', values: ['text', 'image'] },
        referenceId: postId,
        referenceType: 'post',
        limit: 10,
      },
      (data: Amity.LiveCollection<Amity.Comment>) => {
        setCommentCollection(data);
      }
    );
  }

  useEffect(() => {
    const postList = isFromGlobalfeed ? postListGlobal : postListFeed;
    if (communityObject || userObject) {
      subscribeCommentTopic(postList[postIndex]?.targetType as string);
    }
  }, [communityObject, userObject]);

  useEffect(() => {
    const postList = isFromGlobalfeed ? postListGlobal : postListFeed;
    if (postList[postIndex] && postList[postIndex].targetType === 'community') {
      CommunityRepository.getCommunity(
        postList[postIndex].targetId,
        ({ data: community }) => {
          setCommunityObject(community);
        }
      );
    } else if (
      postList[postIndex] &&
      postList[postIndex].targetType === 'user'
    ) {
      UserRepository.getUser(postList[postIndex].targetId, ({ data: user }) => {
        setUserObject(user);
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
            mentionPosition: item?.metadata?.mentioned,
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
    console.log('load more comment');
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isScrollEndReached =
      layoutMeasurement.height + contentOffset.y + 250 >= contentSize.height;

    if (isScrollEndReached) {
      onNextComment && onNextComment();
    }
  };
  const handleSend: () => Promise<void> = async () => {
    if (inputMessage.trim() === '') {
      return;
    }
    Keyboard.dismiss();
    setInputMessage('');
    await createComment(
      inputMessage,
      postId,
      mentionNames?.map((item) => item.targetId),
      mentionsPosition
    );
    setInputMessage('');
    setMentionNames([]);
    setMentionsPosition([]);
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
    console.log('post:', post);
  };

  const handleSelectionChange = (event) => {
    setCursorIndex(event.nativeEvent.selection.start);
  };

  const onSelectUserMention = (user: ISearchItem) => {
    const textAfterCursor: string = inputMessage.substring(
      cursorIndex,
      inputMessage.length + 1
    );
    const newTextAfterReplacement =
      inputMessage.slice(0, cursorIndex - currentSearchUserName.length) +
      user.displayName +
      inputMessage.slice(cursorIndex, inputMessage.length);
    const newInputMessage = newTextAfterReplacement + textAfterCursor;
    const position: IMentionPosition = {
      type: 'user',
      length: user.displayName.length + 1,
      index: cursorIndex - 1 - currentSearchUserName.length,
      userId: user.targetId,
      displayName: user.displayName,
    };

    setInputMessage(newInputMessage);
    setMentionNames((prev) => [...prev, user]);
    setMentionsPosition((prev) => [...prev, position]);
    setCurrentSearchUserName('');
  };
  useEffect(() => {
    checkMention(inputMessage);
  }, [inputMessage]);

  const checkMention = (inputString: string) => {
    // Check if "@" is at the first letter
    const startsWithAt = /^@/.test(inputString);

    // Check if "@" is inside the sentence without any letter before "@"
    const insideWithoutLetterBefore = /[^a-zA-Z]@/.test(inputString);

    const atSigns = inputString.match(/@/g);
    const atSignsNumber = atSigns ? atSigns.length : 0;
    if (
      (startsWithAt || insideWithoutLetterBefore) &&
      atSignsNumber > mentionNames.length
    ) {
      setIsShowMention(true);
    } else {
      setIsShowMention(false);
    }
  };
  useEffect(() => {
    if (isShowMention) {
      const substringBeforeCursor = inputMessage.substring(0, cursorIndex);
      const lastAtsIndex = substringBeforeCursor.lastIndexOf('@');
      if (lastAtsIndex !== -1) {
        const searchText: string = inputMessage.substring(
          lastAtsIndex + 1,
          cursorIndex + 1
        );
        setCurrentSearchUserName(searchText);
      }
    }
  }, [cursorIndex]);

  const RenderTextWithMention = () => {
    if (mentionsPosition.length === 0) {
      return <Text style={styles.inputText}>{inputMessage}</Text>;
    }

    let currentPosition = 0;
    const result: (string | JSX.Element)[][] = mentionsPosition.map(
      ({ index, length }, i) => {
        // Add non-highlighted text before the mention
        const nonHighlightedText = inputMessage.slice(currentPosition, index);

        // Add highlighted text
        const highlightedText = (
          <Text key={`highlighted-${i}`} style={styles.mentionText}>
            {inputMessage.slice(index, index + length)}
          </Text>
        );

        // Update currentPosition for the next iteration
        currentPosition = index + length;

        // Return an array of non-highlighted and highlighted text
        return [nonHighlightedText, highlightedText];
      }
    );

    // Add any remaining non-highlighted text after the mentions
    const remainingText = inputMessage.slice(currentPosition);
    result.push([
      <Text key="nonHighlighted-last" style={styles.inputText}>
        {remainingText}
      </Text>,
    ]);

    // Flatten the array and render
    return <Text style={styles.inputText}>{result.flat()}</Text>;
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
          onChange={onPostChange}
          postDetail={currentPostdetail as IPost}
          isGlobalfeed={isFromGlobalfeed}
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
      {isShowMention && (
        <MentionPopup
          userName={currentSearchUserName}
          onSelectMention={onSelectUserMention}
        />
      )}

      <View style={styles.InputWrap}>
        <View style={styles.inputContainer}>
          <TextInput
            multiline
            placeholder="Say something nice..."
            style={
              mentionNames.length > 0
                ? [styles.textInput, styles.transparentText]
                : styles.textInput
            }
            value={inputMessage}
            onChangeText={(text) => setInputMessage(text)}
            placeholderTextColor={theme.colors.baseShade3}
            onSelectionChange={handleSelectionChange}
          />
          {mentionNames.length > 0 && (
            <View style={styles.overlay}>
              {/* {renderTextWithMention()} */}
              <RenderTextWithMention />
            </View>
          )}
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
