import { TextProps, Text, View } from 'react-native';
import React, { FC, memo } from 'react';
import { ComponentID, ElementID, PageID } from '../../enum';

import ImageElement from '../CommonElements/ImageElement';
import { useStyles } from './styles';

import { useAmityElement } from '../../hooks/useUiKitReference';
import { useIsCommunityModerator } from '../../hooks/useIsCommunityModerator';

type ModeratorBadgeElementType = Partial<TextProps> & {
  pageID: PageID;
  componentID: ComponentID;
  communityId?: Amity.Community['communityId'];
  userId?: Amity.User['userId'];
};

const ModeratorBadgeElement: FC<ModeratorBadgeElementType> = ({
  pageID = PageID.WildCardPage,
  componentID = ComponentID.WildCardComponent,
  userId,
  communityId,
  ...props
}) => {
  const isModerator = useIsCommunityModerator({ communityId, userId });
  const elementID = ElementID.moderator_badge;
  const { isExcluded, config, accessibilityId, themeStyles } = useAmityElement({
    pageId: pageID,
    componentId: componentID,
    elementId: elementID,
  });
  const styles = useStyles(themeStyles);

  if (isExcluded) return null;
  if (!isModerator || !communityId || !userId) return null;
  const text = (config?.text as string) ?? '';

  return (
    <View style={styles.moderatorRow}>
      <ImageElement
        configKey="icon"
        pageID={pageID}
        componentID={componentID}
        elementID={ElementID.moderator_badge}
        style={styles.moderatorBadge}
      />
      <Text
        style={styles.moderatorTitle}
        testID={accessibilityId}
        accessibilityLabel={accessibilityId}
        {...props}
      >
        {text}
      </Text>
    </View>
  );
};

export default memo(ModeratorBadgeElement);
