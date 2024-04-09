import { useMemo } from 'react';
import { Permissions } from '../../constants';
import useAuth from '../../hooks/useAuth';

export const useStoryPermission = (targetId: string) => {
  const { client } = useAuth();
  const hasStoryPermission = useMemo(() => {
    const hasPermission = !!(client as Amity.Client)
      ?.hasPermission(Permissions.ManageStoryPermission)
      .community(targetId);
    return hasPermission;
  }, [client, targetId]);
  return hasStoryPermission;
};
