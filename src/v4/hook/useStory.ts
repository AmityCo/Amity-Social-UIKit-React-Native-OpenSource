import {
  ReactionRepository,
  StoryRepository,
  getCommunityStoriesTopic,
  subscribeTopic,
} from '@amityco/ts-sdk-react-native';
import { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';

export const useStory = () => {
  const onNextPageRef = useRef<(() => void) | undefined | null>(null);
  const globalStoryTargetsOnNextPageRef = useRef<
    (() => void) | undefined | null
  >(null);
  const globalStoriesOnNextPageRef = useRef<(() => void) | undefined | null>(
    null
  );
  const [fetching, setFetching] = useState(false);
  const [stories, setStories] = useState<Amity.Story[]>([]);
  const [globalStories, setGlobalStories] = useState<Amity.Story[]>([]);
  const [globalStoryTargets, setGlobalStoryTargets] = useState<
    Amity.StoryTarget[]
  >([]);

  const getStories = useCallback((param: Amity.GetStoriesByTargetParam) => {
    const unsubscribe = StoryRepository.getActiveStoriesByTarget(
      param,
      ({ data, error, loading, hasNextPage, onNextPage }) => {
        if (error) return;
        setFetching(loading);
        if (!loading) {
          setStories(data);
          const unsubTopic = getCommunityStoriesTopic({
            targetId: param.targetId,
            targetType: param.targetType as Amity.StoryTargetType,
          });
          subscribeTopic(unsubTopic);
          onNextPageRef.current = hasNextPage ? onNextPage : null;
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const getGlobalStoryTargets = useCallback(() => {
    const unsubscribe = StoryRepository.getGlobalStoryTargets(
      { limit: 8, seenState: 'all' as Amity.StorySeenQuery },
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
        Alert.alert('Error on reaction', error.message);
      }
    },
    []
  );

  return {
    handleReaction,
    loading: fetching,

    getStories,
    stories,
    onNextPage: onNextPageRef.current,

    getGlobalStoryTargets,
    globalStoryTargets,
    globalStoryTargetsOnNextPage: globalStoryTargetsOnNextPageRef.current,

    getGlobalStories,
    globalStories,
    globalStoriesOnNextPage: globalStoriesOnNextPageRef.current,
  };
};
