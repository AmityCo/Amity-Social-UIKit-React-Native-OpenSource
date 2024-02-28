import { CategoryRepository } from '@amityco/ts-sdk-react-native';
import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  FlatList,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { useStyle } from './styles';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import Categories from './Components/Categories';
import CloseIcon from '../../svg/CloseIcon';

interface IModal {
  visible: boolean;
  userId?: string;
  onClose: () => void;
  onSelect: (categoryId: string, categoryName: string) => void;
  categoryId?: string;
}
const ChooseCategoryModal = ({
  visible,
  onClose,
  onSelect,
  categoryId,
}: IModal) => {
  const theme = useTheme() as MyMD3Theme;
  const styles = useStyle();
  const [categories, setCategories] =
    useState<Amity.LiveCollection<Amity.Category>>();
  const { data: categoriesList, onNextPage } = categories ?? {};
  const [unSubFunc, setUnSubPageFunc] = useState<() => void>();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const unsubscribe = CategoryRepository.getCategories(
          { limit: 10 },
          (data: Amity.LiveCollection<Amity.Category>) => {
            if (data) {
              setCategories(data);
              if (categoryId) {
                const currentCategoryName =
                  data.data.find((item) => item.categoryId === categoryId)
                    ?.name ?? '';
                onSelect(categoryId, currentCategoryName);
              }
            }
          }
        );
        setUnSubPageFunc(() => unsubscribe);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, [categoryId, onSelect]);

  const onSelectCategory = (categoryId: string, categoryName: string) => {
    onSelect && onSelect(categoryId, categoryName);
    unSubFunc && unSubFunc();
    onClose && onClose();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    const endReachedThreshold = 50; // You can adjust this value based on your requirement

    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

    if (
      scrollPosition + scrollViewHeight >=
      contentHeight - endReachedThreshold
    ) {
      // Trigger your action here when scrolling reaches the end
      onNextPage && onNextPage();
    }
  };

  const handleOnClose = () => {
    unSubFunc && unSubFunc();
    onClose && onClose();
  };
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleOnClose}>
          <CloseIcon color={theme.colors.base} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Select Category</Text>
          </View>
        </View>
        <FlatList
          data={categoriesList}
          renderItem={({ item }) => (
            <Categories item={item} onSelectCategory={onSelectCategory} />
          )}
          keyExtractor={(item) => item.categoryId}
          onScroll={handleScroll}
        />
      </View>
    </Modal>
  );
};

export default ChooseCategoryModal;
