import {
  CommunityRepository,
  createReport,
} from '@amityco/ts-sdk-react-native';
import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  Platform,
  ActionSheetIOS,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useStyles } from './styles';
import UserItem from '../../components/UserItem';
import type { UserInterface } from '../../types/user.interface';
import AddMembersModal from '../../components/AddMembersModal';
import { updateCommunityMember } from '../../providers/Social/communities-sdk';
import { useFocusEffect } from '@react-navigation/native';

export default function CommunityMemberDetail({ navigation, route }: any) {
  const styles = useStyles();
  const [memberList, setMemberList] = useState<Amity.Member<'community'>[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const { communityId } = route.params;
  const onNextPageRef = useRef<(() => void) | null>(null);
  const isFetchingRef = useRef(false);
  const flatListRef = useRef(null);
  const [addMembersModal, setAddMembersModal] = React.useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setAddMembersModal(true);
          }}
        >
          <Image
            source={require('../../../assets/icon/plus.png')}
            style={styles.dotIcon}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, styles.dotIcon]);

  const onSelectMember = async (users: UserInterface[]) => {
    const memberIds = users.map((user) => user.userId);
    try {
      await updateCommunityMember({ operation: 'ADD', communityId, memberIds });
      const members = CommunityRepository.Membership.getMembers(
        {
          communityId,
        },
        ({ data, loading: fetching }) => {
          !fetching && setMemberList([...data]);
        }
      );
      members();
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = CommunityRepository.Membership.getMembers(
        { communityId, limit: 10 },
        ({ data: members, onNextPage, hasNextPage, loading: fetching }) => {
          setLoading(fetching);
          if (!fetching) {
            setMemberList([...members]);
            const userArray: UserInterface[] = members.map((member) => {
              return {
                userId: member.user.userId,
                displayName: member.user.displayName,
                avatarFileId: member.user.avatarFileId,
              };
            });
            setSelectedUser(userArray);
            setHasNextPage(hasNextPage);
            onNextPageRef.current = onNextPage;
            isFetchingRef.current = false;
          }
        }
      );
      unsubscribe();
    }, [communityId])
  );

  // const handleMemberClick = (categoryId: string, categoryName: string) => {
  //   setTimeout(() => {
  //     navigation.navigate('CommunityList', { categoryId, categoryName });
  //   }, 100);
  // };
  const reportUser = async (userId: string): Promise<boolean> => {
    const didCreatePostReport = await createReport('user', userId);

    return didCreatePostReport;
  };
  const onThreeDotTap = (user: UserInterface) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Report User'],
          cancelButtonIndex: 0,
        },
        () => {
          reportUser(user.userId);
        }
      );
    } else {
      Alert.alert('Report', '', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report user',
          onPress: () => {
            reportUser(user.userId);
          },
        },
      ]);
    }
  };
  const renderMember = ({ item }: { item: Amity.Member<'community'> }) => {
    if ((item as Record<string, any>).user) {
      const userObject: UserInterface = {
        userId: item.userId,
        displayName: (item as Record<string, any>).user.displayName,
        avatarFileId: (item as Record<string, any>).user.avatarFileId,
      };
      return (
        <UserItem
          user={userObject}
          showThreeDot={true}
          onThreeDotTap={onThreeDotTap}
        />
      );
    }
    return null;
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.LoadingIndicator}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const handleLoadMore = () => {
    if (hasNextPage) {
      onNextPageRef.current && onNextPageRef.current();
    }
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={memberList}
        renderItem={renderMember}
        keyExtractor={(item) => item.userId.toString()}
        ListFooterComponent={renderFooter}
        // onEndReached={handleEndReached}
        onEndReachedThreshold={0.8}
        onEndReached={handleLoadMore}
        ref={flatListRef}
      />
      <AddMembersModal
        onSelect={onSelectMember}
        onClose={() => setAddMembersModal(false)}
        visible={addMembersModal}
        initUserList={selectedUser}
      />
    </View>
  );
}
