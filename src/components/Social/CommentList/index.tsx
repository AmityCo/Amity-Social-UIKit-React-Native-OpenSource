/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Alert,
} from 'react-native';
import { getStyles } from './styles';
import { SvgXml } from 'react-native-svg';
import {
  likedXml,
  likeXml,
  personXml,
  threeDots,
} from '../../../svg/svg-xml-list';

import type { UserInterface } from '../../../types/user.interface';

import {
  addCommentReaction,
  getCommentsDataByIds,
  removeCommentReaction,
} from '../../../providers/Social/comment-sdk';

import { getAmityUser } from '../../../providers/user-provider';
import { Pressable } from 'react-native';
import useAuth from '../../../hooks/useAuth';
import {
  isReportTarget,
  reportTargetById,
  unReportTargetById,
} from '../../../providers/Social/feed-sdk';
import EditCommentModal from '../../../components/EditCommentModal';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../../providers/amity-ui-kit-provider';
import { IMentionPosition } from '../../../screens/CreatePost';
import { useNavigation } from '@react-navigation/native';

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
}
export interface ICommentList {
  commentDetail: IComment;
  isReplyComment?: boolean;
  onDelete: (commentId: string) => void;
}

export default function CommentList({
  commentDetail,
  isReplyComment = false,
  onDelete,
}: ICommentList) {
  const {
    commentId,
    data,
    user,
    createdAt,
    reactions,
    myReactions,
    childrenComment,
    editedAt,
    mentionPosition,
  } = commentDetail;
  const theme = useTheme() as MyMD3Theme;
  const styles = getStyles();
  const [isLike, setIsLike] = useState<boolean>(
    myReactions ? myReactions.includes('like') : false
  );
  const [likeReaction, setLikeReaction] = useState<number>(
    reactions.like ? reactions.like : 0
  );

  const { client, apiRegion } = useAuth();
  const [commentList, setCommentList] = useState<IComment[]>([]);
  console.log('commentList:', commentList);
  const [textComment, setTextComment] = useState<string>(data.text);
  const [isVisible, setIsVisible] = useState(false);
  const [isReportByMe, setIsReportByMe] = useState<boolean>(false);
  const [editCommentModal, setEditCommentModal] = useState<boolean>(false);
  const [isEditComment, setIsEditComment] = useState<boolean>(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const [commentMentionPosition, setCommentMentionPosition] = useState<
    IMentionPosition[]
  >([]);
  const navigation = useNavigation<any>();

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
  function getTimeDifference(timestamp: string): string {
    // Convert the timestamp string to a Date object
    const timestampDate = Date.parse(timestamp);

    // Get the current date and time
    const currentDate = Date.now();

    // Calculate the difference in milliseconds
    const differenceMs = currentDate - timestampDate;

    const differenceYear = Math.floor(
      differenceMs / (1000 * 60 * 60 * 24 * 365)
    );
    const differenceDay = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    const differenceHour = Math.floor(differenceMs / (1000 * 60 * 60));
    const differenceMinutes = Math.floor(differenceMs / (1000 * 60));
    const differenceSec = Math.floor(differenceMs / 1000);

    if (differenceSec < 60) {
      return 'Just now';
    } else if (differenceMinutes < 60) {
      return (
        differenceMinutes +
        ` ${differenceMinutes === 1 ? 'min ago' : 'mins ago'}`
      );
    } else if (differenceHour < 24) {
      return (
        differenceHour + ` ${differenceHour === 1 ? 'hour ago' : 'hours ago'}`
      );
    } else if (differenceDay < 365) {
      return (
        (differenceDay !== 1 ? differenceDay : '') +
        ` ${differenceDay === 1 ? 'Yesterday' : 'days ago'}`
      );
    } else {
      return (
        differenceYear + ` ${differenceYear === 1 ? 'year ago' : 'years ago'}`
      );
    }
  }

  const formatComments = useCallback(async (replyComments) => {
    if (replyComments && replyComments.length > 0) {
      const formattedCommentList = await Promise.all(
        replyComments.map(async (item: Amity.Comment) => {
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
            dataType: item.dataType,
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
  }, []);
  const getReplyComments = useCallback(async () => {
    const replyComments = await getCommentsDataByIds(childrenComment);
    formatComments(replyComments);
  }, [childrenComment, formatComments]);

  useEffect(() => {
    if (childrenComment.length > 0) {
      getReplyComments();
    }
    checkIsReport();
  }, [childrenComment, getReplyComments]);

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
        Alert.alert('Undo Report sent', '', []);
      }
      setIsVisible(false);
      setIsReportByMe(false);
    } else {
      const reportPost = await reportTargetById('comment', commentId);
      if (reportPost) {
        Alert.alert('Report sent', '', []);
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
          outputRange: [600, 0], // Adjust this value to control the sliding distance
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
  const RenderTextWithMention = () => {
    if (commentMentionPosition.length === 0) {
      return <Text style={styles.inputText}>{textComment}</Text>;
    }
    const mentionClick = (userId: string) => {
      navigation.navigate('UserProfile', {
        userId: userId,
      });
    };
    let currentPosition = 0;
    const result: (string | JSX.Element)[][] = commentMentionPosition.map(
      ({ index, length, userId }, i) => {
        // Add non-highlighted text before the mention
        const nonHighlightedText = textComment.slice(currentPosition, index);

        // Add highlighted text
        const highlightedText = (
          <Text
            onPress={() => mentionClick(userId)}
            key={`highlighted-${i}`}
            style={styles.mentionText}
          >
            {textComment.slice(index, index + length)}
          </Text>
        );

        // Update currentPosition for the next iteration
        currentPosition = index + length;

        // Return an array of non-highlighted and highlighted text
        return [nonHighlightedText, highlightedText];
      }
    );

    // Add any remaining non-highlighted text after the mentions
    const remainingText = textComment.slice(currentPosition);
    result.push([
      <Text key="nonHighlighted-last" style={styles.inputText}>
        {remainingText}
      </Text>,
    ]);

    // Flatten the array and render
    return <Text style={styles.inputText}>{result.flat()}</Text>;
  };
  return (
    <View
      key={commentId}
      style={isReplyComment ? styles.replyCommentWrap : styles.commentWrap}
    >
      <View
        style={
          isReplyComment ? styles.replyHeaderSection : styles.headerSection
        }
      >
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
            <Text style={styles.headerTextTime}>
              {getTimeDifference(createdAt)}
            </Text>
            {(editedAt !== createdAt || isEditComment) && (
              <Text style={styles.dot}>·</Text>
            )}
            {(editedAt !== createdAt || isEditComment) && (
              <Text style={styles.headerTextTime}>Edited</Text>
            )}
          </View>
          <View style={styles.commentBubble}>
            {textComment && <RenderTextWithMention />}
            {/* <Text style={styles.commentText}>{textComment}</Text> */}
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
            {/* {!isReplyComment && (
              <TouchableOpacity
                // onPress={() => addReactionToComment()}
                style={styles.likeBtn}
              >
                <SvgXml xml={replyIcon} width="20" height="16" />

                <Text style={styles.btnText}>Reply</Text>
              </TouchableOpacity>
            )} */}

            <TouchableOpacity onPress={openModal} style={styles.threeDots}>
              <SvgXml
                xml={threeDots(theme.colors.base)}
                width="20"
                height="16"
              />
            </TouchableOpacity>
          </View>
          {/* {commentList.length > 0 && (
            <FlatList
              data={commentList}
              renderItem={({ item }) => (
                <CommentList commentDetail={item} isReplyComment />
              )}
              keyExtractor={(item) => item.commentId.toString()}
              onEndReachedThreshold={0.8}
            />
          )} */}
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
