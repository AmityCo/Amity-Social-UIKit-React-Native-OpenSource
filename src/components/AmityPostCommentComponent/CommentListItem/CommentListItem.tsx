/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useRef, useState } from 'react';

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
import { SvgXml } from 'react-native-svg';
import {
  editIcon,
  expandIcon,
  likeCircle,
  personXml,
  reportOutLine,
  storyDraftDeletHyperLink,
  threeDots,
} from '../../../svg/svg-xml-list';


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
import ReplyCommentList from '../ReplyCommentList/index';
import { CommentRepository } from '@amityco/ts-sdk-react-native';

import ModeratorBadgeElement from '../../../Elements/ModeratorBadgeElement/ModeratorBadgeElement';
import { ComponentID, PageID } from '../../../enum';

import AmityReactionListComponent from '../../AmityReactionListComponent/AmityReactionListComponent';
import uiSlice from '../../../redux/slices/uiSlice';
import { useDispatch } from 'react-redux';
import { UserInterface } from '../../../types/user.interface';
import { useTimeDifference } from '../../../hooks/useTimeDifference';
import { LinkPreview } from '../../PreviewLink';
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
  targetType?: string;
  targetId?: string;
}
export interface ICommentList {
  commentDetail: IComment;
  isReplyComment?: boolean;
  onDelete: (commentId: string) => void;
  onClickReply: (user: UserInterface, commentId: string) => void;
  postType: Amity.CommentReferenceType;
  disabledInteraction?: boolean;
  onNavigate?: () => void;
}

const CommentListItem = ({
  commentDetail,
  onDelete,
  onClickReply,
  postType,
  disabledInteraction,
  onNavigate,
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
    referenceId,
    targetType,
    targetId,
    childrenNumber,
  } = commentDetail ?? {};
  const timeDifference = useTimeDifference(createdAt);
  const dispatch = useDispatch();
  const { showToastMessage } = uiSlice.actions;
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
  const [isReactionListVisible, setIsReactionListVisible] = useState(false);

  useEffect(() => {
    getReplyComments();
    setIsOpenReply(false);
    return () => {
      setIsOpenReply(false);
    };
  }, []);

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
            targetType: item.targetType,
            targetId: item.targetId,
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
      referenceType: postType,
      referenceId: referenceId, // post ID
      dataTypes: { values: ['text', 'image'], matchType: 'any' },
      limit: 5,
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
      setIsVisible(false);
      setIsReportByMe(false);
      if (unReportPost) {
        dispatch(
          showToastMessage({
            toastMessage: 'Comment unreported',
            isSuccessToast: true,
          })
        );
      }
    } else {
      const reportPost = await reportTargetById('comment', commentId);
      setIsVisible(false);
      setIsReportByMe(true);
      if (reportPost) {
        dispatch(
          showToastMessage({
            toastMessage: 'Comment reported',
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

  const onHandleReply = () => {
    onClickReply && onClickReply(user, commentId);
  };

  const onPressCommentReaction = () => {
    onNavigate && onNavigate();
    setIsReactionListVisible(true);
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
            <SvgXml xml={personXml} width="20" height="16" />
          </View>
        )}
        <View style={styles.rightSection}>
          <View style={styles.commentBubble}>
            <Text style={styles.headerText}>{user?.displayName}</Text>
            {targetType === 'community' && targetId && (
              <View style={{ marginVertical: 6 }}>
                <ModeratorBadgeElement
                  pageID={PageID.WildCardPage}
                  communityId={targetId}
                  userId={user?.userId}
                  componentID={ComponentID.post_content}
                />
              </View>
            )}
            {textComment && (
              <LinkPreview
                mentionPositionArr={mentionPosition}
                text={textComment}
              />
            )}
          </View>

          {!disabledInteraction && (
            <View style={styles.actionSection}>
              <View style={styles.rowContainer}>
                <View style={styles.timeRow}>
                  <Text style={styles.headerTextTime}>{timeDifference}</Text>
                  {(editedAt !== createdAt || isEditComment) && (
                    <Text style={styles.headerTextTime}> (edited)</Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => addReactionToComment()}
                  style={styles.likeBtn}
                >
                  <Text style={isLike ? styles.likedText : styles.btnText}>
                    {!isLike ? 'Like' : 'Liked'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onHandleReply}
                  style={styles.likeBtn}
                >
                  <Text style={styles.btnText}>Reply</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={openModal} style={styles.threeDots}>
                  <SvgXml
                    xml={threeDots(theme.colors.base)}
                    width="20"
                    height="16"
                  />
                </TouchableOpacity>
              </View>

              {likeReaction > 0 && (
                <TouchableOpacity
                  onPress={onPressCommentReaction}
                  style={styles.likeBtn}
                >
                  <Text style={styles.btnText}>{likeReaction}</Text>
                  <SvgXml
                    style={{ marginLeft: 4 }}
                    xml={likeCircle}
                    width="20"
                    height="16"
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          {previewReplyCommentList.length > 0 && !isOpenReply && (
            <ReplyCommentList
              commentId={
                previewReplyCommentList[previewReplyCommentList.length - 1]
                  ?.commentId
              }
              commentDetail={
                previewReplyCommentList[previewReplyCommentList.length - 1]
              }
              onDelete={onDelete}
              onHandleReply={onHandleReply}
            />
          )}
          {isOpenReply && replyCommentList?.length > 0 && (
            <FlatList
              data={replyCommentList}
              renderItem={({ item }) => (
                <ReplyCommentList
                  commentId={item.commentId}
                  commentDetail={item}
                  onDelete={onDelete}
                  onHandleReply={onHandleReply}
                />
              )}
              keyExtractor={(item) => item.commentId}
            />
          )}

          {replyCommentList?.length > 0 && !isOpenReply && (
            <TouchableOpacity
              onPress={() => openReplyComment()}
              style={styles.viewMoreReplyBtn}
            >
              <SvgXml xml={expandIcon} />
              <Text style={styles.viewMoreText}>
                View{' '}
                {childrenNumber === 0
                  ? replyCommentList.length
                  : childrenNumber}{' '}
                replies
              </Text>
            </TouchableOpacity>
          )}

          {isOpenReply && hasNextPage && (
            <TouchableOpacity
              onPress={() => onNextPage()}
              style={styles.viewMoreReplyBtn}
            >
              <SvgXml xml={expandIcon} />
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
            <View style={styles.handleBar} />
            {user?.userId === (client as Amity.Client).userId ? (
              <View>
                <TouchableOpacity
                  onPress={openEditCommentModal}
                  style={styles.modalRow}
                >
                  <SvgXml
                    xml={editIcon(theme.colors.base)}
                    width="20"
                    height="20"
                  />
                  <Text style={styles.deleteText}> Edit Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={deletePostObject}
                  style={styles.modalRow}
                >
                  <SvgXml
                    xml={storyDraftDeletHyperLink()}
                    width="20"
                    height="20"
                  />
                  <Text style={styles.deleteText}> Delete Comment</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={reportCommentObject}
                style={styles.modalRow}
              >
                <SvgXml
                  xml={reportOutLine(theme.colors.base)}
                  width="20"
                  height="20"
                />
                <Text style={styles.deleteText}>
                  {isReportByMe ? 'Unreport comment' : 'Report comment'}
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
      {isReactionListVisible && (
        <AmityReactionListComponent
          referenceId={commentId}
          referenceType="comment"
          isModalVisible={isReactionListVisible}
          onCloseModal={() => setIsReactionListVisible(false)}
        />
      )}
    </View>
  );
};
export default memo(CommentListItem);
