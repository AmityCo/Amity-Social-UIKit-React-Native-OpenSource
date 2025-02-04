/* eslint-disable react-hooks/exhaustive-deps */
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useStyles } from './styles';
import CloseButton from '../../components/BackButton';
import useAuth from '../../hooks/useAuth';
import { SvgXml } from 'react-native-svg';
import { communityIcon } from '../../svg/svg-xml-list';

export default function CommunityList({ navigation, route }: any) {
  const { apiRegion } = useAuth();
  const [communities, setCommunities] = useState<Amity.Community[]>([]);
  const [paginateLoading, setPaginateLoading] = useState(false);
  const { categoryId, categoryName } = route.params;
  const [hasNextPage, setHasNextPage] = useState(false);

  const styles = useStyles();
  const onNextPageRef = useRef<(() => void) | null>(null);
  const isFetchingRef = useRef(false);
  const onEndReachedCalledDuringMomentumRef = useRef(true);
  React.useLayoutEffect(() => {
    // Set the headerRight component to a TouchableOpacity
    navigation.setOptions({
      headerLeft: () => <CloseButton />,
      title: categoryName,
    });
  }, [navigation]);
  useEffect(() => {
    const loadCommunities = async () => {
      setPaginateLoading(true);
      try {
        const unsubscribe = CommunityRepository.getCommunities(
          { categoryId: categoryId },
          ({ data: communities, onNextPage, hasNextPage, loading }) => {
            if (!loading) {
              setCommunities((prevCommunities) => [
                ...prevCommunities,
                ...communities,
              ]);
              setHasNextPage(hasNextPage);
              onNextPageRef.current = onNextPage;
              isFetchingRef.current = false;
              unsubscribe();
            }
          }
        );
      } catch (error) {
        console.error('Failed to load communities:', error);
        isFetchingRef.current = false;
      } finally {
        setPaginateLoading(false);
      }
    };

    loadCommunities();
  }, []);
  const onPressCommunity = useCallback(
    ({
      communityId,
      communityName,
    }: {
      communityId: string;
      communityName: string;
    }) => {
      navigation.navigate('CommunityHome', { communityId, communityName });
    },
    []
  );
  const avatarFileURL = (fileId: string) => {
    return `https://api.${apiRegion}.amity.co/api/v3/files/${fileId}/download?size=medium`;
  };
  const renderCommunity = ({ item }: { item: Amity.Community }) => {
    return (
      <TouchableOpacity
        style={styles.rowContainer}
        onPress={() =>
          onPressCommunity({
            communityId: item.communityId,
            communityName: item.displayName,
          })
        }
      >
        {
          item.avatarFileId ?
            <Image
              style={styles.avatar}
              source={
                {
                  uri: item.avatarFileId && avatarFileURL(item.avatarFileId!),
                }

              }
            /> : <View style={styles.avatar}><SvgXml xml={communityIcon} /></View>
        }

        <Text style={styles.categoryText}>{item.displayName}</Text>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!paginateLoading) return null;
    return (
      <View style={styles.LoadingIndicator}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const handleEndReached = useCallback(() => {
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
        data={communities}
        renderItem={renderCommunity}
        keyExtractor={(item) => item.communityId.toString()}
        ListFooterComponent={renderFooter}
        onEndReached={handleEndReached}
        onMomentumScrollBegin={() =>
          (onEndReachedCalledDuringMomentumRef.current = false)
        }
        onEndReachedThreshold={0.8}
      />
    </View>
  );
}
