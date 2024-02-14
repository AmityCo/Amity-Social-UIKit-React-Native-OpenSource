import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { UserRepository, createReport } from '@amityco/ts-sdk-react-native';
import CloseButton from '../../components/BackButton';
import { styles } from './styles';
import { block_unblock, report, unfollow } from '../../svg/svg-xml-list';
import { SvgXml } from 'react-native-svg';
import { LoadingOverlay } from '../../components/LoadingOverlay';

export default function UserProfileSetting({ navigation, route }: any) {
  const { userId, follow } = route.params;
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [followStatus, setFollowStatus] = useState(follow);
  const isBlocked = followStatus === 'blocked';
  const isFollowed = followStatus === 'accepted';
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton />,
      title: 'Settings',
    });
  }, [navigation]);

  const handleReportUserPress = async () => {
    setShowLoadingIndicator(true);
    await createReport('user', userId);
    setShowLoadingIndicator(false);
  };
  const handleUnfollowPress = async () => {
    setShowLoadingIndicator(true);
    await UserRepository.Relationship.unfollow(userId);
    setShowLoadingIndicator(false);
    setFollowStatus('none');
  };

  const handleBlockUser = async () => {
    setShowLoadingIndicator(true);
    await UserRepository.Relationship.blockUser(userId);
    setShowLoadingIndicator(false);
    setFollowStatus('blocked');
  };

  const handleUnblockUser = async () => {
    setShowLoadingIndicator(true);
    await UserRepository.Relationship.unBlockUser(userId);
    setShowLoadingIndicator(false);
    setFollowStatus('none');
  };

  const settingsData = [];
  if (isFollowed) {
    settingsData.push({
      name: 'unfollow',
      icon: unfollow,
      label: 'Unfollow',
      callBack: handleUnfollowPress,
    });
  }
  if (followStatus) {
    settingsData.push(
      {
        name: 'report',
        icon: report,
        label: 'Report user',
        callBack: handleReportUserPress,
      },
      {
        name: 'block',
        icon: block_unblock,
        label: isBlocked ? 'Unblock user' : 'Block user',
        callBack: isBlocked ? handleUnblockUser : handleBlockUser,
      }
    );
  }

  const renderItem = useCallback((item: any) => {
    if (!item.label || !item.icon || !item.callBack) return null;
    return (
      <TouchableOpacity
        key={item.label}
        style={styles.rowContainer}
        onPress={() => item.callBack()}
      >
        <View style={styles.iconContainer}>
          <SvgXml xml={item.icon()} width="20" height="20" />
        </View>
        <Text style={styles.rowText}>{item.label}</Text>
      </TouchableOpacity>
    );
  }, []);
  return (
    <View style={styles.container}>
      <LoadingOverlay isLoading={showLoadingIndicator} loadingText={null} />
      {settingsData.map((setting) => {
        return renderItem(setting);
      })}
    </View>
  );
}
