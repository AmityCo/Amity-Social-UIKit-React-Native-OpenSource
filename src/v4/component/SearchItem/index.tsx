/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useStyles } from './styles';
import { CategoryRepository } from '@amityco/ts-sdk-react-native';
import { useNavigation } from '@react-navigation/native';
import { useFile } from '../../hook';
import { ImageSizeState } from '../../enum';
import { defaultAvatarUri, defaultCommunityAvatarUri } from '../../assets';

export interface ISearchItem {
  targetId: string;
  targetType: string;
  displayName: string;
  categoryIds?: string[];
  avatarFileId?: string;
  id?: string;
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
  const styles = useStyles();
  const { getImage } = useFile();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [avatar, setAvatar] = useState(defaultAvatarUri);
  const [categoryName, setCategoryName] = useState<string>('');
  const navigation = useNavigation<any>();
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
    if (!target?.avatarFileId) return;

    (async () => {
      const fileUrl = await getImage({
        fileId: target?.avatarFileId,
        imageSize: ImageSizeState.small,
      });

      const avatarUrl = fileUrl
        ? fileUrl
        : target?.targetType === 'community'
        ? defaultCommunityAvatarUri
        : defaultAvatarUri;
      setAvatar(avatarUrl);
    })();
  }, [getImage, target?.avatarFileId, target?.targetType]);

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

  return (
    <TouchableOpacity style={styles.listItem} onPress={handleToggle}>
      <View style={styles.leftContainer}>
        <Image style={styles.avatar} source={{ uri: avatar }} />
        <View>
          <Text numberOfLines={1} style={styles.itemText}>
            {target?.displayName}
          </Text>
          {target?.targetType === 'community' && (
            <Text style={styles.categoryText}>{categoryName}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
