/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { LogBox, SafeAreaView } from 'react-native';
import Explore from '../Explore';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { ComponentID, ElementID, PageID } from '../../enum/enumUIKitID';
import { useUiKitConfig } from '../../hooks/useUiKitConfig';
import CustomSocialTab from '../../components/CustomSocialTab/CustomSocialTab';
import { useBehaviour } from '../../providers/BehaviourProvider';
import NewsFeedLoadingComponent from '../../components/NewsFeedLoadingComponent/NewsFeedLoadingComponent';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import AmityEmptyNewsFeedComponent from '../../components/AmityEmptyNewsFeedComponent/AmityEmptyNewsFeedComponent';
import AmityNewsFeedComponent from '../../components/AmityNewsFeedComponent/AmityNewsFeedComponent';
import AmitySocialHomeTopNavigationComponent from '../../components/AmitySocialHomeTopNavigationComponent/AmitySocialHomeTopNavigationComponent';
import AmityMyCommunitiesComponent from '../../components/AmityMyCommunitiesComponent/AmityMyCommunitiesComponent';
LogBox.ignoreAllLogs(true);
export default function Home() {

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

  const { AmitySocialHomePageBehaviour } = useBehaviour();
  // const styles = useStyles();
  // const { client } = useAuth();
  const theme = useTheme() as MyMD3Theme;
  // const dispatch = useDispatch();
  // const { openPostTypeChoiceModal } = uiSlice.actions;
  // const { excludes } = useConfig();
  const [activeTab, setActiveTab] = useState<string>(newsFeedTab);
  console.log('activeTab: ', activeTab);
  const [myCommunities, setMyCommunities] = useState<Amity.Community[]>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    const unsubscribe = CommunityRepository.getCommunities(
      { membership: 'member', limit: 20 },
      ({ data, error, loading }) => {
        if (error) return;
        setPageLoading(loading);
        if (!loading) setMyCommunities(data);
      }
    );
    return () => unsubscribe();
  }, []);




  const onTabChange = useCallback(
    (tabName: string) => {
      if (AmitySocialHomePageBehaviour.onChooseTab)
        return AmitySocialHomePageBehaviour.onChooseTab(tabName);
      setActiveTab(tabName);
    },
    [AmitySocialHomePageBehaviour]
  );

  const onPressExploreCommunity = useCallback(() => {
    onTabChange(exploreTab);
  }, [exploreTab, onTabChange]);

  const renderNewsFeed = () => {
    if (pageLoading) return <NewsFeedLoadingComponent />;
    if (activeTab === exploreTab) return <Explore />;
    if (!myCommunities?.length)
      return (
        <AmityEmptyNewsFeedComponent
          pageId={PageID.social_home_page}
          onPressExploreCommunity={onPressExploreCommunity}
        />
      );
    if (activeTab === newsFeedTab) {
      return <AmityNewsFeedComponent pageId={PageID.social_home_page} />;
    }
    if (activeTab === myCommunitiesTab)
      return (
        <AmityMyCommunitiesComponent
          pageId={PageID.social_home_page}
          componentId={ComponentID.my_communities}
        />
      );
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
      {/* <CustomTab
        tabName={
          excludes.includes(ComponentID.StoryTab)
            ? [TabName.NewsFeed, TabName.Explore]
            : [TabName.NewsFeed, TabName.Explore, TabName.MyCommunities]
        }
        onTabChange={setActiveTab}
      /> */}
      <AmitySocialHomeTopNavigationComponent currentTab={activeTab} />
      <CustomSocialTab
        tabNames={[newsFeedTab, exploreTab, myCommunitiesTab]}
        onTabChange={onTabChange}
        activeTab={activeTab}
      />
      {renderNewsFeed()}
    </SafeAreaView>
  );
}
