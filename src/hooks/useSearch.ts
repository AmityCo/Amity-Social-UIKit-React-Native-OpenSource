import {
  CommunityRepository,
  UserRepository,
} from '@amityco/ts-sdk-react-native';
import { useCallback, useEffect, useState, useRef } from 'react';
import { ISearchItem } from '../components/SearchItem';

export type TSearchItem = Amity.User &
  ISearchItem &
  Amity.Membership<'community'> & { name: string; id: string };

const useSearch = (
  searchText: string = '',
  privateCommunityId: string = ''
) => {
  const onNextPageRef = useRef<(() => void) | undefined | null>(null);
  const [searchResult, setSearchResult] = useState<TSearchItem[]>([]);
  const searchPrivateCommunityMember = useCallback(
    (text: string) => {
      return CommunityRepository.Membership.getMembers(
        {
          communityId: privateCommunityId,
          search: text,
          limit: 5,
          sortBy: 'firstCreated',
          memberships: ['member'],
        },
        ({ data, error, hasNextPage, onNextPage }) => {
          if (error) return null;
          onNextPageRef.current = hasNextPage ? onNextPage : null;
          const mappedSearchData = data.map((item) => {
            return {
              ...item.user,
              name: item.user.displayName,
              id: item.userId,
            };
          }) as TSearchItem[];
          setSearchResult(mappedSearchData);
        }
      );
    },
    [privateCommunityId]
  );

  const searchAllUsers = useCallback((text: string) => {
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
    if (privateCommunityId) return searchPrivateCommunityMember(searchText);
    if (searchText?.length < 2) return setSearchResult([]);
    return searchAllUsers(searchText);
  }, [
    privateCommunityId,
    searchAllUsers,
    searchPrivateCommunityMember,
    searchText,
  ]);

  return { searchResult, getNextPage: onNextPageRef.current };
};

export default useSearch;
