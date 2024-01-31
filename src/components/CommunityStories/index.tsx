import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { CommunityRepository, StoryRepository } from '@amityco/ts-sdk-react-native';
import useAuth from '../../hooks/useAuth';
import { IStoryItems } from '../MyStories';
import InstaStory from '../StoryKit';


interface ICommunityStories {
  communityId: string
}
export default function CommunityStories({ communityId }: ICommunityStories) {

  const styles = getStyles();
  const { apiRegion } = useAuth();
  const [communityItem, setCommunityItem] = useState<IStoryItems>()
  console.log({ communityItem })

  const [communityStories, setCommunityStories] = useState<any>([])


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
    return () => {
      setCommunityItem(undefined)
    }
  }, [])


  

  const getStory = () => {

    const params: Amity.GetStoriesByTargetParam = { targetType: 'community', targetId: communityId }
    StoryRepository.getActiveStoriesByTarget(params, ({ data }) => {

      const storyData = data.map((item: Amity.Story) => {

        return {
          story_id: item.storyId,
          story_image:
            `https://api.${apiRegion}.amity.co/api/v3/files/${item?.data?.fileId}/download?size=full`,
          swipeText: '',
          onPress: () => console.log('story 1 swiped'),
          story_type: item.dataType,
          story_video: `https://api.${apiRegion}.amity.co/api/v3/files/${item?.data?.videoFileId?.original}/download`,
          story_page: 0
        }

      })
      if(storyData.length>0){
        const stories = [
          {
            user_id: communityItem?.communityId,
            user_image:
              `https://api.${apiRegion}.amity.co/api/v3/files/${communityItem?.avatarFileId}/download?size=full`,
            user_name: communityItem.displayName,
            stories: storyData ?? [],
            isOfficial: true,
            isPublic: true,
          },
        ];
        setCommunityStories(stories)
      }



    })

  }

  useEffect(() => {
    if (communityItem) {
      getStory()
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
