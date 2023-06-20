import * as React from 'react';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';

import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { postIcon, postIconOutlined } from '../../../svg/svg-xml-list';
import FloatingButton from '../../../components/FloatingButton';
import useAuth from '../../../hooks/useAuth';
import Explore from '../Explore';
import GlobalFeed from '../GlobalFeed';
import styles from './styles';
import FullScreenModal from '../../../components/FullScreenModal';
import { getAmityUser } from '../../../providers/user-provider';
import type { UserInterface } from 'src/types/user.interface';

export default function Home() {
  // const { t, i18n } = useTranslation();
  const { client } = useAuth();

  const [activeTab, setActiveTab] = useState(1);
  const [indicatorAnim] = useState(new Animated.Value(0));
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

  const handleTabPress = (tabIndex: number) => {
    setActiveTab(tabIndex);
    Animated.timing(indicatorAnim, {
      toValue: tabIndex,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const getIndicatorPosition = () => {
    const tabWidth = 100;
    const translateX = indicatorAnim.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [10, 10, 9 + tabWidth],
    });
    return { transform: [{ translateX }] };
  };

  const renderTabView = (): ReactElement => {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handleTabPress(1)}>
          <Text
            style={[styles.tabText, activeTab === 1 && styles.activeTabText]}
          >
            Newsfeed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress(2)}>
          <Text
            style={[styles.tabText, activeTab === 2 && styles.activeTabText]}
          >
            Explore
          </Text>
        </TouchableOpacity>
        <Animated.View style={[styles.indicator, getIndicatorPosition()]} />
      </View>
    );
  };

  const renderTabComponent = () => {
    switch (activeTab) {
      case 1:
        return <GlobalFeed />;
      case 2:
        return <Explore />;

      default:
        <GlobalFeed />;
    }
  };
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
      {renderTabView()}
      {renderTabComponent()}
      <FloatingButton onPress={openModal} />

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
              <SvgXml xml={postIconOutlined} width="28" height="28" />
              <Text style={styles.postText}>Post</Text>
            </TouchableOpacity>
            <FullScreenModal
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
