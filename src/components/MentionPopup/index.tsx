import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { getStyles } from './styles';
import { UserRepository } from '@amityco/ts-sdk-react-native';
import SearchItem, { ISearchItem } from '../SearchItem';
export default function MentionPopup({
  userName,
  onSelectMention,
}: {
  userName: string;
  onSelectMention: (target: ISearchItem) => void;
}) {
  const styles = getStyles();
  const [usersObject, setUsersObject] =
    useState<Amity.LiveCollection<Amity.User>>();
  const [searchList, setSearchList] = useState<ISearchItem[]>([]);

  const {
    data: userArr = [],
    onNextPage,
    // hasNextPage,
    // loading,
    // error,
  } = usersObject ?? {};

  useEffect(() => {
    searchAccounts(userName);
  }, [userName]);

  const searchAccounts = (text: string = '') => {
    let searchProps = {};
    if (text.length > 2) {
      searchProps = { displayName: userName, limit: 10, sortBy: 'displayName' };
    } else {
      searchProps = { limit: 10, sortBy: 'displayName' };
    }
    const unsubscribe = UserRepository.getUsers(searchProps, (data) => {
      setUsersObject(data);
    });
    unsubscribe();
  };

  const handleLoadMore = () => {
    onNextPage && onNextPage();
  };
  useEffect(() => {
    if (userArr && userArr.length) {
      const searchUsers: ISearchItem[] = userArr.map((item) => {
        return {
          targetId: item?.userId,
          targetType: 'user',
          avatarFileId: (item?.avatarFileId as string) ?? '',
          displayName: item?.displayName as string,
        };
      });
      setSearchList(searchUsers);
    }
  }, [userArr]);

  const onSelectUser = (target: ISearchItem) => {
    onSelectMention && onSelectMention(target);
  };
  return (
    <View style={styles.mentionContainer}>
      <FlatList
        data={searchList}
        renderItem={({ item, index }) => {
          return (
            <SearchItem
              key={index}
              target={item}
              userProfileNavigateEnabled={false}
              onPress={onSelectUser}
            />
          );
        }}
        keyExtractor={(item) => item.targetId}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.7}
      />
    </View>
  );
}
