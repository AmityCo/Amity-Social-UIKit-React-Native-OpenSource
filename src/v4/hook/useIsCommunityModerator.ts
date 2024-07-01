import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import { isModerator } from '../../util/permission';
import { useEffect, useState } from 'react';

export const useIsCommunityModerator = ({
  userId,
  communityId,
}: {
  userId: string;
  communityId: string;
}) => {
  const [isCommunityModerator, setisCommunityModerator] = useState(false);
  useEffect(() => {
    if (!userId || !communityId) return setisCommunityModerator(false);
    const unsub = CommunityRepository.Membership.searchMembers(
      {
        communityId: communityId,
        search: userId,
        limit: 1,
        sortBy: 'firstCreated',
        memberships: ['member'],
      },
      ({ error, loading, data }) => {
        if (error) return setisCommunityModerator(false);
        if (!loading) {
          const userRoles = data[0]?.roles ?? [];
          return setisCommunityModerator(() => isModerator(userRoles));
        }
        return setisCommunityModerator(false);
      }
    );
    return () => unsub();
  }, [communityId, isCommunityModerator, userId]);
  return { isCommunityModerator: isCommunityModerator };
};
