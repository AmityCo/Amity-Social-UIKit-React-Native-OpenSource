import React, { memo, useState } from 'react';
import { useStyles } from './styles';
import AmityTopSearchBarComponent from '../../Components/AmityTopSearchBarComponent/AmityTopSearchBarComponent';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAmityGlobalSearchViewModel } from '../../../hook';
import { TabName } from '../../../enum/enumTabName';
import CustomTab from '../../../component/CustomTab';
import AmityCommunitySearchResultComponent from '../../Components/AmityCommunitySearchResultComponent/AmityCommunitySearchResultComponent';
import { PageID } from '../../../enum';
import { useAmityPage } from '../../../hook';
import AmityUserSearchResultComponent from '../../Components/AmityUserSearchResultComponent/AmityUserSearchResultComponent';

const AmitySocialGlobalSearchPage = () => {
  const pageId = PageID.social_global_search_page;
  const { isExcluded, themeStyles } = useAmityPage({ pageId });
  const styles = useStyles(themeStyles);
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState(TabName.Communities);
  const { searchResult, onNextCommunityPage, onNextUserPage } =
    useAmityGlobalSearchViewModel(searchValue, searchType);
  const isCommunity = searchType === TabName.Communities;
  if (isExcluded) return null;
  return (
    <SafeAreaView style={styles.container}>
      <AmityTopSearchBarComponent
        searchType={searchType}
        setSearchValue={setSearchValue}
      />
      <CustomTab
        onTabChange={setSearchType}
        tabName={[TabName.Communities, TabName.Users]}
      />
      {isCommunity ? (
        <AmityCommunitySearchResultComponent
          pageId={pageId}
          searchType={searchType}
          searchResult={searchResult}
          onNextPage={onNextCommunityPage}
        />
      ) : (
        <AmityUserSearchResultComponent
          pageId={pageId}
          searchResult={searchResult}
          onNextPage={onNextUserPage}
        />
      )}
    </SafeAreaView>
  );
};

export default memo(AmitySocialGlobalSearchPage);
