import { useMemo } from 'react';
import { Permissions } from '../../constants';
import useAuth from '../../hooks/useAuth';

export const useStoryPermission = (targetId: string) => {
  const { client } = useAuth();
  const hasStoryPermission = useMemo(() => {
    const userPermission = !!(client as Amity.Client)
      .hasPermission(Permissions.ManageStoryPermission)
      .currentUser();
    if (userPermission) return true;
    const communityPermission = !!(client as Amity.Client)
      ?.hasPermission(Permissions.ManageStoryPermission)
      .community(targetId);
    return communityPermission;
  }, [client, targetId]);
  return hasStoryPermission;
};
