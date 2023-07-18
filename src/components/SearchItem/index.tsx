/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { SvgXml } from 'react-native-svg';
import { communityIcon } from '../../svg/svg-xml-list';
import { CategoryRepository } from '@amityco/ts-sdk';

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
}: {
  target: ISearchItem;
  onPress?: (target: ISearchItem) => void;
}) {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>('');
  const maxLength = 25;
  const handleToggle = () => {
    setIsChecked(!isChecked);
    if (onPress) {
      onPress(target);
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
    return `https://api.amity.co/api/v3/files/${fileId}/download?size=medium`;
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
            xml={communityIcon}
          />
        )}
        <View>
          <Text style={styles.itemText}>{displayName()}</Text>
          <Text style={styles.categoryText}>{categoryName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
