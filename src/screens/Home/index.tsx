/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';

import { View, TouchableOpacity, LogBox } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { plusIcon, searchIcon } from '../../svg/svg-xml-list';
import FloatingButton from '../../components/FloatingButton';
import useAuth from '../../hooks/useAuth';
import Explore from '../Explore';
import GlobalFeed from '../GlobalFeed';
import { useStyles } from './styles';
import CustomTab from '../../components/CustomTab';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import AllMyCommunity from '../AllMyCommunity';
import useConfig from '../../hooks/useConfig';
import { ComponentID } from '../../util/enumUIKitID';
import { TabName } from '../../enum/tabNameState';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import uiSlice from '../../redux/slices/uiSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchIcon } from '../../svg/SearchIcon';
import { PlusIcon } from '../../svg/PlusIcon';
LogBox.ignoreAllLogs(true);
export default function Home() {
  const styles = useStyles();
  const { client } = useAuth();
  const theme = useTheme() as MyMD3Theme;
  const dispatch = useDispatch();
  const { openPostTypeChoiceModal } = uiSlice.actions;
  const { excludes } = useConfig();
  const [activeTab, setActiveTab] = useState<string>(TabName.NewsFeed);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const onClickSearch = () => {
    navigation.navigate('CommunitySearch');
  };
  const onClickAddCommunity = () => {
    navigation.navigate('CreateCommunity');
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        activeTab === TabName.MyCommunities ? (
          <TouchableOpacity
            onPress={onClickAddCommunity}
            style={styles.btnWrap}
          >
            <PlusIcon color={theme.colors.base} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onClickSearch} style={styles.btnWrap}>
            <SearchIcon color={theme.colors.base} />
          </TouchableOpacity>
        ),
      headerTitle: 'Community',
    });
  }, []);

  const openModal = () => {
    dispatch(
      openPostTypeChoiceModal({
        userId: (client as Amity.Client).userId as string,
      })
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomTab
        tabName={
          excludes.includes(ComponentID.StoryTab)
            ? [TabName.NewsFeed, TabName.Explore]
            : [TabName.NewsFeed, TabName.Explore, TabName.MyCommunities]
        }
        onTabChange={setActiveTab}
      />
      {activeTab === TabName.NewsFeed ? (
        <View style={{ flex: 1 }}>
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
}
