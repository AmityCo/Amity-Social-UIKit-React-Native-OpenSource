import { Image, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import useImage from '../../../hooks/useImage';
import { SvgXml } from 'react-native-svg';
import { categoryIcon } from '../../../svg/svg-xml-list';
import { useStyle } from '../styles';

const RenderCategories = ({
  item,
  onSelectCategory,
}: {
  item: Amity.Category;
  onSelectCategory: (id: string, name: string) => void;
}) => {
  const avatarURL = useImage({ fileId: item.avatarFileId });
  const styles = useStyle();
  return (
    <TouchableOpacity
      onPress={() => onSelectCategory(item.categoryId, item.name)}
      style={styles.rowContainer}
    >
      {item.avatarFileId ? (
        <Image
          style={styles.avatar}
          source={{
            uri: avatarURL,
          }}
        />
      ) : (
        <SvgXml xml={categoryIcon} width={40} height={40} />
      )}

      <Text style={styles.communityText}>{item.name}</Text>
    </TouchableOpacity>
  );
};

export default RenderCategories;
