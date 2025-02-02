import { Pressable, View, Animated, Easing } from 'react-native';
import React, { FC, memo, useCallback, useEffect, useRef } from 'react';
import { PageID, ComponentID, mediaAttachment } from '../../enum';
import { useAmityComponent } from '../../hooks';
import { useStyles } from './styles';
import PlayVideoIcon from '../../svg/PlayVideoIcon';
import GalleryIcon from '../../svg/GalleryIcon';
import CameraIcon from '../../svg/CameraIcon';

type AmityMediaAttachmentComponentType = {
  onPressCamera: () => void;
  onPressImage: () => void;
  onPressVideo: () => void;
  chosenMediaType?: mediaAttachment;
};

const AmityMediaAttachmentComponent: FC<AmityMediaAttachmentComponentType> = ({
  onPressCamera,
  onPressImage,
  onPressVideo,
  chosenMediaType,
}) => {
  const pageId = PageID.post_composer_page;
  const componentId = ComponentID.media_attachment;
  const { accessibilityId, themeStyles, isExcluded } = useAmityComponent({
    pageId,
    componentId,
  });
  const styles = useStyles(themeStyles);

  const animatedBottom = useRef(new Animated.Value(-100)).current;

  const showMediaAttachments = useCallback(() => {
    Animated.timing(animatedBottom, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [animatedBottom]);

  const hideMediaAttachments = useCallback(() => {
    Animated.timing(animatedBottom, {
      toValue: -100,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [animatedBottom]);

  useEffect(() => {
    showMediaAttachments();
    return () => hideMediaAttachments();
  }, [hideMediaAttachments, showMediaAttachments]);

  if (isExcluded) return null;
  return (
    <Animated.View
      testID={accessibilityId}
      accessibilityLabel={accessibilityId}
      style={[styles.container, { bottom: animatedBottom }]}
    >
      <View style={styles.handleBar} />
      <View style={styles.buttonsContainer}>
        <Pressable onPress={onPressCamera}>
          <CameraIcon style={styles.iconBtn} />
        </Pressable>

        {(!chosenMediaType || chosenMediaType === mediaAttachment.image) && (
          <Pressable onPress={onPressImage}>
            <GalleryIcon style={styles.iconBtn} />
          </Pressable>
        )}
        {(!chosenMediaType || chosenMediaType === mediaAttachment.video) && (
          <Pressable onPress={onPressVideo}>
            <PlayVideoIcon style={styles.iconBtn} />
          </Pressable>
        )}
        {/* //will use later
        <Pressable>
          <ImageKeyElement
            pageID={pageId}
            componentID={componentId}
            elementID={ElementID.file_button}
            style={styles.iconBtn}
          />
        </Pressable> */}
      </View>
    </Animated.View>
  );
};

export default memo(AmityMediaAttachmentComponent);
