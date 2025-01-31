import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Modal,
  Animated,
  Alert,
  StyleProp,
  ImageStyle,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import {
  arrowForward,
  editIcon,
  reportOutLine,
  storyDraftDeletHyperLink,
} from '../../svg/svg-xml-list';
import { useStyles } from './styles';
import type { UserInterface } from '../../types/user.interface';
import { getCommunityById } from '../../providers/Social/communities-sdk';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import MediaSection from '../../components/MediaSection';
import { IMentionPosition } from '../../types/type';
import { RootStackParamList } from '../../routes/RouteParamList';
import { ComponentID, ElementID, PageID } from '../../enum';
import AvatarElement from '../../Elements/CommonElements/AvatarElement';

import ModeratorBadgeElement from '../../Elements/ModeratorBadgeElement/ModeratorBadgeElement';
import AmityPostEngagementActionsComponent from '../AmityPostEngagementActionsComponent/AmityPostEngagementActionsComponent';
import { AmityPostContentComponentStyleEnum } from '../../enum/AmityPostContentComponentStyle';
import { PostTargetType } from '../../enum/postTargetType';
import TimestampElement from '../../Elements/TimestampElement/TimestampElement';


import {
  deletePostById,
  isReportTarget,
  reportTargetById,
  unReportTargetById,
} from '../../providers/Social/feed-sdk';
import useAuth from '../../hooks/useAuth';
import globalFeedSlice from '../../redux/slices/globalfeedSlice';
import { useDispatch } from 'react-redux';
import { useBehaviour } from '../../providers/BehaviourProvider';
import uiSlice from '../../redux/slices/uiSlice';
import { useAmityComponent } from '../../hooks/useUiKitReference';
import { useIsCommunityModerator } from '../../hooks/useIsCommunityModerator';
import RenderTextWithMention from '../RenderTextWithMention /RenderTextWithMention';
import { LinkPreview } from '../PreviewLink/LinkPreview';
import { ThreeDotsIcon } from '../../svg/ThreeDotsIcon';

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
  targetType: PostTargetType;
  targetId: string;
  childrenPosts: string[];
  mentionees: string[];
  mentionPosition?: IMentionPosition[];
  analytics: Amity.Post<'analytics'>;
}
export interface IPostList {
  post: IPost;
  pageId?: PageID;
  AmityPostContentComponentStyle?: AmityPostContentComponentStyleEnum;
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
const AmityPostContentComponent = ({
  pageId,
  post,
  AmityPostContentComponentStyle = AmityPostContentComponentStyleEnum.detail,
}: IPostList) => {
  const theme = useTheme() as MyMD3Theme;
  const {
    AmityPostContentComponentBehavior,
    AmityGlobalFeedComponentBehavior,
  } = useBehaviour();
  const componentId = ComponentID.post_content;
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId: pageId,
    componentId: componentId,
  });
  const styles = useStyles(themeStyles);
  const { client } = useAuth();
  const { showToastMessage } = uiSlice.actions;
  const [textPost, setTextPost] = useState<string>('');
  const [communityData, setCommunityData] = useState<Amity.Community>(null);
  const { deleteByPostId } = globalFeedSlice.actions;
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isVisible, setIsVisible] = useState(false);
  const [isReportByMe, setIsReportByMe] = useState(false);
  const [mentionPositionArr, setMentionsPositionArr] = useState<
    IMentionPosition[]
  >([]);

  const slideAnimation = useRef(new Animated.Value(0)).current;

  const {
    postId,
    data,
    myReactions = [],
    reactionCount,
    createdAt,
    user,
    targetType,
    targetId,
    childrenPosts = [],
    editedAt,
    mentionPosition,
  } = post ?? {};
  const { isCommunityModerator } = useIsCommunityModerator({
    communityId: targetType === 'community' && targetId,
    userId: user?.userId,
  });
  const myId = (client as Amity.Client).userId;
  const { isCommunityModerator: isIAmModerator } = useIsCommunityModerator({
    communityId: targetType === 'community' && targetId,
    userId: myId,
  });
  useEffect(() => {
    if (mentionPosition) {
      setMentionsPositionArr(mentionPosition);
    }
  }, [mentionPosition]);

  useEffect(() => {
    setTextPost(data?.text);
    if (targetType === 'community' && targetId) {
      getCommunityInfo(targetId);
    }
  }, [data?.text, myReactions, reactionCount?.like, targetId, targetType]);

  async function getCommunityInfo(id: string) {
    const { data: community }: { data: Amity.LiveObject<Amity.Community> } =
      await getCommunityById(id);
    if (community.error) return;
    if (!community.loading) {
      setCommunityData(community?.data);
    }
  }

  const handleDisplayNamePress = () => {
    if (!user?.userId) return null;
    if (AmityPostContentComponentBehavior?.goToUserProfilePage) {
      return AmityPostContentComponentBehavior.goToUserProfilePage({
        userId: user.userId,
      });
    }
    return navigation.navigate('UserProfile', {
      userId: user.userId,
    });
  };

  const handleCommunityNamePress = () => {
    if (targetType !== 'community' || !targetId) return null;
    if (AmityPostContentComponentBehavior?.goToCommunityProfilePage) {
      return AmityPostContentComponentBehavior.goToCommunityProfilePage({
        communityId: targetId,
        communityName: communityData?.displayName,
      });
    }
    return navigation.navigate('CommunityHome', {
      communityId: targetId,
      communityName: communityData?.displayName,
    });
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

  const openEditPostModal = () => {
    closeModal();
    navigation.navigate('EditPost', { post, community: communityData });
  };

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

  const onDeletePost = useCallback(async () => {
    const deleted = await deletePostById(postId);
    if (deleted) {
      dispatch(deleteByPostId({ postId }));
      navigation.pop();
    }
  }, [deleteByPostId, dispatch, navigation, postId]);

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
          onPress: () => onDeletePost(),
        },
      ]
    );
    setIsVisible(false);
  };

  const reportPostObject = async () => {
    if (isReportByMe) {
      const unReportPost = await unReportTargetById('post', postId);
      setIsVisible(false);
      setIsReportByMe(false);
      if (unReportPost) {
        dispatch(
          showToastMessage({
            toastMessage: 'Post unreported',
            isSuccessToast: true,
          })
        );
      }
    } else {
      const reportPost = await reportTargetById('post', postId);
      setIsVisible(false);
      setIsReportByMe(true);
      if (reportPost) {
        dispatch(
          showToastMessage({
            toastMessage: 'Post reported',
            isSuccessToast: true,
          })
        );
      }
    }
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
              (post?.user?.userId === myId || isIAmModerator) &&
                styles.twoOptions,
            ]}
          >
            <View style={styles.handleBar} />
            {post?.user?.userId === (client as Amity.Client).userId ? (
              <TouchableOpacity
                onPress={openEditPostModal}
                style={styles.modalRow}
              >
                <SvgXml
                  xml={editIcon(themeStyles.colors.base)}
                  width="20"
                  height="20"
                />
                <Text style={styles.editText}> Edit Post</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={reportPostObject}
                style={styles.modalRow}
              >
                <SvgXml
                  xml={reportOutLine(themeStyles.colors.base)}
                  width="20"
                  height="20"
                />
                <Text style={styles.editText}>
                  {isReportByMe ? 'Unreport post' : 'Report post'}
                </Text>
              </TouchableOpacity>
            )}
            {(post?.user?.userId === myId || isIAmModerator) && (
              <TouchableOpacity
                onPress={deletePostObject}
                style={styles.modalRow}
              >
                <SvgXml
                  xml={storyDraftDeletHyperLink()}
                  width="20"
                  height="20"
                />
                <Text style={styles.deleteText}> Delete Post</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </Pressable>
      </Modal>
    );
  };

  const onPressPost = useCallback(() => {
    if (AmityGlobalFeedComponentBehavior.goToPostDetailPage) {
      return AmityGlobalFeedComponentBehavior.goToPostDetailPage(postId);
    }
    return navigation.navigate('PostDetail', {
      postId: postId,
    });
  }, [AmityGlobalFeedComponentBehavior, navigation, postId]);

  return (
    <View
      key={postId}
      style={styles.postWrap}
      testID={accessibilityId}
      accessibilityLabel={accessibilityId}
    >
      <Pressable style={styles.headerSection} onPress={onPressPost}>
        <View style={styles.user}>
          <AvatarElement
            style={styles.avatar as StyleProp<ImageStyle>}
            avatarId={user?.avatarFileId}
            pageID={pageId}
            elementID={ElementID.WildCardElement}
            componentID={componentId}
          />

          <View style={styles.fillSpace}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={handleDisplayNamePress}>
                <Text style={styles.headerText}>{user?.displayName}</Text>
              </TouchableOpacity>

              {communityData?.displayName && (
                <View style={styles.communityNameContainer}>
                  <SvgXml
                    style={styles.arrow}
                    xml={arrowForward(theme.colors.baseShade1)}
                    width="8"
                    height="8"
                  />

                  <TouchableOpacity onPress={handleCommunityNamePress}>
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={3}
                      style={styles.headerText}
                    >
                      {communityData?.displayName}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.timeRow}>
              {isCommunityModerator && (
                <View style={styles.row}>
                  <ModeratorBadgeElement
                    pageID={pageId}
                    componentID={componentId}
                    communityId={targetType === 'community' && targetId}
                    userId={user?.userId}
                  />
                  <Text style={styles.dot}>·</Text>
                </View>
              )}
              <TimestampElement
                createdAt={createdAt}
                style={styles.headerTextTime}
                componentID={componentId}
              />

              {editedAt !== createdAt && (
                <>
                  <Text style={styles.dot}>·</Text>
                  <Text style={styles.headerTextTime}>Edited</Text>
                </>
              )}
            </View>
          </View>
        </View>
        {AmityPostContentComponentStyle ===
        AmityPostContentComponentStyleEnum.feed ? (
          <Pressable onPress={openModal} hitSlop={12}>
          <ThreeDotsIcon/>
          </Pressable>
        ) : (
          <View style={styles.threeDots} />
        )}
      </Pressable>
      <View>
        <View style={styles.bodySection}>
          <Pressable onPress={onPressPost}>
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
          </Pressable>
          {childrenPosts?.length > 0 && (
            <MediaSection childrenPosts={childrenPosts} />
          )}
        </View>
        <AmityPostEngagementActionsComponent
          pageId={pageId}
          componentId={componentId}
          AmityPostContentComponentStyle={AmityPostContentComponentStyle}
          targetType={targetType}
          targetId={targetId}
          postId={postId}
        />
      </View>
      {renderOptionModal()}
      
    </View>
  );
};

export default memo(AmityPostContentComponent);
