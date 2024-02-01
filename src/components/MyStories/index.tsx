import React from 'react';
import { View } from 'react-native';
import { useStyles } from './styles';
// import { CommunityRepository } from '@amityco/ts-sdk-react-native';
// import { useNavigation } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import useAuth from '../../hooks/useAuth';
// import { ElementID } from '../../util/enumUIKitID';
// import InstaStory from '../StoryKit';

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
  // const { apiRegion } = useAuth();
  // const [communityItems, setCommunityItems] = useState<IStoryItems[]>([])

  // const queryCommunities = () => {
  //   const unsubscribe = CommunityRepository.getCommunities(
  //     { membership: 'member', limit: 10, sortBy: 'firstCreated' },
  //     ({ data }) => {
  //       const formattedData: IStoryItems[] = data.map((item: Amity.Community, index: number) => {
  //         return {
  //           communityId: item.communityId as string,
  //           avatarFileId: item.avatarFileId as string,
  //           displayName: item.displayName as string,
  //           isPublic: item.isPublic as boolean,
  //           isOfficial: item.isOfficial as boolean,
  //           hasStories: index < 7 ? true : false
  //         }
  //       })
  //       setCommunityItems(formattedData);
  //     }
  //   );
  //   unsubscribe();
  // };

  // useEffect(() => {
  //   queryCommunities()
  // }, [])

  // const data = [
  //   {
  //     user_id: 1,
  //     user_image:
  //       `https://api.${apiRegion}.amity.co/api/v3/files/${communityItems[0]?.avatarFileId}/download?size=full`,
  //     user_name: communityItems[0]?.displayName,
  //     stories: [
  //       {
  //         story_id: 1,
  //         story_type: 'video',
  //         story_video: 'https://api.sg.amity.co/api/v3/files/6591822f10eab291c20d5ae5/download',

  //         swipeText: 'Custom swipe text for this story',
  //         onPress: () => console.log('story 1 swiped'),
  //         story_page: 0
  //       },
  //       {
  //         story_id: 2,
  //         story_type: 'video',
  //         story_video: 'https://api.sg.amity.co/api/v3/files/659591b3dbd49a6b1ed22d49/download',

  //         swipeText: 'Custom swipe text for this story',
  //         onPress: () => console.log('story 1 swiped'),
  //         story_page: 0
  //       },
  //     ],
  //     isOfficial: true,
  //     isPublic: true
  //   },
  //   {
  //     user_id: 2,
  //     user_image:
  //       `https://api.${apiRegion}.amity.co/api/v3/files/${communityItems[1]?.avatarFileId}/download?size=full`,
  //     user_name: communityItems[1]?.displayName,
  //     stories: [
  //       {
  //         story_id: 1,
  //         story_image:
  //           `https://api.${apiRegion}.amity.co/api/v3/files/${communityItems[1]?.avatarFileId}/download?size=full`,
  //         swipeText: 'Custom swipe text for this story',
  //         onPress: () => console.log('story 1 swiped'),
  //         story_page: 1
  //       },
  //       {
  //         story_id: 2,
  //         story_image:
  //           'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
  //         swipeText: 'Custom swipe text for this story',
  //         onPress: () => console.log('story 2 swiped'),
  //         story_page: 1
  //       },
  //     ],
  //     isOfficial: false,
  //     isPublic: true
  //   },
  //   {
  //     user_id: 3,
  //     user_image:
  //       `https://api.${apiRegion}.amity.co/api/v3/files/${communityItems[2]?.avatarFileId}/download?size=full`,
  //     user_name: communityItems[2]?.displayName,
  //     stories: [
  //       {
  //         story_id: 1,
  //         story_image:
  //           `https://api.${apiRegion}.amity.co/api/v3/files/${communityItems[2]?.avatarFileId}/download?size=full`,
  //         swipeText: 'Custom swipe text for this story',
  //         onPress: () => console.log('story 1 swiped'),
  //         story_page: 2
  //       },
  //       {
  //         story_id: 2,
  //         story_image:
  //           `https://api.${apiRegion}.amity.co/api/v3/files/b57cdc07629d44238684c6d377969cdf/download?size=full`,
  //         swipeText: 'Custom swipe text for this story',
  //         onPress: () => console.log('story 2 swiped'),
  //       },
  //       {
  //         story_id: 'b57cdc07629d44238684c6d377969cdf',
  //         story_image:
  //           'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
  //         swipeText: 'Custom swipe text for this story',
  //         onPress: () => console.log('story 2 swiped'),
  //         story_page: 2
  //       },
  //     ],
  //     isOfficial: false,
  //     isPublic: false
  //   },
  //   {
  //     user_id: 4,
  //     user_image:
  //       `https://api.${apiRegion}.amity.co/api/v3/files/${communityItems[6]?.avatarFileId}/download?size=full`,
  //     user_name: communityItems[6]?.displayName,
  //     stories: [
  //       {
  //         story_id: 1,
  //         story_image:
  //           `https://api.${apiRegion}.amity.co/api/v3/files/${communityItems[6]?.avatarFileId}/download?size=full`,
  //         swipeText: 'Custom swipe text for this story',
  //         onPress: () => console.log('story 1 swiped'),
  //         story_page: 3
  //       },
  //       {
  //         story_id: 2,
  //         story_image:
  //           'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
  //         story_page: 3
  //       },
  //     ],
  //     isOfficial: true,
  //     isPublic: true
  //   },
  //   {
  //     user_id: 5,
  //     user_image:
  //       `https://api.${apiRegion}.amity.co/api/v3/files/${communityItems[5]?.avatarFileId}/download?size=full`,
  //     user_name: communityItems[5]?.displayName,
  //     stories: [
  //       {
  //         story_id: 1,
  //         story_image:
  //           `https://api.${apiRegion}.amity.co/api/v3/files/${communityItems[5]?.avatarFileId}/download?size=full`,
  //         swipeText: 'Custom swipe text for this story',
  //         onPress: () => console.log('story 1 swiped'),
  //         story_page: 4
  //       },
  //       {
  //         story_id: 2,
  //         story_image:
  //           'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
  //         story_page: 4
  //       },
  //     ],
  //     isOfficial: false,
  //     isPublic: true
  //   },
  // ];

  return (
    <View style={styles.container}>
      {/* {communityItems?.length > 0 && <InstaStory
        data={data}
        duration={7}
      />} */}
    </View>
  );
}
