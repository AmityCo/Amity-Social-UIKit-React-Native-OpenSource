import { CategoryRepository } from '@amityco/ts-sdk-react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useStyles } from './styles';
import CloseButton from '../../components/BackButton';
import useAuth from '../../hooks/useAuth';

export default function CategoryList({ navigation }: any) {
  const { apiRegion } = useAuth();

  const [categoryObject, setCategoryObject] = useState<Amity.LiveCollection<Amity.Category>>();
  const { data: categoryArr = [], onNextPage } = categoryObject ?? {};
  const styles = useStyles();


  const onEndReachedCalledDuringMomentumRef = useRef(true);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton />,
    });
  }, [navigation]);
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const unsubscribe = CategoryRepository.getCategories(
          { sortBy: 'name', limit: 12 },
          (data) => {
            if (!data.loading) {
              if (data) {
                setCategoryObject(data);
              }
            }
          }
        );
        unsubscribe();
      } catch (error) {
        console.error('Failed to load categories:', error);
      } 
    };
    loadCategories();
  }, []);
  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    setTimeout(() => {
      navigation.navigate('CommunityList', { categoryId, categoryName });
    }, 100);
  };
  const renderCategory = ({ item }: { item: Amity.Category }) => {
    return (
      <TouchableOpacity
        style={styles.rowContainer}
        onPress={() => handleCategoryClick(item.categoryId, item.name)}
      >
        <Image
          style={styles.avatar}
          source={
            item.avatarFileId
              ? {
                  uri: `https://api.${apiRegion}.amity.co/api/v3/files/${item.avatarFileId}/download`,
                }
              : require('../../../assets/icon/Placeholder.png')
          }
        />
        <Text style={styles.categoryText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };


  const handleEndReached=()=>{
    onNextPage && onNextPage()
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categoryArr}
        renderItem={renderCategory}
        keyExtractor={(item) => item.categoryId.toString()}
        onEndReached={handleEndReached}
        onMomentumScrollBegin={() =>
          (onEndReachedCalledDuringMomentumRef.current = false)
        }
        onEndReachedThreshold={0.8}
      />
    </View>
  );
}
