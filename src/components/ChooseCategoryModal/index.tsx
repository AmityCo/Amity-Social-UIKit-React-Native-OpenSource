import { CategoryRepository } from '@amityco/ts-sdk';
import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  StyleSheet,
  Platform,
  Image,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { categoryIcon, closeIcon } from '../../svg/svg-xml-list';

interface IModal {
  visible: boolean;
  userId?: string;
  onClose: () => void;
  onSelect: (categoryId: string, categoryName: string) => void;
}
const ChooseCategoryModal = ({ visible, onClose, onSelect }: IModal) => {

  const [categories, setCategories] = useState<Amity.LiveCollection<Amity.Category>>();
  const { data: categoriesList, onNextPage } = categories ?? {}
  const [unSubFunc, setUnSubPageFunc] = useState<() => void>();




  useEffect(() => {
    const loadCategories = async () => {
      try {
        const unsubscribe = CategoryRepository.getCategories(
          { limit: 10 },
          (data: Amity.LiveCollection<Amity.Category>) => {
            if (data) {
              setCategories(data);
            }
          }
        );
        setUnSubPageFunc(() => unsubscribe)
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectCategory = (categoryId: string, categoryName: string) => {
    onSelect && onSelect(categoryId, categoryName);
    unSubFunc && unSubFunc();
    onClose && onClose();

  };
  const renderCategories = ({ item }: { item: Amity.Category }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          onSelectCategory(item.categoryId, item.name)
        }
        style={styles.rowContainer}
      >
        {item.avatarFileId ? <Image
          style={styles.avatar}
          source={
            {
              uri: `https://api.amity.co/api/v3/files/${item.avatarFileId}/download`,
            }
          }
        /> : <SvgXml xml={categoryIcon} width={40} height={40} />}

        <Text style={styles.communityText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };


  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    const endReachedThreshold = 50; // You can adjust this value based on your requirement

    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

    if (scrollPosition + scrollViewHeight >= contentHeight - endReachedThreshold) {
      // Trigger your action here when scrolling reaches the end
      onNextPage && onNextPage()
    }
  };

  const handleOnClose = () => {
    unSubFunc && unSubFunc();
    onClose && onClose()

  }
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleOnClose}>
            <SvgXml xml={closeIcon} width="17" height="17" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Select Category</Text>
          </View>
        </View>
        <FlatList
          data={categoriesList}
          renderItem={renderCategories}
          keyExtractor={(item) => item.categoryId}
          onScroll={handleScroll}
        />
      </View>
    </Modal>
  );
};

export default ChooseCategoryModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 35 : 10, // Adjust for Android status bar
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Adjust for iOS notch
    zIndex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 10,
    bottom: 8,
    zIndex: 1,
    padding: 10,
  },
  headerTextContainer: {
    flex: 1,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 17,
    textAlign: 'center',
  },
  communityText: {
    marginLeft: 12,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  myCommunityText: {
    color: '#292B32',
    padding: 16,
    opacity: 0.4,
    fontSize: 17,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  rowContainerMyTimeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    paddingTop: 26,
    paddingHorizontal: 16,
    borderBottomColor: '#EBECEF',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#D9E5FC',
  },
  categoryIcon: {
    alignItems: 'center'
  },
  LoadingIndicator: {
    paddingVertical: 20,
  },
});
