import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { closeIcon } from '../../svg/svg-xml-list';

import { getStyles } from './styles';

import type { IComment } from '../Social/CommentList';
import { editComment } from '../../providers/Social/comment-sdk';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

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
  const styles = getStyles();
  const [inputMessage, setInputMessage] = useState(
    commentDetail?.data?.text ?? ''
  );

  const handleEditComment = async () => {
    if (inputMessage) {
      const editedComment = await editComment(
        inputMessage,
        commentDetail.commentId
      );
      if (editedComment) {
        onFinishEdit && onFinishEdit(inputMessage);
      }
    }
  };

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
        >
          <Text style={styles.headerText}>Save</Text>
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
              <TextInput
                multiline
                placeholder="What's going on..."
                style={styles.textInput}
                value={inputMessage}
                onChangeText={(text) => setInputMessage(text)}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </Modal>
  );
};

export default EditCommentModal;
