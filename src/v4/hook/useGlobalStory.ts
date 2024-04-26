import { StoryRepository } from '@amityco/ts-sdk-react-native';
import { useCallback, useRef, useState } from 'react';

export const useGlobalStory = () => {
  const globalStoriesOnNextPageRef = useRef<(() => void) | undefined | null>(
    null
  );
  const [fetching, setFetching] = useState(false);
  const [globalStoryTargetsOnNextPage, setGlobalStoryTargetsOnNextPage] =
    useState<(() => void) | null>(null);
  const [globalStories, setGlobalStories] = useState<Amity.Story[]>([]);
  const [globalStoryTargets, setGlobalStoryTargets] = useState<
    Amity.StoryTarget[]
  >([]);

  const getGlobalStoryTargets = useCallback(() => {
    const unsubscribe = StoryRepository.getGlobalStoryTargets(
      { limit: 20, seenState: 'smart' as Amity.StorySeenQuery.SMART },
      ({ data, error, loading, hasNextPage, onNextPage }) => {
        if (error) return;
        setFetching(loading);
        if (!loading) {
          setGlobalStoryTargets([...data]);
          setGlobalStoryTargetsOnNextPage(() =>
            hasNextPage ? onNextPage : null
          );
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
    globalStoryTargetsOnNextPage,
    getGlobalStories,
    globalStories,
    globalStoriesOnNextPage: globalStoriesOnNextPageRef.current,
  };
};
