import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { FC, memo, useCallback } from 'react';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/RouteParamList';
import {
  useConfigImageUri,
  useAmityComponent,
  useUiKitConfig,
} from '../../../hook';
import { ComponentID, ElementID, PageID } from '../../../enum/enumUIKitID';
import { useBehaviour } from '../../../providers/BehaviourProvider';
import AmityCreatePostMenuComponent from '../AmityCreatePostMenuComponent/AmityCreatePostMenuComponent';
import TextKeyElement from '../../Elements/TextKeyElement/TextKeyElement';
import { usePopup } from '../../../hook/usePopup';
import Popup from '../../../component/PopupMenu/PopupMenu';

type AmitySocialHomeTopNavigationComponentType = {
  activeTab: string;
};

const AmitySocialHomeTopNavigationComponent: FC<
  AmitySocialHomeTopNavigationComponentType
> = ({ activeTab }) => {
  const pageId = PageID.social_home_page;
  const componentId = ComponentID.top_navigation;
  const componentConfig = useAmityComponent({ pageId, componentId });
  const theme = componentConfig.themeStyles;
  const { AmitySocialHomeTopNavigationComponentBehaviour } = useBehaviour();
  const { isOpen, setIsOpen, toggle } = usePopup();

  const [myCommunitiesTab] = useUiKitConfig({
    page: PageID.social_home_page,
    component: ComponentID.WildCardComponent,
    element: ElementID.my_communities_button,
    keys: ['text'],
  }) as string[];
  const [exploreTab] = useUiKitConfig({
    page: PageID.social_home_page,
    component: ComponentID.WildCardComponent,
    element: ElementID.explore_button,
    keys: ['text'],
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
      position: 'relative',
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

  useFocusEffect(
    useCallback(() => {
      return () => setIsOpen(false);
    }, [setIsOpen])
  );

  const onPressSearch = useCallback(() => {
    if (myCommunitiesTab === activeTab) {
      if (
        AmitySocialHomeTopNavigationComponentBehaviour.goToMyCommunitiesSearchPage
      ) {
        return AmitySocialHomeTopNavigationComponentBehaviour.goToMyCommunitiesSearchPage();
      }
      return navigation.navigate('AmityMyCommunitiesSearchPage');
    }
    if (AmitySocialHomeTopNavigationComponentBehaviour.goToGlobalSearchPage) {
      return AmitySocialHomeTopNavigationComponentBehaviour.goToGlobalSearchPage();
    }
    navigation.navigate('AmitySocialGlobalSearchPage');
  }, [
    AmitySocialHomeTopNavigationComponentBehaviour,
    activeTab,
    myCommunitiesTab,
    navigation,
  ]);

  const onToggleCreateComponent = useCallback(() => {
    toggle();
  }, [toggle]);

  const onCreateCommunity = useCallback(() => {
    navigation.navigate('CreateCommunity');
  }, [navigation]);

  const onPressCreate = useCallback(() => {
    if (AmitySocialHomeTopNavigationComponentBehaviour.onPressCreate)
      return AmitySocialHomeTopNavigationComponentBehaviour.onPressCreate();
    if (activeTab === myCommunitiesTab) return onCreateCommunity();
    return onToggleCreateComponent();
  }, [
    AmitySocialHomeTopNavigationComponentBehaviour,
    activeTab,
    myCommunitiesTab,
    onCreateCommunity,
    onToggleCreateComponent,
  ]);

  if (componentConfig?.isExcluded) return null;

  return (
    <>
      <View
        style={styles.headerContainer}
        testID={componentConfig.accessibilityId}
        accessibilityLabel={componentConfig.accessibilityId}
      >
        <TextKeyElement
          pageID={pageId}
          componentID={componentId}
          elementID={ElementID.header_label}
          style={styles.title}
        />

        <View style={styles.flexContainer}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onPressSearch}
            testID="top_navigation/global_search_button"
            accessibilityLabel="top_navigation/global_search_button"
          >
            <Image source={searchIcon} style={styles.icon} />
          </TouchableOpacity>
          {activeTab !== exploreTab && (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={onPressCreate}
              testID="top_navigation/post_creation_button"
              accessibilityLabel="top_navigation/post_creation_button"
            >
              <Image source={createIcon} style={styles.icon} />
            </TouchableOpacity>
          )}
        </View>
        <Popup
          setOpen={setIsOpen}
          open={isOpen}
          position={{
            top: 45,
            right: 15,
          }}
        >
          <AmityCreatePostMenuComponent
            pageId={PageID.social_home_page}
            componentId={ComponentID.create_post_menu}
          />
        </Popup>
      </View>
    </>
  );
};

export default memo(AmitySocialHomeTopNavigationComponent);
