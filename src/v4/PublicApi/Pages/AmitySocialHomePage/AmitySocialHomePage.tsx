import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { LogBox, SafeAreaView } from 'react-native';
import FloatingButton from '../../../../components/FloatingButton';
import useAuth from '../../../../hooks/useAuth';
import Explore from '../../../../screens/Explore';
import GlobalFeed from '../../../screen/GlobalFeed';
import CustomSocialTab from '../../../component/CustomSocialTab/CustomSocialTab';
import AllMyCommunity from '../../../../screens/AllMyCommunity';
import { useDispatch } from 'react-redux';
import uiSlice from '../../../../redux/slices/uiSlice';
import { useUiKitConfig } from '../../../hook';
import { ComponentID, ElementID, PageID } from '../../../enum/enumUIKitID';
import { MyMD3Theme } from '~/providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';
import { useBehaviour } from '../../../providers/BehaviourProvider';
import AmitySocialHomeTopNavigationComponent from '../../Components/AmitySocialHomeTopNavigationComponent/AmitySocialHomeTopNavigationComponent';
import AmityEmptyNewsFeedComponent from '../../Components/AmityEmptyNewsFeedComponent/AmityEmptyNewsFeedComponent';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
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
  const [myCommunities, setMyCommunities] = useState<Amity.Community[]>(null);

  useEffect(() => {
    const unsubscribe = CommunityRepository.getCommunities(
      { membership: 'member', limit: 20 },
      ({ data, error, loading }) => {
        if (error) return;
        if (!loading) setMyCommunities(data);
      }
    );
    return () => unsubscribe();
  }, []);

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

  const renderNewsFeed = () => {
    if (activeTab === exploreTab) return <Explore />;
    if (!myCommunities?.length) return <AmityEmptyNewsFeedComponent />;
    if (activeTab === newsFeedTab) {
      return (
        <>
          <GlobalFeed />
          <FloatingButton onPress={openModal} />
        </>
      );
    }
    if (activeTab === myCommunitiesTab) return <AllMyCommunity />;
    return null;
  };

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
      <CustomSocialTab
        tabNames={[newsFeedTab, exploreTab, myCommunitiesTab]}
        onTabChange={onTabChange}
      />
      {renderNewsFeed()}
    </SafeAreaView>
  );
};
export default React.memo(AmitySocialHomePage);
