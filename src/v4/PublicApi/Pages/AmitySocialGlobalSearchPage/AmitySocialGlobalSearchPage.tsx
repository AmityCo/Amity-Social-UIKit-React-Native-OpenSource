import React, { memo, useState } from 'react';
import { useStyles } from './styles';
import AmityTopSearchBarComponent from '../../Components/AmityTopSearchBarComponent/AmityTopSearchBarComponent';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAmityGlobalSearchViewModel } from '../../../hook';
import { TabName } from '../../../enum/enumTabName';
import CustomTab from '../../../component/CustomTab';
import AmityCommunitySearchResultComponent from '../../Components/AmityCommunitySearchResultComponent/AmityCommunitySearchResultComponent';

const AmitySocialGlobalSearchPage = () => {
  const styles = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState(TabName.Communities);
  const { searchResult, onNextCommunityPage, onNextUserPage } =
    useAmityGlobalSearchViewModel(searchValue, searchType);
  const onNextPage =
    searchType === TabName.Communities ? onNextCommunityPage : onNextUserPage;
  return (
    <SafeAreaView style={styles.container}>
      <AmityTopSearchBarComponent setSearchValue={setSearchValue} />
      <CustomTab
        onTabChange={setSearchType}
        tabName={[TabName.Communities, TabName.Users]}
      />
      <AmityCommunitySearchResultComponent
        searchType={searchType}
        searchResult={searchResult}
        onNextPage={onNextPage}
      />
    </SafeAreaView>
  );
};

export default memo(AmitySocialGlobalSearchPage);
