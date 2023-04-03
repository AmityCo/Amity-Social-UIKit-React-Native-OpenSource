/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import {
  ListRenderItem,
  NativeScrollEvent,
  SectionList,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAuth from '../../hooks/useAuth';
import SearchBar from '../../components/SearchBar/index';
import { styles } from './styles';
import SectionHeader from '../../components/ListSectionHeader/index';
import UserItem from '../../components/UserItem/index';
import type { UserGroup } from '../../types/user.interface';
import { groupUsers, queryUser } from '../../providers/user-provider';
import SelectedUserHorizontal from '../../components/SelectedUserHorizontal/index';
import DoneButton from '../../components/DoneButton';
import { createAmityChannel } from '../../providers/channel-provider';
import CloseButton from '../../components/CloseButton/index';
import type { queryUsers } from '@amityco/ts-sdk';
import { LoadingOverlay } from '../../components/LoadingOverlay';

export default function SelectMembers({ navigation }: any) {
  // const { t, i18n } = useTranslation();
  const { client } = useAuth();
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const [sectionedUserList, setSectionedUserList] = useState<UserGroup[]>([]);
  const [selectedUserList, setSelectedUserList] = useState<Amity.User[]>([]);
  console.log('selectedUserList: ', selectedUserList);
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
      const result = await queryUser(setUserListOptions, nextPage, displayName);
      let sectionedList: UserGroup[] = [];
      if (displayName != undefined && displayName != '') {
        searchUserList.current = [];
        searchUserList.current = result;
        sectionedList = groupUsers(searchUserList.current);
      } else {
        if (isPaginate || userList.current.length == 0) {
          userList.current = userList.current.concat(result);
        }
        sectionedList = groupUsers(userList.current);
      }
      setSectionedUserList([...sectionedList]);
      // eslint-disable-next-line no-catch-shadow
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
      // eslint-disable-next-line react/no-unstable-nested-components
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
  const onDeleteUserPressed = (user: Amity.User) => {
    const index = selectedUserListRef.current.findIndex(
      (item) => item.displayName === user.displayName
    );
    selectedUserList.splice(index, 1);
    setSelectedUserList([...selectedUserListRef.current]);
  };
  const onUserPressed = (user: Amity.User) => {
    const index = selectedUserListRef.current.findIndex(
      (item) => item.displayName === user.displayName
    );
    if (index !== -1) {
      // Deselect user
      selectedUserListRef.current.splice(index, 1);
      setSelectedUserList([...selectedUserListRef.current]);
    } else {
      // Select user
      selectedUserListRef.current.push(user);
      setSelectedUserList([...selectedUserListRef.current]);
    }
  };

  const onDonePressed = async () => {
    if (selectedUserList.length === 0) {
      navigation.goBack();
    }

    try {
      const result = await createAmityChannel(
        (client as Amity.Client).userId!,
        selectedUserListRef.current
      );
      if (selectedUserList.length === 1 && selectedUserList[0]) {
        const oneOnOneChatObject = {
          userId: selectedUserList[0]._id,
          displayName: selectedUserList[0].displayName as string,
          avatarFileId: selectedUserList[0].avatarFileId as string,
        };
        navigation.goBack();
        setTimeout(() => {
          navigation.navigate('ChatRoom', {
            channelId: result.channelId,
            chatReceiver: oneOnOneChatObject,
          });
        }, 300);
      } else if (selectedUserList.length > 1) {
        const chatDisplayName = selectedUserList.map(
          (item) => item.displayName
        );
        const userObject = selectedUserList.map((item: Amity.User) => {
          return {
            userId: item.userId,
            displayName: item.displayName,
            avatarFileId: item.avatarFileId,
          };
        });
        const groupChatObject = {
          chatDisplayName: chatDisplayName.join(','),
          users: userObject,
        };
        console.log('groupChatObject: ', groupChatObject);
        navigation.goBack();
        setTimeout(() => {
          navigation.navigate('ChatRoom', {
            channelId: result.channelId,
            chatReceiver: groupChatObject,
          });
        }, 300);
      }

      console.log('create chat success ' + JSON.stringify(result));
    } catch (error) {
      console.log('create chat error ' + JSON.stringify(error));
      console.error(error);
    } finally {
      setShowLoadingIndicator(false);
    }
  };

  const renderItem: ListRenderItem<Amity.User> = ({ item }) => {
    let isCheckmark = false;
    const selectedUser = selectedUserList.find(
      (user) => user.userId === item.userId
    );
    isCheckmark = selectedUser ? true : false;
    return (
      <UserItem user={item} isCheckmark={isCheckmark} onPress={onUserPressed} />
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
        {selectedUserList.length > 0 ? (
          <SelectedUserHorizontal
            users={selectedUserList}
            onDeleteUserPressed={onDeleteUserPressed}
          />
        ) : (
          <View />
        )}
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
