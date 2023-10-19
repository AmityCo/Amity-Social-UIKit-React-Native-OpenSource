import React, { useState, useEffect, useRef, type MutableRefObject } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  ScrollView,
} from 'react-native';
import { getStyles } from './styles';
import { UserRepository } from '@amityco/ts-sdk-react-native';
import CloseButton from '../../components/BackButton';
import Feed from '../Feed';
import CustomTab from '../../components/CustomTab';
import type { FeedRefType } from '../CommunityHome';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuth from '../../hooks/useAuth';
import { SvgXml } from 'react-native-svg';
import { editIcon } from '../../svg/svg-xml-list';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';

export default function UserProfile({ route }: any) {
  const theme = useTheme() as MyMD3Theme ;
  const styles = getStyles()
  const { apiRegion } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { userId } = route.params;
  const [user, setUser] = useState<Amity.User>();
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [followStatus, setFollowStatus] = useState<string>('loading');
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  console.log('showLoadingIndicator:', showLoadingIndicator)

  const feedRef: MutableRefObject<FeedRefType | null> =
    useRef<FeedRefType | null>(null);
  const scrollViewRef = useRef(null);

  const avatarFileURL = (fileId: string) => {
    return `https://api.${apiRegion}.amity.co/api/v3/files/${fileId}/download?size=medium`;
  };
  const onEditProfileTap = () => {
    navigation.navigate('EditProfile', {
      user: user,
    });
  };
  const onFollowTap = async () => {
    setShowLoadingIndicator(true);
    const { data: followStatus } = await UserRepository.Relationship.follow(
      userId
    );
    if (followStatus) {
      setFollowStatus(followStatus.status);
      setShowLoadingIndicator(false);
    }
  };
  React.useLayoutEffect(() => {
    // Set the headerRight component to a TouchableOpacity
    navigation.setOptions({
      headerLeft: () => <CloseButton />,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // Handle button press here
            navigation.navigate('UserProfileSetting', {
              userId: userId,
              follow: followStatus !== 'loading' ? followStatus : 'loading',
            });
          }}
        >
          <Image
            source={require('../../../assets/icon/threeDot.png')}
            style={styles.dotIcon}
          />
        </TouchableOpacity>
      ),
      title: '',
    });
  }, [navigation]);
  useEffect(() => {
    navigation.setOptions({
      // Header options...
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('UserProfileSetting', {
              userId: userId,
              follow: followStatus,
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
  }, [followStatus]);
  useEffect(() => {
    const unsubscribeFollow = UserRepository.Relationship.getFollowInfo(
      userId,
      (value) => {
        if (value && !value.loading) {
          setFollowStatus(value.data.status!);
          setFollowerCount(value.data.followerCount);
          setFollowingCount(value.data.followingCount);
        } else {
          console.log('query follow error ' + JSON.stringify(value));
        }
      }
    );
    const unsubscribeUser = UserRepository.getUser(userId, (value) => {
      if (value && !value.loading) {
        setUser(value.data);
      } else {
        console.log('user profile query error ' + JSON.stringify(user));
      }
    });
    unsubscribeFollow();
    unsubscribeUser();
  }, [userId]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      UserRepository.Relationship.getFollowInfo(userId, (value) => {
        if (value && !value.loading) {
          setFollowStatus(value.data.status!);
          setFollowerCount(value.data.followerCount);
          setFollowingCount(value.data.followingCount);
        } else {
        }
      });
      UserRepository.getUser(userId, (value) => {
        if (value && !value.loading) {
          setUser(value.data);
        } else {
        }
      });
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  const editProfileButton = () => {
    return (
      <TouchableOpacity
        style={styles.editProfileButton}
        onPress={onEditProfileTap}
      >
        <SvgXml width={24} height={20} xml={editIcon(theme.colors.base)}/>
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
    );
  };
  const followButton = () => {
    return (
      <TouchableOpacity style={styles.followButton} onPress={onFollowTap}>
        <Image
          source={require('../../../assets/icon/followPlus.png')}
          style={styles.followIcon}
        />
        <Text style={styles.followText}>Follow</Text>
      </TouchableOpacity>
    );
  };

  const handleTab = (index: number) => {
    console.log('index: ', index);
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
  }
  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={20}
    >
      <View style={styles.profileContainer}>
        <View style={styles.userDetail}>
          <Image
            style={styles.avatar}
            source={
              user?.avatarFileId || user?.avatarCustomUrl
                ? {
                  uri: user.avatarFileId
                    ? avatarFileURL(user.avatarFileId)
                    : user.avatarCustomUrl,
                }
                : require('../../../assets/icon/Placeholder.png')
            }
          />
          <View style={styles.userInfo}>
            <Text style={styles.title}>{user?.displayName}</Text>
            <View style={styles.horizontalText}>
              <Text style={styles.textComponent}>
                {followingCount + ' Following '}
              </Text>
              <Text style={styles.textComponent}>
                {followerCount + ' Follower'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          {user?.description ? (
            <Text style={styles.descriptionText}>
              {' '}
              {user?.description}
            </Text>
          ) : (
            <View />
          )}
        </View>

        {followStatus === 'none' ? (
          followButton()
        ) : followStatus === undefined ? ( // userID is the current user ID
          editProfileButton()
        ) : (
          <View />
        )}
      </View>
      <CustomTab tabName={['Timeline', 'Gallery']} onTabChange={handleTab} />
      <Feed targetType="user" targetId={userId} ref={feedRef} />
      {/* <View style={styles.loadingIndicator}>
        <LoadingOverlay
          isLoading={showLoadingIndicator}
          loadingText="Loading..."
        />
      </View> */}
    </ScrollView>
  );
}

