/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useRef, useState } from 'react';
import {
  ListRenderItem,
  NativeScrollEvent,
  Platform,
  SectionList,
  View,
  ActionSheetIOS,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAuth from '../../hooks/useAuth';
import SearchBar from '../../components/SearchBar/index';
import { styles } from './styles';
import SectionHeader from '../../components/ListSectionHeader/index';
import UserItem from '../../components/UserItem/index';
import type { UserGroup } from '../../types/user.interface';
import { groupUsers, reportUser } from '../../providers/user-provider';
import DoneButton from '../../components/DoneButton';
import {
  createAmityChannel,
  queryChannelMember,
} from '../../providers/channel-provider';
import CloseButton from '../../components/CloseButton/index';
import type { queryUsers } from '@amityco/ts-sdk';
import { LoadingOverlay } from '../../components/LoadingOverlay';

export default function MemberDetail({ navigation, route }: any) {
  //   const { t, i18n } = useTranslation();
  const { channelID } = route.params;
  const { client } = useAuth();
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const [sectionedUserList, setSectionedUserList] = useState<UserGroup[]>([]);
  const [selectedUserList] = useState<Amity.User[]>([]);
  const [isScrollEnd, setIsScrollEnd] = useState(false);
  const [userListOptions, setUserListOptions] =
    useState<Amity.RunQueryOptions<typeof queryUsers>>();
  const { loading, nextPage } = userListOptions ?? {};
  const selectedUserListRef = useRef(selectedUserList);
  const userList = useRef<Amity.User[]>([]);
  const searchText = useRef<string>();
  const searchUserList = useRef<Amity.User[]>([]);
  let isPaginate = false;

  const loadUserList = async (
    nextPage?: Amity.Page<number> | undefined,
    displayName?: string
  ) => {
    try {
      const result: (Amity.User | undefined)[] = (
        await queryChannelMember(
          setUserListOptions,
          channelID,
          nextPage,
          displayName
        )
      ).map((value) => {
        return value.user;
      });
      let sectionedList: UserGroup[] = [];
      console.log(
        'enter which one' +
          (displayName != undefined && displayName != '') +
          ' --- ' +
          displayName
      );
      if (displayName != undefined && displayName != '') {
        searchUserList.current = [];
        searchUserList.current = result as Amity.User[];
        sectionedList = groupUsers(searchUserList.current);
      } else {
        console.log(
          'enter not search' +
            (!isPaginate && sectionedList.length > 0) +
            ' ---- ' +
            `${isPaginate}` +
            ' ----- ' +
            `${userList.current.length}`
        );
        if (isPaginate || userList.current.length == 0) {
          userList.current = userList.current.concat(result as Amity.User[]);
        }
        sectionedList = groupUsers(userList.current);
      }
      setSectionedUserList([...sectionedList]);
    } catch (error) {
      console.error(error);
    } finally {
      isPaginate = false;
      setShowLoadingIndicator(false);
    }
  };
  useEffect(() => {
    loadUserList();
  }, []);
  useEffect(() => {
    if (isScrollEnd) {
      isPaginate = true;
      handleLoadMore();
    }
  }, [isScrollEnd]);

  React.useLayoutEffect(() => {
    // Set the headerRight component to a TouchableOpacity
    navigation.setOptions({
      headerLeft: () => <CloseButton navigation={navigation} />,
      headerRight: () => (
        <DoneButton navigation={navigation} onDonePressed={onDonePressed} />
      ),
    });
  }, [navigation]);

  const handleLoadMore = () => {
    if (!loading) {
      loadUserList(nextPage);
    }
  };
  const handleScroll = ({
    nativeEvent,
  }: {
    nativeEvent: NativeScrollEvent;
  }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isEnd =
      layoutMeasurement.height + contentOffset.y >= contentSize.height;

    setIsScrollEnd(isEnd);
  };
  const renderSectionHeader = ({ section }: { section: UserGroup }) => (
    <SectionHeader title={section.title} />
  );

  const handleSearch = (text: string) => {
    searchText.current = text;

    setTimeout(() => {
      loadUserList(undefined, text);
    }, 500);
  };
  const onThreeDotTap = (user: Amity.User) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Report User'],
          cancelButtonIndex: 0,
        },
        () => {
          reportUser(user.userId);
        }
      );
    } else {
      Alert.alert('Report', '', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report user',
          onPress: () => {
            reportUser(user.userId);
          },
        },
      ]);
    }
  };

  const onDonePressed = async () => {
    try {
      const result = await createAmityChannel(
        (client as Amity.Client).userId!,
        selectedUserListRef.current
      );
      console.log('create chat success ' + JSON.stringify(result));
    } catch (error) {
      console.log('create chat error ' + JSON.stringify(error));
      console.error(error);
    } finally {
      setShowLoadingIndicator(false);
    }
  };

  const renderItem: ListRenderItem<Amity.User> = ({ item }) => {
    return (
      <UserItem user={item} showThreeDot={true} onThreeDotTap={onThreeDotTap} />
    );
  };
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 60 }]}>
      <LoadingOverlay
        isLoading={showLoadingIndicator && sectionedUserList.length <= 0}
        loadingText="Loading..."
      />
      <View>
        <SearchBar handleSearch={handleSearch} />
        <SectionList
          sections={sectionedUserList}
          renderItem={renderItem}
          onScroll={handleScroll}
          renderSectionHeader={renderSectionHeader}
          // keyExtractor={(item, index) => index}
        />
      </View>
    </View>
  );
}
