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
import CustomTab from '../../components/CustomTab';
import { getStyles } from './styles';
import Feed from '../Feed';
import useAuth from '../../hooks/useAuth';
import { SvgXml } from 'react-native-svg';
import { editIcon, plusIcon, primaryDot } from '../../svg/svg-xml-list';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { IPost } from '../../components/Social/PostList';
import { amityPostsFormatter } from '../../util/postDataFormatter';
import { checkCommunityPermission } from '../../providers/Social/communities-sdk';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FloatingButton from '../../components/FloatingButton';
import useImage from '../../hooks/useImage';
import { TabName } from '../../enum/tabNameState';

export type FeedRefType = {
  handleLoadMore: () => void;
};

export default function CommunityHome({ route }: any) {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useTheme() as MyMD3Theme;
  const styles = getStyles();
  const { apiRegion, client } = useAuth();
  const { communityId, communityName } = route.params as {
    communityId: string;
    communityName: string;
  };
  const [isJoin, setIsJoin] = useState(true);
  const [communityData, setCommunityData] =
    useState<Amity.LiveObject<Amity.Community>>();
  const avatarUrl = useImage({ fileId: communityData?.data.avatarFileId });
  const feedRef: MutableRefObject<FeedRefType | null> =
    useRef<FeedRefType | null>(null);
  const scrollViewRef = useRef(null);
  const [pendingPosts, setPendingPosts] = useState<IPost[]>([]);
  const [isShowPendingArea, setIsShowPendingArea] = useState<boolean>(false);
  const [isUserHasPermission, setIsUserHasPermission] =
    useState<boolean>(false);
  const [postSetting, setPostSetting] = useState<string>('');
  const disposers: Amity.Unsubscriber[] = useMemo(() => [], []);
  const isSubscribed = useRef(false);
  const subscribePostTopic = useCallback(
    (targetType: string) => {
      if (isSubscribed.current) return;

      if (targetType === 'community') {
        disposers.push(
          subscribeTopic(
            getCommunityTopic(communityData?.data, SubscriptionLevels.POST),
            () => {
              // use callback to handle errors with event subscription
            }
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
        setIsShowPendingArea(true);
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
    }
  }, [apiRegion, client, communityId, disposers, subscribePostTopic]);

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
        // setCommunityData
        (community) => {
          setCommunityData(community);
          setPostSetting(community?.data?.postSetting);
          if (
            (community.data as Amity.RawCommunity).needApprovalOnPostCreation
          ) {
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
    console.log('index: ', tabName); //this func not implmented yet
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
    navigation.navigate('CreatePost', {
      targetId: communityId,
      targetName: communityName,
      targetType: 'community',
    });
  };

  const onEditProfileTap = () => {
    navigation.navigate('EditCommunity', {
      communityData,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={20}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={
              avatarUrl
                ? {
                    uri: avatarUrl,
                  }
                : require('../../../assets/icon/Placeholder.png')
            }
          />
          <View style={styles.darkOverlay} />
          <View style={styles.overlay}>
            <Text style={styles.overlayCommunityText}>
              {communityData?.data.displayName}
            </Text>
            {/* <Text style={styles.overlayCategoryText}>{communityData?.data.}</Text> */}
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
            <SvgXml width={24} height={20} xml={editIcon(theme.colors.base)} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
        {isJoin === false ? joinCommunityButton() : <View />}
        {isJoin && isShowPendingArea ? pendingPostArea() : <View />}
        <CustomTab
          tabName={[TabName.Timeline, TabName.Gallery]}
          onTabChange={handleTab}
        />
        <Feed targetType="community" targetId={communityId} ref={feedRef} />
      </ScrollView>

      <FloatingButton onPress={handleOnPressPostBtn} isGlobalFeed={false} />
    </View>
  );
}
