import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import React, { memo, useCallback, useRef, useState } from 'react';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import { UserInterface } from '../../../types/user.interface';
import UserItem from '../../../components/UserItem';
import { useStyles } from '../styles';
import { TabName } from '../../../enum/tabNameState';
import { useFocusEffect } from '@react-navigation/native';

interface ICommunityMembersTab {
  activeTab: string;
  communityId: string;
  onThreeDotTap: (user: UserInterface) => void;
  setMember: (user: UserInterface[]) => void;
  shouldRefresh: boolean;
}

const CommunityMembersTab: React.FC<ICommunityMembersTab> = ({
  activeTab,
  communityId,
  onThreeDotTap,
  setMember,
  shouldRefresh,
}) => {
  const [memberList, setMemberList] = useState<Amity.Membership<'community'>[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const onNextPageRef = useRef<(() => void) | null>(null);
  const flatListRef = useRef(null);
  const styles = useStyles();
  const members = memberList.filter((member) => {
    if (member.communityMembership === 'none') return null;
    if (activeTab === TabName.Moderators) {
      return member.roles.includes('community-moderator');
    }
    return member;
  });
  const getCommunityMemberList = useCallback(() => {
    setRefreshing(true);
    setMemberList([]);
    const option: { communityId: string; limit: number; roles?: string[] } = {
      communityId,
      limit: 10,
    };

    CommunityRepository.Membership.getMembers(
      option,
      ({ data, onNextPage, hasNextPage, loading: fetching, error }) => {
        setLoading(fetching);
        if (error) return setRefreshing(false);
        if (!fetching) {
          setMemberList([...data]);
          const userArray: UserInterface[] = data.map((member) => {
            return {
              userId: member.user.userId,
              displayName: member.user.displayName,
              avatarFileId: member.user.avatarFileId,
            };
          });
          setMember(userArray);
          onNextPageRef.current = hasNextPage ? onNextPage : null;
          setRefreshing(false);
        }
      }
    );
  }, [communityId, setMember]);

  useFocusEffect(
    useCallback(() => {
      shouldRefresh && getCommunityMemberList();
    }, [getCommunityMemberList, shouldRefresh])
  );

  const renderMember = ({ item }: { item: Amity.Membership<'community'> }) => {
    if ((item as Record<string, any>).user) {
      const isOwner = item.roles.includes('channel-moderator');
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
          hideMenu={isOwner}
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
    onNextPageRef?.current && onNextPageRef.current();
  };

  const onRefresh = () => {
    getCommunityMemberList();
  };

  if (members) {
    return (
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['lightblue']}
            tintColor="lightblue"
          />
        }
        data={members}
        renderItem={renderMember}
        keyExtractor={(item) => item.userId.toString()}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.8}
        onEndReached={handleLoadMore}
        ref={flatListRef}
      />
    );
  }
  return null;
};

export default memo(CommunityMembersTab);
