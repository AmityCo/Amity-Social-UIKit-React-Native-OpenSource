/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  LogBox,
  ScrollView,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import debounce from 'lodash.debounce';
import { getStyles } from './styles';
import { SvgXml } from 'react-native-svg';
import { circleCloseIcon, plusIcon, searchIcon } from '../../svg/svg-xml-list';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import type { ISearchItem } from '../../components/SearchItem';
import SearchItem from '../../components/SearchItem';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export default function AllMyCommunity({ navigation }) {
  const theme = useTheme() as MyMD3Theme;
  const styles = getStyles();
  LogBox.ignoreAllLogs(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType] = useState('community');
  const [communities, setCommunities] =
    useState<Amity.LiveCollection<Amity.Community>>();
  const [searchList, setSearchList] = useState<ISearchItem[]>([]);
  const scrollViewRef = useRef(null);
  const { data: communitiesArr = [], onNextPage } = communities ?? {};

  const onClickCreateCommunity = () => {
    navigation.navigate('CreateCommunity');
  };

  const handleChange = (text: string) => {
    setSearchTerm(text);
  };
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isScrollEndReached =
      layoutMeasurement.height + contentOffset.y + 200 >= contentSize.height;

    if (isScrollEndReached) {
      onNextPage && onNextPage();
    }
  };
  useEffect(() => {
    searchCommunities(searchTerm);
  }, [searchTerm]);

  const searchCommunities = (text: string) => {
    const unsubscribe = CommunityRepository.getCommunities(
      { displayName: text, membership: 'member', limit: 20 },
      (data) => {
        setCommunities(data);
        if (data.data.length === 0) {
          setSearchList([]);
        }
      }
    );
    unsubscribe();
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
  }, [communitiesArr]);

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 500);
  }, []);

  const headerRight = useCallback(
    () => (
      <TouchableOpacity onPress={onClickCreateCommunity}>
        <SvgXml xml={plusIcon(theme.colors.base)} width="25" height="25" />
      </TouchableOpacity>
    ),
    []
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => headerRight(),
      headerTitle: 'My Community',
    });
    return () => {
      debouncedResults.cancel();
    };
  }, []);

  const clearButton = () => {
    setSearchTerm('');
  };

  const cancelSearch = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <View style={styles.inputWrap}>
          <SvgXml xml={searchIcon(theme.colors.base)} width="20" height="20" />

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
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={20}
        contentContainerStyle={styles.searchScrollList}
      >
        {searchList.map((item, index) => (
          <SearchItem key={index} target={item} />
        ))}
      </ScrollView>
    </View>
  );
}
