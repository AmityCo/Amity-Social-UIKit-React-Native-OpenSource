import * as React from 'react';
import { useState } from 'react';
import { View, LogBox } from 'react-native';
import FloatingButton from '../../../components/FloatingButton';
import useAuth from '../../../hooks/useAuth';
import Explore from '../../../screens/Explore';
import GlobalFeed from '../../screen/GlobalFeed';
import CustomTab from '../../component/CustomTab/CustomTab';
import AllMyCommunity from '../../../screens/AllMyCommunity';
import { TabName } from '../../enum/enumTabName';
import { useDispatch } from 'react-redux';
import uiSlice from '../../../redux/slices/uiSlice';

LogBox.ignoreAllLogs(true);
const AmitySocialHomePage = () => {
  const { client } = useAuth();
  const dispatch = useDispatch();
  const { openPostTypeChoiceModal } = uiSlice.actions;
  const [activeTab, setActiveTab] = useState<string>(TabName.NewsFeed);

  const openModal = () => {
    dispatch(
      openPostTypeChoiceModal({
        userId: (client as Amity.Client).userId as string,
      })
    );
  };

  return (
    <View>
      <CustomTab
        tabNames={[TabName.NewsFeed, TabName.Explore, TabName.MyCommunities]}
        onTabChange={setActiveTab}
      />
      {activeTab === TabName.NewsFeed ? (
        <View>
          <GlobalFeed />
          <FloatingButton onPress={openModal} />
        </View>
      ) : activeTab === TabName.Explore ? (
        <View>
          <Explore />
        </View>
      ) : (
        <View>
          <AllMyCommunity />
        </View>
      )}
    </View>
  );
};
export default React.memo(AmitySocialHomePage);
