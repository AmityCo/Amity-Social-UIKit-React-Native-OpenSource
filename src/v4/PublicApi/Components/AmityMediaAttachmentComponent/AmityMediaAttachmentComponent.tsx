import { Text, View } from 'react-native';
import React from 'react';
import { PageID, ComponentID } from '../../../enum';
import { useAmityComponent } from '../../../hook';
import { useStyles } from './styles';

const AmityMediaAttachmentComponent = () => {
  const pageId = PageID.post_composer_page;
  const componentId = ComponentID.media_attachment;
  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });
  const styles = useStyles(themeStyles);
  return (
    <View
      testID={accessibilityId}
      accessibilityLabel={accessibilityId}
      style={styles.container}
    >
      <Text>AmityMediaAttachmentComponent</Text>
    </View>
  );
};

export default AmityMediaAttachmentComponent;
