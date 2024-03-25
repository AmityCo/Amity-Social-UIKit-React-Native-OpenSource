import React, { useCallback, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useStyles } from './styles';
import useAuth from '../../../hooks/useAuth';
import InstaStory from '../../../v4/component/StoryKit';
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
  const navigation =
    useNavigation() as NativeStackNavigationProp<RootStackParamList>;
  const styles = useStyles();
  const { apiRegion, client } = useAuth();
  const userId = (client as Amity.Client).userId;
  const { getStories, stories, loading } = useStory();
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
  const formatStory = useCallback(() => {
    const isSeen = stories.every((story) => story.isSeen);
    const storyData = stories?.map((item: TAmityStory) => {
      const isOwner = item.creator.userId === userId;
      return {
        story_id: item.storyId,
        story_image: `https://api.${apiRegion}.amity.co/api/v3/files/${item?.data?.fileId}/download?size=full`,
        swipeText: '',
        onPress: () => console.log('story 1 swiped'),
        story_type: item.dataType,
        story_video: `https://api.${apiRegion}.amity.co/api/v3/files/${item?.data?.videoFileId?.original}/download`,
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
    if (storyData.length > 0) {
      const mappedStories = [
        {
          user_id: communityId,
          user_image: `https://api.${apiRegion}.amity.co/api/v3/files/${avatarFileId}/download?size=small`,
          user_name: displayName,
          stories: storyData ?? [],
          isOfficial: true,
          isPublic: true,
          seen: isSeen,
        },
      ];

      setCommunityStories(mappedStories);
    }
  }, [apiRegion, avatarFileId, communityId, displayName, stories, userId]);

  useEffect(() => {
    formatStory();
  }, [formatStory]);

  const onPress = useCallback(() => {
    navigation.navigate('Camera', {
      communityId,
      communityName: displayName,
      communityAvatar: `https://api.${apiRegion}.amity.co/api/v3/files/${avatarFileId}/download?size=small`,
    });
  }, [apiRegion, avatarFileId, communityId, displayName, navigation]);

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
        <InstaStory
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
        <TouchableOpacity style={styles.avatarContainer} onPress={onPress}>
          <Image
            source={{
              uri: `https://api.${apiRegion}.amity.co/api/v3/files/${avatarFileId}/download?size=small`,
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
