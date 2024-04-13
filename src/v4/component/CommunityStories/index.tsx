import React, { memo, useCallback, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useStyles } from './styles';
import AmityStory from '../../../v4/component/StoryKit';
import { useStory } from '../../hook/useStory';
import ContentLoader, { Circle } from 'react-content-loader/native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import {
  storyCircleCreatePlusIcon,
  storyRing,
} from '../../../svg/svg-xml-list';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/RouteParamList';
import { useFile } from '../../hook/useFile';
import useAuth from '../../../hooks/useAuth';
import { ImageSizeState } from '../../enum/imageSizeState';
import { useStoryPermission } from '../../hook/useStoryPermission';
import { isCommunityModerator } from '../../../util/permission';

interface ICommunityStories {
  communityId: string;
  displayName: string;
  avatarFileId: string;
}

type TAmityStory = Amity.Story & {
  creator: Amity.User;
};
const CommunityStories = ({
  communityId,
  displayName,
  avatarFileId,
}: ICommunityStories) => {
  const navigation =
    useNavigation() as NativeStackNavigationProp<RootStackParamList>;
  const styles = useStyles();
  const { client } = useAuth();
  const hasStoryPermission = useStoryPermission(communityId);
  const userId = (client as Amity.Client).userId;
  const { getStories, stories, loading } = useStory();
  const { getImage } = useFile();
  const [avatarUrl, setAvatarUrl] = useState(undefined);

  useEffect(() => {
    (async () => {
      const avatarImage = await getImage({
        fileId: avatarFileId,
        imageSize: ImageSizeState.small,
      });
      setAvatarUrl(avatarImage);
    })();
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
        const isOwner = item.creator.userId === userId;
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
          commentsCounts: item.commentsCount,
          viewer: item.reach,
          myReactions: item.myReactions,
          markAsSeen: item.analytics.markAsSeen,
          markLinkAsClicked: item.analytics.markLinkAsClicked,
          isOwner: isOwner,
        };
      })
    );
    if (storyData.length > 0) {
      const isModerator = await isCommunityModerator({ userId, communityId });
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
          isModerator: isModerator,
        },
      ];

      setCommunityStories(mappedStories);
    }
  }, [avatarFileId, communityId, displayName, getImage, stories, userId]);

  useEffect(() => {
    stories.length > 0 && formatStory();
  }, [formatStory, stories.length]);

  const onPress = useCallback(() => {
    hasStoryPermission &&
      navigation.navigate('CreateStory', {
        targetId: communityId,
        targetType: 'community',
      });
  }, [communityId, hasStoryPermission, navigation]);

  const renderCommunityStory = () => {
    if (loading) {
      return (
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
      );
    }
    if (communityStories.length > 0) {
      return (
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
      );
    }
    if (hasStoryPermission) {
      return (
        <TouchableOpacity style={styles.avatarContainer} onPress={onPress}>
          <Image
            source={
              avatarUrl
                ? {
                    uri: avatarUrl,
                  }
                : require('../../assets/icon/Placeholder.png')
            }
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
      );
    }
    return null;
  };

  return <View style={styles.container}>{renderCommunityStory()}</View>;
};

export default memo(CommunityStories);
