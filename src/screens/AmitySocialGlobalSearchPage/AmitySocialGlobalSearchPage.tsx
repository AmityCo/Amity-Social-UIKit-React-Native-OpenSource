import React, { memo, useState } from 'react';
import { useStyles } from './styles';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';




import { useAmityPage } from '../../hooks/useUiKitReference';
import { PageID, TabName } from '../../enum';
import CustomTab from '../../components/CustomTab';
import { useAmityGlobalSearchViewModel } from '../../hooks/useAmityGlobalSearchViewModel';
import AmityCommunitySearchResultComponent from '../../components/AmityCommunitySearchResultComponent/AmityCommunitySearchResultComponent';
import AmityTopSearchBarComponent from '../../components/AmityTopSearchBarComponent/AmityTopSearchBarComponent';


const AmitySocialGlobalSearchPage = () => {
  const pageId = PageID.social_global_search_page;
  const { isExcluded, themeStyles } = useAmityPage({ pageId });
  const styles = useStyles(themeStyles);
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState(TabName.Communities);
  const { searchResult, onNextCommunityPage, onNextUserPage } =
    useAmityGlobalSearchViewModel(searchValue, searchType);
  const onNextPage =
    searchType === TabName.Communities ? onNextCommunityPage : onNextUserPage;
  if (isExcluded) return null;
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <AmityTopSearchBarComponent setSearchValue={setSearchValue} />
      <CustomTab
        onTabChange={setSearchType}
        tabName={[TabName.Communities, TabName.Users]}
      />
      <AmityCommunitySearchResultComponent
        pageId={pageId}
        searchType={searchType}
        searchResult={searchResult}
        onNextPage={onNextPage}
      />
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default memo(AmitySocialGlobalSearchPage);
