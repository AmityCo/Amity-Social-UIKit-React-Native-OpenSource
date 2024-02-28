import { UserRepository } from '@amityco/ts-sdk-react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  SectionList,
  type NativeScrollEvent,
  type ListRenderItemInfo,
  TextInput,
} from 'react-native';

import { useStyle } from './styles';
import type { UserInterface } from '../../types/user.interface';
import UserItem from '../UserItem';
import SectionHeader from '../ListSectionHeader';
import SelectedUserHorizontal from '../SelectedUserHorizontal';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import CloseIcon from '../../svg/CloseIcon';
import { SearchIcon } from '../../svg/SearchIcon';
import CircleCloseIcon from '../../svg/CircleCloseIcon';
interface IModal {
  visible: boolean;
  userId?: string;
  initUserList: UserInterface[];
  onClose: () => void;
  onSelect: (users: UserInterface[]) => void;
  excludeUserList?: UserInterface[];
}
export type SelectUserList = {
  title: string;
  data: UserInterface[];
};
const AddMembersModal = ({
  visible,
  onClose,
  onSelect,
  initUserList,
  excludeUserList = [],
}: IModal) => {
  const styles = useStyle();
  const theme = useTheme() as MyMD3Theme;
  const [sectionedGroupUserList, setSectionedGroupUserList] = useState<
    SelectUserList[]
  >([]);
  const [selectedUserList, setSelectedUserList] =
    useState<UserInterface[]>(initUserList);
  const userNextPageRef = useRef<() => void>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSelectedUserList([...initUserList]);
  }, [initUserList]);

  const queryAccounts = useCallback(
    (text: string = '') => {
      const unsubscribe = UserRepository.searchUserByDisplayName(
        { displayName: text, limit: 20 },
        ({ data, onNextPage }) => {
          userNextPageRef.current = onNextPage;
          setSectionedGroupUserList([]);
          const groupedUser = data.reduce((acc, item) => {
            const initial = item.displayName.charAt(0).toUpperCase();
            //exclude existing members
            if (
              !excludeUserList.some(
                (excludedUser) => excludedUser.userId === item.userId
              )
            ) {
              const existingGroup = acc.find(
                (group) => group.title === initial
              );
              if (existingGroup) {
                existingGroup.data.push(item);
              } else {
                acc.push({
                  title: initial,
                  data: [item],
                });
              }
            }
            return acc;
          }, []);
          setSectionedGroupUserList(groupedUser);
        }
      );
      return () => unsubscribe();
    },
    [excludeUserList]
  );
  const handleChange = (text: string) => {
    setSearchTerm(text);
  };

  useEffect(() => {
    if (searchTerm.length === 0 || searchTerm.length > 2) {
      queryAccounts(searchTerm);
    }
  }, [queryAccounts, searchTerm]);

  const clearButton = () => {
    setSearchTerm('');
    setSectionedGroupUserList([]);
  };

  const renderSectionHeader = ({ section }: { section: SelectUserList }) => (
    <SectionHeader title={section.title} />
  );

  const onUserPressed = (user: UserInterface) => {
    const isIncluded = selectedUserList.some(
      (item) => item.userId === user.userId
    );

    if (isIncluded) {
      const removedUser = selectedUserList.filter(
        (item) => item.userId !== user.userId
      );
      setSelectedUserList(removedUser);
    } else {
      setSelectedUserList((prev) => [...prev, user]);
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<UserInterface>) => {
    const selectedUser = selectedUserList.some(
      (user) => user.userId === item.userId
    );
    const userObj: UserInterface = {
      userId: item.userId,
      displayName: item.displayName as string,
      avatarFileId: item.avatarFileId as string,
    };
    return (
      <UserItem
        showThreeDot={false}
        user={userObj}
        isCheckmark={selectedUser}
        onPress={onUserPressed}
      />
    );
  };
  const handleScroll = ({
    nativeEvent,
  }: {
    nativeEvent: NativeScrollEvent;
  }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isEnd =
      layoutMeasurement.height + contentOffset.y >= contentSize.height;
    console.log('isEnd:', isEnd);
  };
  const handleOnClose = () => {
    setSelectedUserList(initUserList);
    onClose && onClose();
  };
  const handleLoadMore = () => {
    userNextPageRef?.current && userNextPageRef.current();
  };

  const onDeleteUserPressed = (user: UserInterface) => {
    const removedUser = selectedUserList.filter((item) => item !== user);
    setSelectedUserList(removedUser);
  };

  const onDone = () => {
    onSelect && onSelect(selectedUserList);
    onClose && onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleOnClose}>
            <CloseIcon color={theme.colors.base} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Select Member</Text>
          </View>
          <TouchableOpacity
            disabled={selectedUserList.length === 0}
            onPress={onDone}
          >
            <Text
              style={[
                selectedUserList.length > 0
                  ? styles.doneText
                  : styles.disabledDone,
              ]}
            >
              Done
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputWrap}>
          <TouchableOpacity onPress={() => queryAccounts(searchTerm)}>

            <SearchIcon width={20} height={20} color={theme.colors.base} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={searchTerm}
            onChangeText={handleChange}
          />
          <TouchableOpacity onPress={clearButton}>
            <CircleCloseIcon width={20} height={20} />
          </TouchableOpacity>
        </View>
        {selectedUserList.length > 0 ? (
          <SelectedUserHorizontal
            users={selectedUserList}
            onDeleteUserPressed={onDeleteUserPressed}
          />
        ) : (
          <View />
        )}
        <SectionList
          sections={sectionedGroupUserList}
          renderItem={renderItem}
          onScroll={handleScroll}
          renderSectionHeader={renderSectionHeader}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.8}
          keyExtractor={(item) => item.userId.toString()}
        />
      </View>
    </Modal>
  );
};

export default AddMembersModal;
