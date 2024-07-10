import { useWindowDimensions, StyleSheet } from 'react-native';

export const useStyles = () => {
  const { width } = useWindowDimensions();
  return StyleSheet.create({
    container: {
      flex: 1,
      height: width - 24,
      margin: 3,
    },
    image3XContainer: {
      width: width / 3 - 16,
      height: width / 3 - 16,
      margin: 3,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      borderRadius: 5,
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
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      borderRadius: 72,
    },
  });
};
