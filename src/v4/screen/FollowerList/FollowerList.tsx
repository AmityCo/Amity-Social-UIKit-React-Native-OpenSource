import { FlatList, View } from 'react-native';
import React, { FC, memo, useEffect, useRef, useState } from 'react';
import { useStyles } from './styles';
import { UserRepository } from '@amityco/ts-sdk-react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../routes/RouteParamList';
import CustomTab from '../../../components/CustomTab';
import { TabName } from '../../enum';
import FollowerListItem from './Components/FollowerListItem';

type FollowerListType = {
  route: RouteProp<RootStackParamList, 'FollowerList'>;
};

const FollowerList: FC<FollowerListType> = ({ route }) => {
  const styles = useStyles();
  const { userId } = route.params;
  const onNextFollowerPageRef = useRef(null);
  const onNextFollowingPageRef = useRef(null);
  const [activeTab, setActiveTab] = useState<TabName>(TabName.Following);
  const [followers, setFollowers] = useState<Amity.FollowStatus[]>(null);
  const [following, setFollowing] = useState<Amity.FollowStatus[]>(null);
  const [followStatus, setFollowStatus] = useState<Amity.FollowStatus[]>(null);
  useEffect(() => {
    const unsubFollower = UserRepository.Relationship.getFollowers(
      { userId: userId, limit: 8, status: 'accepted' },
      ({ data, error, loading, onNextPage, hasNextPage }) => {
        if (error) return;
        if (!loading) {
          setFollowers(data);
          onNextFollowerPageRef.current = hasNextPage ? onNextPage : null;
        }
      }
    );

    const unsubFollowing = UserRepository.Relationship.getFollowings(
      { userId: userId, limit: 8, status: 'all' },
      ({ data, error, loading, onNextPage, hasNextPage }) => {
        if (error) return;
        if (!loading) {
          setFollowing(data);
          onNextFollowingPageRef.current = hasNextPage ? onNextPage : null;
        }
      }
    );
    return () => {
      unsubFollowing();
      unsubFollower();
    };
  }, [userId]);

  useEffect(() => {
    if (activeTab === TabName.Following) return setFollowStatus(following);
    return setFollowStatus(followers);
  }, [activeTab, followers, following]);

  const renderFollowStatus = ({ item }: { item: Amity.FollowStatus }) => {
    const userID = activeTab === TabName.Following ? item.to : item.from;
    return (
      <FollowerListItem
        userId={userID}
        currentProfileId={userId}
        activeTab={activeTab}
      />
    );
  };

  return (
    <View style={styles.container}>
      <CustomTab
        tabName={[TabName.Following, TabName.Followers]}
        onTabChange={setActiveTab}
      />
      <FlatList
        data={followStatus}
        renderItem={renderFollowStatus}
        keyExtractor={(item) =>
          activeTab === TabName.Following ? item.to : item.from
        }
      />
    </View>
  );
};

export default memo(FollowerList);
