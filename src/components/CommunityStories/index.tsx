import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useStyles } from './styles';
import useAuth from '../../hooks/useAuth';
import AmityStory from '../../v4/component/StoryKit';
import { useStory } from '../../hooks/useStory';
import ContentLoader, { Circle } from 'react-content-loader/native';
import { useFocusEffect } from '@react-navigation/native';

interface ICommunityStories {
  communityId: string;
}

type TAmityStory = Amity.Story & {
  creator: Amity.User;
};
export default function CommunityStories({ communityId }: ICommunityStories) {
  const styles = useStyles();
  const { apiRegion } = useAuth();
  const { getStories, stories, loading } = useStory();

  useFocusEffect(
    useCallback(() => {
      getStories({
        targetId: communityId,
        targetType: 'community',
      });
    }, [communityId, getStories])
  );

  const [communityStories, setCommunityStories] = useState([]);
  const getStory = useCallback(() => {
    const storyData = stories.map((item: TAmityStory) => {
      return {
        story_id: item.storyId,
        story_image: `https://api.${apiRegion}.amity.co/api/v3/files/${item?.data?.fileId}/download?size=full`,
        swipeText: '',
        onPress: () => console.log('story 1 swiped'),
        story_type: item?.dataType,
        story_video: `https://api.${apiRegion}.amity.co/api/v3/files/${item?.data?.videoFileId?.original}/download`,
        story_page: 0,
        creatorName: item?.creator?.displayName ?? '',
        createdAt: item.createdAt,
        items: item.items,
        reactionCounts: item.reactionsCount,
        comments: item.comments,
        viewer: item.impression,
        myReactions: item.myReactions,
      };
    });
    if (storyData.length > 0) {
      const mappedStories = [
        {
          user_id: stories[0].community.communityId,
          user_image: `https://api.${apiRegion}.amity.co/api/v3/files/${stories[0]?.community?.avatarFileId}/download?size=full`,
          user_name: stories[0].community.displayName,
          stories: storyData ?? [],
          isOfficial: true,
          isPublic: true,
        },
      ];
      setCommunityStories(mappedStories);
    }
  }, [apiRegion, stories]);

  useEffect(() => {
    getStory();
  }, [getStory]);

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
      ) : communityStories.length > 0 ? (
        <AmityStory data={communityStories} duration={7} isCommunityStory />
      ) : null}
    </View>
  );
}
