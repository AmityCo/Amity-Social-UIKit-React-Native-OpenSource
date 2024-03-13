import { StoryRepository } from '@amityco/ts-sdk-react-native';
import { useEffect, useRef, useState } from 'react';

interface IUserStory {
  targetId: string;
  targetType: Amity.StoryTargetType;
}

export const useStory = ({ targetId, targetType }: IUserStory) => {
  const onNextPageRef = useRef<(() => void) | undefined | null>(null);
  const [fetching, setFetching] = useState(true);
  const [stories, setStories] = useState<Amity.Story[]>([]);

  useEffect(() => {
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

    return () => unsubscribe();
  }, [targetId, targetType]);
  return { stories, loading: fetching, onNextPage: onNextPageRef.current };
};
