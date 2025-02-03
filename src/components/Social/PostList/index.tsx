import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Animated,
  Alert,
  StyleProp,
  ImageStyle,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import {
  arrowXml,
  commentXml,
  likedXml,
  likeXml,
  personXml,
  threeDots,
} from '../../../svg/svg-xml-list';
import { useStyles } from './styles';
import type { UserInterface } from '../../../types/user.interface';
import {
  addPostReaction,
  isReportTarget,
  removePostReaction,
  reportTargetById,
  unReportTargetById,
} from '../../../providers/Social/feed-sdk';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuth from '../../../hooks/useAuth';
import EditPostModal from '../../../components/EditPostModal';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../../providers/amity-ui-kit-provider';
import MediaSection from '../../../components/MediaSection';
import postDetailSlice from '../../../redux/slices/postDetailSlice';
import { useDispatch } from 'react-redux';
import globalFeedSlice from '../../../redux/slices/globalfeedSlice';

import feedSlice from '../../../redux/slices/feedSlice';
import { RootStackParamList } from '../../../routes/RouteParamList';
import { useTimeDifference } from '../../../hooks/useTimeDifference';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import RenderTextWithMention from '../../RenderTextWithMention /RenderTextWithMention';
import { LinkPreview } from '../../PreviewLink/LinkPreview';
import { IMentionPosition } from '../../../types/type';



