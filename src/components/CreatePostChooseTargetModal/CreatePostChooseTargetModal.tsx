import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  Image,
  FlatList,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { getAmityUser } from '../../providers/user-provider';
import type { UserInterface } from '../../types/user.interface';
import { closeIcon, communityIcon } from '../../svg/svg-xml-list';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuth from '../../hooks/useAuth';
import { useStyles } from './styles';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
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
  const [myUser, setMyUser] = useState<UserInterface>();
  const onNextPageRef = useRef<(() => void) | null>(null);
  const isFetchingRef = useRef(false);
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
          ({ data: communitiesList, onNextPage, loading }) => {
            if (!loading) {
              setCommunities((prevCommunities: Amity.Community[]) => [
                ...prevCommunities,
                ...communitiesList,
              ]);
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
        onPress={() => onSelectFeed(userId as string, 'user')}
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
    targetType?: string,
    community?: Amity.Community
  ) => {
    onSelect && onSelect();
    const targetscreen = () => {
      if (postType === 'post') return 'CreatePost';
      if (postType === 'poll') return 'CreatePoll';
      if (postType === 'livestream') return 'CreateLivestream';
      return null;
    };
    navigation.navigate(targetscreen(), {
      targetId,
      targetType,
      community

    });
  };
  const renderCommunity = ({ item }: { item: Amity.Community }) => {
    return (
      <TouchableOpacity
        key={item.communityId}
        onPress={() =>
          onSelectFeed(
            item.communityId,
            'community',
            item
          )
        }
        style={styles.rowContainer}
      >
        {item.avatarFileId ?
          <Image
            style={styles.avatar}
            source={
              { uri: `https://api.${apiRegion}.amity.co/api/v3/files/${item.avatarFileId}/download` }

            }
          /> : <View style={{ marginRight: 12 }}>
            <SvgXml width={40} height={40} xml={communityIcon} />
          </View>}

        <Text style={styles.communityText}>{item.displayName}</Text>
      </TouchableOpacity>
    );
  };

  const handleEndReached = () => {
    onNextPageRef.current && onNextPageRef.current();
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

        <FlatList
          data={communities}
          keyExtractor={(item) => item.communityId}
          renderItem={renderCommunity}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.7} // Adjust as needed
          ListFooterComponent={() => <View style={{ height: 50 }} />} // Add space
        />
      </View>
    </Modal>
  );
};

export default memo(CreatePostChooseTargetModal);
