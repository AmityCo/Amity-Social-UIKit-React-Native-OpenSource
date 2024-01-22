/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useMemo } from 'react';
// import { useTranslation } from 'react-i18next';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Modal,
  Pressable,
  Animated,
  Alert,
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
import { getStyles } from './styles';

import type { UserInterface } from '../../../types/user.interface';
import {
  addPostReaction,
  isReportTarget,
  removePostReaction,
  reportTargetById,
  unReportTargetById,
} from '../../../providers/Social/feed-sdk';
import { getCommunityById } from '../../../providers/Social/communities-sdk';
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
import { IMentionPosition } from '../../../screens/CreatePost';
import feedSlice from '../../../redux/slices/feedSlice';

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
  postIndex,
  onDelete,
  isGlobalfeed = true,
}: IPostList) {
  const [postData, setPostData] = useState<IPost>(postDetail);

  const theme = useTheme() as MyMD3Theme;
  const { client, apiRegion } = useAuth();
  const styles = getStyles();
  const [isLike, setIsLike] = useState<boolean>(false);
  const [likeReaction, setLikeReaction] = useState<number>(0);
  const [communityName, setCommunityName] = useState('');
  const [textPost, setTextPost] = useState<string>();

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isReportByMe, setIsReportByMe] = useState<boolean>(false);
  const [editPostModalVisible, setEditPostModalVisible] =
    useState<boolean>(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useDispatch();

  const [mentionPositionArr, setMentionsPositionArr] = useState<
    IMentionPosition[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
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
  } = postData ?? {};

  useEffect(() => {
    if (mentionPosition) {
      setMentionsPositionArr(mentionPosition);
    }
  }, [mentionPosition]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 200);
    setPostData(postDetail);
  }, [postDetail]);

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

  const checkIsReport = async () => {
    const isReport = await isReportTarget('post', postId);
    if (isReport) {
      setIsReportByMe(true);
    }
  };

  useEffect(() => {
    checkIsReport();
  }, [postDetail]);

  useEffect(() => {
    setTextPost(data?.text);
    if (myReactions.length > 0 && myReactions.includes('like')) {
      setIsLike(true);
    }
    if (reactionCount?.like) {
      setLikeReaction(reactionCount?.like);
    }
    if (targetType === 'community' && targetId) {
      getCommunityInfo(targetId);
    }
  }, [postDetail]);

  function renderLikeText(likeNumber: number | undefined): string {
    if (!likeNumber) {
      return '';
    } else if (likeNumber === 1) {
      return 'like';
    } else {
      return 'likes';
    }
  }
  function renderCommentText(commentNumber: number | undefined): string {
    if (commentNumber === 0) {
      return '';
    } else if (commentNumber === 1) {
      return 'comment';
    } else {
      return 'comments';
    }
  }

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
  async function addReactionToPost() {
    setIsLike((prev) => !prev);
    if (isLike && likeReaction) {
      setLikeReaction(likeReaction - 1);
      let post: IPost = { ...postDetail };
      post.reactionCount =
        likeReaction - 1 > 0 ? { like: likeReaction - 1 } : {};
      post.myReactions = [];
      if (isGlobalfeed) {
        dispatch(
          updateByPostIdGlobalFeed({ postId: postId, postDetail: post })
        );
      } else {
        dispatch(updateByPostId({ postId: postId, postDetail: post }));
      }

      await removePostReaction(postId, 'like');
    } else {
      setLikeReaction(likeReaction + 1);
      let post: IPost = { ...postDetail };
      post.reactionCount = { like: likeReaction + 1 };
      post.myReactions = ['like'];
      if (isGlobalfeed) {
        dispatch(
          updateByPostIdGlobalFeed({ postId: postId, postDetail: post })
        );
      } else {
        dispatch(updateByPostId({ postId: post.postId, postDetail: post }));
      }

      await addPostReaction(postId, 'like');
    }
  }

  async function getCommunityInfo(id: string) {
    const { data: community } = await getCommunityById(id);
    setCommunityName(community.data.displayName);
  }

  function onClickComment() {
    dispatch(
      updatePostDetail({
        ...postDetail,
        myReactions: isLike ? ['like'] : [],
        reactionCount: { like: likeReaction },
        commentsCount: commentsCount,
      })
    );
    navigation.navigate('PostDetail', {
      postId: postDetail.postId,
      postIndex: postIndex,
      isFromGlobalfeed: isGlobalfeed,
    });
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
        Alert.alert('Undo Report sent', '', []);
      }
      setIsVisible(false);
      setIsReportByMe(false);
    } else {
      const reportPost = await reportTargetById('post', postId);
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

  const handleOnFinishEdit = (postData: {
    text: string;
    mediaUrls: string[] | IVideoPost[];
  }) => {
    setTextPost(postData.text);
    setEditPostModalVisible(false);
    setIsEdit(true);
  };

  const RenderTextWithMention = () => {
    if (mentionPositionArr.length === 0) {
      return <Text style={styles.inputText}>{textPost}</Text>;
    }
    const mentionClick = (userId: string) => {
      navigation.navigate('UserProfile', {
        userId: userId,
      });
    };
    let currentPosition = 0;
    const result: (string | JSX.Element)[][] = mentionPositionArr.map(
      ({ index, length, userId }, i) => {
        // Add non-highlighted text before the mention
        const nonHighlightedText = textPost.slice(currentPosition, index);

        // Add highlighted text
        const highlightedText = (
          <Text
            onPress={() => mentionClick(userId)}
            key={`highlighted-${i}`}
            style={styles.mentionText}
          >
            {textPost.slice(index, index + length)}
          </Text>
        );

        // Update currentPosition for the next iteration
        currentPosition = index + length;

        // Return an array of non-highlighted and highlighted text
        return [nonHighlightedText, highlightedText];
      }
    );

    // Add any remaining non-highlighted text after the mentions
    const remainingText = textPost.slice(currentPosition);
    result.push([
      <Text key="nonHighlighted-last" style={styles.inputText}>
        {remainingText}
      </Text>,
    ]);

    // Flatten the array and render
    return <Text style={styles.inputText}>{result.flat()}</Text>;
  };

  const memoizedMediaSection = useMemo(() => {
    return <MediaSection childrenPosts={childrenPosts} />;
  }, [childrenPosts]);

  return (
    <View key={postId} style={styles.postWrap}>
      <View style={styles.headerSection}>
        <View style={styles.user}>
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

          <View>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={handleDisplayNamePress}>
                <Text style={styles.headerText}>{user?.displayName}</Text>
              </TouchableOpacity>

              {communityName && (
                <>
                  <SvgXml
                    style={styles.arrow}
                    xml={arrowXml}
                    width="8"
                    height="8"
                  />

                  <TouchableOpacity onPress={handleCommunityNamePress}>
                    <Text style={styles.headerText}>{communityName}</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.headerTextTime}>
                {getTimeDifference(createdAt)}
              </Text>
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
          {/* {textPost && <Text style={styles.bodyText}>{textPost}</Text>} */}
          {textPost && <RenderTextWithMention />}
          {childrenPosts.length > 0 && (
            <View style={styles.mediaWrap}>
              {!loading && memoizedMediaSection}
            </View>
          )}
        </View>

        {likeReaction === 0 && commentsCount === 0 ? (
          ''
        ) : (
          <TouchableWithoutFeedback onPress={() => onClickComment()}>
            <View style={styles.countSection}>
              {likeReaction ? (
                <Text style={styles.likeCountText}>
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
          </TouchableWithoutFeedback>
        )}

        <View style={styles.actionSection}>
          <TouchableOpacity
            onPress={() => addReactionToPost()}
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

            <Text style={isLike ? styles.likedText : styles.btnText}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onClickComment()}
            style={styles.commentBtn}
          >
            <SvgXml xml={commentXml} width="20" height="16" />
            <Text style={styles.btnText}>Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
      {renderOptionModal()}
      {editPostModalVisible && (
        <EditPostModal
          visible={editPostModalVisible}
          onClose={closeEditPostModal}
          postDetail={postDetail}
          onFinishEdit={handleOnFinishEdit}
        />
      )}
    </View>
  );
}
