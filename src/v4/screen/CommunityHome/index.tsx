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
  useEffect,
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
import CustomTab from '../../../components/CustomTab';
import { useStyles } from './styles';
import Feed from '../Feed';
import useAuth from '../../../hooks/useAuth';
import { SvgXml } from 'react-native-svg';
import { editIcon, plusIcon, primaryDot } from '../../../svg/svg-xml-list';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '../../../providers/amity-ui-kit-provider';
import { IPost } from '../../../components/Social/PostList';
import { amityPostsFormatter } from '../../../util/postDataFormatter';
import { checkCommunityPermission } from '../../../providers/Social/communities-sdk';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FloatingButton from '../../../components/FloatingButton';
import { useDispatch } from 'react-redux';
import useFile from '../../../hooks/useFile';
import { TabName } from '../../../enum/tabNameState';
import uiSlice from '../../../redux/slices/uiSlice';
import { PostTargetType } from '../../../enum/postTargetType';
import useConfig from '../../hook/useConfig';
import { ComponentID } from '../../enum/enumUIKitID';
import AmityStoryTabComponent from '../../PublicApi/Components/AmityStoryTabComponent/AmityStoryTabComponent';
import { AmityStoryTabComponentEnum } from '../../PublicApi/types/index';
import GalleryComponent from '../../component/Gallery/GalleryComponent';

export type FeedRefType = {
  handleLoadMore: () => void;
};

export default function CommunityHome({ route }: any) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useTheme() as MyMD3Theme;
  const { excludes } = useConfig();
  const styles = useStyles();
  const dispatch = useDispatch();
  const { openPostTypeChoiceModal } = uiSlice.actions;
  const { apiRegion, client } = useAuth();
  const { communityId, communityName } = route.params as {
    communityId: string;
    communityName: string;
  };
  const [isJoin, setIsJoin] = useState(true);
  const [currentTab, setCurrentTab] = useState<TabName>(TabName.Timeline);
  const [communityData, setCommunityData] = useState<Amity.Community>();
  const shouldShowAmityStoryTab = () => {
    if (communityData?.isPublic) return true;
    if (communityData?.isJoined) return true;
    return false;
  };
  const avatarUrl = useFile({ fileId: communityData?.avatarFileId });
  const feedRef: MutableRefObject<FeedRefType | null> =
    useRef<FeedRefType | null>(null);
  const scrollViewRef = useRef(null);
  const [pendingPosts, setPendingPosts] = useState<IPost[]>([]);
  const [isUserHasPermission, setIsUserHasPermission] =
    useState<boolean>(false);
  const disposers: Amity.Unsubscriber[] = useMemo(() => [], []);
  const unsubCommunity = useRef(null);

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
  }, [apiRegion, client, communityId, communityName, disposers, navigation]);

  useEffect(() => {
    const unsubscribe = CommunityRepository.getCommunity(
      communityId,
      ({ error, loading, data }) => {
        if (error) return;
        if (!loading) {
          unsubCommunity.current = subscribeTopic(
            getCommunityTopic(data, SubscriptionLevels.COMMUNITY)
          );
          setCommunityData(data);
        }
        setIsJoin(data.isJoined || false); // Set isJoin to communityData?.data.isJoined value
      }
    );
    return () => {
      unsubscribe();
      unsubCommunity.current && unsubCommunity.current();
    };
  }, [communityId]);

  useFocusEffect(
    useCallback(() => {
      getPendingPosts();
      return () => {
        disposers.forEach((fn) => fn());
      };
    }, [disposers, getPendingPosts])
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
          <SvgXml xml={plusIcon('#FFF')} width={24} />
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
              <SvgXml xml={primaryDot(theme.colors.primary)} />
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
        isPublic: communityData?.isPublic,
        targetName: communityName,
        targetType: PostTargetType.community,
        postSetting: communityData?.postSetting,
        needApprovalOnPostCreation: (communityData as Record<string, any>)
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
              {communityData?.displayName}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.rowNumber}>{communityData?.postsCount}</Text>
            <Text style={styles.rowLabel}>post</Text>
          </View>

          <View style={styles.rowItemContent}>
            <View style={styles.verticalLine} />
            <TouchableOpacity
              onPress={() => handleMembersPress()}
              style={[styles.rowItem, { paddingLeft: 10 }]}
            >
              <Text style={styles.rowNumber}>
                {communityData?.membersCount}
              </Text>
              <Text style={styles.rowLabel}>members</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.textComponent}>{communityData?.description}</Text>
        {isUserHasPermission && (
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={onEditProfileTap}
          >
            <SvgXml width={24} height={20} xml={editIcon(theme.colors.base)} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
        {isJoin === false && joinCommunityButton()}
        {isJoin !== false && pendingPosts?.length > 0 && pendingPostArea()}
        {!excludes.includes(`*/${ComponentID.StoryTab}/*`) &&
          shouldShowAmityStoryTab() && (
            <AmityStoryTabComponent
              type={AmityStoryTabComponentEnum.communityFeed}
              targetId={communityId}
            />
          )}
        <CustomTab
          tabName={[TabName.Timeline, TabName.Gallery]}
          onTabChange={handleTab}
        />
        {renderTabs()}
      </ScrollView>
      {isJoin !== false && (
        <FloatingButton onPress={handleOnPressPostBtn} isGlobalFeed={false} />
      )}
    </View>
  );
}
