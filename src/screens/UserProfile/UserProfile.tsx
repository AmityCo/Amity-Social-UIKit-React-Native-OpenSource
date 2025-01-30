import React, {
  useState,
  useEffect,
  useRef,
  type MutableRefObject,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  ScrollView,
  Pressable,
} from 'react-native';
import { useStyles } from './styles';
import {
  UserRepository,
  getMyFollowersTopic,
  getMyFollowingsTopic,
  subscribeTopic,
} from '@amityco/ts-sdk-react-native';
import Feed from '../Feed';
import CustomTab from '../../components/CustomTab';
import type { FeedRefType } from '../CommunityHome';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuth from '../../hooks/useAuth';
import { SvgXml } from 'react-native-svg';
import {
  blockOrUnblock,
  cancelFollowRequest,
  editIcon,
  primaryDot,
  privateUserProfile,
} from '../../svg/svg-xml-list';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';
import FloatingButton from '../../components/FloatingButton';

import { useDispatch } from 'react-redux';
import uiSlice from '../../redux/slices/uiSlice';
import { PostTargetType } from '../../enum/postTargetType';

import { defaultAvatarUri } from '../../assets';
import { ImageSizeState } from '../../enum';

import GalleryComponent from '../../components/Gallery/GalleryComponent';
import {  } from '../../hooks';
import { TabName } from '../../enum/enumTabName';
import { useFileV4 } from '../../hooks/useFilev4';

