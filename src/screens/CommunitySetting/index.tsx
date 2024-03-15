import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SectionList,
  Alert,
} from 'react-native';
import { useStyles } from './styles';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import { SvgXml } from 'react-native-svg';
import { arrowOutlined } from '../../svg/svg-xml-list';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

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

  const onLeaveCommunity = async () => {
    try {
      await CommunityRepository.leaveCommunity(communityId);
      navigation.navigate('Home');
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes(
          "Can't leave the community because you are the only active moderator in this community"
        )
      ) {
        Alert.alert(
          'Unable to leave community',
          'You are the only moderator in this group. To leave community, nominate other members to moderator role'
        );
        console.error(
          "Error: Can't leave the community due to being the only active moderator"
        );
      } else {
        Alert.alert(
          'Unable to leave community',
          'Something went wrong. Please try again later'
        );
      }
    }
  };

  const handleLeaveCommunityPress = async () => {
    Alert.alert(
      'Leave community?',
      "Leaving community, you'll give up your moderator status and no longer be able to post and interact in this community",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Leave',
          onPress: onLeaveCommunity,
          style: 'destructive',
        },
      ]
    );
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
          leftIcon: require('../../../assets/icon/groupMember.png'),
          callBack: handleMembersPress,
          rightIcon: arrowOutlined(theme.colors.base),
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
      ],
    },
  ];

  if (isModerator) {
    communitySettingData[1].data.push({
      name: 'Close Community',
      leftIcon: null,
      callBack: handleCloseCommunityPress,
      rightIcon: null,
      type: SettingType.leaveOrClose,
    });
  }

  const renderSettingItems = ({ item }) => {
    if (item.type === SettingType.basicInfo) {
      return (
        <TouchableOpacity style={styles.rowContainer} onPress={item.callBack}>
          <View style={styles.iconContainer}>
            <Image source={item.leftIcon} style={styles.groupIcon} />
          </View>
          <Text style={styles.rowText}>{item.name}</Text>
          <SvgXml xml={item.rightIcon} width={24} />
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
