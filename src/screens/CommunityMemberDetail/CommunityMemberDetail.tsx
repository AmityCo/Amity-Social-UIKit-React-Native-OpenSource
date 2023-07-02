import { CommunityRepository, createReport } from '@amityco/ts-sdk';
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
import CloseButton from '../../components/BackButton';
import UserItem from '../../components/UserItem';

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
      headerLeft: () => <CloseButton />,
      title: 'Member',
    });
  }, [navigation]);
  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true);
      try {
        const unsubscribe = CommunityRepository.Membership.getMembers(
          { communityId },
          ({ data: members, onNextPage, hasNextPage, loading }) => {
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
  const reportUser = async (userId: string): Promise<boolean> => {
    const didCreatePostReport = await createReport('user', userId);

    return didCreatePostReport;
  };
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
  const renderMember = ({ item }: { item: Amity.Membership<'community'> }) => {
    if (item.user) {
      return (
        <UserItem
          user={item.user}
          showThreeDot={true}
          onThreeDotTap={onThreeDotTap}
        />
      );
    }
    return null;
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
