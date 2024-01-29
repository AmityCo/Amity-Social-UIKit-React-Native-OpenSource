import { StyleSheet } from 'react-native';

export const getStyles = () => {
  const styles = StyleSheet.create({
    imageLargePost: {
      height: 350,
      borderRadius: 6,
      resizeMode: 'cover',
    },
    imageMediumLargePost: {
      height: 235,
      borderRadius: 6,
    },
    imageMediumPost: {
      height: 182,
      borderRadius: 6,
    },
    imageSmallPost: {
      height: 120,
      borderRadius: 6,
    },
    imageMarginRight: {
      marginRight: 2,
    },
    imageMarginLeft: {
      marginLeft: 2,
    },
    imageMarginTop: {
      marginTop: 2,
    },
    imageMarginBottom: {
      marginBottom: 2,
    },
    imagesWrap: {
      display: 'flex',
      flex: 6,
      marginTop: 12,
      marginBottom: 4,
      width: '100%',
    },
    row: {
      flexDirection: 'row',
    },
    col2: {
      flex: 2,
    },
    col3: {
      flex: 3,
    },
    col6: {
      flex: 6,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 6,
      marginTop: 2,
      marginLeft: 2,
    },
    overlayText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
    },
    playButton: {
      width: 100,
      height: 100,
      borderRadius: 50,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -25 }, { translateY: -25 }],
      zIndex: 1,
    },
  });
  return styles;
};
