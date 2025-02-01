import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback, useState } from 'react';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/RouteParamList';

import { ComponentID, ElementID, PageID, TabName } from '../../enum';
import { useBehaviour } from '../../providers/BehaviourProvider';
// import { useConfigImageUri } from '../../hooks/useConfigImageUri';
import { useUiKitConfig } from '../../hooks/useUiKitConfig';

import SearchIconV4 from '../../svg/SearchIconV4';
import PlusIconV4 from '../../svg/PlusIconV4';


import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { PostIconOutlined } from '../../svg/PostIconOutlined';
import { PollIcon } from '../../svg/PollIcon';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import CreatePostChooseTargetModal from '../CreatePostChooseTargetModal/CreatePostChooseTargetModal';


const AmitySocialHomeTopNavigationComponent = ({ currentTab }: { currentTab: string }) => {

  const theme = useTheme() as MyMD3Theme;
  const { AmitySocialHomeTopNavigationComponentBehaviour } = useBehaviour();
  const [headerTitle] = useUiKitConfig({
    keys: ['text'],
    page: PageID.social_home_page,
    component: ComponentID.top_navigation,
    element: ElementID.header_label,
  }) as string[];
  const [openPostCreationMenu, setOpenPostCreationMenu] = useState<boolean>(false)


  const {
    userId,
  } = useSelector((state: RootState) => state.ui);
  const [postType, setPostType] = useState<string>();
  const [createPostModalVisible, setCreatePostModalVisible] = useState(false);

  const onChooseType = (type: string) => {
    setOpenPostCreationMenu(false)
    setPostType(type);
    setCreatePostModalVisible(true);
  };
  const closeCreatePostModal = () => {
    setCreatePostModalVisible(false);
  };
  // const searchIcon = useConfigImageUri({
  //   configPath: {
  //     page: PageID.social_home_page,
  //     component: ComponentID.top_navigation,
  //     element: ElementID.global_search_button,
  //   },
  //   configKey: 'icon',
  // });

  // const createIcon = useConfigImageUri({
  //   configPath: {
  //     page: PageID.social_home_page,
  //     component: ComponentID.top_navigation,
  //     element: ElementID.post_creation_button,
  //   },
  //   configKey: 'icon',
  // });
  const navigation =
    useNavigation() as NativeStackNavigationProp<RootStackParamList>;
  const styles = StyleSheet.create({
    headerContainer: {
      width: '100%',
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 8,
      marginVertical: 8,
    },
    title: {
      fontWeight: 'bold',
      color: theme.colors.base,
      fontSize: 20,
    },
    flexContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconBtn: {
      borderRadius: 50,
      backgroundColor: theme.colors.baseShade4,
      padding: 4,
      marginHorizontal: 4,
      width: 32,
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    icon: {
      tintColor: theme.colors.base,
      padding: 4
    },
    optionsContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 12,
      shadowColor: '#606170',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
      marginTop: 40

    },
    modalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
      marginVertical: 5,
    },
    postText: {
      paddingLeft: 12,
      fontWeight: '600',
      color: theme.colors.base,
    },
  });

  const onPressSearch = useCallback(() => {
    navigation.navigate('AmitySocialGlobalSearchPage');
  }, [AmitySocialHomeTopNavigationComponentBehaviour, navigation]);

  const onClickPlusIcon = useCallback(() => {

    if (currentTab === TabName.MyCommunities) {
      navigation.navigate('CreateCommunity');
    } else {
      setOpenPostCreationMenu(true)
    }
  }, [navigation, currentTab]);

  const onPressCreate = useCallback(() => {
    if (AmitySocialHomeTopNavigationComponentBehaviour.onPressCreate)
      return AmitySocialHomeTopNavigationComponentBehaviour.onPressCreate();
    return onClickPlusIcon();
  }, [AmitySocialHomeTopNavigationComponentBehaviour, onClickPlusIcon]);

  return (
    <View
      style={styles.headerContainer}
      testID="top_navigation"
      accessibilityLabel="top_navigation"
    >
      <Text
        style={styles.title}
        testID="top_navigation/header_label"
        accessibilityLabel="top_navigation/header_label"
      >
        {headerTitle}
      </Text>
      <View style={styles.flexContainer}>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onPressSearch}
          testID="top_navigation/global_search_button"
          accessibilityLabel="top_navigation/global_search_button"
        >
          <SearchIconV4 color={theme.colors.base} />
        </TouchableOpacity>


        {/* <Image source={searchIcon} style={styles.icon} /> */}
        {currentTab !== TabName.Explore &&
          <Menu opened={openPostCreationMenu} onBackdropPress={() => setOpenPostCreationMenu(false)}>
            <MenuTrigger >
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={onPressCreate}
                testID="top_navigation/post_creation_button"
                accessibilityLabel="top_navigation/post_creation_button"
              >
                {/* <Image source={createIcon} style={styles.icon} /> */}
                <PlusIconV4 color={theme.colors.base} />

              </TouchableOpacity>
            </MenuTrigger>
            <MenuOptions customStyles={{ optionsContainer: styles.optionsContainer }}>

              <MenuOption >
                <TouchableOpacity
                  onPress={() => onChooseType('post')}
                  style={styles.modalRow}
                >
                  <PostIconOutlined color={theme.colors.base} />
                  <Text style={styles.postText}>Post</Text>
                </TouchableOpacity>
              </MenuOption>
              <MenuOption >
                <TouchableOpacity
                  onPress={() => onChooseType('poll')}
                  style={styles.modalRow}
                >
                  <PollIcon color={theme.colors.base} />
                  <Text style={styles.postText}>Poll</Text>
                </TouchableOpacity>
              </MenuOption>
            </MenuOptions>
          </Menu>
        }
        <CreatePostChooseTargetModal
          visible={createPostModalVisible}
          onClose={closeCreatePostModal}
          userId={userId}
          onSelect={closeCreatePostModal}
          postType={postType}
        />
      </View>
    </View>
  );
};

export default memo(AmitySocialHomeTopNavigationComponent);
