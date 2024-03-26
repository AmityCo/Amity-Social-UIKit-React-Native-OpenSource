import React, { useCallback, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useStyles } from './styles';
import AmityStory from '../../../v4/component/StoryKit';
import { useStory } from '../../hook/useStory';
import ContentLoader, { Circle } from 'react-content-loader/native';
import { useFocusEffect } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import {
  storyCircleCreatePlusIcon,
  storyRing,
} from '../../../svg/svg-xml-list';
import { useFile } from '../../hook/useFile';
import { ImageSizeState } from '../../enum/imageSizeState';

interface ICommunityStories {
  communityId: string;
  displayName: string;
  avatarFileId: string;
}

type TAmityStory = Amity.Story & {
  creator: Amity.User;
};
export default function CommunityStories({
  communityId,
  displayName,
  avatarFileId,
}: ICommunityStories) {
  const styles = useStyles();
  const { getStories, stories, loading } = useStory();
  const { getImage } = useFile();
  const [avatarUrl, setAvatarUrl] = useState(undefined);

  useEffect(() => {
    const gg = getImage({
      fileId: avatarFileId,
      imageSize: ImageSizeState.small,
    });
    setAvatarUrl(gg);
  }, [avatarFileId, getImage]);

  useFocusEffect(
    useCallback(() => {
      getStories({
        targetId: communityId,
        targetType: 'community',
        options: {
          orderBy: 'asc',
          sortBy: 'createdAt',
        },
      });
    }, [communityId, getStories])
  );

  const [communityStories, setCommunityStories] = useState([]);
  const formatStory = useCallback(async () => {
    const isSeen = stories.every((story) => story.isSeen);
    const storyData = await Promise.all(
      stories?.map(async (item: TAmityStory) => {
        return {
          story_id: item.storyId,
          story_image: item?.imageData?.fileUrl,
          swipeText: '',
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
        };
      })
    );
    if (storyData.length > 0) {
      const mappedStories = [
        {
          user_id: communityId,
          user_image: await getImage({
            fileId: avatarFileId,
            imageSize: ImageSizeState.small,
          }),
          user_name: displayName,
          stories: storyData ?? [],
          isOfficial: true,
          isPublic: true,
          seen: isSeen,
        },
      ];

      setCommunityStories(mappedStories);
    }
  }, [avatarFileId, communityId, displayName, getImage, stories]);

  useEffect(() => {
    formatStory();
  }, [formatStory]);

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
        <AmityStory
          data={communityStories}
          duration={7}
          isCommunityStory
          onStorySeen={({ story }) => story.markAsSeen()}
          onClose={() =>
            getStories({
              targetId: communityId,
              targetType: 'community',
              options: {
                orderBy: 'asc',
                sortBy: 'createdAt',
              },
            })
          }
        />
      ) : (
        <TouchableOpacity style={styles.avatarContainer}>
          <Image
            source={{
              uri: avatarUrl,
            }}
            style={styles.communityAvatar}
          />
          <SvgXml
            style={styles.storyRing}
            width={48}
            height={48}
            xml={storyRing('#EBECEF', '#EBECEF')}
          />
          <SvgXml
            style={styles.storyCreateIcon}
            xml={storyCircleCreatePlusIcon()}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
