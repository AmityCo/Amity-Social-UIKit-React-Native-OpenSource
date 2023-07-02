import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { styles } from './styles';
import { CommunityRepository } from '@amityco/ts-sdk';
import CloseButton from '../../../components/BackButton';

interface ChatDetailProps {
  navigation: any;
  route: any;
}

export const CommunitySetting: React.FC<ChatDetailProps> = ({
  navigation,
  route,
}) => {
  const { communityId, communityName } = route.params;
  React.useLayoutEffect(() => {
    // Set the headerRight component to a TouchableOpacity
    navigation.setOptions({
      headerLeft: () => <CloseButton navigation={navigation} />,
      title: communityName,
    });
  }, [navigation]);
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
      // case 1:
      //   return (
      //     <TouchableOpacity
      //       style={styles.rowContainer}
      //       onPress={handleGroupProfilePress}
      //     >
      //       <View style={styles.iconContainer}>
      //         <Image
      //           source={require('../../../../assets/icon/editPencil.png')}
      //           style={styles.icon}
      //         />
      //       </View>
      //       <Text style={styles.rowText}>Group profile</Text>
      //       <Image
      //         source={require('../../../../assets/icon/arrowRight.png')}
      //         style={styles.arrowIcon}
      //       />
      //     </TouchableOpacity>
      //   );
      case 1:
        return (
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={handleMembersPress}
          >
            <View style={styles.iconContainer}>
              <Image
                source={require('../../../../assets/icon/groupMember.png')}
                style={styles.groupIcon}
              />
            </View>
            <Text style={styles.rowText}>Members</Text>
            <Image
              source={require('../../../../assets/icon/arrowRight.png')}
              style={styles.arrowIcon}
            />
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
