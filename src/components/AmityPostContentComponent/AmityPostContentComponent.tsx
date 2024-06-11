import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  Alert,
  StyleProp,
  ImageStyle,
} from 'react-native';

import { useStyles } from './styles';
import type { UserInterface } from '../../types/user.interface';
import {
  deletePostById,
  isReportTarget,
  reportTargetById,
  unReportTargetById,
} from '../../providers/Social/feed-sdk';
import { getCommunityById } from '../../providers/Social/communities-sdk';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuth from '../../hooks/useAuth';
import EditPostModal from '../../components/EditPostModal';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import MediaSection from '../../components/MediaSection';
import { useDispatch } from 'react-redux';
import globalFeedSlice from '../../redux/slices/globalfeedSlice';
import { IMentionPosition } from '../../types/type';
import RenderTextWithMention from '../RenderTextWithMention/RenderTextWithMention';
import { RootStackParamList } from '../../routes/RouteParamList';
import AvatarElement from '../../Elements/CommonElements/AvatarElement';

import ModeratorBadgeElement from '../../Elements/ModeratorBadgeElement/ModeratorBadgeElement';
import AmityPostEngagementActionsComponent from '../AmityPostEngagementActionsComponent/AmityPostEngagementActionsComponent';
import { AmityPostContentComponentStyleEnum } from '../../enum/AmityPostContentComponentStyle';
import { PostTargetType } from '../../enum/postTargetType';
import TimestampElement from '../../Elements/TimestampElement/TimestampElement';
import MenuButtonIconElement from '../../Elements/MenuButtonIconElement/MenuButtonIconElement';
import { ComponentID, ElementID, PageID } from '../../enum';
import { useAmityComponent } from '../../hooks/useUiKitReference';
import ArrowForwardIcon from '../../svg/ArrowForwardIcon';
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
  const componentId = ComponentID.post_content;
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId: pageId,
    componentId: componentId,
  });
  const { client } = useAuth();
  const styles = useStyles(themeStyles);
  const { deleteByPostId } = globalFeedSlice.actions;
  const [textPost, setTextPost] = useState<string>('');
  const [privateCommunityId, setPrivateCommunityId] = useState(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isReportByMe, setIsReportByMe] = useState<boolean>(false);
  const [communityData, setCommunityData] = useState<Amity.Community>(null);
  const [editPostModalVisible, setEditPostModalVisible] =
    useState<boolean>(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const [mentionPositionArr, setMentionsPositionArr] = useState<
    IMentionPosition[]
  >([]);
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

  useEffect(() => {
    if (mentionPosition) {
      setMentionsPositionArr(mentionPosition);
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
      !community.data.isPublic &&
        setPrivateCommunityId(community.data.communityId);
    }
  }

  const handleDisplayNamePress = () => {
    if (user?.userId) {
      navigation.navigate('UserProfile', {
        userId: user?.userId,
      });
    }
  };

  const handleCommunityNamePress = () => {
    if (targetType === 'community' && targetId) {
      navigation.navigate('CommunityHome', {
        communityId: targetId,
        communityName: communityData?.displayName,
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
          onPress: () => onDeletePost(),
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

  const handleOnFinishEdit = (postData: {
    text: string;
    mediaUrls: string[] | IVideoPost[];
  }) => {
    setTextPost(postData.text);
    setEditPostModalVisible(false);
    setIsEdit(true);
  };

  const onDeletePost = useCallback(async () => {
    const isDeleted = await deletePostById(postId);
    if (isDeleted) {
      dispatch(deleteByPostId({ postId }));
    }
  }, [deleteByPostId, dispatch, postId]);

  return (
    <View
      key={postId}
      style={styles.postWrap}
      testID={accessibilityId}
      accessibilityLabel={accessibilityId}
    >
      <View style={styles.headerSection}>
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
                  <ArrowForwardIcon  style={styles.arrow}  width={8} height={8} color={theme.colors.baseShade1}/>

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
              {targetType === 'community' && targetId && (
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

              {(editedAt !== createdAt || isEdit) && (
                <>
                  <Text style={styles.dot}>·</Text>
                  <Text style={styles.headerTextTime}>Edited</Text>
                </>
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={openModal} style={styles.threeDots}>
          <MenuButtonIconElement
            width={20}
            height={20}
            resizeMode="contain"
            tintColor={themeStyles.colors.base}
            componentID={componentId}
          />
        </TouchableOpacity>
      </View>
      <View>
        <View style={styles.bodySection}>
          {textPost && (
            <RenderTextWithMention
              mentionPositionArr={[...mentionPositionArr]}
              textPost={textPost}
            />
          )}
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
      {/* {editPostModalVisible && (
        <EditPostModal
          privateCommunityId={privateCommunityId}
          visible={editPostModalVisible}
          onClose={closeEditPostModal}
          postDetail={{ ...post, data: { ...data, text: textPost } }}
          onFinishEdit={handleOnFinishEdit}
        />
      )} */}
    </View>
  );
};

export default memo(AmityPostContentComponent);
