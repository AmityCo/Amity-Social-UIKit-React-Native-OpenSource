import { Dimensions, StyleSheet } from 'react-native';

export const createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
      maxWidth: Dimensions.get('window').height / 4,
      height: Dimensions.get('window').height / 5,
      margin: 3,
    },
    image: {
      flex: 1,
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      borderRadius: 5,
      backgroundColor: '#bcbcbc',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressBar: {
      marginVertical: 10,
    },
    loadingImage: {
      opacity: 0.5,
    },
    loadedImage: {
      opacity: 1,
    },
    closeButton: {
      position: 'absolute',
      top: 7,
      right: 7,
      padding: 7,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderRadius: 72,
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
};
