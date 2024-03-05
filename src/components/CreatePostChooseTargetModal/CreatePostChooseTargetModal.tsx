import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { getAmityUser } from '../../providers/user-provider';
import type { UserInterface } from '../../types/user.interface';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuth from '../../hooks/useAuth';
import { useStyles } from './styles';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import CloseIcon from '../../svg/CloseIcon';
import { AvatarIcon } from '../../svg/AvatarIcon';
import CommunityIcon from '../../svg/CommunityIcon';
interface IModal {
  visible: boolean;
  userId?: string;
  onClose: () => void;
  onSelect: () => void;
  postType: string;
}
const CreatePostChooseTargetModal = ({
  visible,
  onClose,
  userId,
  onSelect,
  postType,
}: IModal) => {
  const theme = useTheme() as MyMD3Theme;
  const styles = useStyles();
  const { apiRegion } = useAuth();
  const [communities, setCommunities] = useState<Amity.Community[]>([]);
  const [hasNextPageFunc, setHasNextPageFunc] = useState(false);
  const [myUser, setMyUser] = useState<UserInterface>();
  const onNextPageRef = useRef<(() => void) | null>(null);
  const isFetchingRef = useRef(false);
  const onEndReachedCalledDuringMomentumRef = useRef(true);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const getMyUserDetail = useCallback(async () => {
    if (userId) {
      const { userObject } = await getAmityUser(userId);
      let formattedUserObject: UserInterface;

      formattedUserObject = {
        userId: userObject.data.userId,
        displayName: userObject.data.displayName,
        avatarFileId: userObject.data?.avatarFileId,
      };
      setMyUser(formattedUserObject);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      getMyUserDetail();
    }
  }, [getMyUserDetail, userId]);

  useEffect(() => {
    const loadCommunities = async () => {
      try {
        const unsubscribe = CommunityRepository.getCommunities(
          { membership: 'member', limit: 10, sortBy: 'displayName' },
          ({ data: communitiesList, onNextPage, hasNextPage, loading }) => {
            if (!loading) {
              setCommunities((prevCommunities: Amity.Community[]) => [
                ...prevCommunities,
                ...communitiesList,
              ]);
              setHasNextPageFunc(hasNextPage);
              onNextPageRef.current = onNextPage;
              isFetchingRef.current = false;
              unsubscribe();
            }
          }
        );
      } catch (error) {
        console.error('Failed to load communities:', error);
        isFetchingRef.current = false;
      }
    };

    loadCommunities();
  }, []);
  const renderMyTimeLine = () => {
    return (
      <TouchableOpacity
        onPress={() => onSelectFeed(userId as string, 'My Timeline', 'user')}
        style={styles.rowContainerMyTimeLine}
      >
        {myUser?.avatarFileId ?
          <Image
            style={styles.avatar}
            source={
              {
                uri: myUser?.avatarFileId && avatarFileURL(myUser?.avatarFileId),
              }
            }
          /> : <View style={styles.avatar}> <AvatarIcon /></View>
        }

        <Text style={styles.communityText}>My Timeline</Text>
      </TouchableOpacity>
    );
  };
  const onSelectFeed = (
    targetId: string,
    targetName: string,
    targetType: string,
    postSetting?: ValueOf<
      Readonly<{
        ONLY_ADMIN_CAN_POST: 'ONLY_ADMIN_CAN_POST';
        ADMIN_REVIEW_POST_REQUIRED: 'ADMIN_REVIEW_POST_REQUIRED';
        ANYONE_CAN_POST: 'ANYONE_CAN_POST';
      }>
    >,
    needApprovalOnPostCreation?: string
  ) => {
    onSelect && onSelect();
    const targetscreen = () => {
      if (postType === 'post') return 'CreatePost';
      if (postType === 'poll') return 'CreatePoll';
      return null;
    };
    navigation.navigate(targetscreen(), {
      targetId: targetId,
      targetName: targetName,
      targetType: targetType,
      postSetting: postSetting,
      needApprovalOnPostCreation: needApprovalOnPostCreation,
    });
  };

  const avatarFileURL = (fileId: string) => {
    return `https://api.${apiRegion}.amity.co/api/v3/files/${fileId}/download?size=medium`;
  };

  const renderCommunity = ({ item }: { item: Amity.Community }) => {
    return (
      <TouchableOpacity
        key={item.communityId}
        onPress={() =>
          onSelectFeed(
            item.communityId,
            item.displayName,
            'community',
            item.postSetting,
            (item as Record<string, any>).needApprovalOnPostCreation
          )
        }
        style={styles.rowContainer}
      >
        {item?.avatarFileId ?
          <Image
            style={styles.avatar}
            source={
              {
                uri: item?.avatarFileId && avatarFileURL(item?.avatarFileId),
              }

            }
          /> : <View style={styles.avatar}> <CommunityIcon /></View>
        }

        <Text style={styles.communityText}>{item.displayName}</Text>
      </TouchableOpacity>
    );
  };

  const handleEndReached = () => {
    if (
      !isFetchingRef.current &&
      hasNextPageFunc &&
      !onEndReachedCalledDuringMomentumRef.current
    ) {
      isFetchingRef.current = true;
      onEndReachedCalledDuringMomentumRef.current = true;
      onNextPageRef.current && onNextPageRef.current();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onTouchEnd={handleEndReached}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <CloseIcon color={theme.colors.base} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Post To</Text>
          </View>
        </View>
        {renderMyTimeLine()}
        <Text style={styles.myCommunityText}>My Community</Text>

        <ScrollView
          onScroll={({ nativeEvent }) => {
            const yOffset = nativeEvent.contentOffset.y;
            const contentHeight = nativeEvent.contentSize.height;
            const scrollViewHeight = nativeEvent.layoutMeasurement.height;
            const isNearBottom =
              contentHeight - yOffset <= scrollViewHeight * 1.7; // Adjust the multiplier as needed

            if (isNearBottom) {
              handleEndReached();
            }
          }}
          scrollEventThrottle={16} // Adjust as needed
        >
          {communities.map((item) => renderCommunity({ item }))}

          {/* You can add any additional components or content here */}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default memo(CreatePostChooseTargetModal);
