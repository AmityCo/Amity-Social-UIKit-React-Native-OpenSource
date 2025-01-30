import {
  Pressable,
  SafeAreaView,
  View,
  Alert,
  Keyboard,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Modal,
  useWindowDimensions,
  LayoutChangeEvent,
} from 'react-native';
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useLayoutEffect,
  useRef,
} from 'react';
import { ComponentID, PageID } from '../../enum/';

import { useStyles } from './styles';
import BackButtonIconElement from '../../Elements/BackButtonIconElement/BackButtonIconElement';
import MenuButtonIconElement from '../../Elements/MenuButtonIconElement/MenuButtonIconElement';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../routes/RouteParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  PostRepository,
  SubscriptionLevels,
  getPostTopic,
  subscribeTopic,
} from '@amityco/ts-sdk-react-native';
import { amityPostsFormatter } from '../../util/postDataFormatter';



import {
  createComment,
  createReplyComment,
} from '../../providers/Social/comment-sdk';
import {
  closeIcon,
  editIcon,
  reportOutLine,
  storyDraftDeletHyperLink,
} from '../../svg/svg-xml-list';
import { SvgXml } from 'react-native-svg';

import AmityMentionInput from '../../components/MentionInput/AmityMentionInput';
import {
  deletePostById,
  isReportTarget,
  reportTargetById,
  unReportTargetById,
} from '../../providers/Social/feed-sdk';
import globalFeedSlice from '../../redux/slices/globalfeedSlice';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import EditPostModal from '../../components/EditPostModal';
import { getCommunityById } from '../../providers/Social/communities-sdk';
import uiSlice from '../../redux/slices/uiSlice';



import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TSearchItem, useAmityPage, useIsCommunityModerator } from '../../hooks';
import { IMentionPosition } from '../../types/type';
import { comment_contains_inapproproate_word, text_contain_blocked_word } from '../../types/constants';
import AmityPostContentComponent from '../../components/AmityPostContentComponent/AmityPostContentComponent';
import { AmityPostContentComponentStyleEnum } from '../../enum/AmityPostContentComponentStyle';
import AmityPostCommentComponent from '../../components/AmityPostCommentComponent/AmityPostCommentComponent';
import MyAvatar from '../../components/MyAvatar/MyAvatar';

type AmityPostDetailPageType = {
  postId: Amity.Post['postId'];
};

