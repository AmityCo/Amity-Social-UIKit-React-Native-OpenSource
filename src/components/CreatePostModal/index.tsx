import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { getAmityUser } from '../../providers/user-provider';
import type { UserInterface } from 'src/types/user.interface';
import { closeIcon } from '../../svg/svg-xml-list';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuth from '../../hooks/useAuth';
import { getStyles } from './styles';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
interface IModal {
  visible: boolean;
  userId?: string;
  onClose: () => void;
  onSelect: () => void;
}
const CreatePostModal = ({ visible, onClose, userId, onSelect }: IModal) => {
  const theme = useTheme() as MyMD3Theme;
  const styles = getStyles();
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
        avatarFileId: userObject.data.avatarFileId,
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
        <Image
          style={styles.avatar}
          source={
            myUser
              ? {
                  uri: `https://api.${apiRegion}.amity.co/api/v3/files/${myUser.avatarFileId}/download`,
                }
              : require('./../../../assets/icon/Placeholder.png')
          }
        />
        <Text style={styles.communityText}>My Timeline</Text>
      </TouchableOpacity>
    );
  };
  const onSelectFeed = (
    targetId: string,
    targetName: string,
    targetType: string
  ) => {
    onSelect && onSelect();
    navigation.navigate('CreatePost', {
      targetId: targetId,
      targetName: targetName,
      targetType: targetType,
    });
  };
  const renderCommunity = ({ item }: { item: Amity.Community }) => {
    return (
      <TouchableOpacity
        key={item.communityId}
        onPress={() =>
          onSelectFeed(item.communityId, item.displayName, 'community')
        }
        style={styles.rowContainer}
      >
        <Image
          style={styles.avatar}
          source={
            item.avatarFileId
              ? {
                  uri: `https://api.${apiRegion}.amity.co/api/v3/files/${item.avatarFileId}/download`,
                }
              : require('./../../../assets/icon/Placeholder.png')
          }
        />
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
            <SvgXml xml={closeIcon(theme.colors.base)} width="17" height="17" />
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

export default CreatePostModal;
