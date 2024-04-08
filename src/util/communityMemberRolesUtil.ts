import { MemberRoles } from '~/constants';

const ADMIN = 'global-admin';
const {
  COMMUNITY_MODERATOR,
  CHANNEL_MODERATOR,
  MODERATOR,
  SUPER_MODERATOR,
  MEMBER,
} = MemberRoles;

export const isMember = (userRoles?: string[]) => {
  if (!userRoles?.length) {
    return false;
  }
  return userRoles.includes(MEMBER);
};

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