export default function UserProfile({ route }: any) {
  const theme = useTheme() as MyMD3Theme;
  const styles = useStyles();
  const { client } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { userId } = route.params;
  const { openPostTypeChoiceModal } = uiSlice.actions;
  const dispatch = useDispatch();
  const [user, setUser] = useState<Amity.User>();
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [followStatus, setFollowStatus] =
    useState<Amity.FollowInfo['status']>(null);
  const [currentTab, setCurrentTab] = useState<TabName>(TabName.Timeline);
  const [socialSettings, setSocialSettings] =
    useState<Amity.SocialSettings>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const { getImage } = useFileV4();
  const [avatar, setAvatar] = useState<string>(null);
  const isMyProfile = !followStatus;
  const isBlocked = followStatus === 'blocked';
  const isUnfollowed = followStatus === 'none';
  const isPending = followStatus === 'pending';
  const isAccepted = followStatus === 'accepted';
  const shouldShowPrivateProfile =
    !isMyProfile &&
    !isAccepted &&
    socialSettings?.userPrivacySetting === 'private';
  const shouldShowPending = isMyProfile && pendingCount > 0;
  const feedRef: MutableRefObject<FeedRefType | null> =
    useRef<FeedRefType | null>(null);
  const galleryRef: MutableRefObject<FeedRefType | null> =
    useRef<FeedRefType | null>(null);
  const scrollViewRef = useRef(null);

  const onEditProfileTap = () => {
    navigation.navigate('EditProfile', {
      user: user,
    });
  };
  const onFollowTap = async () => {
    const { data: followStatus } = await UserRepository.Relationship.follow(
      userId
    );
    if (followStatus) {
      setFollowStatus(followStatus.status);
    }
  };
  const onUnblockUser = async () => {
    await UserRepository.Relationship.unBlockUser(userId);
    setFollowStatus('none');
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('UserProfileSetting', {
              user,
              follow: followStatus,
            });
          }}
        >
          <Image
            source={require('../../assets/icon/threeDot.png')}
            style={styles.dotIcon}
          />
        </TouchableOpacity>
      ),
    });
  }, [followStatus, navigation, styles.dotIcon, user]);

  useEffect(() => {
    (async () => {
      if (client) {
        const settings = await (client as Amity.Client)?.getSocialSettings();
        setSocialSettings(settings);
      }
    })();
  }, [client]);

  useEffect(() => {
    if (!user?.avatarFileId) {
      return setAvatar(defaultAvatarUri);
    }
    (async () => {
      const avatarUrl = await getImage({
        fileId: user.avatarFileId,
        imageSize: ImageSizeState.small,
      });
      setAvatar(avatarUrl ?? defaultAvatarUri);
    })();
  }, [getImage, user?.avatarFileId]);

  useEffect(() => {
    let userUnsubscribe: () => void;
    let userRsUnsubscribe: () => void;
    const unsubFollowing = subscribeTopic(getMyFollowingsTopic());
    const unsubFollower = subscribeTopic(getMyFollowersTopic());
    const unsubscribe = navigation.addListener('focus', () => {
      userRsUnsubscribe = UserRepository.Relationship.getFollowInfo(
        userId,
        (value) => {
          if (value && !value.loading) {
            setPendingCount(value.data.pendingCount);
            setFollowStatus(value.data.status);
            setFollowerCount(value.data.followerCount);
            setFollowingCount(value.data.followingCount);
          } else {
          }
        }
      );

      userUnsubscribe = UserRepository.getUser(userId, ({ data, loading }) => {
        if (!loading) {
          setUser(data);
        } else {
        }
      });
    });

    return () => {
      unsubscribe();
      userUnsubscribe && userUnsubscribe();
      userRsUnsubscribe && userRsUnsubscribe();
      unsubFollowing();
      unsubFollower();
    };
  }, [navigation, userId]);
  const editProfileButton = () => {
    return (
      <TouchableOpacity
        style={styles.editProfileButton}
        onPress={onEditProfileTap}
      >
        <SvgXml width={24} height={20} xml={editIcon(theme.colors.base)} />
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
    );
  };
  const followButton = () => {
    return (
      <TouchableOpacity style={styles.followButton} onPress={onFollowTap}>
        <Image
          source={require('../../assets/icon/followPlus.png')}
          style={styles.followIcon}
        />
        <Text style={styles.followText}>Follow</Text>
      </TouchableOpacity>
    );
  };
  const unBlockButton = () => {
    return (
      <TouchableOpacity
        style={styles.editProfileButton}
        onPress={onUnblockUser}
      >
        <SvgXml
          width={24}
          height={20}
          xml={blockOrUnblock(theme.colors.base)}
        />
        <Text style={styles.editProfileText}>Unblock user</Text>
      </TouchableOpacity>
    );
  };

  const cancelRequestButton = () => {
    const onCancelRequest = async () => {
      await UserRepository.Relationship.unfollow(userId);
      setFollowStatus('none');
    };
    return (
      <TouchableOpacity
        style={styles.editProfileButton}
        onPress={onCancelRequest}
      >
        <SvgXml
          width={24}
          height={20}
          xml={cancelFollowRequest(theme.colors.base)}
        />
        <Text style={styles.editProfileText}>Cancel request</Text>
      </TouchableOpacity>
    );
  };

  const pendingCountButton = () => {
    const onPressPending = () => {
      navigation.navigate('UserPendingRequest');
    };

    return (
      <TouchableOpacity
        style={styles.pendingRequestContainer}
        onPress={onPressPending}
      >
        <View style={styles.rowContainer}>
          <SvgXml xml={primaryDot(theme.colors.primary)} />
          <Text style={styles.pendingRequestText}>Pending requests</Text>
        </View>

        <Text style={styles.pendingRequestSubText}>
          Your requests are waiting for review
        </Text>
      </TouchableOpacity>
    );
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isScrollEndReached =
      layoutMeasurement.height + contentOffset.y + 200 >= contentSize.height;

    if (isScrollEndReached) {
      triggerLoadMoreFunction();
    }
  };
  function triggerLoadMoreFunction() {
    if (feedRef.current) {
      feedRef.current.handleLoadMore(); // Call the function inside the child component
    }
    if (galleryRef.current) {
      galleryRef.current.handleLoadMore();
    }
  }
  const handleOnPressPostBtn = () => {
    dispatch(
      openPostTypeChoiceModal({
        userId: userId,
        targetId: userId,
        targetName: 'My Timeline',
        targetType: PostTargetType.user,
      })
    );
  };

  const renderButtons = () => {
    if (isMyProfile) return editProfileButton();
    if (isUnfollowed) return followButton();
    if (isPending) return cancelRequestButton();
    if (isBlocked) return unBlockButton();
    return null;
  };

  const renderPrivateProfile = () => {
    return (
      <View style={styles.privateProfileContainer}>
        <SvgXml width={40} height={40} xml={privateUserProfile()} />
        <Text style={styles.privateAccountTitle}>This account is private</Text>
        <Text style={styles.privateAccountSubTitle}>
          Follow this user to see all posts
        </Text>
      </View>
    );
  };

  const renderTabs = () => {
    if (shouldShowPrivateProfile) return renderPrivateProfile();
    if (currentTab === TabName.Timeline)
      return <Feed targetType="user" targetId={userId} ref={feedRef} />;
    if (currentTab === TabName.Gallery)
      return (
        <GalleryComponent
          targetId={userId}
          ref={galleryRef}
          targetType="user"
        />
      );
    return null;
  };

  const onPressFollowers = useCallback(() => {
    if (isMyProfile || isAccepted) navigation.navigate('FollowerList', user);
  }, [isAccepted, isMyProfile, navigation, user]);
  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={20}
      >
        <View style={styles.profileContainer}>
          <View style={styles.userDetail}>
            <Image style={styles.avatar} source={{ uri: avatar }} />
            <View style={styles.userInfo}>
              <Text style={styles.title}>{user?.displayName}</Text>
              <Pressable
                style={styles.horizontalText}
                onPress={onPressFollowers}
              >
                <Text style={styles.textComponent}>
                  {followingCount + ' Following '}
                </Text>
                <Text style={styles.textComponent}>
                  {followerCount + ' Follower'}
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.descriptionContainer}>
            {user?.description ? (
              <Text style={styles.descriptionText}> {user?.description}</Text>
            ) : (
              <View />
            )}
          </View>
          {renderButtons()}
          {shouldShowPending && pendingCountButton()}
        </View>
        {!isBlocked && (
          <>
            <CustomTab
              tabName={[TabName.Timeline, TabName.Gallery] as TabName[] }
              onTabChange={setCurrentTab}
            />
            {renderTabs()}
          </>
        )}
      </ScrollView>
      {(client as Amity.Client).userId === userId && (
        <FloatingButton onPress={handleOnPressPostBtn} isGlobalFeed={false} />
      )}
    </View>
  );
}
