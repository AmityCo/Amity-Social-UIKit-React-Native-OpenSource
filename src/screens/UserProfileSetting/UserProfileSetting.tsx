import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, SectionList } from 'react-native';
import { UserRepository, createReport } from '@amityco/ts-sdk-react-native';
import CloseButton from '../../components/BackButton';
import { useStyles } from './styles';
import {
  arrowOutlined,
  block_unblock,
  editIcon,
  report,
  unfollow,
} from '../../svg/svg-xml-list';
import { SvgXml } from 'react-native-svg';
import { LoadingOverlay } from '../../components/LoadingOverlay';

export default function UserProfileSetting({ navigation, route }: any) {
  const { userId, follow, displayName } = route.params;
  const styles = useStyles();
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const [followStatus, setFollowStatus] = useState(follow);
  const isMyProfile = !followStatus;
  const isBlocked = followStatus === 'blocked';
  const isFollowed = followStatus === 'accepted';
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CloseButton />,
      title: displayName,
      headerTitleAlign: 'center',
    });
  }, [displayName, navigation]);

  const handleReportUserPress = useCallback(async () => {
    setShowLoadingIndicator(true);
    await createReport('user', userId);
    setShowLoadingIndicator(false);
  }, [userId]);
  const handleUnfollowPress = useCallback(async () => {
    setShowLoadingIndicator(true);
    await UserRepository.Relationship.unfollow(userId);
    setShowLoadingIndicator(false);
    setFollowStatus('none');
  }, [userId]);
  const handleBlockUser = useCallback(async () => {
    setShowLoadingIndicator(true);
    await UserRepository.Relationship.blockUser(userId);
    setShowLoadingIndicator(false);
    setFollowStatus('blocked');
  }, [userId]);
  const handleUnblockUser = useCallback(async () => {
    setShowLoadingIndicator(true);
    await UserRepository.Relationship.unBlockUser(userId);
    setShowLoadingIndicator(false);
    setFollowStatus('none');
  }, [userId]);

  const settingData = useMemo(() => {
    const userSettingData = [];
    if (isMyProfile) {
      userSettingData.push({
        title: 'Basic info',
        data: [
          {
            label: 'Edit Profile',
            leftIcon: editIcon,
            rightIcon: arrowOutlined,
            callBack: () => {},
            type: 'basic_info',
          },
        ],
      });
    } else {
      userSettingData.push({ title: 'Manage', data: [] });
      userSettingData.map((setting) => {
        if (setting.title === 'Manage')
          if (isFollowed)
            return setting.data.push({
              type: 'manage',
              leftIcon: unfollow,
              label: 'Unfollow',
              callBack: handleUnfollowPress,
            });
        if (followStatus)
          return setting.data.push(
            {
              type: 'manage',
              leftIcon: report,
              label: 'Report user',
              callBack: handleReportUserPress,
            },
            {
              type: 'manage',
              leftIcon: block_unblock,
              label: isBlocked ? 'Unblock user' : 'Block user',
              callBack: isBlocked ? handleUnblockUser : handleBlockUser,
            }
          );
        return setting;
      });
    }
    return userSettingData;
  }, [
    followStatus,
    handleBlockUser,
    handleReportUserPress,
    handleUnblockUser,
    handleUnfollowPress,
    isBlocked,
    isFollowed,
    isMyProfile,
  ]);

  const renderSectionItem = useCallback(
    ({ item }) => {
      return (
        <TouchableOpacity
          key={item.label}
          style={styles.rowContainer}
          onPress={() => item.callBack()}
        >
          <View style={styles.iconContainer}>
            <SvgXml xml={item.leftIcon()} width="20" height="20" />
          </View>
          <Text style={styles.rowText}>{item.label}</Text>
          {item.rightIcon && (
            <SvgXml xml={item.rightIcon()} width="20" height="20" />
          )}
        </TouchableOpacity>
      );
    },
    [styles]
  );

  return (
    <View style={styles.container}>
      <LoadingOverlay isLoading={showLoadingIndicator} loadingText={null} />
      <SectionList
        sections={settingData}
        renderItem={renderSectionItem}
        keyExtractor={(_, index) => index.toString()}
        renderSectionHeader={({ section: { title } }) => {
          return <Text style={styles.sectionHeader}>{title}</Text>;
        }}
      />
    </View>
  );
}
