import { Animated, Easing, Pressable, Text, View } from 'react-native';
import React, { FC, memo, useCallback, useEffect, useRef } from 'react';
import { PageID, ComponentID, mediaAttachment } from '../../enum';
import { useAmityComponent } from '../../hooks';
import { useStyles } from './styles';
import CameraIcon from '../../svg/CameraIcon';
import GalleryIcon from '../../svg/GalleryIcon';
import PlayVideoIcon from '../../svg/PlayVideoIcon';

type AmityDetailedMediaAttachmentComponentType = {
  onPressCamera: () => void;
  onPressImage: () => void;
  onPressVideo: () => void;
  chosenMediaType?: mediaAttachment;
};

const AmityDetailedMediaAttachmentComponent: FC<
  AmityDetailedMediaAttachmentComponentType
> = ({ onPressCamera, onPressImage, onPressVideo, chosenMediaType }) => {
  const pageId = PageID.post_composer_page;
  const componentId = ComponentID.detailed_media_attachment;
  const { accessibilityId, themeStyles, isExcluded } = useAmityComponent({
    pageId,
    componentId,
  });
  const styles = useStyles(themeStyles);

  const animatedBottom = useRef(new Animated.Value(-200)).current;

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
      toValue: -200,
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
        <Pressable style={styles.mediaAttachmentBtn} onPress={onPressCamera}>
          <CameraIcon style={styles.iconBtn} />
          <Text style={styles.iconText}>Camera</Text>
        </Pressable>
        {(!chosenMediaType || chosenMediaType === mediaAttachment.image) && (
          <Pressable style={styles.mediaAttachmentBtn} onPress={onPressImage}>
            <GalleryIcon style={styles.iconBtn} />
            <Text style={styles.iconText}>Photo</Text>
          </Pressable>
        )}
        {(!chosenMediaType || chosenMediaType === mediaAttachment.video) && (
          <Pressable style={styles.mediaAttachmentBtn} onPress={onPressVideo}>
            <PlayVideoIcon style={styles.iconBtn} />
            <Text style={styles.iconText}>Video</Text>
          </Pressable>
        )}
        {/* will use later
        <Pressable style={styles.mediaAttachmentBtn}>
          <ImageKeyElement
            pageID={pageId}
            componentID={componentId}
            elementID={ElementID.file_button}
            style={styles.iconBtn}
          />
          <TextKeyElement
            pageID={pageId}
            componentID={componentId}
            elementID={ElementID.file_button}
            style={styles.iconText}
          />
        </Pressable> */}
      </View>
    </Animated.View>
  );
};

export default memo(AmityDetailedMediaAttachmentComponent);
