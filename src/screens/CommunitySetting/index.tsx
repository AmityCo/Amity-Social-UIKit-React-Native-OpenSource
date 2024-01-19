import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { getStyles } from './styles';
import { CommunityRepository } from '@amityco/ts-sdk-react-native';
import CloseButton from '../../components/BackButton';
import { SvgXml } from 'react-native-svg';
import { arrowOutlined } from '../../svg/svg-xml-list';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

interface ChatDetailProps {
  navigation: any;
  route: any;
}

export const CommunitySetting: React.FC<ChatDetailProps> = ({
  navigation,
  route,
}) => {
  const theme = useTheme() as MyMD3Theme;
  const styles = getStyles();
  const { communityId, communityName } = route.params;
  React.useLayoutEffect(() => {
    // Set the headerRight component to a TouchableOpacity
    navigation.setOptions({
      headerLeft: () => <CloseButton />,
      title: communityName,
    });
  }, []);
  const handleMembersPress = () => {
    navigation.navigate('CommunityMemberDetail', {
      communityId: communityId,
    });
  };
  const handleLeaveCommunityPress = async () => {
    const hasLeft = await CommunityRepository.leaveCommunity(communityId);
    if (hasLeft) {
      navigation.goBack();
    }
  };

  const renderItem = ({ item }: any) => {
    switch (item.id) {
      case 1:
        return (
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={handleMembersPress}
          >
            <View style={styles.iconContainer}>
              <Image
                source={require('../../../assets/icon/groupMember.png')}
                style={styles.groupIcon}
              />
            </View>
            <Text style={styles.rowText}>Members</Text>
            <SvgXml xml={arrowOutlined(theme.colors.base)} width={24} />
          </TouchableOpacity>
        );
      case 2:
        return (
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={handleLeaveCommunityPress}
          >
            <View style={styles.leaveChatContainer}>
              <Text style={styles.leaveChatLabel}>Leave Community</Text>
            </View>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const data = [{ id: 1 }, { id: 2 }, { id: 3 }];

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};
