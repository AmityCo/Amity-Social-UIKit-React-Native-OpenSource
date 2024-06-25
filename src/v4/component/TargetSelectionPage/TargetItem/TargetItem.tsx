import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../../../providers/amity-ui-kit-provider';
import { ComponentID, PageID, ElementID } from '../../../enum';
import AvatarElement from '../../../PublicApi/Elements/CommonElements/AvatarElement';
import ImageElement from '../../../PublicApi/Elements/CommonElements/ImageElement';
import TextKeyElement from '../../../PublicApi/Elements/TextKeyElement/TextKeyElement';
import TextElement from '../../../PublicApi/Elements/CommonElements/TextElement';

interface ITargetItem {
  pageId?: PageID;
  componentId?: ComponentID;
  avatarElementId?: ElementID;
  displayNameElementId?: ElementID;
  displayName: string;
  avatarFileId?: string;
  isBadgeShow?: boolean;
  isPrivate?: boolean;
  onSelect: () => void;
}

const TargetItem = ({
  pageId = PageID.WildCardPage,
  componentId = ComponentID.WildCardComponent,
  avatarElementId = ElementID.WildCardElement,
  displayNameElementId,
  avatarFileId,
  displayName,
  isBadgeShow,
  isPrivate,
  onSelect,
}: ITargetItem) => {
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
      <AvatarElement
        style={styles.avatar}
        pageID={pageId}
        componentID={componentId}
        elementID={avatarElementId}
        avatarId={avatarFileId}
      />
      {displayNameElementId ? (
        <TextKeyElement
          pageID={pageId}
          componentID={componentId}
          elementID={displayNameElementId}
          style={styles.displayName}
        />
      ) : (
        <TextElement
          pageID={pageId}
          componentID={componentId}
          elementID={ElementID.community_display_name}
          style={styles.displayName}
          text={displayName}
        />
      )}

      {isBadgeShow && (
        <ImageElement
          componentID={componentId}
          elementID={ElementID.community_official_badge}
          style={styles.badgeIcon}
          configKey="image"
        />
      )}
      {isPrivate && (
        <ImageElement
          componentID={componentId}
          elementID={ElementID.community_private_badge}
          style={styles.lockIcon}
          configKey="image"
        />
      )}
    </TouchableOpacity>
  );
};

export default React.memo(TargetItem);
