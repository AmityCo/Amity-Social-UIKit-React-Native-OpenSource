import React, { memo, useState } from 'react';
import { useStyles } from './styles';
import AmityTopSearchBarComponent from '../../Components/AmityTopSearchBarComponent/AmityTopSearchBarComponent';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAmityGlobalSearchViewModel } from '../../../hook';
import { TabName } from '../../../enum/enumTabName';
import AmityCommunitySearchResultComponent from '../../Components/AmityCommunitySearchResultComponent/AmityCommunitySearchResultComponent';
import { PageID } from '../../../enum';
import { useAmityPage } from '../../../hook';
import NoSearchResult from '../../../component/NoSearchResult/NoSearchResult';

const AmityMyCommunitiesSearchPage = () => {
  const pageId = PageID.social_global_search_page;
  const { isExcluded, themeStyles } = useAmityPage({ pageId });
  const styles = useStyles(themeStyles);
  const [searchValue, setSearchValue] = useState<null | string>(null);
  const searchType = TabName.MyCommunities;
  const { searchResult, onNextMyCommunityPage } = useAmityGlobalSearchViewModel(
    searchValue,
    searchType
  );

  if (isExcluded) return null;
  return (
    <SafeAreaView style={styles.container}>
      <AmityTopSearchBarComponent
        searchType={searchType}
        setSearchValue={setSearchValue}
      />
      {searchValue && searchResult?.length === 0 ? (
        <NoSearchResult />
      ) : (
        <AmityCommunitySearchResultComponent
          pageId={pageId}
          searchType={searchType}
          searchResult={searchResult}
          onNextPage={onNextMyCommunityPage}
        />
      )}
    </SafeAreaView>
  );
};

export default memo(AmityMyCommunitiesSearchPage);
