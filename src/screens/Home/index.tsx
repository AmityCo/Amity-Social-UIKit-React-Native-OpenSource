import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';

import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Modal,
  Pressable,
  LogBox,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { postIconOutlined } from '../../svg/svg-xml-list';
import FloatingButton from '../../components/FloatingButton';
import useAuth from '../../hooks/useAuth';
import Explore from '../Explore';
import GlobalFeed from '../GlobalFeed';
import { getStyles } from './styles';
import CreatePostModal from '../../components/CreatePostModal';
import CustomTab from '../../components/CustomTab';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { TabName } from '../../enum/tabNameState';
LogBox.ignoreAllLogs(true);
export default function Home() {
  // const { t, i18n } = useTranslation();
  const styles = getStyles();
  const { client } = useAuth();
  const theme = useTheme() as MyMD3Theme;
  const [activeTab, setActiveTab] = useState<TabName>(TabName.NewsFeed);
  const [isVisible, setIsVisible] = useState(false);

  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);

  const openCreatePostModal = () => {
    setCreatePostModalVisible(true);
  };
  const closeCreatePostModal = () => {
    setCreatePostModalVisible(false);
    closeModal();
  };
  const openModal = () => {
    setIsVisible(true);
  };

  const closeModal = () => {
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsVisible(false));
  };
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnimation]);

  const modalStyle = {
    transform: [
      {
        translateY: slideAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [600, 0], // Adjust this value to control the sliding distance
        }),
      },
    ],
  };
  return (
    <View>
      <CustomTab
        tabName={[TabName.NewsFeed, TabName.Explorer]}
        onTabChange={setActiveTab}
      />
      {activeTab === TabName.NewsFeed ? (
        <View>
          <GlobalFeed />
          <FloatingButton onPress={openModal} />
        </View>
      ) : (
        <View>
          <Explore />
        </View>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeModal}
      >
        <Pressable onPress={closeModal} style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, modalStyle]}>
            <TouchableOpacity
              onPress={openCreatePostModal}
              style={styles.modalRow}
            >
              <SvgXml
                xml={postIconOutlined(theme.colors.base)}
                width="28"
                height="28"
              />
              <Text style={styles.postText}>Post</Text>
            </TouchableOpacity>
            <CreatePostModal
              visible={createPostModalVisible}
              onClose={closeCreatePostModal}
              userId={(client as Amity.Client).userId as string}
              onSelect={closeCreatePostModal}
            />
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}
