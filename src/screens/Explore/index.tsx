import * as React from 'react';
import {
  CategoryRepository,
  CommunityRepository,
} from '@amityco/ts-sdk-react-native';
import { useState, useEffect, useCallback } from 'react';
// import { useTranslation } from 'react-i18next';

import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useStyles } from './styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useAuth from '../../hooks/useAuth';
import CommunityIcon from '../../svg/CommunityIcon';
import ChevronLeftIcon from '../../svg/ChevronLeftcon';
import CategoryIcon from '../../svg/CategoryIcon';

export default function Explore() {
  const styles = useStyles();
  const { apiRegion } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [recommendCommunityList, setRecommendCommunityList] = useState<
    Amity.Community[]
  >([]);
  const [trendingCommunityList, setTrendingCommunityList] = useState<
    Amity.Community[]
  >([]);
  const [categoryList, setCategoryList] = useState<Amity.Category[]>([]);

  const loadRecommendCommunities = () => {
    const unsubscribe = CommunityRepository.getRecommendedCommunities(
      { limit: 5 },
      ({ data: recommendCommunities }) =>
        setRecommendCommunityList(recommendCommunities)
    );
    unsubscribe();
  };

  const loadTrendingCommunities = async () => {
    const { data: communities } =
      await CommunityRepository.getTopTrendingCommunities();
    setTrendingCommunityList(communities);
  };
  const loadCategories = async () => {
    CategoryRepository.getCategories({}, ({ data: categories }) => {
      setCategoryList(categories);
    });
  };
  const handleCategoryListClick = () => {
    setTimeout(() => {
      navigation.navigate('CategoryList');
    }, 100);
  };
  const handleCommunityClick = (communityId: string, communityName: string) => {
    setTimeout(() => {
      navigation.navigate('CommunityHome', { communityId, communityName });
    }, 100);
  };
  useEffect(() => {
    loadRecommendCommunities();
    loadTrendingCommunities();
    loadCategories();
  }, []);
  const handleCategoryClick = useCallback(
    (categoryId: string, categoryName: string) => {
      setTimeout(() => {
        navigation.navigate('CommunityList', { categoryId, categoryName });
      }, 100);
    },
    [navigation]
  );
  const avatarFileURL = (fileId: string) => {
    return `https://api.${apiRegion}.amity.co/api/v3/files/${fileId}/download?size=medium`;
  };
  const renderCategoryList = useCallback(() => {
    const truncatedCategoryList = categoryList.slice(0, 8);
    return (
      <View style={styles.wrapContainer}>
        {truncatedCategoryList.map((category) => {
          return (
            <TouchableOpacity
              style={styles.rowContainer}
              key={category.categoryId}
              onPress={() =>
                handleCategoryClick(category.categoryId, category.name)
              }
            >
              {
                category?.avatarFileId ?
                  <Image
                    style={styles.avatar}
                    source={
                      {
                        uri: category.avatarFileId && avatarFileURL(category.avatarFileId!),
                      }

                    }
                  /> : <View style={styles.avatar}> <CategoryIcon /></View>
              }


              <Text style={styles.columnText}>{category.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }, [apiRegion, categoryList, handleCategoryClick, styles]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.recommendContainer}>
        <Text style={styles.title}>Recommended for you</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommendCommunityList.map((community) => (
            <TouchableOpacity
              key={community.communityId}
              style={styles.card}
              onPress={() =>
                handleCommunityClick(
                  community.communityId,
                  community.displayName
                )
              }
            >
              {community.avatarFileId ? (
                <Image
                  style={styles.avatar}
                  source={{
                    uri: `https://api.${apiRegion}.amity.co/api/v3/files/${community.avatarFileId}/download`,
                  }}
                />
              ) : (

                <View style={styles.avatar}>
                  <CommunityIcon width={40} height={40} />
                </View>

              )}

              <Text style={styles.name}>{community.displayName}</Text>
              <Text style={styles.recommendSubDetail}>
                {community.membersCount} members
              </Text>
              <Text style={styles.bio}>{community.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.trendingContainer}>
        <Text style={styles.title}>Today's trending</Text>
        <View>
          {trendingCommunityList.map((community, index) => (
            <TouchableOpacity
              key={community.communityId}
              style={styles.itemContainer}
              onPress={() =>
                handleCommunityClick(
                  community.communityId,
                  community.displayName
                )
              }
            >
              {community.avatarFileId ? (
                <Image
                  style={styles.avatar}
                  source={
                    {
                      uri: community.avatarFileId && avatarFileURL(community.avatarFileId!),
                    }

                  }
                />
              ) : (
                <View style={styles.avatar}>
                  <CommunityIcon width={40} height={40} />
                </View>

              )}

              <View style={styles.trendingTextContainer}>
                <Text style={styles.number}>{index + 1}</Text>
                <View style={styles.memberContainer}>
                  <View style={styles.memberTextContainer}>
                    <Text style={styles.memberText}>
                      {community.displayName}
                    </Text>
                    <Text style={styles.memberCount}>
                      {community.membersCount} members
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.categoriesContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Categories</Text>
          <TouchableOpacity onPress={handleCategoryListClick}>
            <ChevronLeftIcon style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>
        {renderCategoryList()}
      </View>
    </ScrollView>
  );
}