const AmityPostDetailPage: FC<AmityPostDetailPageType> = ({ postId }) => {
  console.log('postId: ', postId);
  const { top, bottom } = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const pageId = PageID.post_detail_page;
  const { client } = useAuth();
  const { deleteByPostId } = globalFeedSlice.actions;
  const dispatch = useDispatch();
  const componentId = ComponentID.WildCardComponent;
  const disabledInteraction = false;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isExcluded, themeStyles, accessibilityId } = useAmityPage({ pageId });
  const styles = useStyles(themeStyles);
  const [postData, setPostData] = useState<Amity.Post>(null);
  const [replyUserName, setReplyUserName] = useState<string>('');
  const [replyCommentId, setReplyCommentId] = useState<string>('');
  const [inputMessage, setInputMessage] = useState('');
  const [resetValue, setResetValue] = useState(false);
  const [mentionNames, setMentionNames] = useState<TSearchItem[]>([]);
  const [mentionsPosition, setMentionsPosition] = useState<IMentionPosition[]>(
    []
  );
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isReportByMe, setIsReportByMe] = useState<boolean>(false);
  const [privateCommunityId, setPrivateCommunityId] = useState(null);
  const [editPostModalVisible, setEditPostModalVisible] =
    useState<boolean>(false);

  const [topBarHeigh, setTopBarHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const adjustedHeight =
    height -
    (footerHeight +
      (isKeyboardVisible ? keyboardHeight : 0) +
      top +
      bottom +
      topBarHeigh);

  const { showToastMessage } = uiSlice.actions;
  const myId = (client as Amity.Client).userId;
  const { isCommunityModerator: isIAmModerator } = useIsCommunityModerator({
    communityId: postData?.targetType === 'community' && postData?.targetId,
    userId: myId,
  });

  const slideAnimation = useRef(new Animated.Value(0)).current;

  const openModal = () => {
    setIsVisible(true);
  };

  const closeModal = () => {
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => setIsVisible(false));
  };

  const checkIsReport = useCallback(async () => {
    const isReport = await isReportTarget('post', postId);
    if (isReport) {
      setIsReportByMe(true);
    }
  }, [postId]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    checkIsReport();
  }, [checkIsReport]);

  useEffect(() => {
    if (postData?.targetType === 'community' && postData?.targetId) {
      getCommunityInfo(postData?.targetId);
    }
  }, [postData?.targetId, postData?.targetType, postData?.text]);

  async function getCommunityInfo(id: string) {
    const { data: community }: { data: Amity.LiveObject<Amity.Community> } =
      await getCommunityById(id);
    if (community.error) return;
    if (!community.loading) {
      !community.data.isPublic &&
        setPrivateCommunityId(community.data.communityId);
    }
  }

  const onDeletePost = useCallback(async () => {
    const deleted = await deletePostById(postId);
    if (deleted) {
      dispatch(deleteByPostId({ postId }));
      navigation.pop();
    }
  }, [deleteByPostId, dispatch, navigation, postId]);

  const deletePostObject = () => {
    Alert.alert(
      'Delete this post',
      `This post will be permanently deleted. You'll no longer see and find this post`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeletePost(),
        },
      ]
    );
    setIsVisible(false);
  };
  const reportPostObject = async () => {
    if (isReportByMe) {
      const unReportPost = await unReportTargetById('post', postId);
      setIsVisible(false);
      setIsReportByMe(false);
      if (unReportPost) {
        dispatch(
          showToastMessage({
            toastMessage: 'Post unreported',
            isSuccessToast: true,
          })
        );
      }
    } else {
      const reportPost = await reportTargetById('post', postId);
      setIsVisible(false);
      setIsReportByMe(true);
      if (reportPost) {
        dispatch(
          showToastMessage({
            toastMessage: 'Post reported',
            isSuccessToast: true,
          })
        );
      }
    }
  };

  const modalStyle = {
    transform: [
      {
        translateY: slideAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [580, 0], // Adjust this value to control the sliding distance
        }),
      },
    ],
  };

  const closeEditPostModal = () => {
    setEditPostModalVisible(false);
  };
  const openEditPostModal = () => {
    setIsVisible(false);
    setEditPostModalVisible(true);
  };

  const renderOptionModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeModal}
      >
        <Pressable onPress={closeModal} style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.modalContent,
              modalStyle,
              (postData?.user?.userId === myId || isIAmModerator) &&
                styles.twoOptions,
            ]}
          >
            <View style={styles.handleBar} />
            {postData?.user?.userId === myId ? (
              <TouchableOpacity
                onPress={openEditPostModal}
                style={styles.modalRow}
              >
                <SvgXml
                  xml={editIcon(themeStyles.colors.base)}
                  width="20"
                  height="20"
                />
                <Text style={styles.deleteText}> Edit Post</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={reportPostObject}
                style={styles.modalRow}
              >
                <SvgXml
                  xml={reportOutLine(themeStyles.colors.base)}
                  width="20"
                  height="20"
                />
                <Text style={styles.deleteText}>
                  {isReportByMe ? 'Unreport post' : 'Report post'}
                </Text>
              </TouchableOpacity>
            )}
            {(postData?.user?.userId === myId || isIAmModerator) && (
              <TouchableOpacity
                onPress={deletePostObject}
                style={styles.modalRow}
              >
                <SvgXml
                  xml={storyDraftDeletHyperLink()}
                  width="20"
                  height="20"
                />
                <Text style={styles.deleteText}> Delete Post</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </Pressable>
      </Modal>
    );
  };

  const handleOnFinishEdit = () => {
    setEditPostModalVisible(false);
  };

  useLayoutEffect(() => {
    if (!postId) return () => {};
    let unsub: () => void;
    let hasSubscribed = false;
    const postUnsub = PostRepository.getPost(
      postId,
      async ({ error, loading, data }) => {
        if (!error && !loading) {
          if (!hasSubscribed) {
            unsub = subscribeTopic(
              getPostTopic(data, SubscriptionLevels.COMMENT)
            );
            hasSubscribed = true;
          }
          const posts = await amityPostsFormatter([data]);
          console.log('posts: ', posts);
          setPostData(posts[0]);
        }
      }
    );

    return () => {
      postUnsub();
      unsub && unsub();
    };
  }, [postId]);

  useEffect(() => {
    const checkMentionNames = mentionNames.filter((item) => {
      return inputMessage.includes(item.displayName);
    });
    const checkMentionPosition = mentionsPosition.filter((item) => {
      return inputMessage.includes(item.displayName as string);
    });
    setMentionNames(checkMentionNames);
    setMentionsPosition(checkMentionPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputMessage]);

  const onPressBack = useCallback(() => {
    // if the previous screen is CreateLivestream, skip createLivestream and selectTarget screen
    navigation.goBack();
  }, [navigation]);

  const onCloseReply = () => {
    setReplyUserName('');
    setReplyCommentId('');
  };

  const handleSend: () => Promise<void> = useCallback(async () => {
    setResetValue(false);
    if (inputMessage.trim() === '') {
      return;
    }
    setInputMessage('');
    Keyboard.dismiss();
    if (replyCommentId.length > 0) {
      try {
        await createReplyComment(
          inputMessage,
          postId,
          replyCommentId,
          mentionNames?.map((item) => item.id),
          mentionsPosition,
          'post'
        );
      } catch (error) {
        if (error.message.includes(text_contain_blocked_word)) {
          dispatch(
            showToastMessage({
              toastMessage: comment_contains_inapproproate_word,
            })
          );
          return;
        }
      }
    } else {
      try {
        await createComment(
          inputMessage,
          postId,
          mentionNames?.map((item) => item.id),
          mentionsPosition,
          'post'
        );
      } catch (error) {
        if (error.message.includes(text_contain_blocked_word)) {
          dispatch(
            showToastMessage({
              toastMessage: comment_contains_inapproproate_word,
            })
          );
          return;
        }
      }
    }
    setInputMessage('');
    setMentionNames([]);
    setMentionsPosition([]);
    onCloseReply();
    setResetValue(true);
  }, [
    dispatch,
    inputMessage,
    mentionNames,
    mentionsPosition,
    postId,
    replyCommentId,
    showToastMessage,
  ]);

  const renderFooterComponent = useMemo(() => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.commentListFooter}
      >
        <View
          onLayout={(event: LayoutChangeEvent) => {
            const { height: layoutHeight } = event.nativeEvent.layout;
            setFooterHeight(layoutHeight);
          }}
        >
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
                    xml={closeIcon(themeStyles.colors.baseShade2)}
                    width={20}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          )}
          {!disabledInteraction && (
            <View style={styles.InputWrap}>
              <MyAvatar style={styles.myAvatar} />
              <View style={styles.inputContainer}>
                <AmityMentionInput
                  resetValue={resetValue}
                  initialValue=""
                  privateCommunityId={null}
                  multiline
                  placeholder="Say something nice..."
                  placeholderTextColor={themeStyles.colors.baseShade3}
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
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }, [
    disabledInteraction,
    handleSend,
    inputMessage.length,
    mentionNames,
    mentionsPosition,
    replyUserName,
    resetValue,
    styles,
    themeStyles,
  ]);

  if (isExcluded) return null;

  return (
    <SafeAreaView testID={accessibilityId} style={styles.container}>
      <View
        style={[
          styles.scrollContainer,
          {
            paddingTop: topBarHeigh,
            paddingBottom: isKeyboardVisible
              ? (Platform.OS !== 'android' ? keyboardHeight : 0) +
                footerHeight -
                topBarHeigh -
                bottom
              : footerHeight - topBarHeigh,
            height: adjustedHeight,
          },
        ]}
      >
        <AmityPostCommentComponent
          setReplyUserName={setReplyUserName}
          setReplyCommentId={setReplyCommentId}
          postId={postId}
          postType="post"
          disabledInteraction={false}
          ListHeaderComponent={
            postData && (
              <AmityPostContentComponent
                post={postData}
                AmityPostContentComponentStyle={
                  AmityPostContentComponentStyleEnum.detail
                }
                pageId={pageId}
              />
            )
          }
        />
      </View>
      <View
        style={styles.header}
        onLayout={(event: LayoutChangeEvent) => {
          const { height: layoutHeight } = event.nativeEvent.layout;
          setTopBarHeight(layoutHeight);
        }}
      >
        <Pressable onPress={onPressBack}>
          <BackButtonIconElement
            pageID={pageId}
            componentID={componentId}
            style={styles.headerIcon}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Post</Text>
        <Pressable onPress={openModal}>
          <MenuButtonIconElement
            pageID={pageId}
            componentID={componentId}
            style={styles.headerIcon}
          />
        </Pressable>
      </View>
      {renderFooterComponent}
      {renderOptionModal()}
      {editPostModalVisible && (
        <EditPostModal
          privateCommunityId={privateCommunityId}
          visible={editPostModalVisible}
          onClose={closeEditPostModal}
          postDetail={postData}
          onFinishEdit={handleOnFinishEdit}
        />
      )}
    </SafeAreaView>
  );
};

export default memo(AmityPostDetailPage);
