import React, { useState } from 'react';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useStyles } from './styles';
import RoundCheckbox from '../RoundCheckbox/index';
import type { UserInterface } from '../../types/user.interface';
import useAuth from '../../hooks/useAuth';
import { ThreeDotsIcon } from '../../svg/ThreeDotsIcon';
import { SvgXml } from 'react-native-svg';
import { userIcon } from '../../svg/svg-xml-list';

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
  const styles = useStyles();
  const { apiRegion, client } = useAuth();
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
    <Pressable style={styles.listItem} onPress={handleToggle}>
      <View style={styles.leftContainer}>
        {
          user?.avatarFileId ?
            <Image
              style={styles.avatar}
              source={
                {
                  uri: user?.avatarFileId && avatarFileURL(user.avatarFileId),
                }

              }
            /> :   <SvgXml style={styles.avatar} xml={userIcon()} />
        }

        <Text style={styles.itemText}>{displayName()}</Text>
      </View>
     { !showThreeDot ? (
        <RoundCheckbox isChecked={isCheckmark ?? false} />
      ) : (showThreeDot && user?.userId!== (client as Amity.Client)?.userId)? (
        <TouchableOpacity
          onPress={() => {
            if (onThreeDotTap) {
              onThreeDotTap(user);
            }
          }}
          style = {styles.btnContainer}
        >

          <ThreeDotsIcon style={styles.dotIcon} />
        </TouchableOpacity>
      ): <View/>}
    </Pressable>
  );
}
