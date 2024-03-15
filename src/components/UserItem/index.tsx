import React, { useCallback, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useStyles } from './styles';
import RoundCheckbox from '../RoundCheckbox/index';
import type { UserInterface } from 'src/types/user.interface';
import useAuth from '../../hooks/useAuth';

export default function UserItem({
  user,
  isCheckmark,
  showThreeDot,
  onPress,
  onThreeDotTap,
  hideMenu,
}: {
  user: UserInterface;
  isCheckmark?: boolean;
  showThreeDot?: boolean;
  onPress?: (user: UserInterface) => void;
  onThreeDotTap?: (user: UserInterface) => void;
  hideMenu?: boolean;
}) {
  const styles = useStyles();
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

  const renderMenu = useCallback(() => {
    if (hideMenu) return null;
    if (showThreeDot)
      return (
        <TouchableOpacity
          style={styles.threeDotsContainerStyle}
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
      );
    return <RoundCheckbox isChecked={isCheckmark ?? false} />;
  }, [
    hideMenu,
    isCheckmark,
    onThreeDotTap,
    showThreeDot,
    styles.dotIcon,
    styles.threeDotsContainerStyle,
    user,
  ]);

  return (
    <TouchableOpacity
      style={styles.listItem}
      disabled={!onPress}
      onPress={handleToggle}
    >
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
      {renderMenu()}
    </TouchableOpacity>
  );
}
