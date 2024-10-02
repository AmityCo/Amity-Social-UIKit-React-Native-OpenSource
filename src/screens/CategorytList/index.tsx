import { CategoryRepository } from '@amityco/ts-sdk-react-native';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useStyles } from './styles';
import CloseButton from '../../components/BackButton';
import useAuth from '../../hooks/useAuth';

export default function CategoryList({ navigation }: any) {
  const { apiRegion } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categoryObject, setCategoryObject] = useState<Amity.LiveCollection<Amity.Category>>();
  const { data: categoryArr = [], onNextPage } = categoryObject ?? {};
  const styles = useStyles();


  const onEndReachedCalledDuringMomentumRef = useRef(true);
  React.useLayoutEffect(() => {
    // Set the headerRight component to a TouchableOpacity
    navigation.setOptions({
      headerLeft: () => <CloseButton />,
    });
  }, [navigation]);
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const unsubscribe = CategoryRepository.getCategories(
          { sortBy: 'name', limit: 10 },
          (data) => {
            if (!loading) {
              if (data) {
                setCategoryObject(data);
              }
            }
          }
        );
        unsubscribe();
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.LoadingIndicator}>
        <ActivityIndicator size="large" />
      </View>
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
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onMomentumScrollBegin={() =>
          (onEndReachedCalledDuringMomentumRef.current = false)
        }
        onEndReachedThreshold={0.8}
      />
    </View>
  );
}
