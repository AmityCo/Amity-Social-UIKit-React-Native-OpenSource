import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useStyles } from './styles';
import { useStory } from '../../hook/useStory';
import useAuth from '../../../hooks/useAuth';
import ContentLoader, { Circle } from 'react-content-loader/native';
import InstaStory, { IUserStory } from '../StoryKit';

export interface IStoryItems {
  communityId: string;
  avatarFileId: string;
  displayName: string;
  isPublic: boolean;
  isOfficial: boolean;
  hasStories: boolean;
}

type TAmityStory = Amity.Story & {
  creator: Amity.User;
};

export default function MyStories() {
  const styles = useStyles();
  const { apiRegion, client } = useAuth();
  const userId = (client as Amity.Client).userId;
  const [globalStoriesItems, setGlobalStoriesItems] = useState<
    IUserStory<Record<string, any>>[]
  >([]);
  const {
    getGlobalStoryTargets,
    globalStoryTargets,
    getGlobalStories,
    globalStories,
    loading,
  } = useStory();

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
    const mappedGlobalStories: IUserStory<Record<string, any>>[] =
      Object.entries(groupedByCommunity).map(([communityId, items]) => {
        const { community } = items[0];
        const avatarFileId = community.avatarFileId;
        const displayName = community.displayName;
        const isSeen = items.every((item) => item.isSeen);

        const storyData = items.map((item: TAmityStory) => {
          const isOwner = item.creator.userId === userId;
          return {
            story_id: item.storyId,
            story_image: item?.imageData?.fileUrl,
            swipeText: '',
            onPress: () => console.log('story 1 swiped'),
            story_type: item.dataType,
            story_video: item?.videoData?.fileUrl,
            story_page: 0,
            creatorName: item?.creator?.displayName ?? '',
            createdAt: item.createdAt,
            items: item.items,
            reactionCounts: item.reactionsCount,
            comments: item.comments,
            viewer: item.impression,
            myReactions: item.myReactions,
            markAsSeen: item.analytics.markAsSeen,
            markLinkAsClicked: item.analytics.markLinkAsClicked,
            isOwner: isOwner,
          };
        });

        return {
          user_id: communityId,
          user_image: `https://api.${apiRegion}.amity.co/api/v3/files/${avatarFileId}/download?size=full`,
          user_name: displayName,
          stories: storyData,
          isOfficial: community.isOfficial,
          isPublic: community.isPublic,
          seen: isSeen,
        };
      });
    setGlobalStoriesItems([...mappedGlobalStories]);
  }, [apiRegion, globalStories, userId]);

  return (
    <View style={styles.container}>
      {loading ? (
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
      ) : globalStoriesItems?.length > 0 ? (
        <InstaStory
          data={globalStoriesItems}
          duration={15}
          onStorySeen={({ story }) => story.markAsSeen()}
        />
      ) : null}
    </View>
  );
}
