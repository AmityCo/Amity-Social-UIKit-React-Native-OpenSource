import React, { useCallback, useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { closeIcon } from '../../svg/svg-xml-list';
import { useStyles } from './styles';
import type { IComment } from '../../v4/PublicApi/Components/AmityPostCommentComponent/CommentListItem/CommentListItem';
import { editComment } from '../../providers/Social/comment-sdk';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import AmityMentionInput from '../../v4/component/MentionInput/AmityMentionInput';
import { TSearchItem } from '~/v4/hook';
import { IMentionPosition } from '~/v4/types/type';
import {
  CommunityRepository,
  UserRepository,
} from '@amityco/ts-sdk-react-native';

interface IModal {
  visible: boolean;
  userId?: string;
  onClose: () => void;
  onFinishEdit: (editText: string) => void;
  commentDetail: IComment;
}
const EditCommentModal = ({
  visible,
  onClose,
  commentDetail,
  onFinishEdit,
}: IModal) => {
  const theme = useTheme() as MyMD3Theme;
  const styles = useStyles();
  const [inputMessage, setInputMessage] = useState('');
  const [mentionUsers, setMentionUsers] = useState<TSearchItem[]>([]);
  const [initialText, setInitialText] = useState(
    commentDetail?.data?.text ?? ''
  );
  const [mentionsPosition, setMentionsPosition] = useState<IMentionPosition[]>(
    []
  );
  const [privateCommunityId, setPrivateCommunityId] = useState<string>(null);

  const handleEditComment = async () => {
    if (inputMessage) {
      const mentionedUserIds = mentionUsers.map((user) => user.userId);
      const editedComment = await editComment(
        inputMessage,
        commentDetail.commentId,
        'post',
        mentionedUserIds,
        mentionsPosition
      );
      if (editedComment) {
        onFinishEdit && onFinishEdit(inputMessage);
      }
    }
  };
  const disabledState =
    !inputMessage || inputMessage === commentDetail?.data?.text;
  const disabledColor = disabledState && { color: theme.colors.baseShade2 };

  const parsePostText = useCallback(
    (text: string, mentionUsersArr: TSearchItem[]) => {
      const parsedText = text.replace(/@([\w\s-]+)/g, (_, username) => {
        const mentionee = mentionUsersArr.find(
          (user) => user.displayName === username
        );
        const mentioneeId = mentionee ? mentionee.userId : '';
        return `@[${username}](${mentioneeId})`;
      });
      return parsedText;
    },
    []
  );

  const getMentionPositions = useCallback(
    (text: string, mentioneeIds: string[]) => {
      let index = 0;
      let mentions = [];
      let match;
      const mentionRegex = /@([\w-]+)/g;

      while ((match = mentionRegex.exec(text)) !== null) {
        let username = match[1];
        let mentioneeId = mentioneeIds[index++];
        let startIdx = match.index;
        let mention = {
          type: 'user',
          displayName: username,
          index: startIdx,
          length: match[0].length,
          userId: mentioneeId,
        };
        mentions.push(mention);
      }
      return mentions;
    },
    []
  );

  const getMentionUsers = useCallback(
    async (mentionIds: string[]) => {
      const { data } = await UserRepository.getUserByIds(mentionIds);
      const users = data.map((user) => {
        return {
          ...user,
          name: user.displayName,
          id: user.userId,
        };
      }) as TSearchItem[];

      setMentionUsers(users);
      const parsedText = parsePostText(commentDetail?.data?.text ?? '', users);
      setInitialText(parsedText);
      return users;
    },
    [parsePostText, commentDetail?.data?.text]
  );

  useEffect(() => {
    if (commentDetail?.mentionees?.length > 0) {
      const mentionPositions = getMentionPositions(
        commentDetail?.data?.text ?? '',
        commentDetail.mentionees ?? []
      );
      getMentionUsers(commentDetail.mentionees ?? []);
      setMentionsPosition(mentionPositions);
    } else {
      setInitialText(commentDetail?.data?.text ?? '');
    }
  }, [getMentionPositions, getMentionUsers, commentDetail]);

  useEffect(() => {
    if (commentDetail?.targetType === 'community') {
      CommunityRepository.getCommunity(
        commentDetail?.targetId,
        ({ error, data, loading }) => {
          if (!error && !loading) {
            data.isPublic && setPrivateCommunityId(data.communityId);
          }
        }
      );
    }

    return () => {};
  }, [commentDetail?.targetId, commentDetail?.targetType]);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <SvgXml xml={closeIcon(theme.colors.base)} width="17" height="17" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Edit Comment</Text>
        </View>
        <TouchableOpacity
          onPress={handleEditComment}
          style={styles.headerTextContainer}
          disabled={disabledState}
        >
          <Text style={[styles.headerText, disabledColor]}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.AllInputWrap}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.select({ ios: 100, android: 80 })}
            style={styles.AllInputWrap}
          >
            <ScrollView style={styles.container}>
              <AmityMentionInput
                initialValue={initialText}
                privateCommunityId={privateCommunityId}
                multiline
                placeholder="What's going on..."
                placeholderTextColor={theme.colors.baseShade3}
                mentionUsers={mentionUsers}
                setInputMessage={setInputMessage}
                setMentionUsers={setMentionUsers}
                mentionsPosition={mentionsPosition}
                setMentionsPosition={setMentionsPosition}
                isBottomMentionSuggestionsRender
              />
              {/* <TextInput
                multiline
                placeholder="What's going on..."
                style={styles.textInput}
                value={inputMessage}
                onChangeText={(text) => setInputMessage(text)}
              /> */}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

export default EditCommentModal;
