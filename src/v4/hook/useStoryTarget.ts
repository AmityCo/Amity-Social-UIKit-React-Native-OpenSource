import {
  StoryRepository,
  getCommunityStoriesTopic,
  subscribeTopic,
} from '@amityco/ts-sdk-react-native';
import { useEffect, useState } from 'react';

export const useStoryTarget = (param: Amity.StoryTargetQueryParam) => {
  const [storyTarget, setStoryTarget] = useState<Amity.StoryTarget>(null);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
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
  }, [param]);

  return { storyTarget, loading: fetching };
};
