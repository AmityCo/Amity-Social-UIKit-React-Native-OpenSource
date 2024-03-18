import {
  ReactionRepository,
  StoryRepository,
} from '@amityco/ts-sdk-react-native';
import { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';

interface IUserStory {
  targetId: string;
  targetType: Amity.StoryTargetType;
}

export const useStory = () => {
  const onNextPageRef = useRef<(() => void) | undefined | null>(null);
  const [fetching, setFetching] = useState(true);
  const [stories, setStories] = useState<Amity.Story[]>([]);

  const getStories = useCallback(({ targetId, targetType }: IUserStory) => {
    const unsubscribe = StoryRepository.getActiveStoriesByTarget(
      {
        targetId,
        targetType,
      },
      ({ data, error, loading, hasNextPage, onNextPage }) => {
        if (error) return;
        setFetching(loading);
        if (!loading) {
          setStories(data);
          onNextPageRef.current = hasNextPage ? onNextPage : null;
        }
      }
    );
    return unsubscribe();
  }, []);

  const handleReaction = useCallback(
    async ({
      targetId,
      reactionName,
      isLiked,
    }: {
      targetId: string;
      reactionName: string;
      isLiked: boolean;
    }) => {
      try {
        if (isLiked) {
          await ReactionRepository.removeReaction(
            'story',
            targetId,
            reactionName
          );
        } else {
          await ReactionRepository.addReaction('story', targetId, reactionName);
        }
      } catch (error) {
        Alert.alert('Error on reaction', error);
      }
    },
    []
  );

  return {
    handleReaction,
    getStories,
    stories,
    loading: fetching,
    onNextPage: onNextPageRef.current,
  };
};
