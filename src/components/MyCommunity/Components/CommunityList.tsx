import { Image, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useStyle } from '../styles';
import useFile from '../../../hooks/useFile';
import type { MyMD3Theme } from '../../../providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';
import { PrivacyState } from '../../../enum/privacyState';
import CommunityIcon from '../../../svg/CommunityIcon';
import PrivateIcon from '../../../svg/PrivateIcon';
import OfficialIcon from '../../../svg/OfficialIcon';

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
  const avatarUrl = useFile({ fileId: item.avatarFileId });
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
      {item.avatarFileId && avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      ) : (

        <View style={styles.avatar}>
          <CommunityIcon />
        </View>

      )}
      <View style={styles.textRow}>
        {!item.isPublic && (
          <PrivateIcon color={theme.colors.base} />
        )}
        <Text style={styles.itemText}>
          {getDisplayName({
            text: item.displayName,
            type: !item.isPublic ? PrivacyState.private : PrivacyState.public,
          })}
        </Text>
        {item.isOfficial && (
          <OfficialIcon color={theme.colors.base} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CommunityList;
