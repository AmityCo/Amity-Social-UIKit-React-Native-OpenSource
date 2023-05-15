import { CategoryRepository } from '@amityco/ts-sdk';
import React, { FC, useEffect, useState, useCallback, useRef } from 'react';
import { FlatList, View, Text, ActivityIndicator, Image } from 'react-native';
import { styles } from './styles';

export default function CategoryList() {
  const [categories, setCategories] = useState<Amity.Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const onNextPageRef = useRef<(() => void) | null>(null);
  const isFetchingRef = useRef(false);
  const onEndReachedCalledDuringMomentumRef = useRef(true);
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const unsubscribe = CategoryRepository.getCategories(
          {},
          ({ data: categories, onNextPage, hasNextPage, loading, error }) => {
            console.log('check all categories ' + JSON.stringify(categories));
            if (!loading) {
              setCategories((prevCategories) => [
                ...prevCategories,
                ...categories,
              ]);
              console.log('did query catgories ');
              setHasNextPage(hasNextPage);
              onNextPageRef.current = onNextPage;
              isFetchingRef.current = false;
            }
          }
        );
      } catch (error) {
        console.error('Failed to load categories:', error);
        isFetchingRef.current = false;
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const renderCategory = ({ item }: { item: Amity.Category }) => {
    return (
      <View style={styles.rowContainer}>
        <Image
          style={styles.avatar}
          source={{
            uri: `https://api.amity.co/api/v3/files/${item.avatarFileId}/download`,
          }}
        />
        <Text style={{ marginLeft: 10, marginBottom: 10 }}>{item.name}</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const handleEndReached = useCallback(() => {
    console.log('handleEndReached got triggered');
    if (
      !isFetchingRef.current &&
      hasNextPage &&
      !onEndReachedCalledDuringMomentumRef.current
    ) {
      console.log(
        'checking value for each variable ' +
        isFetchingRef.current +
        ' --- ' +
        hasNextPage +
        ' --- ' +
        onEndReachedCalledDuringMomentumRef.current
      );
      isFetchingRef.current = true;
      onEndReachedCalledDuringMomentumRef.current = true;
      onNextPageRef.current && onNextPageRef.current();
    }
  }, [hasNextPage]);

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.categoryId.toString()}
        ListFooterComponent={renderFooter}
        // onEndReached={handleEndReached}
        onEndReached={handleEndReached}
        onMomentumScrollBegin={() =>
          (onEndReachedCalledDuringMomentumRef.current = false)
        }
        onEndReachedThreshold={0.8}
      />
    </View>
  );
}
