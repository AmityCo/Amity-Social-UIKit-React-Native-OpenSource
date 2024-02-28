import { UserRepository } from '@amityco/ts-sdk-react-native';
import { useCallback, useEffect, useState } from 'react';

const useSearch = (searchText: string = '') => {
  const [searchResult, setSearchResult] = useState([]);
  const [getNextPage, setGetNextPage] = useState(null);
  const searchData = useCallback((text: string) => {
    return UserRepository.getUsers(
      { displayName: text, limit: 5, sortBy: 'displayName' },
      ({ data, error, hasNextPage, onNextPage }) => {
        if (error) return null;
        hasNextPage ? setGetNextPage(() => onNextPage) : setGetNextPage(null);
        const mappedSearchData = data.map((item) => {
          return {
            ...item,
            name: item.displayName,
            id: item.userId,
          };
        });
        setSearchResult(mappedSearchData);
      }
    );
  }, []);

  useEffect(() => {
    if (searchText.length < 2) return setSearchResult([]);
    searchData(searchText);
  }, [searchText, searchData]);

  return { searchResult, getNextPage };
};

export default useSearch;
