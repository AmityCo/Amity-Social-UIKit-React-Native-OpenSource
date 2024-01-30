import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  LogBox,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStyles } from './styles';
import { SvgXml } from 'react-native-svg';
import { circleCloseIcon, searchIcon } from '../../svg/svg-xml-list';
import { useNavigation } from '@react-navigation/native';
import CustomTab from '../../components/CustomTab';
import {
  CommunityRepository,
  UserRepository,
} from '@amityco/ts-sdk-react-native';
import type { ISearchItem } from '../../components/SearchItem';
import SearchItem from '../../components/SearchItem';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { TabName } from '../../enum/tabNameState';

enum searchTypeEnum {
  user = 'user',
  community = 'community',
}

export default function CommunitySearch() {
  const theme = useTheme() as MyMD3Theme;
  LogBox.ignoreAllLogs(true);
  const styles = getStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState(searchTypeEnum.community);
  const [communities, setCommunities] =
    useState<Amity.LiveCollection<Amity.Community>>();
  const [usersObject, setUsersObject] =
    useState<Amity.LiveCollection<Amity.User>>();
  const navigation = useNavigation<any>();
  const [searchList, setSearchList] = useState<ISearchItem[]>([]);
  const {
    data: communitiesArr = [],
    // onNextPage,
    // hasNextPage,
    // loading,
    // error,
  } = communities ?? {};
  const {
    data: userArr = [],
    // onNextPage,
    // hasNextPage,
    // loading,
    // error,
  } = usersObject ?? {};
  const handleChange = (text: string) => {
    setSearchTerm(text);
  };
  useEffect(() => {
    if (searchTerm.length > 0 && searchType === 'community') {
      searchCommunities(searchTerm);
    } else if (searchTerm.length > 0 && searchType === 'user') {
      searchAccounts(searchTerm);
    }
  }, [searchTerm, searchType]);

  const searchCommunities = (text: string) => {
    const unsubscribe = CommunityRepository.getCommunities(
      {
        displayName: text,
        membership: 'notMember',
        limit: 20,
        sortBy: 'displayName',
      },
      (data) => {
        setCommunities(data);
        if (data.data.length === 0) {
          setSearchList([]);
        }
      }
    );
    unsubscribe();
  };
  const searchAccounts = (text: string = '') => {
    if (text.length > 2) {
      const unsubscribe = UserRepository.getUsers(
        { displayName: text, limit: 20, sortBy: 'displayName' },
        (data) => {
          setUsersObject(data);
        }
      );
      unsubscribe();
    }
  };

  useEffect(() => {
    if (communitiesArr.length > 0 && searchType === searchTypeEnum.community) {
      const searchItem: ISearchItem[] = communitiesArr.map((item) => {
        return {
          targetId: item?.communityId,
          targetType: searchType,
          displayName: item?.displayName,
          categoryIds: item?.categoryIds,
          avatarFileId: item?.avatarFileId ?? '',
        };
      });
      setSearchList(searchItem);
    }
  }, [communitiesArr, searchType]);

  useEffect(() => {
    if (userArr && userArr.length > 0 && searchType === searchTypeEnum.user) {
      const searchUsers: ISearchItem[] = userArr.map((item) => {
        return {
          targetId: item?.userId,
          targetType: searchType,
          avatarFileId: (item?.avatarFileId as string) ?? '',
          displayName: item?.displayName as string,
        };
      });
      setSearchList(searchUsers);
    }
  }, [userArr, searchType]);

  const clearButton = () => {
    setSearchTerm('');
  };

  const cancelSearch = () => {
    navigation.goBack();
  };
  const handleTabChange = (tabName: TabName) => {
    if (tabName === TabName.Communities) {
      setSearchType(searchTypeEnum.community);
      if (searchTerm.length > 0) {
        searchCommunities(searchTerm);
      }
    } else if (tabName === TabName.Accounts) {
      setSearchType(searchTypeEnum.user);
      if (searchTerm.length > 0) {
        searchAccounts(searchTerm);
      }
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrap}>
        <View style={styles.inputWrap}>
          <TouchableOpacity onPress={() => searchAccounts(searchTerm)}>
            <SvgXml
              xml={searchIcon(theme.colors.base)}
              width="20"
              height="20"
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={searchTerm}
            onChangeText={handleChange}
          />
          <TouchableOpacity onPress={clearButton}>
            <SvgXml xml={circleCloseIcon} width="20" height="20" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={cancelSearch}>
          <Text style={styles.cancelBtn}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <CustomTab
        tabName={[TabName.Communities, TabName.Accounts]}
        onTabChange={handleTabChange}
      />
      <ScrollView contentContainerStyle={styles.searchScrollList}>
        {searchList.map((item, index) => (
          <SearchItem key={index} target={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
