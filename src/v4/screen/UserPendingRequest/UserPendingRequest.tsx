import { FlatList } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { UserRepository } from '@amityco/ts-sdk-react-native';
import { Client } from '@amityco/ts-sdk-react-native';
import PendingFollowerListItem from './Components/PendingFollowerListItem';

const UserPendingRequest = () => {
  const onNextPageRef = useRef(null);
  const { userId } = Client?.getActiveUser();
  const [pendingFollowers, setPendingFollowers] =
    useState<Amity.FollowStatus[]>(null);
  useEffect(() => {
    const unsub = UserRepository.Relationship.getFollowers(
      { userId: userId, limit: 8, status: 'pending' },
      ({ data, error, loading, onNextPage, hasNextPage }) => {
        if (error) return;
        if (!loading) {
          setPendingFollowers(data);
          onNextPageRef.current = hasNextPage ? onNextPage : null;
        }
      }
    );

    return () => {
      unsub();
    };
  }, [userId]);

  const renderPendingFollowerListItem = ({ item }) => {
    return <PendingFollowerListItem userId={item.from} />;
  };

  if (pendingFollowers?.length === 0) return null;

  return (
    <FlatList
      data={pendingFollowers}
      renderItem={renderPendingFollowerListItem}
      extraData={(item) => item.from}
    />
  );
};

export default UserPendingRequest;
