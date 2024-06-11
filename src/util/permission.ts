import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import { MemberRoles } from './constants';

const ADMIN = 'global-admin';
const { COMMUNITY_MODERATOR, CHANNEL_MODERATOR, MODERATOR, SUPER_MODERATOR } =
  MemberRoles;

export const isModerator = (userRoles?: string[]) => {
  if (!userRoles?.length) {
    return false;
  }

  const roles: string[] = [
    COMMUNITY_MODERATOR,
    CHANNEL_MODERATOR,
    MODERATOR,
    SUPER_MODERATOR,
  ];
  return userRoles.some((role) => roles.includes(role));
};

export const isAdmin = (userRoles?: string[]) => {
  if (!userRoles?.length) {
    return false;
  }

  return userRoles.includes(ADMIN);
};

export const isCommunityModerator = async ({
  userId,
  communityId,
}: {
  userId: string;
  communityId: string;
}) => {
  if (!userId || !communityId) return false;
  try {
    const {
      error,
      loading,
      data,
    }: Amity.LiveCollection<Amity.Membership<'community'>> = await new Promise(
      (resolve) => {
        CommunityRepository.Membership.getMembers(
          {
            communityId: communityId,
            search: userId,
            limit: 1,
            sortBy: 'firstCreated',
            memberships: ['member'],
          },
          (result) => resolve(result)
        );
      }
    );
    if (error || loading || !data) return false;
    const userRoles = data[0]?.roles ?? [];
    return isModerator(userRoles);
  } catch (error) {
    console.error('Error checking community moderator:', error);
    return false;
  }
};
