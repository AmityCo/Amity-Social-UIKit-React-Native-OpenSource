import { useEffect, useState } from 'react';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';

export const useCommunity = (communityId: Amity.Community['communityId']) => {
  const [community, setCommunity] = useState<Amity.Community>();

  useEffect(() => {
    const unsubscribe = CommunityRepository.getCommunity(
      communityId,
      ({ error, loading, data }) => {
        if (error) return;
        if (!loading) {
          setCommunity(data);
        }
      }
    );
    unsubscribe();
  }, [communityId]);
  return { community };
};
