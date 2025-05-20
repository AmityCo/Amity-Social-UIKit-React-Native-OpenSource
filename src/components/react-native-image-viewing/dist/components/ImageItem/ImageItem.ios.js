import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import useDoubleTapToZoom from '../../hooks/useDoubleTapToZoom';
import useImageDimensions from '../../hooks/useImageDimensions';
import { getImageStyles, getImageTransform } from '../../utils';
import { ImageLoading } from './ImageLoading';

const SWIPE_CLOSE_OFFSET = 75;
const SWIPE_CLOSE_VELOCITY = 1.55;
const SCREEN = Dimensions.get('screen');
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;

const ImageItem = ({
  imageSrc,
  onZoom,
  onRequestClose,
  onLongPress,
  delayLongPress,
  swipeToCloseEnabled = true,
  doubleTapToZoomEnabled = true,
}) => {
  const scrollViewRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [scaled, setScaled] = useState(false);
  const imageDimensions = useImageDimensions(imageSrc);

  const handleDoubleTap = useDoubleTapToZoom(scrollViewRef, scaled, SCREEN);

  const [translate, scale] = getImageTransform(imageDimensions, SCREEN);
  const scrollValueY = new Animated.Value(0);
  const scaleValue = new Animated.Value(scale || 1);
  const translateValue = new Animated.ValueXY(translate);

  const maxScale = scale && scale > 0 ? Math.max(1 / scale, 1) : 1;

  const imageOpacity = scrollValueY.interpolate({
    inputRange: [-SWIPE_CLOSE_OFFSET, 0, SWIPE_CLOSE_OFFSET],
    outputRange: [0.5, 1, 0.5],
  });

  const imageStyles = getImageStyles(imageDimensions, translateValue, scaleValue);
  const imageStylesWithOpacity = {
    ...imageStyles,
    opacity: imageOpacity,
  };

  const onScrollEndDrag = useCallback(
    ({ nativeEvent }) => {
      const velocityY = nativeEvent?.velocity?.y ?? 0;
      const isScaled = nativeEvent?.zoomScale > 1;

      onZoom(isScaled);
      setScaled(isScaled);

      if (
        !isScaled &&
        swipeToCloseEnabled &&
        Math.abs(velocityY) > SWIPE_CLOSE_VELOCITY
      ) {
        onRequestClose();
      }
    },
    [scaled]
  );

  const onScroll = ({ nativeEvent }) => {
    const offsetY = nativeEvent?.contentOffset?.y ?? 0;
    if (nativeEvent?.zoomScale > 1) return;
    scrollValueY.setValue(offsetY);
  };

  const onLongPressHandler = useCallback(() => {
    onLongPress(imageSrc);
  }, [imageSrc, onLongPress]);

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        style={styles.listItem}
        pinchGestureEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        maximumZoomScale={maxScale}
        contentContainerStyle={styles.imageScrollContainer}
        scrollEnabled={swipeToCloseEnabled}
        onScrollEndDrag={onScrollEndDrag}
        scrollEventThrottle={1}
        {...(swipeToCloseEnabled && { onScroll })}
      >
        {(!loaded || !imageDimensions) && <ImageLoading />}

        <TouchableWithoutFeedback
          onPress={doubleTapToZoomEnabled ? handleDoubleTap : undefined}
          onLongPress={onLongPressHandler}
          delayLongPress={delayLongPress}
        >
          <Animated.View style={imageStylesWithOpacity}>
            <ExpoImage
              source={imageSrc}
              style={StyleSheet.absoluteFill}
              contentFit="contain"
              transition={300}
              onLoad={() => setLoaded(true)}
            />
          </Animated.View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  imageScrollContainer: {
    height: SCREEN_HEIGHT,
  },
});

export default React.memo(ImageItem);