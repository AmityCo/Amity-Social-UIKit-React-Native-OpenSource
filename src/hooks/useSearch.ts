import { UserRepository } from '@amityco/ts-sdk-react-native';
import { useCallback, useEffect, useState, useRef } from 'react';
import { ISearchItem } from '../components/SearchItem';

export type TSearchItem = Amity.User &
  ISearchItem & { name: string; id: string };

const useSearch = (searchText: string = '') => {
  const onNextPageRef = useRef<(() => void) | undefined | null>(null);
  const [searchResult, setSearchResult] = useState<TSearchItem[]>([]);
  const searchData = useCallback((text: string) => {
    return UserRepository.getUsers(
      { displayName: text, limit: 5, sortBy: 'displayName' },
      ({ data, error, hasNextPage, onNextPage }) => {
        if (error) return null;
        hasNextPage
          ? (onNextPageRef.current = onNextPage)
          : (onNextPageRef.current = null);
        const mappedSearchData = data.map((item) => {
          return {
            ...item,
            name: item.displayName,
            id: item.userId,
          };
        }) as TSearchItem[];
        setSearchResult(mappedSearchData);
      }
    );
  }, []);

  useEffect(() => {
    if (searchText.length < 2) return setSearchResult([]);
    searchData(searchText);
  }, [searchText, searchData]);

  return { searchResult, getNextPage: onNextPageRef.current };
};

export default useSearch;
