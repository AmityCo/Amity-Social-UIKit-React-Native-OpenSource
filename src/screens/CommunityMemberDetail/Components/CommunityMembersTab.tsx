import { ActivityIndicator, FlatList, View } from 'react-native';
import React, { memo, useEffect, useRef, useState } from 'react';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import { UserInterface } from '../../../types/user.interface';
import UserItem from '../../../components/UserItem';
import { useStyles } from '../styles';
import { TabName } from '../../../enum/tabNameState';

interface ICommunityMembersTab {
  activeTab: string;
  communityId: string;
  onThreeDotTap: (user: UserInterface) => void;
  setMember: (user: UserInterface[]) => void;
}

const CommunityMembersTab: React.FC<ICommunityMembersTab> = ({
  activeTab,
  communityId,
  onThreeDotTap,
  setMember,
}) => {
  const [memberList, setMemberList] = useState<Amity.Member<'community'>[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const onNextPageRef = useRef<(() => void) | null>(null);
  const isFetchingRef = useRef(false);
  const flatListRef = useRef(null);
  const styles = useStyles();

  useEffect(() => {
    const option: { communityId: string; limit: number; roles?: string[] } = {
      communityId,
      limit: 10,
    };
    option.roles =
      activeTab === TabName.Moderators ? ['community-moderator'] : undefined;

    const unsubscribeMember = CommunityRepository.Membership.getMembers(
      option,
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
          setMember(userArray);
          setHasNextPage(hasNextPage);
          onNextPageRef.current = onNextPage;
          isFetchingRef.current = false;
        }
      }
    );
    return () => unsubscribeMember();
  }, [communityId, activeTab, setMember]);

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
    <FlatList
      data={memberList}
      renderItem={renderMember}
      keyExtractor={(item) => item.userId.toString()}
      ListFooterComponent={renderFooter}
      onEndReachedThreshold={0.8}
      onEndReached={handleLoadMore}
      ref={flatListRef}
    />
  );
};

export default memo(CommunityMembersTab);