export interface IPost {
  postId: string;
  data: Record<string, any>;
  dataType: string | undefined;
  myReactions: string[];
  reactionCount: Record<string, number>;
  commentsCount: number;
  user: UserInterface | undefined;
  updatedAt: string | undefined;
  editedAt: string | undefined;
  createdAt: string;
  targetType: string;
  targetId: string;
  childrenPosts: string[];
  mentionees: string[];
  mentionPosition?: IMentionPosition[];
  path: string;
  analytics: Amity.Post<'analytics'>;
}
export interface IPostList {
  onDelete?: (postId: string) => void;
  onChange?: (postDetail: IPost) => void;
  postDetail: IPost;
  postIndex?: number;
  isGlobalfeed?: boolean;
}
export interface MediaUri {
  uri: string;
}
export interface IVideoPost {
  thumbnailFileId: string;
  videoFileId: {
    original: string;
  };
}
export default function PostList({
  postDetail,
  onDelete,
}: IPostList) {
  const theme = useTheme() as MyMD3Theme;
  const { client, apiRegion } = useAuth();
  const styles = useStyles();
  const [isLike, setIsLike] = useState<boolean>(false);
  const [likeReaction, setLikeReaction] = useState<number>(0);
  const [communityName, setCommunityName] = useState('');
  const [isJoined, setIsJoined] = useState<boolean>(true);
  const [textPost, setTextPost] = useState<string>('');
  const [privateCommunityId, setPrivateCommunityId] = useState(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isReportByMe, setIsReportByMe] = useState<boolean>(false);
  const [editPostModalVisible, setEditPostModalVisible] =
    useState<boolean>(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const [mentionPositionArr, setMentionsPositionArr] = useState<
    IMentionPosition[]
  >([]);
  const { updateByPostId: updateByPostIdGlobalFeed } = globalFeedSlice.actions;
  const { updateByPostId } = feedSlice.actions;
  const { updatePostDetail } = postDetailSlice.actions;
  const {
    postId,
    data,
    myReactions = [],
    reactionCount,
    commentsCount,
    createdAt,
    user,
    targetType,
    targetId,
    childrenPosts = [],
    editedAt,
    mentionPosition,
  } = postDetail ?? {};
  const timeDifference = useTimeDifference(createdAt);

  useEffect(() => {
    if (mentionPosition) {
      setMentionsPositionArr(mentionPosition);
    }
  }, [mentionPosition]);

  useEffect(() => {
    if (myReactions && myReactions?.length > 0) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
    if (reactionCount?.like) {
      setLikeReaction(reactionCount?.like);
    } else {
      setLikeReaction(0);
    }
  }, [myReactions, reactionCount]);

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
    checkIsReport();
  }, [checkIsReport]);

  useEffect(() => {
    let unsubCommunity: () => void;
    if (targetType === 'community' && targetId) {
      unsubCommunity = CommunityRepository.getCommunity(
        targetId,
        ({ error, loading, data }) => {
          if (error) return;
          if (!loading) {
            setCommunityName(data.displayName);
            setIsJoined(data.isJoined);
            !data.isPublic && setPrivateCommunityId(data.communityId);
          }
        }
      );
    }
    return () => unsubCommunity && unsubCommunity();
  }, [targetId, targetType]);

  useEffect(() => {
    setTextPost(data?.text);
    if (myReactions.length > 0 && myReactions.includes('like')) {
      setIsLike(true);
    }
    if (reactionCount?.like) {
      setLikeReaction(reactionCount?.like);
    }
  }, [data?.text, myReactions, reactionCount?.like, targetId, targetType]);

  const renderLikeText = useCallback(
    (likeNumber: number | undefined): string => {
      if (!likeNumber) return '';
      if (likeNumber === 1) return 'like';
      return 'likes';
    },
    []
  );
  const renderCommentText = useCallback(
    (commentNumber: number | undefined): string => {
      if (!commentNumber) return '';
      if (commentNumber === 1) return 'comment';
      return 'comments';
    },
    []
  );

  const addReactionToPost = useCallback(
    async (isLiked) => {
      setIsLike((prev) => !prev);
      setLikeReaction((prev) => (isLiked ? prev - 1 : prev + 1));
      const updatedLikeReaction = isLiked ? likeReaction - 1 : likeReaction + 1;
      const updatedPost = {
        ...postDetail,
        reactionCount: { like: updatedLikeReaction },
        myReactions: isLiked ? [] : ['like'],
      };

      try {
        dispatch(
          updateByPostIdGlobalFeed({
            postId: postId,
            postDetail: updatedPost,
          })
        );
        dispatch(updateByPostId({ postId: postId, postDetail: updatedPost }));

        if (isLiked) {
          await removePostReaction(postId, 'like');
        } else {
          await addPostReaction(postId, 'like');
        }
      } catch (error) {
        setLikeReaction((prev) => prev);
      }
    },
    [
      dispatch,
      likeReaction,
      postDetail,
      postId,
      updateByPostId,
      updateByPostIdGlobalFeed,
    ]
  );

  function onClickComment() {
    dispatch(
      updatePostDetail({
        ...postDetail,
        myReactions: isLike ? ['like'] : [],
        reactionCount: { like: likeReaction },
        commentsCount: commentsCount,
      })
    );

  }
  const handleDisplayNamePress = () => {
    if (user?.userId) {
      navigation.navigate('UserProfile', {
        userId: user.userId,
      });
    }
  };

  const handleCommunityNamePress = () => {
    if (targetType === 'community' && targetId) {
      navigation.navigate('CommunityHome', {
        communityId: targetId,
        communityName: communityName,
      });
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
          onPress: () => onDelete && onDelete(postId),
        },
      ]
    );
    setIsVisible(false);
  };
  const reportPostObject = async () => {
    if (isReportByMe) {
      const unReportPost = await unReportTargetById('post', postId);
      if (unReportPost) {
        Alert.alert('Undo Report sent');
      }
      setIsVisible(false);
      setIsReportByMe(false);
    } else {
      const reportPost = await reportTargetById('post', postId);
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
              user?.userId === (client as Amity.Client).userId &&
                styles.twoOptions,
            ]}
          >
            {user?.userId === (client as Amity.Client).userId ? (
              <View>
                <TouchableOpacity
                  onPress={openEditPostModal}
                  style={styles.modalRow}
                >
                  <Text style={styles.deleteText}> Edit Post</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={deletePostObject}
                  style={styles.modalRow}
                >
                  <Text style={styles.deleteText}> Delete Post</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={reportPostObject}
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
    );
  };
  const closeEditPostModal = () => {
    setEditPostModalVisible(false);
  };
  const openEditPostModal = () => {
    setIsVisible(false);
    setEditPostModalVisible(true);
  };

  const handleOnFinishEdit = useCallback(
    (postData: { text: string; mediaUrls: string[] | IVideoPost[] }) => {
      setTextPost(postData.text);
      setEditPostModalVisible(false);
      setIsEdit(true);
    },
    []
  );
  const onClickReactions = useCallback(() => {
    navigation.navigate('ReactionList', {
      referenceId: postId,
      referenceType: 'post',
    });
  }, [navigation, postId]);

  return (
    <View key={postId} style={styles.postWrap}>
      <View style={styles.headerSection}>
        <View style={styles.user}>
          {user?.avatarFileId ? (
            <Image
              style={styles.avatar as StyleProp<ImageStyle>}
              source={{
                uri: `https://api.${apiRegion}.amity.co/api/v3/files/${user?.avatarFileId}/download`,
              }}
            />
          ) : (
            <View style={styles.avatar}>
              <SvgXml xml={personXml} width="20" height="16" />
            </View>
          )}

          <View style={styles.fillSpace}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={handleDisplayNamePress}>
                <Text style={styles.headerText}>{user?.displayName}</Text>
              </TouchableOpacity>

              {communityName && (
                <View style={styles.communityNameContainer}>
                  <SvgXml
                    style={styles.arrow}
                    xml={arrowXml}
                    width="8"
                    height="8"
                  />

                  <TouchableOpacity onPress={handleCommunityNamePress}>
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={3}
                      style={styles.headerText}
                    >
                      {communityName}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.headerTextTime}>{timeDifference}</Text>
              {(editedAt !== createdAt || isEdit) && (
                <Text style={styles.dot}>·</Text>
              )}
              {(editedAt !== createdAt || isEdit) && (
                <Text style={styles.headerTextTime}>Edited</Text>
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={openModal} style={styles.threeDots}>
          <SvgXml xml={threeDots(theme.colors.base)} width="20" height="16" />
        </TouchableOpacity>
      </View>
      <View>
        <View style={styles.bodySection}>
          {textPost && childrenPosts?.length === 0 && (
            <LinkPreview
              text={textPost}
              mentionPositionArr={[...mentionPositionArr]}
            />
          )}
          {textPost && childrenPosts?.length > 0 && (
            <RenderTextWithMention
              textPost={textPost}
              mentionPositionArr={[...mentionPositionArr]}
            />
          )}
          {childrenPosts?.length > 0 && !editPostModalVisible && (
            <MediaSection childrenPosts={childrenPosts} />
          )}
        </View>

        {likeReaction === 0 && commentsCount === 0 ? (
          ''
        ) : (
          <View>
            <View style={styles.countSection}>
              {likeReaction ? (
                <Text style={styles.likeCountText} onPress={onClickReactions}>
                  {likeReaction} {renderLikeText(likeReaction)}
                </Text>
              ) : (
                <Text />
              )}
              {commentsCount > 0 && (
                <Text style={styles.commentCountText}>
                  {commentsCount > 0 && commentsCount}{' '}
                  {renderCommentText(commentsCount)}
                </Text>
              )}
            </View>
          </View>
        )}

        {targetType !== 'community' || isJoined !== false ? (
          <View style={styles.actionSection}>
            <TouchableOpacity
              onPress={() => addReactionToPost(isLike)}
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
                Like
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClickComment}
              style={styles.commentBtn}
            >
              <SvgXml xml={commentXml} width="20" height="16" />
              <Text style={styles.btnText}>Comment</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionSection}>
            <Text style={styles.btnText}>
              Join community to interact with all posts
            </Text>
          </View>
        )}
      </View>
      {renderOptionModal()}
      {editPostModalVisible && (
        <EditPostModal
          privateCommunityId={privateCommunityId}
          visible={editPostModalVisible}
          onClose={closeEditPostModal}
          postDetail={{ ...postDetail, data: { ...data, text: textPost } }}
          onFinishEdit={handleOnFinishEdit}
        />
      )}
    </View>
  );
}
