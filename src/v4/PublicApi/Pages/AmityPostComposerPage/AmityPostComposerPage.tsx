import { Text, View } from 'react-native';
import React, { FC } from 'react';
import { PageID } from '../../../enum';
import { useAmityPage } from '../../../hook';
import { useStyles } from './styles';
import { AmityPostComposerPageType } from '../../types';

const AmityPostComposerPage: FC<AmityPostComposerPageType> = () => {
  const pageId = PageID.post_composer_page;
  const { isExcluded, themeStyles, accessibilityId } = useAmityPage({ pageId });
  const styles = useStyles(themeStyles);
  if (isExcluded) return null;
  return (
    <View
      testID={accessibilityId}
      accessibilityLabel={accessibilityId}
      style={styles.container}
    >
      <Text>AmityPostComposerPage</Text>
    </View>
  );
};

export default AmityPostComposerPage;
