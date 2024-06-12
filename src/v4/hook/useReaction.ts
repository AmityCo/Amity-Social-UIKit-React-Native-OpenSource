import { ReactionRepository } from '@amityco/ts-sdk-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
export const useReaction = ({
  referenceId,
  referenceType,
}: {
  referenceId: string;
  referenceType: Amity.ReactableType;
}) => {
  const [allReactionList, setAllReactionList] = useState<Amity.Reactor[]>(null);
  const [likeReactionList, setLikeReactionList] =
    useState<Amity.Reactor[]>(null);
  const [loveReactionList, setLoveReactionList] =
    useState<Amity.Reactor[]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (!referenceId) return () => {};
      const unsubscribe = ReactionRepository.getReactions(
        { referenceId, referenceType },
        async ({ loading, error, data: reactorList }) => {
          setIsLoading(loading);
          if (error) {
            return setHasError(error);
          }
          if (!loading) {
            setAllReactionList(reactorList);
            const likeReactions = reactorList.filter(
              (reactor) => reactor.reactionName === 'like'
            );
            const loveReactions = reactorList.filter(
              (reactor) => reactor.reactionName === 'love'
            );
            setLoveReactionList(loveReactions);
            setLikeReactionList(likeReactions);
          }
        }
      );
      return () => {
        unsubscribe();
        setAllReactionList(null);
        setLikeReactionList(null);
      };
    }, [referenceId, referenceType])
  );

  return {
    loading: isLoading,
    allReactionList,
    likeReactionList,
    loveReactionList,
    hasError,
  };
};
