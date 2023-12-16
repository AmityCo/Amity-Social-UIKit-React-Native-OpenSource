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

  const onClickItem = (communityId: string, displayName: string) => {
    navigation.navigate('CommunityHome', { communityId: communityId, communityName: displayName });
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        {communityItem &&
          <TouchableOpacity onPress={() => onClickItem(communityItem.communityId, communityItem.displayName)} key={communityItem.communityId} style={styles.itemContainer}>
            <View>
              {communityItem.avatarFileId ? <Image source={{ uri: avatarFileURL(communityItem.avatarFileId) }} style={styles.avatar} /> :
                <SvgXml
                  style={styles.avatar}
                  width={40}
                  height={40}
                  xml={communityIcon}
                />}
              <SvgXml
                style={styles.storyRing}
                width={48}
                height={48}
                xml={storyRing(communityItem.hasStories ? theme.colors.storiesRing.colorOne : '#EBECEF', communityItem.hasStories ? theme.colors.storiesRing.colorTwo : '#EBECEF')}
              />
              {communityItem.isOfficial &&
                <SvgXml
                  style={styles.officialIcon}
                  xml={officialIcon(theme.colors.primary)}
                />}
            </View>

            <View style={styles.textRow}>
              {!communityItem.isPublic &&
                <SvgXml
                  width={17}
                  height={17}
                  xml={privateIcon(theme.colors.base)}
                />}
              <Text style={styles.itemText}>Story</Text>

            </View>

          </TouchableOpacity>

        }

      </ScrollView>
    </View>
  );
}
