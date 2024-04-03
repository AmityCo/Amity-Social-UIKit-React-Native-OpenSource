import { StoryRepository } from '@amityco/ts-sdk-react-native';
import { useCallback, useRef, useState } from 'react';

export const useGlobalStory = () => {
  const globalStoryTargetsOnNextPageRef = useRef<
    (() => void) | undefined | null
  >(null);
  const globalStoriesOnNextPageRef = useRef<(() => void) | undefined | null>(
    null
  );
  const [fetching, setFetching] = useState(false);
  const [globalStories, setGlobalStories] = useState<Amity.Story[]>([]);
  const [globalStoryTargets, setGlobalStoryTargets] = useState<
    Amity.StoryTarget[]
  >([]);

  const getGlobalStoryTargets = useCallback(() => {
    const unsubscribe = StoryRepository.getGlobalStoryTargets(
      { limit: 8, seenState: 'smart' as Amity.StorySeenQuery.SMART },
      ({ data, error, loading, hasNextPage, onNextPage }) => {
        if (error) return;
        setFetching(loading);
        if (!loading) {
          setGlobalStoryTargets([...data]);
          globalStoryTargetsOnNextPageRef.current = hasNextPage
            ? onNextPage
            : null;
        }
      }
    );
    return () => unsubscribe();
  }, []);

  const getGlobalStories = useCallback(
    (param: {
      targets: Amity.StoryTargetQueryParam[];
      options?: Amity.StorySortOption;
    }) => {
      const unsubscribe = StoryRepository.getStoriesByTargetIds(
        param,
        ({ data, error, loading, hasNextPage, onNextPage }) => {
          if (error) return;
          if (!loading) {
            setGlobalStories([...data]);
            globalStoriesOnNextPageRef.current = hasNextPage
              ? onNextPage
              : null;
          }
        }
      );
      return () => unsubscribe();
    },
    []
  );
  return {
    loading: fetching,
    getGlobalStoryTargets,
    globalStoryTargets,
    globalStoryTargetsOnNextPage: globalStoryTargetsOnNextPageRef.current,
    getGlobalStories,
    globalStories,
    globalStoriesOnNextPage: globalStoriesOnNextPageRef.current,
  };
};
