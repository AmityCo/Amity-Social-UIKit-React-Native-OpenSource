import { CommunityRepository } from '@amityco/ts-sdk';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  Platform,
  ActionSheetIOS,
  Alert,
} from 'react-native';
import { styles } from './styles';
import CloseButton from '../../../components/BackButton';
import UserItem from '../../../components/UserItem';

export default function CommunityMemberDetail({ navigation, route }: any) {
  const [memberList, setMemberList] = useState<Amity.Member<'community'>[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const { communityId } = route.params;
  const onNextPageRef = useRef<(() => void) | null>(null);
  const isFetchingRef = useRef(false);
  const onEndReachedCalledDuringMomentumRef = useRef(true);
  React.useLayoutEffect(() => {
    // Set the headerRight component to a TouchableOpacity
    navigation.setOptions({
      headerLeft: () => <CloseButton navigation={navigation} />,
      title: 'Member',
    });
  }, [navigation]);
  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true);
      try {
        const unsubscribe = CommunityRepository.Membership.getMembers(
          { communityId },
          ({ data: members, onNextPage, hasNextPage, loading, error }) => {
            // console.log('check all categories ' + JSON.stringify(categories));
            if (!loading) {
              console.log(
                'checking list of members ' +
                  communityId +
                  ' --- ' +
                  JSON.stringify(members)
              );
              setMemberList((prevMembers) => [
                ...prevMembers,
                ...(members || []),
              ]);
              console.log('did query members ');
              setHasNextPage(hasNextPage);
              onNextPageRef.current = onNextPage;
              isFetchingRef.current = false;
              unsubscribe();
            }
          }
        );
      } catch (error) {
        console.error('Failed to load categories:', error);
        isFetchingRef.current = false;
      } finally {
        setLoading(false);
      }
    };
    loadMembers();
  }, []);
  // const handleMemberClick = (categoryId: string, categoryName: string) => {
  //   setTimeout(() => {
  //     navigation.navigate('CommunityList', { categoryId, categoryName });
  //   }, 100);
  // };
  const reportUser = async (userId: string): boolean => {};
  const onThreeDotTap = (user: Amity.User) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Report User'],
          cancelButtonIndex: 0,
        },
        () => {
          reportUser(user.userId);
        }
      );
    } else {
      Alert.alert('Report', '', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report user',
          onPress: () => {
            reportUser(user.userId);
          },
        },
      ]);
    }
  };
  const renderMember = ({ item }: { item: Amity.Member<'community'> }) => {
    return (
      <UserItem
        user={item.user}
        showThreeDot={true}
        onThreeDotTap={onThreeDotTap}
      />
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.LoadingIndicator}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const handleEndReached = useCallback(() => {
    console.log('handleEndReached got triggered');
    if (
      !isFetchingRef.current &&
      hasNextPage &&
      !onEndReachedCalledDuringMomentumRef.current
    ) {
      isFetchingRef.current = true;
      onEndReachedCalledDuringMomentumRef.current = true;
      onNextPageRef.current && onNextPageRef.current();
    }
  }, [hasNextPage]);

  return (
    <View style={styles.container}>
      <FlatList
        data={memberList}
        renderItem={renderMember}
        keyExtractor={(item) => item.userId.toString()}
        ListFooterComponent={renderFooter}
        // onEndReached={handleEndReached}
        onEndReached={handleEndReached}
        onMomentumScrollBegin={() =>
          (onEndReachedCalledDuringMomentumRef.current = false)
        }
        onEndReachedThreshold={0.8}
      />
    </View>
  );
}

// /* eslint-disable react/no-unstable-nested-components */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-shadow */
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ListRenderItem,
//   NativeScrollEvent,
//   Platform,
//   SectionList,
//   View,
//   ActionSheetIOS,
//   Alert,
//   FlatList,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import useAuth from '../../hooks/useAuth';
// import SearchBar from '../../components/SearchBar/index';
// import { styles } from './styles';
// import SectionHeader from '../../components/ListSectionHeader/index';
// import UserItem from '../../components/UserItem/index';
// import type { UserGroup } from '../../types/user.interface';
// import { groupUsers, reportUser } from '../../providers/user-provider';
// import DoneButton from '../../components/DoneButton';
// import {
//   createAmityChannel,
//   queryChannelMember,
// } from '../../providers/channel-provider';
// import CloseButton from '../../components/CloseButton/index';
// import type { queryUsers } from '@amityco/ts-sdk';
// import { LoadingOverlay } from '../../components/LoadingOverlay';
// import BackButton from 'src/components/BackButton';
// import BackButton from '../../../components/BackButton/index';
// import UserItem from '../../../components/UserItem/index';

