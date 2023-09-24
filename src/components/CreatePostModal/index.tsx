import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  StyleSheet,
  Platform,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { getAmityUser } from '../../providers/user-provider';
import type { UserInterface } from 'src/types/user.interface';
import { closeIcon } from '../../svg/svg-xml-list';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuth from '../../hooks/useAuth';
interface IModal {
  visible: boolean;
  userId?: string;
  onClose: () => void;
  onSelect: () => void;
}
const CreatePostModal = ({ visible, onClose, userId, onSelect }: IModal) => {
  const { apiRegion } = useAuth();
  const [communities, setCommunities] = useState<Amity.Community[]>([]);
  const [paginateLoading, setPaginateLoading] = useState(false);
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
      setPaginateLoading(true);
      try {
        const unsubscribe = CommunityRepository.getCommunities(
          { membership: 'member' },
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
      } finally {
        setPaginateLoading(false);
      }
    };

    loadCommunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const renderFooter = () => {
    if (!paginateLoading) return null;
    return (
      <View style={styles.LoadingIndicator}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const handleEndReached = useCallback(() => {
    if (
      !isFetchingRef.current &&
      hasNextPageFunc &&
      !onEndReachedCalledDuringMomentumRef.current
    ) {
      isFetchingRef.current = true;
      onEndReachedCalledDuringMomentumRef.current = true;
      onNextPageRef.current && onNextPageRef.current();
    }
  }, [hasNextPageFunc]);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <SvgXml xml={closeIcon} width="17" height="17" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Post To</Text>
          </View>
        </View>
        {renderMyTimeLine()}
        <Text style={styles.myCommunityText}>My Community</Text>
        <FlatList
          data={communities}
          renderItem={renderCommunity}
          keyExtractor={(item) => item.communityId.toString()}
          ListFooterComponent={renderFooter}
          // onEndReached={handleEndReached}
          onEndReached={handleEndReached}
          onMomentumScrollBegin={() =>
            (onEndReachedCalledDuringMomentumRef.current = false)
          }
          onEndReachedThreshold={0.8}
        />
      </View>
    </Modal>
  );
};

export default CreatePostModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 35 : 10, // Adjust for Android status bar
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Adjust for iOS notch
    zIndex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 10,
    bottom: 8,
    zIndex: 1,
    padding: 10,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 17,
    textAlign: 'center',
  },
  communityText: {
    marginLeft: 12,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  myCommunityText: {
    color: '#292B32',
    padding: 16,
    opacity: 0.4,
    fontSize: 17,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  rowContainerMyTimeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    paddingTop: 26,
    paddingHorizontal: 16,
    borderBottomColor: '#EBECEF',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#D9E5FC',
  },
  LoadingIndicator: {
    paddingVertical: 20,
  },
});
