import { ActivityIndicator, View } from 'react-native';
import React, { FC, memo, useCallback, useLayoutEffect, useState } from 'react';
import { useFile, useStory, useStoryPermission } from '../../../hook';
import { useStyles } from './styles';
import { isCommunityModerator } from '../../../../util/permission';
import useAuth from '../../../../hooks/useAuth';
import { ImageSizeState } from '../../../enum';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import { NextOrPrevious } from '../../../component/StoryKit';
import AmityViewStoryItem from './Components/AmityViewStoryItem';

interface IAmityViewStoryPage {
  targetType: Amity.StoryTargetType;
  targetId: string;
  currentPage?: number;
  index?: number;
  onFinish?: (state?: NextOrPrevious, targetId?: string) => void;
  onPressCommunityName?: () => void;
  onPressAvatar?: () => void;
}

interface IStoryData extends Amity.Story {
  finish: number;
}

const AmityViewStoryPage: FC<IAmityViewStoryPage> = ({
  targetId,
  targetType,
  onFinish,
  onPressCommunityName,
  onPressAvatar,
  currentPage,
  index,
}) => {
  const { client } = useAuth();
  const userId = (client as Amity.Client).userId;
  const hasStoryPermission = useStoryPermission(targetId);
  const styles = useStyles();
  const { getStories, stories, loading } = useStory();
  const { getImage } = useFile();
  const [storyData, setStoryData] = useState<IStoryData[]>([]);
  const [current, setCurrent] = useState(0);
  const currentStory = storyData[current];
  const isOwner = currentStory?.creator?.userId === userId;
  const [communityData, setCommunityData] = useState<Amity.Community>(null);
  const [communityAvatar, setCommunityAvatar] = useState<string>(null);
  const [isModerator, setIsModerator] = useState(false);
  const hasStoryImpressionPermission = isModerator || isOwner;

  useLayoutEffect(() => {
    if (targetId && index === currentPage) {
      getStories({
        targetId: targetId,
        targetType: targetType,
        options: { orderBy: 'asc', sortBy: 'createdAt' },
      });
    }
  }, [currentPage, getStories, index, targetId, targetType]);

  useLayoutEffect(() => {
    if (stories) {
      const unSeenStory = stories?.findIndex((story) => !story.isSeen);
      if (unSeenStory > 0) {
        setCurrent(unSeenStory);
      }
      const mappedStory: IStoryData[] = stories.map((story, i) => ({
        ...story,
        finish: i < unSeenStory ? 1 : 0,
      }));
      setStoryData(mappedStory);
    }
  }, [stories]);

  useLayoutEffect(() => {
    if (!targetId || !userId) return;
    (async () => {
      const isMod = await isCommunityModerator({
        userId,
        communityId: targetId,
      });
      setIsModerator(isMod);
    })();
  }, [targetId, userId]);

  useLayoutEffect(() => {
    if (!targetId) return;
    CommunityRepository.getCommunity(
      targetId,
      async ({ error: err, loading: fetching, data }) => {
        if (err) return;
        if (!fetching) {
          setCommunityData(data);
          const avatarUrl = await getImage({
            fileId: data.avatarFileId,
            imageSize: ImageSizeState.small,
          });
          setCommunityAvatar(avatarUrl);
        }
      }
    );
  }, [getImage, targetId]);

  useLayoutEffect(() => {
    if (!storyData?.length) return;
    storyData[current]?.analytics.markAsSeen();
  }, [current, storyData]);

  const close = useCallback(
    (state: NextOrPrevious) => {
      onFinish && onFinish(state, targetId);
    },
    [onFinish, targetId]
  );

  const onClose = useCallback(() => {
    onFinish && onFinish();
  }, [onFinish]);

  if (!targetId) return null;
  if (loading || !currentStory || !communityData || !storyData) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator animating={loading} size="large" color={'white'} />
      </View>
    );
  }

  if (currentPage === index) {
    return (
      <AmityViewStoryItem
        key={storyData[current].storyId}
        communityData={communityData}
        communityAvatar={communityAvatar}
        storyData={storyData}
        hasStoryImpressionPermission={hasStoryImpressionPermission}
        close={close}
        onClose={onClose}
        setCurrent={setCurrent}
        current={current}
        hasStoryPermission={hasStoryPermission}
        onPressAvatar={onPressAvatar}
        onPressCommunityName={onPressCommunityName}
      />
    );
  }
  return null;
};

export default memo(AmityViewStoryPage);
