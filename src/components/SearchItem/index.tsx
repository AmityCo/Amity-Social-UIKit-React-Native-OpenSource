/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { SvgXml } from 'react-native-svg';
import { communityIcon, userIcon } from '../../svg/svg-xml-list';
import { CategoryRepository } from '@amityco/ts-sdk-react-native';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../../hooks/useAuth';
export interface ISearchItem {
  targetId: string;
  targetType: string;
  displayName: string;
  categoryIds?: string[];
  avatarFileId?: string;
}
export default function SearchItem({
  target,
  onPress,
  userProfileNavigateEnabled = true,
}: {
  target: ISearchItem;
  onPress?: (target: ISearchItem) => void;
  userProfileNavigateEnabled?: boolean;
}) {
  const styles = getStyles();
  const { apiRegion } = useAuth();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>('');
  const navigation = useNavigation<any>();
  const maxLength = 25;
  const handleToggle = () => {
    setIsChecked(!isChecked);
    if (onPress) {
      onPress(target);
    }
    if (userProfileNavigateEnabled) {
      if (target.targetType === 'community') {
        navigation.navigate('CommunityHome', {
          communityId: target.targetId,
          communityName: target.displayName,
        });
      } else {
        navigation.navigate('UserProfile', {
          userId: target.targetId,
        });
      }
    }
  };
  useEffect(() => {
    getCategory();
  }, [target.categoryIds]);

  async function getCategory() {
    if (target.categoryIds) {
      const { data: category } = await CategoryRepository.getCategory(
        target.categoryIds[0] as string
      );

      category && setCategoryName(category.name);
    }
  }
  const displayName = () => {
    if (target.displayName) {
      if (target.displayName!.length > maxLength) {
        return target.displayName!.substring(0, maxLength) + '..';
      }
      return target.displayName!;
    }
    return 'Display name';
  };
  const avatarFileURL = (fileId: string) => {
    return `https://api.${apiRegion}.amity.co/api/v3/files/${fileId}/download?size=medium`;
  };

  return (
    <TouchableOpacity style={styles.listItem} onPress={handleToggle}>
      <View style={styles.leftContainer}>
        {target.avatarFileId ? (
          <Image
            style={styles.avatar}
            source={{
              uri: target.avatarFileId && avatarFileURL(target.avatarFileId!),
            }}
          />
        ) : (
          <SvgXml
            style={styles.avatar}
            width={40}
            height={40}
            xml={target.targetType === 'user' ? userIcon() : communityIcon}
          />
        )}
        <View>
          <Text style={styles.itemText}>{displayName()}</Text>
          {target.targetType === 'community' && (
            <Text style={styles.categoryText}>{categoryName}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
