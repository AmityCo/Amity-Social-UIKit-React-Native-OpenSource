import { UserRepository } from '@amityco/ts-sdk-react-native';
import { useEffect, useState } from 'react';

export const useUser = (userId: string) => {
  const [user, setUser] = useState<Amity.User>(null);
  useEffect(() => {
    if (!userId) return;
    UserRepository.getUser(userId, ({ data, loading, error }) => {
      if (error) return undefined;
      if (!loading) {
        setUser(data);
      }
    });
  }, [userId]);
  return user;
};
