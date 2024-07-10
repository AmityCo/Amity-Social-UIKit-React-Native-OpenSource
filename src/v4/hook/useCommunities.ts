import { useEffect, useState } from 'react';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';

export const useCommunities = () => {
  const [communities, setCommunities] = useState<Amity.Community[]>();
  const [onNextCommunityPage, setOnNextCommunityPage] =
    useState<() => void | null>(null);
  useEffect(() => {
    const unsubscribe = CommunityRepository.getCommunities(
      { membership: 'member', limit: 20 },
      ({ error, loading, data, hasNextPage, onNextPage }) => {
        if (error) return;
        if (!loading) {
          setCommunities(data);
          setOnNextCommunityPage(() => {
            if (hasNextPage) return onNextPage;
            return null;
          });
        }
      }
    );
    return unsubscribe;
  }, []);
  return { communities, onNextCommunityPage };
};
