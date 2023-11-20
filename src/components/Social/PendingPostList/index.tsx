/* eslint-disable react-hooks/exhaustive-deps */
import React, {
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
import { PostRepository } from '@amityco/ts-sdk-react-native';

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
  mentionPosition?: IMentionPosition[]
}
export interface IPostList {
  onAcceptDecline?: (postId: string) => void;
  postDetail: IPost;
  postIndex?: number;
  isGlobalfeed?: boolean;
  isModerator?: boolean
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
export default function PendingPostList({
  postDetail,
  postIndex,
  onAcceptDecline,
  isGlobalfeed = true,
  isModerator = false

}: IPostList) {
  const [postData, setPostData] = useState<IPost>(postDetail)


  const theme = useTheme() as MyMD3Theme;
  const { client, apiRegion } = useAuth();
  const styles = getStyles();
  const [isLike, setIsLike] = useState<boolean>(false);
  const [likeReaction, setLikeReaction] = useState<number>(0);
  const [communityName, setCommunityName] = useState('');
  const [textPost, setTextPost] = useState<string>()

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isReportByMe, setIsReportByMe] = useState<boolean>(false);
  const [editPostModalVisible, setEditPostModalVisible] = useState<boolean>(false)
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const dispatch = useDispatch()

  const [mentionPositionArr, setMentionsPositionArr] = useState<IMentionPosition[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const { updateByPostId: updateByPostIdGlobalFeed } = globalFeedSlice.actions
  const { updateByPostId } = feedSlice.actions
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
    mentionPosition
  } = postData ?? {};



  useEffect(() => {
    if (mentionPosition) {
      setMentionsPositionArr(mentionPosition)
    }

  }, [mentionPosition])


  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 200);
    setPostData(postDetail)

  }, [postDetail])


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
  }, [myReactions, reactionCount])


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


  async function getCommunityInfo(id: string) {
    const { data: community } = await getCommunityById(id);
    setCommunityName(community.data.displayName);
  }



  const handleDisplayNamePress = () => {
    if (user?.userId) {
      navigation.navigate('UserProfile', {
        userId: user.userId,
      });
    }
  };



  const RenderTextWithMention = () => {
    if (mentionPositionArr.length === 0) {
      return <Text style={styles.inputText}>{textPost}</Text>;
    }
    const mentionClick = (userId: string) => {
      navigation.navigate('UserProfile', {
        userId: userId
      });
    };
    let currentPosition = 0;
    const result: (string | JSX.Element)[][] = mentionPositionArr.map(
      ({ index, length, userId }, i) => {
        // Add non-highlighted text before the mention
        const nonHighlightedText = textPost.slice(currentPosition, index);

        // Add highlighted text
        const highlightedText = (
          <Text onPress={() => mentionClick(userId)} key={`highlighted-${i}`} style={styles.mentionText}>
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
    result.push([<Text key="nonHighlighted-last" style={styles.inputText}>{remainingText}</Text>]);

    // Flatten the array and render
    return <Text style={styles.inputText}>{result.flat()}</Text>;
  };

  const memoizedMediaSection = useMemo(() => {
    return <MediaSection childrenPosts={childrenPosts} />;
  }, [childrenPosts]);

  async function approvePost() {
    const { data: post } = await PostRepository.approvePost(postId);

    if (post) {
      onAcceptDecline && onAcceptDecline(postId)
    }
  }
  async function declinePost() {
    const { data: post } = await PostRepository.declinePost(postId);

    if (post) {
      onAcceptDecline && onAcceptDecline(postId)
    }
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
        {isModerator && <View style={styles.actionSection}>
          <TouchableOpacity
            onPress={() => approvePost()}
            style={styles.acceptBtn}
          >


            <Text style={styles.acceptBtnText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => declinePost()}
            style={styles.declineBtn}
          >
            <Text style={styles.declineBtnText}>Decline</Text>
          </TouchableOpacity>
        </View>}

      </View>

    </View>
  );
}
