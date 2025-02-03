/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Alert,
  FlatList,
} from 'react-native';
import { useStyles } from './styles';

import type { UserInterface } from '../../../types/user.interface';

import {
  addCommentReaction,
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
import { useNavigation } from '@react-navigation/native';
import ReplyCommentList from '../ReplyCommentList';
import { CommentRepository } from '@amityco/ts-sdk-react-native';
import PersonIcon from '../../../svg/PersonIcon';
import { LikedIcon } from '../../../svg/LikedIcon';
import { LikeIcon } from '../../../svg/LikeIcon';
import ReplyIcon from '../../../svg/ReplyIcon';
import { ThreeDotsIcon } from '../../../svg/ThreeDotsIcon';
import ExpandIcon from '../../../svg/ExpandIcon';
import { IMentionPosition } from '../../../types/type';

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
export interface ICommentList {
  commentDetail: IComment;
  isReplyComment?: boolean;
  onDelete: (commentId: string) => void;
  onClickReply: (user: UserInterface, commentId: string) => void;
}

const CommentList = ({
  commentDetail,
  onDelete,
  onClickReply,
}: ICommentList) => {
  const theme = useTheme() as MyMD3Theme;
  const styles = useStyles();

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
    childrenNumber,
    referenceId,
  } = commentDetail ?? {};

  const [isLike, setIsLike] = useState<boolean>(
    myReactions ? myReactions.includes('like') : false
  );
  const [likeReaction, setLikeReaction] = useState<number>(
    reactions?.like ? reactions?.like : 0
  );

  const { client, apiRegion } = useAuth();
  const [replyCommentList, setReplyCommentList] = useState<IComment[]>([]);
  const [previewReplyCommentList, setPreviewReplyCommentList] = useState<
    IComment[]
  >([]);
  const [replyCommentCollection, setReplyCommentCollection] =
    useState<Amity.LiveCollection<Amity.InternalComment<any>>>();

  const { onNextPage, hasNextPage } = replyCommentCollection ?? {};

  const [isOpenReply, setIsOpenReply] = useState<boolean>(false);
  const [textComment, setTextComment] = useState<string>(data?.text);
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
    getReplyComments();
    setIsOpenReply(true);
    return () => {
      setIsOpenReply(false);
    };
  }, []);

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

  const formatReplyComments = async (
    replyComments,
    isPreviewReply: boolean = false
  ) => {
    if (isPreviewReply) {
      setPreviewReplyCommentList([]);
    } else {
      setReplyCommentList([]);
    }

    if (replyComments && replyComments.length > 0) {
      const formattedCommentList = await Promise.all(
        replyComments.map(async (item: Amity.InternalComment<any>) => {
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
      if (isPreviewReply) {
        setPreviewReplyCommentList([...formattedCommentList]);
      } else {
        setReplyCommentList([...formattedCommentList]);
      }
    }
  };
  const getReplyComments = async () => {
    const getCommentsParams: Amity.CommentLiveCollection = {
      referenceType: 'post',
      referenceId: referenceId, // post ID
      dataTypes: { values: ['text', 'image'], matchType: 'any' },
      limit: 3,
      parentId: commentId,
    };

    CommentRepository.getComments(getCommentsParams, (result) => {
      setReplyCommentCollection(result);
      formatReplyComments(result.data);
    });
  };
  const openReplyComment = () => {
    setIsOpenReply(true);
    getReplyComments();
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

  const onHandleReply = () => {
    onClickReply && onClickReply(user, commentId);
  };
  return (
    <View key={commentId} style={styles.commentWrap}>
      <View style={styles.headerSection}>
        {user?.avatarFileId ? (
          <Image
            style={styles.avatar}
            source={{
              uri: `https://api.${apiRegion}.amity.co/api/v3/files/${user?.avatarFileId}/download`,
            }}
          />
        ) : (
          <View style={styles.avatar}>
            <PersonIcon width={20} height={16} />
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
                <LikedIcon  color={theme.colors.primary} width={20} height={16} />

              ) : (

                <LikeIcon color={theme.colors.baseShade2} width={20} height={16} />
              )}

              <Text style={isLike ? styles.likedText : styles.btnText}>
                {!isLike && likeReaction === 0 ? 'Like' : likeReaction}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onHandleReply}
              // onPress={() => addReactionToComment()}
              style={styles.likeBtn}
            >

              <ReplyIcon color={theme.colors.baseShade2} width={20} height={16} />
              <Text style={styles.btnText}>Reply</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={openModal} style={styles.threeDots}>

              <ThreeDotsIcon color={theme.colors.baseShade2}/>
            </TouchableOpacity>
          </View>

          {previewReplyCommentList.length > 0 && !isOpenReply && (
            <ReplyCommentList
              commentId={
                previewReplyCommentList[previewReplyCommentList.length - 1]
                  ?.commentId
              }
              commentDetail={
                previewReplyCommentList[previewReplyCommentList.length - 1]
              }
            />
          )}
          {isOpenReply && (
            <FlatList
              data={replyCommentList}
              renderItem={({ item }) => (
                <ReplyCommentList
                  commentId={item.commentId}
                  commentDetail={item}
                />
              )}
              keyExtractor={(item, index) => item.commentId + index}
            />
          )}

          {childrenComment.length > 0 && !isOpenReply && (
            <TouchableOpacity
              onPress={() => openReplyComment()}
              style={styles.viewMoreReplyBtn}
            >
              <ExpandIcon/>
              <Text style={styles.viewMoreText}>
                View {childrenNumber} replies
              </Text>
            </TouchableOpacity>
          )}

          {isOpenReply && hasNextPage && (
            <TouchableOpacity
              onPress={() => onNextPage()}
              style={styles.viewMoreReplyBtn}
            >
               <ExpandIcon/>
              <Text style={styles.viewMoreText}>View more replies</Text>
            </TouchableOpacity>
          )}
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
};
export default CommentList;
