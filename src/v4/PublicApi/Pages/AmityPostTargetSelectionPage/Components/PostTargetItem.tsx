import React from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity } from 'react-native';
import useFile from '../../../../../hooks/useFile';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../../../../providers/amity-ui-kit-provider';

interface IPostTargetItem {
  displayName: string;
  avatarFileId?: string;
  isBadgeShow?: boolean;
  isPrivate?: boolean;
  onSelect: () => void;
}

const PostTargetItem = ({
  avatarFileId,
  displayName,
  isBadgeShow,
  isPrivate,
  onSelect,
}: IPostTargetItem) => {
  const file = useFile({
    fileId: avatarFileId,
  });

  const theme = useTheme() as MyMD3Theme;

  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    displayName: {
      color: theme.colors.base,
      fontSize: 15,
      fontWeight: '600',
    },
    badgeIcon: {
      width: 20,
      height: 20,
    },
    lockIcon: {
      width: 20,
      height: 20,
      tintColor: theme.colors.base,
    },
  });

  return (
    <TouchableOpacity onPress={onSelect} style={styles.container}>
      <View>
        <Image
          style={styles.avatar}
          source={
            // TODO: check default avatar
            file
              ? { uri: file }
              : require('../../../../assets/icon/Placeholder.png')
          }
        />
      </View>
      <Text style={styles.displayName}>{displayName}</Text>
      {isBadgeShow && (
        <Image
          style={styles.badgeIcon}
          source={require('../../../../assets/icon/Badge.png')}
        />
      )}
      {isPrivate && (
        <Image
          style={styles.lockIcon}
          source={require('../../../../assets/icon/Private.png')}
        />
      )}
    </TouchableOpacity>
  );
};

export default React.memo(PostTargetItem);
