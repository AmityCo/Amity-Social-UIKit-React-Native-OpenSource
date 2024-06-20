import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo, useCallback } from 'react';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '~/providers/amity-ui-kit-provider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/RouteParamList';
import { useUiKitConfig, useConfigImageUri } from '../../../hook';
import { ComponentID, ElementID, PageID } from '../../../enum/enumUIKitID';
import { useBehaviour } from '../../../providers/BehaviourProvider';
import { AmityCreatePostMenuComponent } from '../AmityCreatePostMenuComponent/AmityCreatePostMenuComponent';
import { usePopup } from '../../../hook/usePopup';
import Popup from '../../../component/PopupMenu/PopupMenu';

const AmitySocialHomeTopNavigationComponent = () => {
  const theme = useTheme() as MyMD3Theme;
  const { isOpen, toggle } = usePopup();

  const { AmitySocialHomeTopNavigationComponentBehaviour } = useBehaviour();
  const [headerTitle] = useUiKitConfig({
    keys: ['text'],
    page: PageID.social_home_page,
    component: ComponentID.top_navigation,
    element: ElementID.header_label,
  }) as string[];
  const searchIcon = useConfigImageUri({
    configPath: {
      page: PageID.social_home_page,
      component: ComponentID.top_navigation,
      element: ElementID.global_search_button,
    },
    configKey: 'icon',
  });

  const createIcon = useConfigImageUri({
    configPath: {
      page: PageID.social_home_page,
      component: ComponentID.top_navigation,
      element: ElementID.post_creation_button,
    },
    configKey: 'icon',
  });

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
      zIndex: 1,
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
    },
    icon: {
      width: 20,
      height: 20,
      tintColor: theme.colors.base,
    },
  });

  const onPressSearch = useCallback(() => {
    if (AmitySocialHomeTopNavigationComponentBehaviour.onPressSearch)
      return AmitySocialHomeTopNavigationComponentBehaviour.onPressSearch();
    navigation.navigate('AmitySocialGlobalSearchPage');
  }, [AmitySocialHomeTopNavigationComponentBehaviour, navigation]);

  const onToggleCreateComponent = useCallback(() => {
    toggle();
  }, [toggle]);

  // const onCreateCommunity = useCallback(() => {
  //   navigation.navigate('CreateCommunity');
  // }, [navigation]);

  const onPressCreate = useCallback(() => {
    if (AmitySocialHomeTopNavigationComponentBehaviour.onPressCreate)
      return AmitySocialHomeTopNavigationComponentBehaviour.onPressCreate();
    return onToggleCreateComponent();
  }, [AmitySocialHomeTopNavigationComponentBehaviour, onToggleCreateComponent]);

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
          <Image source={searchIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onPressCreate}
          testID="top_navigation/post_creation_button"
          accessibilityLabel="top_navigation/post_creation_button"
        >
          <Image source={createIcon} style={styles.icon} />
        </TouchableOpacity>
        <Popup
          open={isOpen}
          position={{
            top: 20,
            right: 0,
          }}
        >
          <AmityCreatePostMenuComponent
            pageId={PageID.social_home_page}
            componentId={ComponentID.create_post_menu}
          />
        </Popup>
      </View>
    </View>
  );
};

export default memo(AmitySocialHomeTopNavigationComponent);
