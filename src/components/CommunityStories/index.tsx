import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { getStyles } from './styles';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import { communityIcon, officialIcon, privateIcon, storyRing } from '../../svg/svg-xml-list';
import { SvgXml } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuth from '../../hooks/useAuth';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';
import { IStoryItems } from '../MyStories';
import InstaStory from '../StoryKit';


interface ICommunityStories {
  communityId: string
}
export default function CommunityStories({ communityId }: ICommunityStories) {
  const theme = useTheme() as MyMD3Theme;
  const styles = getStyles();
  const { apiRegion } = useAuth();
  const [communityItem, setCommunityItem] = useState<IStoryItems>()
  console.log({ communityItem })
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const avatarFileURL = (fileId: string) => {
    return `https://api.${apiRegion}.amity.co/api/v3/files/${fileId}/download?size=medium`;
  };
  const [communityStories, setCommunityStories] = useState<any>([])
  console.log('communityStories: ', communityStories);

  const queryCommunities = () => {

    const unsubscribe = CommunityRepository.getCommunity(
      communityId,
      ({ data }) => {

        const formattedData = {
          communityId: data.communityId as string,
          avatarFileId: data.avatarFileId as string,
          displayName: data.displayName as string,
          isPublic: data.isPublic as boolean,
          isOfficial: data.isOfficial as boolean,
          hasStories: true
        }
        setCommunityItem(formattedData);
      }
    );
    unsubscribe();
  };

  useEffect(() => {
    queryCommunities()
  }, [])
  useEffect(() => {
    if (communityItem) {
      const data = [
        {
          user_id: communityItem?.communityId,
          user_image:
            `https://api.${apiRegion}.amity.co/api/v3/files/${communityItem?.avatarFileId}/download?size=full`,
          user_name: communityItem.displayName,
          stories: [
            {
              story_id: 1,
              story_image:
                `https://api.${apiRegion}.amity.co/api/v3/files/${communityItem?.avatarFileId}/download?size=full`,
              swipeText: '',
              onPress: () => console.log('story 1 swiped'),
            },
            {
              story_id: 2,
              story_image:
                'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
            },
          ],
          isOfficial: true,
          isPublic: true
        },
      ];
      setCommunityStories(data)
    }


  }, [communityItem])


  return (
    <View style={styles.container}>
      {communityStories.length > 0 && <InstaStory
        data={communityStories}
        duration={7}
        isCommunityStory
      />}

    </View>
  );
}
