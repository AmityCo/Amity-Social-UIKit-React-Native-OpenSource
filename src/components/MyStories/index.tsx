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

export interface IStoryItems {
  communityId: string;
  avatarFileId: string;
  displayName: string;
  isPublic: boolean;
  isOfficial: boolean;
  hasStories: boolean;

}
export default function MyStories() {
  const theme = useTheme() as MyMD3Theme;
  console.log(theme.colors.storiesRing.colorOne)
  const styles = getStyles();
  const { apiRegion } = useAuth();
  const maxLength = 6;
  const [communityItems, setCommunityItems] = useState<IStoryItems[]>([])
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const avatarFileURL = (fileId: string) => {
    return `https://api.${apiRegion}.amity.co/api/v3/files/${fileId}/download?size=medium`;
  };
  const queryCommunities = () => {
    const unsubscribe = CommunityRepository.getCommunities(
      { membership: 'member', limit: 10 },
      ({ data }) => {
        const formattedData: IStoryItems[] = data.map((item: Amity.Community, index: number) => {
          return {
            communityId: item.communityId as string,
            avatarFileId: item.avatarFileId as string,
            displayName: item.displayName as string,
            isPublic: item.isPublic as boolean,
            isOfficial: item.isOfficial as boolean,
            hasStories: index < 7 ? true : false
          }
        })
        setCommunityItems(formattedData);
      }
    );
    unsubscribe();
  };
  const displayName = (text: string, type: string) => {
    if (text) {
      let reduceLetter = 0;
      if (type === 'private') {
        reduceLetter = 3
      }
      if (text!.length > maxLength - reduceLetter) {
        return text!.substring(0, maxLength) + '...';
      }
      return text;
    }
    return 'Display name';
  };
  useEffect(() => {
    queryCommunities()
  }, [])

  const onClickItem = (communityId: string, displayName: string) => {
    navigation.navigate('CommunityHome', { communityId: communityId, communityName: displayName });
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        {communityItems.map((item) => (
          <TouchableOpacity onPress={() => onClickItem(item.communityId, item.displayName)} key={item.communityId} style={styles.itemContainer}>
            <View>
              {item.avatarFileId ? <Image source={{ uri: avatarFileURL(item.avatarFileId) }} style={styles.avatar} /> :
                <SvgXml
                  style={styles.avatar}
                  width={56}
                  height={56}
                  xml={communityIcon}
                />}
              <SvgXml
                style={styles.storyRing}
                width={64}
                height={64}
                xml={storyRing(item.hasStories ? theme.colors.storiesRing.colorOne : '#EBECEF', item.hasStories ? theme.colors.storiesRing.colorTwo : '#EBECEF')}
              />
              {item.isOfficial &&
                <SvgXml
                  style={styles.officialIcon}
                  xml={officialIcon(theme.colors.primary)}
                />}
            </View>

            <View style={styles.textRow}>
              {!item.isPublic &&
                <SvgXml
                  width={17}
                  height={17}
                  xml={privateIcon(theme.colors.base)}
                />}
              <Text style={styles.itemText}>{displayName(item.displayName, !item.isPublic ? 'private' : 'public')}</Text>

            </View>

          </TouchableOpacity>

        ))
        }

      </ScrollView>
    </View>
  );
}
