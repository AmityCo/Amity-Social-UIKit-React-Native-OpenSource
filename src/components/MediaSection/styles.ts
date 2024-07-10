import { StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export const useStyles = () => {
  const { top } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const styles = StyleSheet.create({
    headerContainer: {
      width,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: top + 14,
      paddingHorizontal: 12,
    },
    closebtnIcon: {
      backgroundColor: '#ffffff8f',
      borderRadius: 24,
      width: 24,
      height: 24,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      textAlignVertical: 'center',
      overflow: 'hidden',
    },

    closeBtn: {
      fontSize: 18,
      color: 'black',
      fontWeight: 'bold',
    },
    header: {
      textAlign: 'center',
      fontSize: 14,
      color: 'white',
      fontWeight: 'bold',
    },
    flexWidth: {
      flex: 1,
    },
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
