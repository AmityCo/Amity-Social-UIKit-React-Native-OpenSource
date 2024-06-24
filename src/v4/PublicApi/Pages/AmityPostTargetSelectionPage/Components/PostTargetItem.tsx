import React from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useFile from '~/hooks/useFile';

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

  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 12,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginBottom: 10,
    },
    displayName: {
      lineHeight: 20,
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
    },
  });

  return (
    <TouchableOpacity onPress={onSelect} style={styles.container}>
      <Image
        style={styles.avatar}
        source={
          // TODO: check default avatar
          file
            ? { uri: file }
            : require('../../../../assets/icon/Placeholder.png')
        }
      />
      <View>
        <Text style={styles.displayName}>{displayName}</Text>
        {isBadgeShow && (
          <Image
            style={styles.badgeIcon}
            source={require('../../../../assets/icon/badge.svg')}
          />
        )}
        {isPrivate && (
          <Image
            style={styles.badgeIcon}
            source={require('../../../../assets/icon/Private.svg')}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(PostTargetItem);
