import * as React from 'react';
import { useCallback, useState } from 'react';
import { View, LogBox, SafeAreaView } from 'react-native';
import FloatingButton from '../../../../components/FloatingButton';
import useAuth from '../../../../hooks/useAuth';
import Explore from '../../../../screens/Explore';
import GlobalFeed from '../../../screen/GlobalFeed';
import CustomTab from '../../../component/CustomTab/CustomTab';
import AllMyCommunity from '../../../../screens/AllMyCommunity';
import { useDispatch } from 'react-redux';
import uiSlice from '../../../../redux/slices/uiSlice';
import { useUiKitConfig } from '../../../hook';
import { ComponentID, ElementID, PageID } from '../../../enum/enumUIKitID';
import { MyMD3Theme } from '~/providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';
import { useBehaviour } from '../../../providers/BehaviourProvider';
import AmitySocialHomeTopNavigationComponent from '../../Components/AmitySocialHomeTopNavigationComponent/AmitySocialHomeTopNavigationComponent';
LogBox.ignoreAllLogs(true);
const AmitySocialHomePage = () => {
  const { client } = useAuth();
  const dispatch = useDispatch();
  const theme = useTheme() as MyMD3Theme;
  const { AmitySocialHomePageBehaviour } = useBehaviour();
  const { openPostTypeChoiceModal } = uiSlice.actions;
  const [newsFeedTab] = useUiKitConfig({
    page: PageID.social_home_page,
    component: ComponentID.WildCardComponent,
    element: ElementID.newsfeed_button,
    keys: ['text'],
  }) as string[];
  const [exploreTab] = useUiKitConfig({
    page: PageID.social_home_page,
    component: ComponentID.WildCardComponent,
    element: ElementID.explore_button,
    keys: ['text'],
  }) as string[];
  const [myCommunitiesTab] = useUiKitConfig({
    page: PageID.social_home_page,
    component: ComponentID.WildCardComponent,
    element: ElementID.my_communities_button,
    keys: ['text'],
  }) as string[];

  const [activeTab, setActiveTab] = useState<string>(newsFeedTab);

  const openModal = () => {
    dispatch(
      openPostTypeChoiceModal({
        userId: (client as Amity.Client).userId as string,
      })
    );
  };

  const onTabChange = useCallback(
    (tabName: string) => {
      if (AmitySocialHomePageBehaviour.onChooseTab)
        return AmitySocialHomePageBehaviour.onChooseTab(tabName);
      setActiveTab(tabName);
    },
    [AmitySocialHomePageBehaviour]
  );

  return (
    <SafeAreaView
      testID="social_home_page"
      accessibilityLabel="social_home_page"
      id="social_home_page"
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <AmitySocialHomeTopNavigationComponent />
      <CustomTab
        tabNames={[newsFeedTab, exploreTab, myCommunitiesTab]}
        onTabChange={onTabChange}
      />
      {activeTab === newsFeedTab ? (
        <View>
          <GlobalFeed />
          <FloatingButton onPress={openModal} />
        </View>
      ) : activeTab === exploreTab ? (
        <Explore />
      ) : (
        <AllMyCommunity />
      )}
    </SafeAreaView>
  );
};
export default React.memo(AmitySocialHomePage);
