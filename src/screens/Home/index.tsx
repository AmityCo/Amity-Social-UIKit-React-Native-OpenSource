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
  type StyleProp,
  type ImageStyle,
  LogBox,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { postIconOutlined, searchIcon } from '../../svg/svg-xml-list';
import FloatingButton from '../../components/FloatingButton';
import useAuth from '../../hooks/useAuth';
import Explore from '../Explore';
import GlobalFeed from '../GlobalFeed';
import { getStyles } from './styles';
import CreatePostModal from '../../components/CreatePostModal';
import CustomTab from '../../components/CustomTab';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import AllMyCommunity from '../AllMyCommunity';
LogBox.ignoreAllLogs(true);
export default function Home() {
  const styles = getStyles();
  const { client } = useAuth();
  const theme = useTheme() as MyMD3Theme;

  const [activeTab, setActiveTab] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onClickSearch = () => {
    navigation.navigate('CommunitySearch');
  };
  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity onPress={onClickSearch} style={styles.btnWrap}>
        <SvgXml xml={searchIcon(theme.colors.base)} width="25" height="25" />
      </TouchableOpacity>
    ),
    headerTitle: 'Community',
  });

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

  const renderTabComponent = () => {
    let globalFeedStyle: StyleProp<ImageStyle> | StyleProp<ImageStyle>[] = styles.visible;
    let exploreStyle: StyleProp<ImageStyle> | StyleProp<ImageStyle>[] = styles.invisible;
    let myCommunityStyle: StyleProp<ImageStyle> | StyleProp<ImageStyle>[] = styles.invisible;

    if(activeTab=== 1){
      globalFeedStyle = styles.visible;
      exploreStyle = styles.invisible;
      myCommunityStyle = styles.invisible;
    }
    if (activeTab === 2) {
      globalFeedStyle = styles.invisible;
      exploreStyle = styles.visible;
      myCommunityStyle = styles.invisible;
    }
    if (activeTab === 3) {
      globalFeedStyle = styles.invisible;
      exploreStyle = styles.invisible;
      myCommunityStyle = styles.visible;
    }
    return (
      <View>
        <View style={globalFeedStyle}>
          <GlobalFeed />
          <FloatingButton onPress={openModal} />
        </View>
        <View style={exploreStyle}>
          <Explore />
        </View>
        <View style={myCommunityStyle} >
          <AllMyCommunity />
        </View>
      </View>
    );
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
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };
  return (
    <View>
      <CustomTab
        tabName={['Newsfeed', 'Explore', 'Community']}
        onTabChange={handleTabChange}
      />
      {renderTabComponent()}

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
              <SvgXml xml={postIconOutlined(theme.colors.base)} width="28" height="28" />
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
