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
} from 'react-native';
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useLayoutEffect,
} from 'react';
import { ComponentID, PageID } from '../../enum/';

import { useStyles } from './styles';
import BackButtonIconElement from '../../Elements/BackButtonIconElement/BackButtonIconElement';
import MenuButtonIconElement from '../../Elements/MenuButtonIconElement/MenuButtonIconElement';
import { RouteProp, useNavigation } from '@react-navigation/native';
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


import { TSearchItem } from '../../hooks/useSearch';
import { useAmityPage } from '../../hooks/useUiKitReference';
import AmityMentionInput from '../../components/MentionInput/AmityMentionInput';
import { IMentionPosition } from '../../types/type';
import CloseIcon from '../../svg/CloseIcon';
import { AmityPostContentComponentStyleEnum } from '../../enum/AmityPostContentComponentStyle';
import AmityPostContentComponent from '../../components/AmityPostContentComponent/AmityPostContentComponent';
import AmityPostCommentComponent from '../../components/AmityPostCommentComponent/AmityPostCommentComponent';

type AmityPostDetailPageType = {
  route: RouteProp<RootStackParamList, 'PostDetail'>;
};

const AmityPostDetailPage: FC<AmityPostDetailPageType> = ({ route }) => {
  const pageId = PageID.post_detail_page;
  const { postId } = route.params;
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
  useLayoutEffect(() => {
    let unsub: () => void;
    let hasSubscribed = false;
    PostRepository.getPost(postId, async ({ error, loading, data }) => {
      if (!error && !loading) {
        if (!hasSubscribed) {
          unsub = subscribeTopic(
            getPostTopic(data, SubscriptionLevels.COMMENT)
          );
          hasSubscribed = true;
        }
        const posts = await amityPostsFormatter([data]);
        setPostData(posts[0]);
      }
    });

    return () => unsub && unsub();
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
        Alert.alert('Reply Error ', error.message);
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
        Alert.alert('Comment Error ', error.message);
      }
    }
    setInputMessage('');
    setMentionNames([]);
    setMentionsPosition([]);
    onCloseReply();
    setResetValue(true);
  }, [inputMessage, mentionNames, mentionsPosition, postId, replyCommentId]);

  const renderFooterComponent = useMemo(() => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.commentListFooter}
      >
        {replyUserName.length > 0 && (
          <View style={styles.replyLabelWrap}>
            <Text style={styles.replyLabel}>
              Replying to{' '}
              <Text style={styles.userNameLabel}>{replyUserName}</Text>
            </Text>
            <TouchableOpacity>
              <TouchableOpacity onPress={onCloseReply}>
                <CloseIcon  style={styles.closeIcon} width={20} color={themeStyles.colors.baseShade2}/>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}
        {!disabledInteraction && (
          <View style={styles.InputWrap}>
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
      <View style={styles.scrollContainer}>
        <AmityPostCommentComponent
          setReplyUserName={setReplyUserName}
          setReplyCommentId={setReplyCommentId}
          postId={postId}
          postType="post"
          disabledInteraction={false}
          ListHeaderComponent={
            <AmityPostContentComponent
              post={postData}
              AmityPostContentComponentStyle={
                AmityPostContentComponentStyleEnum.detail
              }
              pageId={pageId}
            />
          }
        />
      </View>
      <View style={styles.header}>
        <Pressable onPress={onPressBack}>
          <BackButtonIconElement
            pageID={pageId}
            componentID={componentId}
            style={styles.headerIcon}
          />
        </Pressable>
        <Text style={styles.headerTitle}>Post</Text>
        <Pressable>
          <MenuButtonIconElement
            pageID={pageId}
            componentID={componentId}
            style={styles.headerIcon}
          />
        </Pressable>
      </View>
      {renderFooterComponent}
    </SafeAreaView>
  );
};

export default memo(AmityPostDetailPage);