// export default function CommunityMemberDetail({ navigation, route }: any) {
//   //   const { t, i18n } = useTranslation();
//   const { channelID } = route.params;
//   const { client } = useAuth();
//   const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
//   const [sectionedUserList, setSectionedUserList] = useState<UserGroup[]>([]);
//   const [selectedUserList] = useState<Amity.User[]>([]);
//   const [isScrollEnd, setIsScrollEnd] = useState(false);
//   const [userListOptions, setUserListOptions] =
//     useState<Amity.RunQueryOptions<typeof queryUsers>>();
//   const { loading, nextPage } = userListOptions ?? {};
//   const selectedUserListRef = useRef(selectedUserList);
//   const userList = useRef<Amity.User[]>([]);
//   const searchText = useRef<string>();
//   const searchUserList = useRef<Amity.User[]>([]);
//   let isPaginate = false;

//   const loadUserList = async (
//     nextPage?: Amity.Page<number> | undefined,
//     displayName?: string
//   ) => {
//     try {
//       const result: (Amity.User | undefined)[] = (
//         await queryChannelMember(
//           setUserListOptions,
//           channelID,
//           nextPage,
//           displayName
//         )
//       ).map((value) => {
//         return value.user;
//       });
//       let sectionedList: UserGroup[] = [];
//       console.log(
//         'enter which one' +
//           (displayName != undefined && displayName != '') +
//           ' --- ' +
//           displayName
//       );
//       if (displayName != undefined && displayName != '') {
//         searchUserList.current = [];
//         searchUserList.current = result as Amity.User[];
//         sectionedList = groupUsers(searchUserList.current);
//       } else {
//         console.log(
//           'enter not search' +
//             (!isPaginate && sectionedList.length > 0) +
//             ' ---- ' +
//             `${isPaginate}` +
//             ' ----- ' +
//             `${userList.current.length}`
//         );
//         if (isPaginate || userList.current.length == 0) {
//           userList.current = userList.current.concat(result as Amity.User[]);
//         }
//         sectionedList = groupUsers(userList.current);
//       }
//       setSectionedUserList([...sectionedList]);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       isPaginate = false;
//       setShowLoadingIndicator(false);
//     }
//   };
//   useEffect(() => {
//     loadUserList();
//   }, []);
//   useEffect(() => {
//     if (isScrollEnd) {
//       isPaginate = true;
//       handleLoadMore();
//     }
//   }, [isScrollEnd]);

//   React.useLayoutEffect(() => {
//     // Set the headerRight component to a TouchableOpacity
//     navigation.setOptions({
//       headerLeft: () => <BackButton onPress={handleBack} />,
//     });
//   }, [navigation]);

//   function handleBack(): void {
//     navigation.goBack();
//   }

//   const handleLoadMore = () => {
//     if (!loading) {
//       loadUserList(nextPage);
//     }
//   };
//   const onThreeDotTap = (user: Amity.User) => {
//     if (Platform.OS === 'ios') {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           options: ['Cancel', 'Report User'],
//           cancelButtonIndex: 0,
//         },
//         () => {
//           reportUser(user.userId);
//         }
//       );
//     } else {
//       Alert.alert('Report', '', [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Report user',
//           onPress: () => {
//             reportUser(user.userId);
//           },
//         },
//       ]);
//     }
//   };

//   const onDonePressed = async () => {
//     try {
//       const result = await createAmityChannel(
//         (client as Amity.Client).userId!,
//         selectedUserListRef.current
//       );
//       console.log('create chat success ' + JSON.stringify(result));
//     } catch (error) {
//       console.log('create chat error ' + JSON.stringify(error));
//       console.error(error);
//     } finally {
//       setShowLoadingIndicator(false);
//     }
//   };

//   const renderItem: ListRenderItem<Amity.User> = ({ item }) => {
//     return (
//       <UserItem user={item} showThreeDot={true} onThreeDotTap={onThreeDotTap} />
//     );
//   };
//   const insets = useSafeAreaInsets();
//   return (
//     <View style={[styles.container, { paddingBottom: insets.bottom + 60 }]}>
//       <LoadingOverlay
//         isLoading={showLoadingIndicator && sectionedUserList.length <= 0}
//         loadingText="Loading..."
//       />
//       <View>
//         <FlatList
//           data={members}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.categoryId.toString()}
//           ListFooterComponent={renderFooter}
//           // onEndReached={handleEndReached}
//           onEndReached={handleEndReached}
//           onMomentumScrollBegin={() =>
//             (onEndReachedCalledDuringMomentumRef.current = false)
//           }
//           onEndReachedThreshold={0.8}
//         />
//       </View>
//     </View>
//   );
// }
