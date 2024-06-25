import {
  CommunityRepository,
  PostRepository,
  SubscriptionLevels,
  getCommunityTopic,
  subscribeTopic,
} from '@amityco/ts-sdk-react-native';
import React, {
  type MutableRefObject,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  Pressable,
} from 'react-native';
import CustomTab from '../../components/CustomTabV3';
import { useStyles } from './styles';
import Feed from '../Feed';
import useAuth from '../../hooks/useAuth';

import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { IPost } from '../../components/Social/PostList';
import { amityPostsFormatter } from '../../util/postDataFormatter';
import { checkCommunityPermission } from '../../providers/Social/communities-sdk';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FloatingButton from '../../components/FloatingButton';
import { useDispatch } from 'react-redux';

import { TabName } from '../../enum/tabNameState';
import uiSlice from '../../redux/slices/uiSlice';
import { PostTargetType } from '../../enum/postTargetType';
import useFile from '../../hooks/useFile';
import { PlusIcon } from '../../svg/PlusIcon';
import PrimaryDot from '../../svg/PrimaryDotIcon';
import EditIcon from '../../svg/EditIcon';
import GalleryComponent from '../../components/Gallery/GalleryComponent';


export type FeedRefType = {
  handleLoadMore: () => void;
};

export default function CommunityHome({ route }: any) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useTheme() as MyMD3Theme;
  // const { excludes } = useConfig();
  const styles = useStyles();
  const dispatch = useDispatch();
  const { openPostTypeChoiceModal } = uiSlice.actions;
  const { apiRegion, client } = useAuth();
  const { communityId, communityName,} = route.params as {
    communityId: string;
    communityName: string;
  };
  const [isJoin, setIsJoin] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabName>(TabName.Timeline);
  const [communityData, setCommunityData] =
    useState<Amity.LiveObject<Amity.Community>>();
  const avatarUrl = useFile({ fileId: communityData?.data.avatarFileId });
  const feedRef: MutableRefObject<FeedRefType | null> =
    useRef<FeedRefType | null>(null);
  const scrollViewRef = useRef(null);
  const [pendingPosts, setPendingPosts] = useState<IPost[]>([]);
  const [isShowPendingArea, setIsShowPendingArea] = useState<boolean>(false);
  const [isUserHasPermission, setIsUserHasPermission] =
    useState<boolean>(false);
  const [postSetting, setPostSetting] = useState<
    ValueOf<
      Readonly<{
        ONLY_ADMIN_CAN_POST: 'ONLY_ADMIN_CAN_POST';
        ADMIN_REVIEW_POST_REQUIRED: 'ADMIN_REVIEW_POST_REQUIRED';
        ANYONE_CAN_POST: 'ANYONE_CAN_POST';
      }>
    >
  >(null);
  const disposers: Amity.Unsubscriber[] = useMemo(() => [], []);
  const isSubscribed = useRef(false);
  const subscribePostTopic = useCallback(
    (targetType: string) => {
      if (isSubscribed.current) return;

      if (targetType === 'community') {
        disposers.push(
          subscribeTopic(
            getCommunityTopic(communityData?.data, SubscriptionLevels.POST)
          )
        );
        isSubscribed.current = true;
      }
    },
    [communityData?.data, disposers]
  );
  const getPendingPosts = useCallback(async () => {
    const unsubscribe = PostRepository.getPosts(
      {
        targetId: communityId,
        targetType: 'community',
        feedType: 'reviewing',
        limit: 30,
      },
      async ({ data: posts }) => {
        const pendingPost = await amityPostsFormatter(posts);
        setPendingPosts(pendingPost);
        subscribePostTopic('community');
      }
    );
    disposers.push(unsubscribe);
    const res = await checkCommunityPermission(
      communityId,
      client as Amity.Client,
      apiRegion
    );
    if (
      res?.permissions?.length > 0 &&
      res.permissions.includes('Post/ManagePosts')
    ) {
      setIsUserHasPermission(true);
      navigation.setParams({ isModerator: true, communityId, communityName });
    }
  }, [
    apiRegion,
    client,
    communityId,
    communityName,
    disposers,
    navigation,
    subscribePostTopic,
  ]);

  useFocusEffect(
    useCallback(() => {
      if (postSetting === 'ADMIN_REVIEW_POST_REQUIRED') {
        setIsShowPendingArea(true);
      }
    }, [postSetting])
  );

  const loadCommunity = useCallback(async () => {
    try {
      const unsubscribe = CommunityRepository.getCommunity(
        communityId,
        (community) => {
          setCommunityData(community);
          setPostSetting(community?.data?.postSetting);
          if (community.data?.postSetting === 'ADMIN_REVIEW_POST_REQUIRED') {
            setPostSetting('ADMIN_REVIEW_POST_REQUIRED');
          }
          setIsJoin(community?.data.isJoined || false); // Set isJoin to communityData?.data.isJoined value
        }
      );
      unsubscribe();
    } catch (error) {
      console.error('Failed to load communities:', error);
    }
  }, [communityId]);

  useFocusEffect(
    useCallback(() => {
      getPendingPosts();
      loadCommunity();
      return () => {
        disposers.forEach((fn) => fn());
      };
    }, [disposers, getPendingPosts, loadCommunity])
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isScrollEndReached =
      layoutMeasurement.height + contentOffset.y + 200 >= contentSize.height;

    if (isScrollEndReached) {
      triggerLoadMoreFunction();
    }
  };

  const handleMembersPress = () => {
    navigation.navigate('CommunityMemberDetail', {
      communityId: communityId,
      communityName: communityName,
      isModerator: isUserHasPermission,
    });
  };
  function triggerLoadMoreFunction() {
    if (feedRef.current) {
      feedRef.current.handleLoadMore(); // Call the function inside the child component
    }
  }

  const onJoinCommunityTap = async () => {
    const isJoined = await CommunityRepository.joinCommunity(communityId);
    if (isJoined) {
      setIsJoin(isJoined);
      return isJoined;
    }
    return null;
  };

  const joinCommunityButton = () => {
    return (
      <View style={styles.joinContainer}>
        <TouchableOpacity
          style={styles.joinCommunityButton}
          onPress={onJoinCommunityTap}
        >
          <PlusIcon color='#FFF' width={24} />
          <Text style={styles.joinCommunityText}>Join</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleTab = (tabName: TabName) => {
    setCurrentTab(tabName);
  };

  const handleClickPendingArea = () => {
    navigation.navigate('PendingPosts', {
      communityId: communityId,
      isModerator: isUserHasPermission,
    });
  };
  const pendingPostArea = () => {
    return (
      <Pressable onPress={handleClickPendingArea}>
        <View style={styles.pendingPostWrap}>
          <View style={styles.pendingPostArea}>
            <View style={styles.pendingRow}>
              <PrimaryDot color={theme.colors.primary} />
              <Text style={styles.pendingText}>Pending posts</Text>
            </View>

            <Text style={styles.pendingDescriptionText}>
              {isUserHasPermission
                ? (pendingPosts.length > 30 && 'More than ') +
                pendingPosts.length +
                ' posts need approval'
                : 'Your posts are pending for review'}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };
  const handleOnPressPostBtn = () => {
    return dispatch(
      openPostTypeChoiceModal({
        userId: (client as Amity.Client).userId as string,
        targetId: communityId,
        isPublic: communityData?.data.isPublic,
        targetName: communityName,
        targetType: PostTargetType.community,
        postSetting: postSetting,
        needApprovalOnPostCreation: (communityData?.data as Record<string, any>)
          ?.needApprovalOnPostCreation,
      })
    );
  };

  const onEditProfileTap = () => {
    navigation.navigate('EditCommunity', {
      communityData,
    });
  };

  const renderTabs = () => {
    if (currentTab === TabName.Timeline)
      return (
        <Feed targetType="community" targetId={communityId} ref={feedRef} />
      );
    if (currentTab === TabName.Gallery)
      return (
        <GalleryComponent
          targetId={communityId}
          ref={feedRef}
          targetType="community"
        />
      );
    return null;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={20}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={
              avatarUrl
                ? {
                  uri: avatarUrl,
                }
                : require('../../assets/icon/Placeholder.png')
            }
          />
          <View style={styles.darkOverlay} />
          <View style={styles.overlay}>
            <Text style={styles.overlayCommunityText}>
              {communityData?.data.displayName}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.rowNumber}>
              {communityData?.data.postsCount}
            </Text>
            <Text style={styles.rowLabel}>post</Text>
          </View>

          <View style={styles.rowItemContent}>
            <View style={styles.verticalLine} />
            <TouchableOpacity
              onPress={() => handleMembersPress()}
              style={[styles.rowItem, { paddingLeft: 10 }]}
            >
              <Text style={styles.rowNumber}>
                {communityData?.data.membersCount}
              </Text>
              <Text style={styles.rowLabel}>members</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.textComponent}>
          {communityData?.data.description}
        </Text>
        {isUserHasPermission && (
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={onEditProfileTap}
          >
            <EditIcon width={24} height={20} color={theme.colors.base} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
        {!isJoin && joinCommunityButton()}
        {isJoin && isShowPendingArea && pendingPostArea()}
        <CustomTab
          tabName={[TabName.Timeline, TabName.Gallery]}
          onTabChange={handleTab}
        />
        <View style={styles.tabBackground} >
          {renderTabs()}
        </View>

      </ScrollView>
      {isJoin && (
        <FloatingButton onPress={handleOnPressPostBtn} isGlobalFeed={false} />
      )}
    </View>
  );
}
