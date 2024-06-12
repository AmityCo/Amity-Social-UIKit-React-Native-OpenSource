/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Alert,
} from 'react-native';
import { useStyles } from './styles';
import { SvgXml } from 'react-native-svg';
import {
  expandIcon,
  likedXml,
  likeXml,
  personXml,
  threeDots,
} from '../../../../svg/svg-xml-list';

import type { UserInterface } from '../../../../types';

import {
  addCommentReaction,
  removeCommentReaction,
} from '../../../../providers/Social/comment-sdk';

import { Pressable } from 'react-native';
import useAuth from '../../../../hooks/useAuth';
import { useTimeDifference } from '../../../../hooks/useTimeDifference';
import {
  isReportTarget,
  reportTargetById,
  unReportTargetById,
} from '../../../../providers/Social/feed-sdk';
import EditCommentModal from '../../../../components/EditCommentModal';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../../../providers/amity-ui-kit-provider';
import { IMentionPosition } from '../../../../screens/CreatePost';
import { LinkPreview } from '../../PreviewLink';

export interface IComment {
  commentId: string;
  data: Record<string, any>;
  dataType: string | undefined;
  myReactions: string[];
  reactions: Record<string, number>;
  user: UserInterface | undefined;
  updatedAt: string | undefined;
  editedAt: string | undefined;
  createdAt: string;
  childrenComment: string[];
  referenceId: string;
  mentionees?: string[];
  mentionPosition?: IMentionPosition[];
  childrenNumber: number;
}
export interface IReplyCommentList {
  commentId: string;
  commentDetail: IComment;
  onDelete?: (commentId: string) => void;
}

export default function ReplyCommentList({
  commentDetail,
  onDelete,
  commentId,
}: IReplyCommentList) {
  const {
    data,
    user,
    createdAt,
    reactions,
    myReactions,
    childrenComment,
    editedAt,
    mentionPosition,
    childrenNumber,
  } = commentDetail;
  const theme = useTheme() as MyMD3Theme;
  const styles = useStyles();
  const timeDifference = useTimeDifference(createdAt);
  const [isLike, setIsLike] = useState<boolean>(
    myReactions ? myReactions.includes('like') : false
  );
  const [likeReaction, setLikeReaction] = useState<number>(
    reactions.like ? reactions.like : 0
  );

  const { client, apiRegion } = useAuth();

  const [textComment, setTextComment] = useState<string>(data.text);
  const [isVisible, setIsVisible] = useState(false);
  const [isReportByMe, setIsReportByMe] = useState<boolean>(false);
  const [editCommentModal, setEditCommentModal] = useState<boolean>(false);
  const [isEditComment, setIsEditComment] = useState<boolean>(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const [commentMentionPosition, setCommentMentionPosition] = useState<
    IMentionPosition[]
  >([]);

  useEffect(() => {
    if (mentionPosition) {
      setCommentMentionPosition(mentionPosition);
    }
  }, [mentionPosition]);

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
  const checkIsReport = async () => {
    const isReport = await isReportTarget('comment', commentId);
    if (isReport) {
      setIsReportByMe(true);
    }
  };

  useEffect(() => {
    checkIsReport();
  }, [childrenComment]);

  const addReactionToComment: () => Promise<void> = async () => {
    if (isLike && likeReaction) {
      setLikeReaction(likeReaction - 1);
      setIsLike(false);
      await removeCommentReaction(commentId, 'like');
    } else {
      setIsLike(true);
      setLikeReaction(likeReaction + 1);
      await addCommentReaction(commentId, 'like');
    }
  };
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
          onPress: () => onDelete && onDelete(commentId),
        },
      ]
    );
    setIsVisible(false);
  };
  const reportCommentObject = async () => {
    if (isReportByMe) {
      const unReportPost = await unReportTargetById('comment', commentId);
      if (unReportPost) {
        Alert.alert('Undo Report sent');
      }
      setIsVisible(false);
      setIsReportByMe(false);
    } else {
      const reportPost = await reportTargetById('comment', commentId);
      if (reportPost) {
        Alert.alert('Report sent');
      }
      setIsVisible(false);
      setIsReportByMe(true);
    }
  };
  const modalStyle = {
    transform: [
      {
        translateY: slideAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [600, 0],
        }),
      },
    ],
  };

  const openEditCommentModal = () => {
    setIsVisible(false);
    setEditCommentModal(true);
  };
  const onEditComment = (editText: string) => {
    setIsEditComment(true);
    setEditCommentModal(false);
    setTextComment(editText);
  };
  const onCloseEditCommentModal = () => {
    setEditCommentModal(false);
  };

  return (
    <View key={commentId} style={styles.replyCommentWrap}>
      <View style={styles.replyHeaderSection}>
        {user?.avatarFileId ? (
          <Image
            style={styles.avatar}
            source={{
              uri: `https://api.${apiRegion}.amity.co/api/v3/files/${user?.avatarFileId}/download`,
            }}
          />
        ) : (
          <View style={styles.avatar}>
            <SvgXml xml={personXml} width="20" height="16" />
          </View>
        )}
        <View style={styles.rightSection}>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>{user?.displayName}</Text>
          </View>

          <View style={styles.timeRow}>
            <Text style={styles.headerTextTime}>{timeDifference}</Text>
            {(editedAt !== createdAt || isEditComment) && (
              <Text style={styles.dot}>·</Text>
            )}
            {(editedAt !== createdAt || isEditComment) && (
              <Text style={styles.headerTextTime}>Edited</Text>
            )}
          </View>
          <View style={styles.commentBubble}>
            {textComment && (
              <LinkPreview
                text={textComment}
                mentionPositionArr={commentMentionPosition}
              />
            )}
          </View>
          <View style={styles.actionSection}>
            <TouchableOpacity
              onPress={() => addReactionToComment()}
              style={styles.likeBtn}
            >
              {isLike ? (
                <SvgXml
                  xml={likedXml(theme.colors.primary)}
                  width="20"
                  height="16"
                />
              ) : (
                <SvgXml xml={likeXml} width="20" height="16" />
              )}

              <Text style={isLike ? styles.likedText : styles.btnText}>
                {!isLike && likeReaction === 0 ? 'Like' : likeReaction}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={openModal} style={styles.threeDots}>
              <SvgXml
                xml={threeDots(theme.colors.base)}
                width="20"
                height="16"
              />
            </TouchableOpacity>
          </View>
          <View>
            {childrenComment && childrenComment.length > 0 && (
              <Pressable style={styles.viewMoreReplyBtn}>
                <SvgXml xml={expandIcon} />
                <Text style={styles.viewMoreText}>
                  View {childrenNumber} replies
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
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
              user?.userId === (client as Amity.Client).userId &&
                styles.twoOptions,
            ]}
          >
            {user?.userId === (client as Amity.Client).userId ? (
              <View>
                <TouchableOpacity
                  onPress={openEditCommentModal}
                  style={styles.modalRow}
                >
                  <Text style={styles.deleteText}> Edit Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={deletePostObject}
                  style={styles.modalRow}
                >
                  <Text style={styles.deleteText}> Delete Comment</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={reportCommentObject}
                style={styles.modalRow}
              >
                <Text style={styles.deleteText}>
                  {isReportByMe ? 'Undo Report' : 'Report'}
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </Pressable>
      </Modal>
      <EditCommentModal
        visible={editCommentModal}
        commentDetail={commentDetail}
        onFinishEdit={onEditComment}
        onClose={onCloseEditCommentModal}
      />
    </View>
  );
}
