/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { CommunityRepository } from '@amityco/ts-sdk';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import CustomTab from '../../../components/CustomTab';
import CloseButton from '../../../components/BackButton';
import { styles } from './styles';
import Feed from '../Feed';

export type FeedRefType = {
  handleLoadMore: () => void;
};

export default function CommunityHome({ navigation, route }: any) {
  const { communityId, communityName } = route.params;
  const [isJoin, setIsJoin] = useState(true);
  const [communityData, setCommunityData] =
    useState<Amity.LiveObject<Amity.Community>>();
  const feedRef: MutableRefObject<FeedRefType | null> =
    useRef<FeedRefType | null>(null);
  const scrollViewRef = useRef(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isScrollEndReached =
      layoutMeasurement.height + contentOffset.y + 200 >= contentSize.height;

    if (isScrollEndReached) {
      console.log('ending');
      triggerLoadMoreFunction();
    }
  };
  React.useLayoutEffect(() => {
    // Set the headerRight component to a TouchableOpacity
    navigation.setOptions({
      headerLeft: () => <CloseButton navigation={navigation} />,
      title: communityName,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // Handle button press here
            navigation.navigate('CommunitySetting', {
              communityId: communityId,
              communityName: communityName,
            });
          }}
        >
          <Image
            source={require('../../../../assets/icon/threeDot.png')}
            style={styles.dotIcon}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleMembersPress = () => {
    navigation.navigate('CommunityMemberDetail', {
      communityId: communityId,
      communityName: communityName,
    });
  };
  function triggerLoadMoreFunction() {
    console.log('triggerLoadMoreFunction: ', triggerLoadMoreFunction);
    if (feedRef.current) {
      feedRef.current.handleLoadMore(); // Call the function inside the child component
    }
  }
  useEffect(() => {
    const loadCommunity = async () => {
      try {
        const unsubscribe = CommunityRepository.getCommunity(
          communityId,
          // setCommunityData
          (community) => {
            setCommunityData(community);
            setIsJoin(community?.data.isJoined || false); // Set isJoin to communityData?.data.isJoined value
          }
        );
        unsubscribe();
      } catch (error) {
        console.error('Failed to load communities:', error);
      }
    };

    loadCommunity();
  }, [communityId]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      CommunityRepository.getCommunity(
        communityId,
        // setCommunityData
        (community) => {
          setCommunityData(community);
          setIsJoin(community?.data.isJoined || false); // Set isJoin to communityData?.data.isJoined value
        }
      );
    });
    return unsubscribe;
  }, []);

  const onJoinCommunityTap = async () => {
    const isJoined = await CommunityRepository.joinCommunity(communityId);
    if (isJoined) {
      setIsJoin(isJoined);
      return isJoined;
    }
    return null;
  };

  const joinCommunityButton = () => {
    return (
      <View style={styles.joinContainer}>
        <TouchableOpacity
          style={styles.joinCommunityButton}
          onPress={onJoinCommunityTap}
        >
          <Image
            source={require('../../../../assets/icon/followPlus.png')}
            style={styles.joinIcon}
          />
          <Text style={styles.joinCommunityText}>Join</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleTab = (index: number) => {
    console.log('index: ', index);
  };
  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={20}
      style={styles.container}
    >
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={
            communityData?.data.avatarFileId
              ? {
                  uri: `https://api.amity.co/api/v3/files/${communityData?.data.avatarFileId}/download?size=medium`,
                }
              : require('../../../../assets/icon/Placeholder.png')
          }
        />
        <View style={styles.darkOverlay} />
        <View style={styles.overlay}>
          <Text style={styles.overlayCommunityText}>
            {communityData?.data.displayName}
          </Text>
          {/* <Text style={styles.overlayCategoryText}>{communityData?.data.}</Text> */}
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Text style={styles.rowNumber}>{communityData?.data.postsCount}</Text>
          <Text style={styles.rowLabel}>post</Text>
        </View>

        <View style={styles.rowItemContent}>
          <View style={styles.verticalLine} />
          <TouchableOpacity
            onPress={() => handleMembersPress()}
            style={[styles.rowItem, { paddingLeft: 10 }]}
          >
            <Text style={styles.rowNumber}>
              {communityData?.data.membersCount}
            </Text>
            <Text style={styles.rowLabel}>members</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.textComponent}>
        {communityData?.data.description}
      </Text>
      {isJoin === false ? joinCommunityButton() : <View />}
      <CustomTab tabName={['Timeline', 'Gallery']} onTabChange={handleTab} />
      <Feed targetType="community" targetId={communityId} ref={feedRef} />
    </ScrollView>
  );
}
