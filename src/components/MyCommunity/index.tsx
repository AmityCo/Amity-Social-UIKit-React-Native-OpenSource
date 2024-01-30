import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useStyle } from './styles';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import { arrowOutlined } from '../../svg/svg-xml-list';
import { SvgXml } from 'react-native-svg';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';
import CommunityList from './Components/CommunityList';

interface ICommunityItems {
  communityId: string;
  avatarFileId: string;
  displayName: string;
  isPublic: boolean;
  isOfficial: boolean;
}
export default function MyCommunity() {
  const theme = useTheme() as MyMD3Theme;
  const styles = useStyle();
  const [communityItems, setCommunityItems] = useState<ICommunityItems[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const queryCommunities = () => {
    const unsubscribe = CommunityRepository.getCommunities(
      { membership: 'member', limit: 8 },
      ({ data }) => {
        const formattedData: ICommunityItems[] = data.map(
          (item: Amity.Community) => {
            return {
              communityId: item.communityId as string,
              avatarFileId: item.avatarFileId as string,
              displayName: item.displayName as string,
              isPublic: item.isPublic as boolean,
              isOfficial: item.isOfficial as boolean,
            };
          }
        );
        setCommunityItems(formattedData);
      }
    );
    unsubscribe();
  };

  useFocusEffect(
    useCallback(() => {
      queryCommunities();
    }, [])
  );

  const onClickItem = (communityId: string, displayName: string) => {
    navigation.navigate('CommunityHome', {
      communityId: communityId,
      communityName: displayName,
    });
  };
  const onClickSeeAll = () => {
    navigation.navigate('AllMyCommunity');
  };
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>My Community</Text>
        <TouchableOpacity onPress={onClickSeeAll}>
          <SvgXml
            style={styles.arrowIcon}
            width={17}
            height={17}
            xml={arrowOutlined(theme.colors.base)}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        {communityItems.map((item) => (
          <CommunityList
            key={item.communityId}
            item={item}
            onClickItem={onClickItem}
          />
        ))}
        <TouchableOpacity onPress={onClickSeeAll} style={styles.seeAllBtn}>
          <View style={styles.seeAllIcon}>
            <SvgXml
              width={15}
              height={15}
              xml={arrowOutlined(theme.colors.base)}
            />
          </View>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
