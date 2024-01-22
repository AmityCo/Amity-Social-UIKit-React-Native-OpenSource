import { UserRepository } from '@amityco/ts-sdk-react-native';
import React, { useEffect, useState } from 'react';
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
import { SvgXml } from 'react-native-svg';
import { getStyles } from './styles';
import { circleCloseIcon, closeIcon, searchIcon } from '../../svg/svg-xml-list';
import type { UserInterface } from '../../types/user.interface';
import UserItem from '../UserItem';
import SectionHeader from '../ListSectionHeader';
import SelectedUserHorizontal from '../SelectedUserHorizontal';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';
interface IModal {
  visible: boolean;
  userId?: string;
  initUserList: UserInterface[];
  onClose: () => void;
  onSelect: (users: UserInterface[]) => void;
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
}: IModal) => {
  const styles = getStyles();
  const theme = useTheme() as MyMD3Theme;
  const [sectionedUserList, setSectionedUserList] = useState<SelectUserList[]>(
    []
  );
  const [sectionedGroupUserList, setSectionedGroupUserList] = useState<
    SelectUserList[]
  >([]);
  const [selectedUserList, setSelectedUserList] =
    useState<UserInterface[]>(initUserList);
  // const [isScrollEnd, setIsScrollEnd] = useState(false);
  const [usersObject, setUsersObject] =
    useState<Amity.LiveCollection<Amity.User>>();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: userArr = [], onNextPage } = usersObject ?? {};

  useEffect(() => {
    setSelectedUserList(initUserList);
  }, [initUserList]);

  const queryAccounts = (text: string = '') => {
    const unsubscribe = UserRepository.searchUserByDisplayName(
      { displayName: text, limit: 20 },
      (data) => {
        setSectionedUserList([]);
        setSectionedGroupUserList([]);
        setUsersObject(data);
      }
    );
    return () => unsubscribe();
  };
  const handleChange = (text: string) => {
    setSearchTerm(text);
  };
  useEffect(() => {
    if (searchTerm.length > 2) {
      queryAccounts(searchTerm);
    }
  }, [searchTerm]);

  const clearButton = () => {
    setSearchTerm('');
    setSectionedUserList([]);
    setSectionedGroupUserList([]);
  };

  const createSectionGroup = () => {
    userArr.forEach((item) => {
      const firstChar = (item.displayName as string).charAt(0).toUpperCase();
      const isAlphabet = /^[A-Z]$/i.test(firstChar);
      const currentLetter = isAlphabet
        ? (item.displayName as string).charAt(0).toUpperCase()
        : '#';
      setSectionedUserList((prev) => [
        ...prev,
        {
          title: currentLetter as string,
          data: [
            {
              userId: item.userId,
              displayName: item.displayName as string,
              avatarFileId: item.avatarFileId as string,
            },
          ],
        },
      ]);
    });
  };
  useEffect(() => {
    createSectionGroup();
  }, [userArr]);

  useEffect(() => {
    queryAccounts();
  }, []);

  useEffect(() => {
    const jsonData: SelectUserList[] = [...sectionedUserList];

    const groupedData: SelectUserList[] = [...sectionedGroupUserList];

    jsonData.forEach((item) => {
      const existingItemIndex = groupedData.findIndex(
        (groupedItem) => groupedItem.title === item.title
      );

      if (existingItemIndex !== -1 && groupedData) {
        // If the title already exists in the groupedData array, merge the data arrays
        (groupedData[existingItemIndex] as Record<string, any>).data.push(
          ...item.data
        );
      } else {
        // If the title does not exist, add the entire item to the groupedData array
        groupedData.push(item);
      }
    });
    setSectionedGroupUserList(groupedData);
  }, [sectionedUserList]);

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
    // setIsScrollEnd(isEnd);
  };
  const handleOnClose = () => {
    setSelectedUserList(initUserList);
    onClose && onClose();
  };
  const handleLoadMore = () => {
    if (onNextPage) {
      onNextPage();
    }
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
            <SvgXml xml={closeIcon(theme.colors.base)} width="17" height="17" />
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
          // keyExtractor={(item, index) => index}
        />
      </View>
    </Modal>
  );
};

export default AddMembersModal;
