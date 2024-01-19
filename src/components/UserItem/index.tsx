import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import RoundCheckbox from '../RoundCheckbox/index';
import type { UserInterface } from 'src/types/user.interface';
import useAuth from '../../hooks/useAuth';

export default function UserItem({
  user,
  isCheckmark,
  showThreeDot,
  onPress,
  onThreeDotTap,
}: {
  user: UserInterface;
  isCheckmark?: boolean | undefined;
  showThreeDot?: boolean | undefined;
  onPress?: (user: UserInterface) => void;
  onThreeDotTap?: (user: UserInterface) => void;
}) {
  const styles = getStyles();
  const { apiRegion } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  const maxLength = 25;
  const handleToggle = () => {
    setIsChecked(!isChecked);
    if (onPress) {
      onPress(user);
    }
  };

  const displayName = () => {
    if (user.displayName) {
      if (user.displayName!.length > maxLength) {
        return user.displayName!.substring(0, maxLength) + '..';
      }
      return user.displayName!;
    }
    return 'Display name';
  };
  const avatarFileURL = (fileId: string) => {
    return `https://api.${apiRegion}.amity.co/api/v3/files/${fileId}/download?size=medium`;
  };

  return (
    <TouchableOpacity style={styles.listItem} onPress={handleToggle}>
      <View style={styles.leftContainer}>
        <Image
          style={styles.avatar}
          source={
            user.avatarFileId
              ? {
                  uri: user.avatarFileId && avatarFileURL(user.avatarFileId!),
                }
              : require('../../../assets/icon/Placeholder.png')
          }
        />
        <Text style={styles.itemText}>{displayName()}</Text>
      </View>
      {!showThreeDot ? (
        <RoundCheckbox isChecked={isCheckmark ?? false} />
      ) : (
        <TouchableOpacity
          onPress={() => {
            if (onThreeDotTap) {
              onThreeDotTap(user);
            }
          }}
        >
          <Image
            source={require('../../../assets/icon/threeDot.png')}
            style={styles.dotIcon}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
