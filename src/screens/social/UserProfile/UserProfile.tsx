import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { styles } from './styles';
import { UserRepository } from '@amityco/ts-sdk';
import CloseButton from '../../../components/BackButton';
import { follow } from '@amityco/ts-sdk/dist/userRepository/relationship';
import { LoadingOverlay } from '../../../components/LoadingOverlay/index';
import LoadingIndicator from '../../../components/LoadingIndicator/index';

export default function UserProfile({ navigation, route }: any) {
  const { userId } = route.params;
  const [user, setUser] = useState<Amity.User>();
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [followStatus, setFollowStatus] = useState<string>('loading');
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const avatarFileURL = (fileId: string) => {
    return `https://api.amity.co/api/v3/files/${fileId}/download?size=medium`;
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
      return followStatus;
    }
  };
  React.useLayoutEffect(() => {
    // Set the headerRight component to a TouchableOpacity
    navigation.setOptions({
      headerLeft: () => <CloseButton navigation={navigation} />,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // Handle button press here
            navigation.navigate('UserProfileSetting', {
              userId: userId,
              follow:
                followStatus !== 'loading' ? followStatus : 'loading',
            });
          }}
        >
          <Image
            source={require('../../../../assets/icon/threeDot.png')}
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
            source={require('../../../../assets/icon/threeDot.png')}
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
          console.log('query follow success ' + JSON.stringify(value));
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
        console.log('checking user profile ' + JSON.stringify(value.data));
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
          console.log('query follow success ' + JSON.stringify(value));
          setFollowStatus(value.data.status!);
          setFollowerCount(value.data.followerCount);
          setFollowingCount(value.data.followingCount);
        } else {
          console.log('query follow error ' + JSON.stringify(value));
        }
      });
      UserRepository.getUser(userId, (value) => {
        if (value && !value.loading) {
          setUser(value.data);
          console.log('checking user profile ' + JSON.stringify(value.data));
        } else {
          console.log('user profile query error ' + JSON.stringify(user));
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
        <Image
          source={require('../../../../assets/icon/editPencil-not-filled.png')}
          style={styles.icon}
        />
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>
    );
  };
  const followButton = () => {
    return (
      <TouchableOpacity style={styles.followButton} onPress={onFollowTap}>
        <Image
          source={require('../../../../assets/icon/followPlus.png')}
          style={styles.followIcon}
        />
        <Text style={styles.followText}>Follow</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View>
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
                : require('../../../../assets/icon/Placeholder.png')
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
        {user?.description ? (
          <Text style={{ fontSize: 17, marginBottom: 10 }}>
            {' '}
            {user?.description}
          </Text>
        ) : (
          <View />
        )}
        {console.log('check follow status ' + followStatus)}
        {followStatus === 'none' ? (
          followButton()
        ) : followStatus === undefined ? ( // userID is the current user ID
          editProfileButton()
        ) : (
          <View />
        )}
      </View>
      {/* <View style={styles.loadingIndicator}>
        <LoadingOverlay
          isLoading={showLoadingIndicator}
          loadingText="Loading..."
        />
      </View> */}
    </View>
  );
}
