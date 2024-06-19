import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, useCallback, useState } from 'react';
import { PageID } from '../../../enum';
import {
  TSearchItem,
  useAmityPage,
  useIsCommunityModerator,
} from '../../../hook';
import { useStyles } from './styles';
import { AmityPostComposerPageType } from '../../types';
import AmityMentionInput from '../../../component/MentionInput/AmityMentionInput';
import { IMentionPosition } from '~/v4/types/type';
import CloseButtonIconElement from '../../Elements/CloseButtonIconElement/CloseButtonIconElement';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import uiSlice from '../../../../redux/slices/uiSlice';
import { amityPostsFormatter } from '../../../../util/postDataFormatter';
import useAuth from '../../../../hooks/useAuth';
import globalfeedSlice from '../../../../redux/slices/globalfeedSlice';
import { createPostToFeed } from '../../../../providers/Social/feed-sdk';

const AmityPostComposerPage: FC<AmityPostComposerPageType> = ({
  targetId,
  targetType,
  community,
}) => {
  const pageId = PageID.post_composer_page;
  const { isExcluded, themeStyles, accessibilityId } = useAmityPage({ pageId });
  const styles = useStyles(themeStyles);
  const navigation = useNavigation();
  const { client } = useAuth();
  const dispatch = useDispatch();
  const { addPostToGlobalFeed } = globalfeedSlice.actions;
  const isModerator = useIsCommunityModerator({
    communityId: community?.communityId,
    userId: (client as Amity.Client)?.userId,
  });

  const { showToastMessage, hideToastMessage } = uiSlice.actions;
  const [inputMessage, setInputMessage] = useState<string>('');
  const [mentionsPosition, setMentionsPosition] = useState<IMentionPosition[]>(
    []
  );
  const [mentionUsers, setMentionUsers] = useState<TSearchItem[]>([]);
  const [isShowingSuggestion, setIsShowingSuggestion] = useState(false);
  const privateCommunityId = !community?.isPublic && community?.communityId;
  const title = community?.displayName ?? 'My Timeline';
  const isInputValid = inputMessage.trim().length > 0;
  const onPressClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPressPost = useCallback(async () => {
    Keyboard.dismiss();
    if (!isInputValid) {
      dispatch(
        showToastMessage({ toastMessage: 'Text field cannot be blank !' })
      );
      return;
    }
    dispatch(
      showToastMessage({
        toastMessage: 'Loading...',
        isLoadingToast: true,
      })
    );
    const mentionedUserIds =
      mentionUsers?.map((item) => item.id) ?? ([] as string[]);
    const type = 'text';
    const fileIds = [];
    const response = await createPostToFeed(
      targetType,
      targetId,
      {
        text: inputMessage,
        fileIds: fileIds as string[],
      },
      type,
      mentionedUserIds.length > 0 ? mentionedUserIds : [],
      mentionsPosition
    );
    if (!response) {
      dispatch(showToastMessage({ toastMessage: 'Failed to create post' }));
      onPressClose();
      return;
    }
    dispatch(hideToastMessage());
    if (
      targetType === 'community' &&
      (community?.postSetting === 'ADMIN_REVIEW_POST_REQUIRED' ||
        (community as Record<string, any>)?.needApprovalOnPostCreation) &&
      !isModerator
    ) {
      return Alert.alert(
        'Post submitted',
        'Your post has been submitted to the pending list. It will be reviewed by community moderator',
        [
          {
            text: 'OK',
            onPress: () => onPressClose(),
          },
        ],
        { cancelable: false }
      );
    }
    const formattedPost = await amityPostsFormatter([response]);
    dispatch(addPostToGlobalFeed(formattedPost[0]));
    onPressClose();
    return;
  }, [
    addPostToGlobalFeed,
    community,
    dispatch,
    hideToastMessage,
    inputMessage,
    isInputValid,
    isModerator,
    mentionUsers,
    mentionsPosition,
    onPressClose,
    showToastMessage,
    targetId,
    targetType,
  ]);

  if (isExcluded) return null;
  return (
    <View
      testID={accessibilityId}
      accessibilityLabel={accessibilityId}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onPressClose} hitSlop={20}>
          <CloseButtonIconElement pageID={pageId} style={styles.closeBtn} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onPressPost}>
          <Text
            style={[styles.postBtnText, isInputValid && styles.activePostBtn]}
          >
            Post
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputWrapper}
      >
        <ScrollView
          nestedScrollEnabled={true}
          scrollEnabled={!isShowingSuggestion}
          keyboardShouldPersistTaps="handled"
        >
          <AmityMentionInput
            setIsShowingSuggestion={setIsShowingSuggestion}
            autoFocus
            initialValue=""
            privateCommunityId={privateCommunityId}
            multiline
            placeholder="What's going on..."
            placeholderTextColor={themeStyles.colors.baseShade3}
            mentionUsers={mentionUsers}
            setInputMessage={setInputMessage}
            setMentionUsers={setMentionUsers}
            mentionsPosition={mentionsPosition}
            setMentionsPosition={setMentionsPosition}
            isBottomMentionSuggestionsRender
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default AmityPostComposerPage;
