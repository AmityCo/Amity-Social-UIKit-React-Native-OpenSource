import {
  Alert,
  Animated,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useStyles } from '../styles';
import {
  Client,
  UserRepository,
  createReport,
  deleteReport,
  isReportedByMe,
} from '@amityco/ts-sdk-react-native';
import { ImageSizeState } from '../../../enum';
import { TabName } from '../../../enum/tabNameState';
import { defaultAvatarUri } from '../../../assets';
import { useFile } from '../../../hook';
import { SvgXml } from 'react-native-svg';
import { threeDots } from '../../../../svg/svg-xml-list';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '~/providers/amity-ui-kit-provider';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../routes/RouteParamList';

type FollowerListItemType = {
  userId: string;
  currentProfileId: string;
  activeTab: TabName;
};

const FollowerListItem: FC<FollowerListItemType> = ({
  userId,
  currentProfileId,
  activeTab,
}) => {
  const { getImage } = useFile();
  const { userId: myId } = Client.getActiveUser();
  const isMyProfile = currentProfileId === myId;
  const isMyId = userId === myId;
  const isFollowing = activeTab === TabName.Following;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const theme = useTheme() as MyMD3Theme;
  const styles = useStyles();
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const [userData, setUserData] = useState<Amity.User>(null);
  const [avatar, setAvatar] = useState(defaultAvatarUri);
  const [isVisible, setIsVisible] = useState(false);
  const [isReported, setIsReported] = useState(false);

  useEffect(() => {
    UserRepository.getUser(userId, async ({ data, error, loading }) => {
      if (error) return;
      if (!loading) {
        setUserData(data);
        const userAvatar = await getImage({
          fileId: data.avatarFileId,
          imageSize: ImageSizeState.small,
        });
        setAvatar(userAvatar ?? defaultAvatarUri);
      }
    });
  }, [getImage, userId]);

  const onPressUserInfo = useCallback(() => {
    navigation.push('UserProfile', { userId: userId });
  }, [navigation, userId]);

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

  const checkIsReport = useCallback(async () => {
    const isReport = await isReportedByMe('user', userId);
    if (isReport) return setIsReported(true);
    return setIsReported(false);
  }, [userId]);

  useEffect(() => {
    checkIsReport();
  }, [checkIsReport]);

  const onPressReport = useCallback(async () => {
    try {
      if (isReported) {
        const reported = await createReport('user', userId);
        if (reported) return Alert.alert('User is reported');
      } else {
        const unreported = await deleteReport('user', userId);
        if (unreported) return Alert.alert('Report is undone');
      }
    } catch (error) {
      Alert.alert('Error on report action');
    }
  }, [isReported, userId]);

  const onPressRemove = useCallback(async () => {
    try {
      const deletedFollower =
        await UserRepository.Relationship.declineMyFollower(userId);
      if (deletedFollower) return Alert.alert('Follower is Removed');
    } catch (error) {
      Alert.alert('Error on removing follower');
    }
  }, [userId]);

  const onPressUnfollow = useCallback(async () => {
    try {
      const unfollowed = await UserRepository.Relationship.unfollow(userId);
      if (unfollowed) return Alert.alert('User is unfollowed');
    } catch (error) {
      Alert.alert('Error on unfollow');
    }
  }, [userId]);

  return (
    <View style={styles.listItemContainer}>
      <TouchableOpacity
        style={styles.userInfoContainer}
        onPress={onPressUserInfo}
      >
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={styles.userName} ellipsizeMode="tail" numberOfLines={1}>
          {userData?.displayName}
        </Text>
      </TouchableOpacity>

      {!isMyId && (
        <TouchableOpacity onPress={openModal} style={styles.menuBtn}>
          <SvgXml xml={threeDots(theme.colors.base)} width="20" height="16" />
        </TouchableOpacity>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeModal}
      >
        <Pressable onPress={closeModal} style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, modalStyle]}>
            <Text style={styles.report} onPress={onPressReport}>
              {isReported ? 'Report user' : 'Undo Report'}
            </Text>
            {isMyProfile && !isFollowing && (
              <Text style={styles.remove} onPress={onPressRemove}>
                Remove user
              </Text>
            )}
            {isMyProfile && isFollowing && (
              <Text style={styles.remove} onPress={onPressUnfollow}>
                Unfollow user
              </Text>
            )}
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default memo(FollowerListItem);
