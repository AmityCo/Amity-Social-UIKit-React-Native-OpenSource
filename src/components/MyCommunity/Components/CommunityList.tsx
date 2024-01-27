import { Image, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { SvgXml } from 'react-native-svg';
import {
  communityIcon,
  officialIcon,
  privateIcon,
} from '../../../svg/svg-xml-list';
import { useStyle } from '../styles';
import useImage from '../../../hooks/useImage';
import type { MyMD3Theme } from '../../../providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';
import { PrivacyState } from '../../../enum/privacyState';

interface ICommunityItems {
  communityId: string;
  avatarFileId: string;
  displayName: string;
  isPublic: boolean;
  isOfficial: boolean;
}

const CommunityList = ({
  item,
  onClickItem,
}: {
  item: ICommunityItems;
  onClickItem: (id: string, name: string) => void;
}) => {
  const MAX_LENGTH = 6;
  const theme = useTheme() as MyMD3Theme;
  const styles = useStyle();
  const avatarUrl = useImage({ fileId: item.avatarFileId });
  const getDisplayName = ({ text, type }: { text?: string; type: string }) => {
    if (text) {
      const reduceLetter = type === PrivacyState.private ? 3 : 0;
      if (text!.length > MAX_LENGTH - reduceLetter) {
        return text!.substring(0, MAX_LENGTH) + '...';
      }
      return text;
    }
    return 'Display name';
  };
  return (
    <TouchableOpacity
      onPress={() => onClickItem(item.communityId, item.displayName)}
      key={item.communityId}
      style={styles.itemContainer}
    >
      {item.avatarFileId ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (
        <SvgXml
          style={styles.avatar}
          width={40}
          height={40}
          xml={communityIcon}
        />
      )}
      <View style={styles.textRow}>
        {!item.isPublic && (
          <SvgXml width={17} height={17} xml={privateIcon(theme.colors.base)} />
        )}
        <Text style={styles.itemText}>
          {getDisplayName({
            text: item.displayName,
            type: !item.isPublic ? PrivacyState.private : PrivacyState.public,
          })}
        </Text>
        {item.isOfficial && (
          <SvgXml
            width={20}
            height={20}
            xml={officialIcon(theme.colors.primary)}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CommunityList;
