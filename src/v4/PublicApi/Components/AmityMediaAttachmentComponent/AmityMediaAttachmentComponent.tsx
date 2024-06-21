import { Pressable, View } from 'react-native';
import React, { memo } from 'react';
import { PageID, ComponentID, ElementID } from '../../../enum';
import { useAmityComponent } from '../../../hook';
import { useStyles } from './styles';
import ImageKeyElement from '../../Elements/ImageKeyElement/ImageKeyElement';

const AmityMediaAttachmentComponent = () => {
  const pageId = PageID.post_composer_page;
  const componentId = ComponentID.media_attachment;
  const { accessibilityId, themeStyles, isExcluded } = useAmityComponent({
    pageId,
    componentId,
  });
  const styles = useStyles(themeStyles);

  if (isExcluded) return null;
  return (
    <View
      testID={accessibilityId}
      accessibilityLabel={accessibilityId}
      style={styles.container}
    >
      <View style={styles.handleBar} />
      <View style={styles.buttonsContainer}>
        <Pressable>
          <ImageKeyElement
            pageID={pageId}
            componentID={componentId}
            elementID={ElementID.camera_button}
            style={styles.iconBtn}
          />
        </Pressable>
        <Pressable>
          <ImageKeyElement
            pageID={pageId}
            componentID={componentId}
            elementID={ElementID.image_button}
            style={styles.iconBtn}
          />
        </Pressable>
        <Pressable>
          <ImageKeyElement
            pageID={pageId}
            componentID={componentId}
            elementID={ElementID.video_button}
            style={styles.iconBtn}
          />
        </Pressable>
        <Pressable>
          <ImageKeyElement
            pageID={pageId}
            componentID={componentId}
            elementID={ElementID.file_button}
            style={styles.iconBtn}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default memo(AmityMediaAttachmentComponent);
