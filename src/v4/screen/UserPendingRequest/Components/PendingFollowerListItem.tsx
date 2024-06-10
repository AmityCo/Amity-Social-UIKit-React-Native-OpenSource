import { Alert, Image, Pressable, Text, View } from 'react-native';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useFile } from '../../../hook';
import { UserRepository } from '@amityco/ts-sdk-react-native';
import { ImageSizeState } from '../../../enum';
import { defaultAvatarUri } from '../../../assets';
import { useStyles } from '../styles';
import { Divider } from 'react-native-paper';

type PendingFollowerListItemType = {
  userId: string;
};

const PendingFollowerListItem: FC<PendingFollowerListItemType> = ({
  userId,
}) => {
  const { getImage } = useFile();
  const styles = useStyles();
  const [userData, setUserData] = useState<Amity.User>(null);
  const [avatar, setAvatar] = useState(defaultAvatarUri);
  useEffect(() => {
    UserRepository.getUser(userId, async ({ data, error, loading }) => {
      if (error) return;
      if (!loading) {
        setUserData(data);
        const userAvatar = await getImage({
          fileId: data.avatarFileId,
          imageSize: ImageSizeState.small,
        });
        setAvatar(userAvatar ?? defaultAvatarUri);
      }
    });
  }, [getImage, userId]);

  const onPressAcceptRequest = useCallback(async () => {
    try {
      const accepted = await UserRepository.Relationship.acceptMyFollower(
        userId
      );
      if (!accepted) return Alert.alert('Accept Request Failed');
    } catch (error) {
      Alert.alert('Accept Request Failed');
    }
  }, [userId]);

  const onPressDeclineRequest = useCallback(async () => {
    try {
      const accepted = await UserRepository.Relationship.declineMyFollower(
        userId
      );
      if (!accepted) return Alert.alert('Decline Request Failed');
    } catch (error) {
      Alert.alert('Decline Request Failed');
    }
  }, [userId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={styles.displayName}>{userData?.displayName}</Text>
      </View>
      <Divider />
      <View style={styles.actionContainer}>
        <Pressable style={styles.accept} onPress={onPressAcceptRequest}>
          <Text style={styles.acceptText}>Accept</Text>
        </Pressable>
        <Pressable style={styles.decline} onPress={onPressDeclineRequest}>
          <Text style={styles.declineText}>Decline</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PendingFollowerListItem;
