/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { CommunityRepository, PostRepository, SubscriptionLevels, getCommunityTopic, subscribeTopic } from '@amityco/ts-sdk-react-native';
import React, { type MutableRefObject, useEffect, useRef, useState, useLayoutEffect } from 'react';
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
import CloseButton from '../../components/BackButton';
import { getStyles } from './styles';
import Feed from '../Feed';
import useAuth from '../../hooks/useAuth';
import { SvgXml } from 'react-native-svg';
import { plusIcon, primaryDot } from '../../svg/svg-xml-list';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { IPost } from '../../components/Social/PostList';
import { amityPostsFormatter } from '../../util/postDataFormatter';
import { checkCommunityPermission } from '../../providers/Social/communities-sdk';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FloatingButton from '../../components/FloatingButton';
import CommunityStories from '../../components/CommunityStories';

export type FeedRefType = {
  handleLoadMore: () => void;
};

export default function CommunityHome({ route }: any) {

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const theme = useTheme() as MyMD3Theme;
  const styles = getStyles();
  const { apiRegion, client } = useAuth();
  const { communityId, communityName } = route.params;
  const [isJoin, setIsJoin] = useState(true);
  const [communityData, setCommunityData] = useState<Amity.LiveObject<Amity.Community>>();

  const feedRef: MutableRefObject<FeedRefType | null> = useRef<FeedRefType | null>(null);
  const scrollViewRef = useRef(null);

  const [pendingPosts, setPendingPosts] = useState<IPost[]>([])
  const [isShowPendingArea, setIsShowPendingArea] = useState<boolean>(false)
  const [isUserHasPermission, setIsUserHasPermission] = useState<boolean>(false)
  const [postSetting, setPostSetting] = useState<string>('')

  const disposers: Amity.Unsubscriber[] = [];
  let isSubscribed = false;

  const subscribePostTopic = (targetType: string) => {
    if (isSubscribed) return;

    if (targetType === 'community') {

      disposers.push(
        subscribeTopic(getCommunityTopic(communityData?.data, SubscriptionLevels.POST), () => {
          // use callback to handle errors with event subscription
        }),
      );
      isSubscribed = true;
    }
  };

  const getPendingPosts = async () => {
    const unsubscribe = PostRepository.getPosts(
      { targetId: communityId, targetType: 'community', feedType: 'reviewing', limit: 30 },
      async ({ data: posts }) => {
        const pendingPost = await amityPostsFormatter(posts)

        setPendingPosts(pendingPost)
        subscribePostTopic('community');
        setIsShowPendingArea(true)
      },
    );
    disposers.push(unsubscribe);
    const res = await checkCommunityPermission(communityId, client as Amity.Client, apiRegion)
    if (res.permissions.length > 0 && res.permissions.includes('Post/ManagePosts')) {
      setIsUserHasPermission(true)
    }
  }


  useEffect(() => {
    if (postSetting === 'ADMIN_REVIEW_POST_REQUIRED') {
      setIsShowPendingArea(true)
    }
  }, [postSetting])


  useLayoutEffect(() => {
    getPendingPosts()
    loadCommunity();
    return () => {
      disposers.forEach(fn => fn());
    };
  }, [])
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isScrollEndReached =
      layoutMeasurement.height + contentOffset.y + 200 >= contentSize.height;

    if (isScrollEndReached) {
      triggerLoadMoreFunction();
    }
  };
  const onBackPress = () => {
    navigation.navigate('Home')
  }
  React.useLayoutEffect(() => {
    // Set the headerRight component to a TouchableOpacity
    navigation.setOptions({
      headerLeft: () => <CloseButton onPress={onBackPress} goBack={false} />,
      title: communityName,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // Handle button press here
            navigation.navigate('CommunitySetting', {
              communityId: communityId,
              communityName: communityName,
            });
          }}
        >
          <Image
            source={require('../../../assets/icon/threeDot.png')}
            style={styles.dotIcon}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
  const loadCommunity = async () => {
    try {
      const unsubscribe = CommunityRepository.getCommunity(
        communityId,
        // setCommunityData
        (community) => {
          setCommunityData(community);
          setPostSetting(community?.data?.postSetting)
          if ((community.data as Record<string, any>).needApprovalOnPostCreation) {
            setPostSetting('ADMIN_REVIEW_POST_REQUIRED')
          }
          setIsJoin(community?.data.isJoined || false); // Set isJoin to communityData?.data.isJoined value
        }
      );
      unsubscribe();
    } catch (error) {
      console.error('Failed to load communities:', error);
    }

  };




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

  const handleTab = (index: number) => {
    console.log('index: ', index);
  };

  const handleClickPendingArea = () => {
    navigation.navigate('PendingPosts', { communityId: communityId, isModerator: isUserHasPermission ? true : false });
  }
  const pendingPostArea = () => {
    return (
      <Pressable onPress={handleClickPendingArea}>
        <View style={styles.pendingPostWrap}>
          <View style={styles.pendingPostArea}>
            <View style={styles.pendingRow}>
              <SvgXml xml={primaryDot(theme.colors.primary)} />
              <Text style={styles.pendingText} >Pending posts</Text>
            </View>

            <Text style={styles.pendingDescriptionText}>{isUserHasPermission ? (pendingPosts.length > 30 && 'More than ') + pendingPosts.length + ' posts need approval' : 'Your posts are pending for review'}</Text>
          </View>
        </View>
      </Pressable>
    )
  }

  const handleOnPressPostBtn = () => {
    navigation.navigate('CreatePost', {
      targetId: communityId,
      targetName: communityName,
      targetType: 'community',
    });
  }
  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={20}
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={
              communityData?.data.avatarFileId
                ? {
                  uri: `https://api.${apiRegion}.amity.co/api/v3/files/${communityData?.data.avatarFileId}/download?size=medium`,
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
            <Text style={styles.rowNumber}>{communityData?.data.postsCount}</Text>
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
        {isJoin === false ? joinCommunityButton() : <View />}
        <CommunityStories communityId={communityId}/>
        {(isJoin && isShowPendingArea) ? pendingPostArea() : <View />}
        <CustomTab tabName={['Timeline', 'Gallery']} onTabChange={handleTab} />
        <Feed targetType="community" targetId={communityId} ref={feedRef} />

      </ScrollView>

      <FloatingButton onPress={handleOnPressPostBtn} isGlobalFeed={false}/>
    </View>
  );
}
