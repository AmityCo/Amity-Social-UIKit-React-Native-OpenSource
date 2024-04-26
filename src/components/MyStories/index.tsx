import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useStyles } from './styles';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import CommunityStories from '../CommunityStories';

export interface IStoryItems {
  communityId: string;
  avatarFileId: string;
  displayName: string;
  isPublic: boolean;
  isOfficial: boolean;
  hasStories: boolean;
}
export default function MyStories() {
  const styles = useStyles();
  const [communityItems, setCommunityItems] = useState<string[]>([]);

  const queryCommunities = () => {
    const unsubscribe = CommunityRepository.getCommunities(
      { membership: 'member', limit: 10, sortBy: 'firstCreated' },
      ({ data }) => {
        const communityIds: string[] = data.map((item: Amity.Community) => {
          return item.communityId;
        });
        setCommunityItems(communityIds);
      }
    );
    unsubscribe();
  };

  useEffect(() => {
    queryCommunities();
  }, []);

  return (
    <View style={styles.container}>
      {communityItems?.length > 0 &&
        communityItems.map((communityId) => {
          return <CommunityStories communityId={communityId} />;
        })}
    </View>
  );
}
