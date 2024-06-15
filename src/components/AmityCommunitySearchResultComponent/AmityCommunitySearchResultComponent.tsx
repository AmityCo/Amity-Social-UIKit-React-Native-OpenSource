import { FlatList, StyleSheet, View } from 'react-native';
import React, { FC, memo } from 'react';
import { TabName } from '../../enum/enumTabName';

import { ComponentID, PageID } from '../../enum';


import { useAmityComponent } from '../../hooks/useUiKitReference';
import SearchResultItem from '../SearchResultItem/SearchResultItem';




type AmityCommunitySearchResultComponentType = {
  pageId?: PageID;
  searchResult: Amity.Community[] & Amity.User[];
  searchType: TabName;
  onNextPage: () => void;
};

const AmityCommunitySearchResultComponent: FC<
  AmityCommunitySearchResultComponentType
> = ({
  searchResult,
  searchType,
  onNextPage,
  pageId = PageID.WildCardPage,
}) => {
  const componentId = ComponentID.community_search_result;
  const { isExcluded } = useAmityComponent({ pageId, componentId });
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
    return (
      <SearchResultItem
        item={item}
        searchType={searchType}
        pageId={pageId}
        componentId={componentId}
      />
    );
  };

  if (isExcluded) return null;
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
