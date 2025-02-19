import { FlatList, SafeAreaView } from 'react-native';
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useStyles } from './styles';
import { UserRepository } from '@amityco/ts-sdk-react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../routes/RouteParamList';
import CustomTab from '../../components/CustomTab';
import { TabName } from '../../enum/tabNameState';
import FollowerListItem from './Components/FollowerListItem';

type FollowerListType = {
  route: RouteProp<RootStackParamList, 'FollowerList'>;
};

type followStatus = Amity.FollowStatus & { userId: string };
const FollowerList: FC<FollowerListType> = ({ route }) => {
  const styles = useStyles();
  const { userId } = route.params;
  const onNextFollowerPageRef = useRef(null);
  const onNextFollowingPageRef = useRef(null);
  const [activeTab, setActiveTab] = useState<TabName>(TabName.Following);
  const [followStatus, setFollowStatus] = useState<followStatus[]>(null);
  const [follower, setFollower] = useState<followStatus[]>(null);
  const [following, setFollowing] = useState<followStatus[]>(null);
  const formatFollowInfo = useCallback(
    (follows?: Amity.FollowStatus[], type?: TabName): followStatus[] => {
      return follows.map((item: Amity.FollowStatus): followStatus => {
        return {
          ...item,
          userId: type === TabName.Following ? item.to : item.from,
        };
      });
    },
    []
  );

  useEffect(() => {
    const unsubFollower = UserRepository.Relationship.getFollowers(
      { userId: userId, limit: 20, status: 'accepted' },
      ({ data, error, loading, onNextPage, hasNextPage }) => {
        if (error) return;
        if (!loading) {
          const followInfo = formatFollowInfo(data, TabName.Followers);
          setFollower(followInfo);
          onNextFollowerPageRef.current = hasNextPage ? onNextPage : null;
        }
      }
    );

    const unsubFollowing = UserRepository.Relationship.getFollowings(
      { userId: userId, limit: 20, status: 'accepted' },
      ({ data, error, loading, onNextPage, hasNextPage }) => {
        if (error) return;
        if (!loading) {
          const followInfo = formatFollowInfo(data, TabName.Following);
          setFollowing(followInfo);
          onNextFollowingPageRef.current = hasNextPage ? onNextPage : null;
        }
      }
    );
    return () => {
      unsubFollowing();
      unsubFollower();
    };
  }, [formatFollowInfo, userId]);

  useEffect(() => {
    if (activeTab === TabName.Followers) return setFollowStatus(follower);
    return setFollowStatus(following);
  }, [activeTab, follower, following]);

  const renderFollowStatus = ({ item }: { item: followStatus }) => {
    return (
      <FollowerListItem
        userId={item.userId}
        currentProfileId={userId}
        activeTab={activeTab}
      />
    );
  };

  const onEndReach = useCallback(() => {
    if (activeTab === TabName.Followers && onNextFollowerPageRef?.current)
      return onNextFollowerPageRef?.current();
    if (activeTab === TabName.Following && onNextFollowingPageRef?.current)
      return onNextFollowingPageRef?.current();
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.container}>
      <CustomTab
        tabName={[TabName.Following, TabName.Followers]}
        onTabChange={setActiveTab}
      />
      <FlatList
        onEndReached={onEndReach}
        data={followStatus}
        renderItem={renderFollowStatus}
        keyExtractor={(item) => item.userId}
      />
    </SafeAreaView>
  );
};

export default memo(FollowerList);
