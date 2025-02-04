import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  Alert,
} from 'react-native';
import { useStyles } from './styles';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import ArrowOutlinedIcon from '../../svg/ArrowOutlinedIcon';
import { SvgXml } from 'react-native-svg';
import {  communitySettingMemberIcon } from '../../svg/svg-xml-list';

interface ChatDetailProps {
  navigation: any;
  route: any;
}

export enum SettingType {
  basicInfo = 'basic_info',
  leaveOrClose = 'leave_or_close',
}

export const CommunitySetting: React.FC<ChatDetailProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme() as MyMD3Theme;
  const styles = useStyles();
  const { communityId, isModerator } = route.params;
  const handleMembersPress = () => {
    navigation.navigate('CommunityMemberDetail', {
      communityId: communityId,
      isModerator: isModerator,
    });
  };

  const handleLeaveCommunityPress = async () => {
    const hasLeft = await CommunityRepository.leaveCommunity(communityId);
    if (hasLeft) {
      navigation.goBack();
    }
  };

  const onCloseCommunity = async () => {
    const deletedCommunity = await CommunityRepository.deleteCommunity(
      communityId
    );
    if (deletedCommunity) return navigation.navigate('Home');
    Alert.alert(
      'Unable to close community',
      'Something went wrong. Please try again later'
    );
  };

  const handleCloseCommunityPress = async () => {
    Alert.alert(
      'Close community?',
      'All members will be removed from the community. All posts, messages, reactions and media shared in community will be deleted. This cannot be undone',
      [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('Cancel');
          },
          style: 'cancel',
        },
        {
          text: 'Close',
          onPress: onCloseCommunity,
          style: 'destructive',
        },
      ]
    );
  };

  const communitySettingData = [
    {
      title: 'Basic info',
      data: [
        {
          name: 'Members',
          leftIcon: <SvgXml width={30} height={30} xml={communitySettingMemberIcon} color={theme.colors.base}/>,
          callBack: handleMembersPress,
          rightIcon: <ArrowOutlinedIcon width={24} color={theme.colors.base}/>,
          type: SettingType.basicInfo,
        },
      ],
    },
    {
      title: '',
      data: [
        {
          name: 'Leave Community',
          leftIcon: null,
          callBack: handleLeaveCommunityPress,
          rightIcon: null,
          type: SettingType.leaveOrClose,
        },
        {
          name: 'Close Community',
          leftIcon: null,
          callBack: handleCloseCommunityPress,
          rightIcon: null,
          type: SettingType.leaveOrClose,
        },
      ],
    },
  ];

  const renderSettingItems = ({ item }) => {
    if (item.type === SettingType.basicInfo) {
      return (
        <TouchableOpacity style={styles.rowContainer} onPress={item.callBack}>
          <View style={styles.iconContainer}>
            {item.leftIcon}
          </View>
          <Text style={styles.rowText}>{item.name}</Text>
          {item.rightIcon}
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.rowContainer} onPress={item.callBack}>
          <View style={styles.leaveChatContainer}>
            <Text style={styles.leaveChatLabel}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={communitySettingData}
        renderItem={renderSettingItems}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </View>
  );
};
