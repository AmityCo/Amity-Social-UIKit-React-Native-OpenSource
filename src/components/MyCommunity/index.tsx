import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { CommunityRepository } from '@amityco/ts-sdk';
import { arrowOutlined, communityIcon, officialIcon, privateIcon } from '../../svg/svg-xml-list';
import { SvgXml } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface ICommunityItems {
  communityId: string;
  avatarFileId: string;
  displayName: string;
  isPublic: boolean;
  isOfficial: boolean;

}
export default function MyCommunity() {
  const maxLength = 6;
  const [communityItems, setCommunityItems] = useState<ICommunityItems[]>([])
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const avatarFileURL = (fileId: string) => {
    return `https://api.amity.co/api/v3/files/${fileId}/download?size=medium`;
  };
  const queryCommunities = () => {
    const unsubscribe = CommunityRepository.getCommunities(
      { membership: 'member', limit: 8 },
      ({ data }) => {
        const formattedData: ICommunityItems[] = data.map((item: Amity.Community) => {
          return {
            communityId: item.communityId as string,
            avatarFileId: item.avatarFileId as string,
            displayName: item.displayName as string,
            isPublic: item.isPublic as boolean,
            isOfficial: item.isOfficial as boolean
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
      if(type === 'private'){
        reduceLetter = 3
      }
      if (text!.length > maxLength-reduceLetter) {
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
  const onClickSeeAll = () => {
    navigation.navigate('AllMyCommunity');
  }
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>My Community</Text>
        <TouchableOpacity onPress={onClickSeeAll}>
          <SvgXml
            style={styles.arrowIcon}
            width={17}
            height={17}
            xml={arrowOutlined}
          />
        </TouchableOpacity>

      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        {communityItems.map((item) => (
          <TouchableOpacity onPress={() => onClickItem(item.communityId, item.displayName)} key={item.communityId} style={styles.itemContainer}>
            {item.avatarFileId ? <Image source={{ uri: avatarFileURL(item.avatarFileId) }} style={styles.avatar} /> :
              <SvgXml
                style={styles.avatar}
                width={40}
                height={40}
                xml={communityIcon}
              />}
            <View style={styles.textRow}>
              {!item.isPublic &&
                <SvgXml
                  width={17}
                  height={17}
                  xml={privateIcon}
                />}
              <Text style={styles.itemText}>{displayName(item.displayName, !item.isPublic?'private': 'public')}</Text>
              {item.isOfficial &&
                <SvgXml
                  width={20}
                  height={20}
                  xml={officialIcon}
                />}
            </View>

          </TouchableOpacity>

        ))
        }
        <TouchableOpacity onPress={onClickSeeAll} style={styles.seeAllBtn}>
          <View style={styles.seeAllIcon}>
            <SvgXml
              width={15}
              height={15}
              xml={arrowOutlined}
            />
          </View>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
