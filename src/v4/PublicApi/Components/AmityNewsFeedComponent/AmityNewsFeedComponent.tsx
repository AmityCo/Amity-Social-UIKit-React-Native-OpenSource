import React, { FC, memo } from 'react';
import { View } from 'react-native';
import useConfig from '../../../hook/useConfig';
import { ComponentID, PageID } from '../../../enum/enumUIKitID';
import AmityGlobalFeedComponent from '../AmityGlobalFeedComponent/AmityGlobalFeedComponent';
import { useStyles } from './styles';

type AmityNewsFeedComponentType = {
  pageId?: PageID;
};

const AmityNewsFeedComponent: FC<AmityNewsFeedComponentType> = ({
  pageId = PageID.WildCardPage,
}) => {
  const { excludes } = useConfig();
  const componentId = ComponentID.newsfeed_component;
  const uiReference = `${pageId}/${componentId}/*`;
  const styles = useStyles();
  if (excludes.includes(uiReference)) return null;

  return (
    <View
      style={styles.container}
      testID={uiReference}
      accessibilityLabel={uiReference}
    >
      <AmityGlobalFeedComponent pageId={pageId} />
    </View>
  );
};

export default memo(AmityNewsFeedComponent);
