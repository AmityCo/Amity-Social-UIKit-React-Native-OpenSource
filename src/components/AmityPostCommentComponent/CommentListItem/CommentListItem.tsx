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
  FlatList,
} from 'react-native';
import { useStyles } from './styles';
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
import ReplyCommentList from '../ReplyCommentList/index';
import { CommentRepository } from '@amityco/ts-sdk-react-native';



import { ComponentID, PageID } from '../../../enum';
import RenderTextWithMention from '../../RenderTextWithMention/RenderTextWithMention';
import { UserInterface } from '../../../types/user.interface';
import { IMentionPosition } from '../../../screens/CreatePost';
import { useTimeDifference } from '../../../hooks/useTimeDifference';
import ModeratorBadgeElement from '../../../Elements/ModeratorBadgeElement/ModeratorBadgeElement';
import PersonIcon from '../../../svg/PersonIcon';
import { ThreeDotsIcon } from '../../../svg/ThreeDotsIcon';

import ExpandIcon from '../../../svg/ExpandIcon';
import LikeReactionIcon from '../../../svg/LikeReactionIcon';

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
    childrenNumber,
    referenceId,
    targetType,
    targetId,
  } = commentDetail ?? {};
  const timeDifference = useTimeDifference(createdAt);
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
  // const { themeStyles } = useAmityComponent({
  //   pageId: PageID.post_detail_page,
  //   componentId: ComponentID.post_content,
  // });
  const [isOpenReply, setIsOpenReply] = useState<boolean>(false);
  const [textComment, setTextComment] = useState<string>(data?.text);
  const [isVisible, setIsVisible] = useState(false);
  const [isReportByMe, setIsReportByMe] = useState<boolean>(false);
  const [editCommentModal, setEditCommentModal] = useState<boolean>(false);
  const [isEditComment, setIsEditComment] = useState<boolean>(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<any>();

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

  const onHandleReply = () => {
    onClickReply && onClickReply(user, commentId);
  };

  const onPressCommentReaction = () => {
    onNavigate && onNavigate();
    navigation.navigate('ReactionList', {
      referenceId: commentId,
      referenceType: 'comment',
    });
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
              <RenderTextWithMention
                mentionPositionArr={mentionPosition}
                textPost={textComment}
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
                  <ThreeDotsIcon color={theme.colors.base} />
                </TouchableOpacity>
              </View>

              {likeReaction > 0 && (
                <TouchableOpacity
                  onPress={onPressCommentReaction}
                  style={styles.likeBtn}
                >
                <Text style={styles.btnText}>{likeReaction}</Text>
               <LikeReactionIcon width={20} height={16} style={{marginLeft: 4}} />
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
          {isOpenReply && (
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
              keyExtractor={(item, index) => item.commentId + index}
            />
          )}

          {replyCommentList.length > 0 && !isOpenReply && (
            <TouchableOpacity
              onPress={() => openReplyComment()}
              style={styles.viewMoreReplyBtn}
            >
              <ExpandIcon />
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
              <ExpandIcon />
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
export default CommentListItem;
