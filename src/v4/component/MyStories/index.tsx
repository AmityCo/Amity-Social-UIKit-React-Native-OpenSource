import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useStyles } from './styles';
import { useGlobalStory } from '../../hook/useGlobalStory';
import ContentLoader, { Circle } from 'react-content-loader/native';
import AmityStory, { IUserStory } from '../StoryKit';
import { useFile } from '../../hook/useFile';
import useAuth from '../../../hooks/useAuth';
import { ImageSizeState } from '../../enum/imageSizeState';
import { isCommunityModerator } from '../../../util/permission';

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
  const { client } = useAuth();
  const userId = (client as Amity.Client).userId;
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
      options: { sortBy: 'createdAt', orderBy: 'asc' },
    });
  }, [getGlobalStories, globalStoryTargets]);

  const formatStory = useCallback(
    async (categorizedStory: Amity.Story | Object) => {
      const mappedGlobalStories: IUserStory<Record<string, any>>[] =
        await Promise.all(
          Object.entries(categorizedStory).map(
            async ([communityId, items], index: number) => {
              const { community } = items[0];
              const avatarFileId = community.avatarFileId;
              const displayName = community.displayName;
              const isSeen = items.every((item) => item.isSeen);
              const isModerator = await isCommunityModerator({
                userId,
                communityId,
              });

              const storyData = await Promise.all(
                items.map((item) => {
                  const isOwner = item.creator.userId === userId;
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
                    commentsCounts: item.commentsCount,
                    viewer: item.reach,
                    myReactions: item.myReactions,
                    markAsSeen: item.analytics.markAsSeen,
                    markLinkAsClicked: item.analytics.markLinkAsClicked,
                    isOwner: isOwner,
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
                isModerator: isModerator,
              };
            }
          )
        );
      setGlobalStoriesItems([...mappedGlobalStories]);
    },
    [getImage, userId]
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
        {Array.from({ length: 6 }, (_, index) => {
          return (
            <View style={{ padding: 10 }} key={index}>
              <ContentLoader
                height={70}
                speed={1}
                width={70}
                backgroundColor={'#d2d2d2'}
                foregroundColor={'#eee'}
                viewBox="0 0 50 50"
              >
                <Circle cx="25" cy="25" r="25" />
              </ContentLoader>
            </View>
          );
        })}
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
