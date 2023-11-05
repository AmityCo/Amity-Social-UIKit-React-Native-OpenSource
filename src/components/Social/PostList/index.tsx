/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
// import { useTranslation } from 'react-i18next';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  type StyleProp,
  type ImageStyle,
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
  playBtn,
  postIcon,
  threeDots,
} from '../../../svg/svg-xml-list';
import { getStyles } from './styles';

import type { UserInterface } from '../../../types/user.interface';
import {
  addPostReaction,
  getPostById,
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
import { useDispatch, useSelector } from 'react-redux';
import globalFeedSlice from '../../../redux/slices/globalfeedSlice';
import { RootState } from '../../../redux/store';
import { getAmityUser } from '../../../providers/user-provider';

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
  mentionees: string[]
}
export interface IPostList {
  onDelete?: (postId: string) => void;
  onChange?: (postDetail: IPost) => void;
  postDetail: IPost;
  postIndex?: number
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
  onChange,

}: IPostList) {
  const [postData, setPostData] = useState<IPost>(postDetail)


  const theme = useTheme() as MyMD3Theme;
  const { client, apiRegion } = useAuth();
  const styles = getStyles();
  const [isLike, setIsLike] = useState<boolean>(false);
  const [likeReaction, setLikeReaction] = useState<number>(0);
  const [communityName, setCommunityName] = useState('');
  const [imagePosts, setImagePosts] = useState<string[]>([]);
  const [textPost, setTextPost] = useState<string>()

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isReportByMe, setIsReportByMe] = useState<boolean>(false);
  const [editPostModalVisible, setEditPostModalVisible] = useState<boolean>(false)
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useDispatch()
const [mentionUsers, setMentionUsers] = useState<UserInterface[]>([])

  const { updateByPostId } = globalFeedSlice.actions
  const { updatePostDetail } = postDetailSlice.actions
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
    mentionees
  } = postData ?? {};


  const queryUserList = async () => {
    const userList = await Promise.all(mentionees.map(async (item: string) => {
      const { userObject } = await getAmityUser(item);
      let formattedUserObject: UserInterface;

      formattedUserObject = {
        userId: userObject.data.userId,
        displayName: userObject.data.displayName,
        avatarFileId: userObject.data.avatarFileId,
      };

      return formattedUserObject
    }))
    if(userList){
      setMentionUsers(userList)
    }

    console.log('userList:', userList)
  }
  useEffect(() => {
    if (mentionees?.length > 0) {
      queryUserList()
    }
  }, [mentionees])

  useEffect(() => {

    setPostData(postDetail)

  }, [postDetail])

  // useEffect(() => {
  //   onChange && onChange(postData)
  //   // memoizedDispatch()
  // }, [postData])

  useEffect(() => {
    if (myReactions && myReactions?.length > 0) {
      setIsLike(true)
    } else {
      setIsLike(false)
    }
    if (reactionCount?.like) {
      setLikeReaction(reactionCount?.like)
    } else {
      setLikeReaction(0)
    }
  }, [myReactions, reactionCount, postDetail])


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



  // useEffect(() => {
  //   if (imagePosts.length > 0) {
  //     const updatedUrls: MediaUri[] = imagePosts.map((url: string) => {
  //       return {
  //         uri: url.replace('size=medium', 'size=large')
  //       }
  //     })
  //     setImagePostsFullSize(updatedUrls)

  //   }
  //   if (videoPosts.length > 0) {
  //     const updatedUrls: MediaUri[] = videoPosts.map((item: IVideoPost) => {
  //       return {
  //         uri: `https://api.${apiRegion}.amity.co/api/v3/files/${item?.thumbnailFileId}/download?size=large`
  //       }
  //     })
  //     setVideoPostsFullSize(updatedUrls)
  //   }

  // }, [imagePosts, videoPosts])

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
    setTextPost(data?.text)
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
      let post: IPost = { ...postDetail }
      post.reactionCount = likeReaction - 1 > 0 ? { like: likeReaction - 1 } : {}
      post.myReactions = []
      // setPostData(post)
      dispatch(updateByPostId({ postId: postId, postDetail: post }))

      await removePostReaction(postId, 'like');
    } else {
      setLikeReaction(likeReaction + 1);
      let post: IPost = { ...postDetail }
      post.reactionCount = { like: likeReaction + 1 }
      post.myReactions = ["like"]
      // setPostData(post)
      dispatch(updateByPostId({ postId: post.postId, postDetail: post }))
      await addPostReaction(postId, 'like');
    }
  }

  async function getCommunityInfo(id: string) {
    const { data: community } = await getCommunityById(id);
    setCommunityName(community.data.displayName);
  }


  function onClickComment() {
    // const index = postList.findIndex(item => item.postId === postDetail.postId)
    // dispatch(updateCurrentIndex(index))
    dispatch(updatePostDetail({
      ...postDetail,
      myReactions: isLike ? ["like"] : [],
      reactionCount: { like: likeReaction },
      commentsCount: commentsCount
    }))
    navigation.navigate('PostDetail', {
      postId: postDetail.postId,
      postIndex: postIndex
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
          <Animated.View style={[styles.modalContent, modalStyle, user?.userId === (client as Amity.Client).userId && styles.twoOptions]}>
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
    )
  }
  const closeEditPostModal = () => {
    setEditPostModalVisible(false)
  }
  const openEditPostModal = () => {
    setIsVisible(false)
    setEditPostModalVisible(true)

  }
  const memoizedMediaSection = useMemo(() => {
    return (
      childrenPosts.length > 0 &&
      <View style={styles.mediaWrap}>
        <MediaSection childrenPosts={childrenPosts} />
      </View>
    );
  }, [postDetail]);
  const handleOnFinishEdit = (postData: { text: string, mediaUrls: string[] | IVideoPost[] }, type: string) => {
    console.log('Finish:', postData)

    if (type === 'image') {
      setImagePosts(postData.mediaUrls as string[])

    }
    else if (type === 'video') {
      const videoPostsCallBack: unknown[] = postData.mediaUrls
      setVideoPosts(videoPostsCallBack as IVideoPost[])
    }
    setTextPost(postData.text)
    setEditPostModalVisible(false)
    setIsEdit(true)
  }

  const renderTextWithMention = () => {
    const textArr: string[] = data?.text.split(/(@\w+)(\s*)/).filter(Boolean);
    console.log('textArr:', textArr)

    const textElement = textArr.map((item: string) => {
      const atsIndex = item.indexOf('@')
      const mentionName = atsIndex > -1 ? item.replace(/@/g, '') : '';
      const isTextIncluded = mentionUsers.some(item => item.userId.includes(mentionName));
      return (mentionName !== '' && isTextIncluded) ? <Text style={styles.mentionText}>{item}</Text> : <Text style={styles.inputText}>{item}</Text>
    })
    return <View style={{ flexDirection: 'row' }}>{textElement}</View>
  }
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
              {(editedAt !== createdAt || isEdit) && <Text style={styles.dot}>·</Text>}
              {(editedAt !== createdAt || isEdit) &&
                <Text style={styles.headerTextTime}>
                  Edited
                </Text>}
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
          {textPost && renderTextWithMention()}
          {memoizedMediaSection}
          {/* {childrenPosts.length > 0 && (
            <View style={styles.mediaWrap}>
              <MediaSection childrenPosts={childrenPosts} />
            </View>
          )} */}
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
              <SvgXml xml={likedXml(theme.colors.primary)} width="20" height="16" />
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
      {editPostModalVisible &&
        <EditPostModal
          visible={editPostModalVisible}
          onClose={closeEditPostModal}
          postDetail={postDetail}
          onFinishEdit={handleOnFinishEdit}
        />}

    </View>
  );
}
