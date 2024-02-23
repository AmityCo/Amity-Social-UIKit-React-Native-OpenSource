import {
  ReactionRepository,
  UserRepository,
} from '@amityco/ts-sdk-react-native';
import { useEffect, useState } from 'react';

export const useReaction = ({
  referenceId,
  referenceType,
}: {
  referenceId: string;
  referenceType: Amity.ReactableType;
}) => {
  const [reactions, setReactions] = useState<{
    like: number;
    all: number;
  } | null>(null);
  const [reactors, setReactors] = useState<Amity.User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = ReactionRepository.getReactions(
      { referenceId, referenceType },
      async ({ data: reactorList, error }) => {
        setIsLoading(true);
        if (error) return;
        const reactionCount: {
          [key in 'all' | 'like']: number;
        } = reactorList.reduce(
          (acc, curr) => {
            acc.all++;
            if (curr.reactionName === 'like') {
              acc.like++;
            }
            return acc;
          },
          { all: 0, like: 0 }
        );
        setReactions(reactionCount);
        const userList = reactorList.map((item) => item.userId);
        const { data: users } = await UserRepository.getUserByIds(userList);
        setReactors(users);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, [referenceId, referenceType]);

  return {
    loading: isLoading,
    reactions,
    reactors,
  };
};
