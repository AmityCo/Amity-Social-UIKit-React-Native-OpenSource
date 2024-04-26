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
  const [fetching, setFetching] = useState(false);
  const [stories, setStories] = useState<Amity.Story[]>([]);
  const [storyTarget, setStoryTarget] = useState<Amity.StoryTarget>(null);

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

  const getStoryTarget = useCallback((param: Amity.StoryTargetQueryParam) => {
    const unsubscribe = StoryRepository.getTargetById(
      param,
      ({ data, error, loading }) => {
        if (error) return;
        setFetching(loading);
        if (!loading) {
          setStoryTarget(data);
          const unsubTopic = getCommunityStoriesTopic({
            targetId: param.targetId,
            targetType: param.targetType as Amity.StoryTargetType,
          });
          subscribeTopic(unsubTopic);
        }
      }
    );
    return () => unsubscribe();
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

    getStoryTarget,
    storyTarget,
  };
};
