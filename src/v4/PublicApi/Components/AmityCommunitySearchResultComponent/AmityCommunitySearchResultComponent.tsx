import { FlatList, StyleSheet, View } from 'react-native';
import React, { FC, memo } from 'react';
import { TabName } from '../../../enum/enumTabName';
import SearchResultItem from '../../../component/SearchResultItem/SearchResultItem';

type AmityCommunitySearchResultComponentType = {
  searchResult: Amity.Community[] & Amity.User[];
  searchType: TabName;
  onNextPage: () => void;
};

const AmityCommunitySearchResultComponent: FC<
  AmityCommunitySearchResultComponentType
> = ({ searchResult, searchType, onNextPage }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  const renderSearchResultItem = ({
    item,
  }: {
    item: Amity.Community & Amity.User;
  }) => {
    return <SearchResultItem item={item} searchType={searchType} />;
  };

  if (!searchResult?.length) return null;

  return (
    <View style={styles.container}>
      <FlatList
        data={searchResult}
        renderItem={renderSearchResultItem}
        keyExtractor={(_, index) => index.toString()}
        onEndReached={() => {
          onNextPage && onNextPage();
        }}
      />
    </View>
  );
};

export default memo(AmityCommunitySearchResultComponent);
