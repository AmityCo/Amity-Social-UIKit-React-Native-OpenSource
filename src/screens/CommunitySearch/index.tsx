/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  LogBox,
  ScrollView,
} from 'react-native';
import debounce from 'lodash.debounce';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import { SvgXml } from 'react-native-svg';
import { circleCloseIcon, searchIcon } from '../../svg/svg-xml-list';
import { useNavigation } from '@react-navigation/native';
import CustomTab from '../../components/CustomTab';
import { CommunityRepository, UserRepository } from '@amityco/ts-sdk';
import type { ISearchItem } from '../../components/SearchItem';
import SearchItem from '../../components/SearchItem';

export default function CommunitySearch() {
  LogBox.ignoreAllLogs(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('community');
  console.log('searchType: ', searchType);
  console.log('searchTerm: ', searchTerm);
  const [communities, setCommunities] =
    useState<Amity.LiveCollection<Amity.Community>>();
  const [usersObject, setUsersObject] =
    useState<Amity.LiveCollection<Amity.User>>();
  const navigation = useNavigation<any>();
  const [searchList, setSearchList] = useState<ISearchItem[]>([]);
  console.log('searchList: ', searchList);
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
  console.log('communitiesArr: ', communitiesArr);
  console.log('userArr: ', userArr);
  const handleChange = (text: string) => {
    setSearchTerm(text);
  };
  useEffect(() => {
    if (searchTerm.length > 2 && searchType === 'community') {
      searchCommunities(searchTerm);
    } else if (searchTerm.length > 2 && searchType === 'user') {
      // setTimeout(() => {
      searchAccounts(searchTerm);
      // }, 500);
    }
  }, [searchTerm]);

  const searchCommunities = (text: string) => {
    const unsubscribe = CommunityRepository.getCommunities(
      { displayName: text, membership: 'notMember', limit: 40 },
      (data) => {
        console.log('data: ', data);
        setCommunities(data);
        if (data.data.length === 0) {
          setSearchList([]);
        }
      }
    );
    unsubscribe();
  };
  const searchAccounts = (text: string) => {
    if (searchTerm.length > 0) {
      console.log('text: users ', searchTerm);
      //   try {
      const unsubscribe = UserRepository.getUsers(
        { displayName: text },
        (data) => {
          if (data.data.length === 0) {
            setSearchList([]);
          } else {
            setUsersObject(data);
          }
        }
      );
      unsubscribe();
    }
  };

  useEffect(() => {
    if (communitiesArr.length > 0 && searchType === 'community') {
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
    if (userArr.length > 0 && searchType === 'user') {
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
  }, [usersObject, searchType]);

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 500);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  const clearButton = () => {
    console.log('clearButton: ');
    setSearchTerm('');
  };

  const cancelSearch = () => {
    navigation.goBack();
  };
  const handleTabChange = (index: number) => {
    if (index === 1) {
      setSearchType('community');
      searchCommunities(searchTerm);
    } else if (index === 2) {
      setSearchType('user');
      searchAccounts(searchTerm);
    }
    console.log('index: ', index);
  };
  return (
    <SafeAreaView>
      <View style={styles.headerWrap}>
        <View style={styles.inputWrap}>
          <TouchableOpacity onPress={() => searchAccounts(searchTerm)}>
            <SvgXml xml={searchIcon} width="20" height="20" />
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
        tabName={['Communities', 'Accounts']}
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
