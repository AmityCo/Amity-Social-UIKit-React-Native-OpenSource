import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useStyles } from './styles';
import { useGlobalStory } from '../../hook/useGlobalStory';
import ContentLoader, { Circle } from 'react-content-loader/native';
import AmityStory, { IUserStory } from '../StoryKit';
import { useFile } from '../../hook/useFile';
import { ImageSizeState } from '../../enum/imageSizeState';

export interface IStoryItems {
  communityId: string;
  avatarFileId: string;
  displayName: string;
  isPublic: boolean;
  isOfficial: boolean;
  hasStories: boolean;
}

export default function MyStories() {
  const styles = useStyles();
  const { getImage } = useFile();
  const [globalStoriesItems, setGlobalStoriesItems] = useState<
    IUserStory<Record<string, any>>[]
  >([]);
  const {
    getGlobalStoryTargets,
    globalStoryTargets,
    getGlobalStories,
    globalStories,
    loading,
  } = useGlobalStory();

  useEffect(() => {
    getGlobalStoryTargets();
  }, [getGlobalStoryTargets]);

  useEffect(() => {
    const globalStoryTargetIds = globalStoryTargets.filter((target) => {
      if (target.targetType === 'community') return target.targetId;
      return null;
    });
    getGlobalStories({
      targets: globalStoryTargetIds,
      options: { sortBy: 'createdAt', orderBy: 'desc' },
    });
  }, [getGlobalStories, globalStoryTargets]);

  const formatStory = useCallback(
    async (categorizedStory: Amity.Story | Object) => {
      const mappedGlobalStories: IUserStory<Record<string, any>>[] =
        await Promise.all(
          Object.entries(categorizedStory).map(async ([communityId, items]) => {
            const { community } = items[0];
            const avatarFileId = community.avatarFileId;
            const displayName = community.displayName;
            const isSeen = items.every((item) => item.isSeen);

            const storyData = await Promise.all(
              items.map((item, index: number) => {
                return {
                  story_id: item.storyId,
                  story_image: item?.imageData?.fileUrl,
                  swipeText: '',
                  story_type: item.dataType,
                  story_video: item?.videoData?.fileUrl,
                  story_page: index,
                  creatorName: item?.creator?.displayName ?? '',
                  createdAt: item.createdAt,
                  items: item.items,
                  reactionCounts: item.reactionsCount,
                  comments: item.comments,
                  viewer: item.impression,
                  myReactions: item.myReactions,
                  markAsSeen: item.analytics.markAsSeen,
                  markLinkAsClicked: item.analytics.markLinkAsClicked,
                };
              })
            );

            return {
              user_id: communityId,
              user_image: await getImage({
                fileId: avatarFileId,
                imageSize: ImageSizeState.small,
              }),
              user_name: displayName,
              stories: storyData,
              isOfficial: community.isOfficial,
              isPublic: community.isPublic,
              seen: isSeen,
            };
          })
        );
      setGlobalStoriesItems([...mappedGlobalStories]);
    },
    [getImage]
  );

  useEffect(() => {
    const groupedByCommunity: Amity.Story | Object = globalStories.reduce(
      (acc, item) => {
        const { community } = item;
        const communityId = community.communityId;
        if (!acc[communityId]) {
          acc[communityId] = [];
        }
        acc[communityId].push(item);
        return acc;
      },
      {}
    );
    formatStory(groupedByCommunity);
  }, [formatStory, globalStories]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ContentLoader
          height={70}
          speed={1}
          width={100}
          backgroundColor={'#d2d2d2'}
          foregroundColor={'#eee'}
          viewBox="-10 7 100 30"
        >
          <Circle cx="25" cy="25" r="25" />
        </ContentLoader>
      </View>
    );
  }
  if (globalStoriesItems?.length > 0) {
    return (
      <View style={styles.container}>
        <AmityStory
          data={globalStoriesItems}
          duration={7}
          onStorySeen={({ story }) => story.markAsSeen()}
        />
      </View>
    );
  }
  return null;
}
