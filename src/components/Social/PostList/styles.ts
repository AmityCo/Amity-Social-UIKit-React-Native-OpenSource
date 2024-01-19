import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const getStyles = () => {
  const theme = useTheme() as MyMD3Theme;

  const styles = StyleSheet.create({
    postWrap: {
      backgroundColor: theme.colors.background,
      marginTop: 8,
      paddingHorizontal: 16,
      paddingTop: 4,
    },
    headerSection: {
      paddingVertical: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headerText: {
      fontWeight: '600',
      fontSize: 15,
      color: theme.colors.base,
    },
    user: {
      paddingVertical: 8,
      flexDirection: 'row',
      maxWidth: 300,
    },

    headerTextTime: {
      fontSize: 13,
      fontWeight: '400',
      color: theme.colors.baseShade1,
      marginVertical: 4,
    },
    bodySection: {
      justifyContent: 'center',
      paddingVertical: 10,
      minHeight: 45,
    },
    countSection: {
      marginVertical: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    likeCountText: {
      fontSize: 13,
      color: theme.colors.baseShade2,
    },
    commentCountText: {
      fontSize: 13,
      color: theme.colors.baseShade2,
    },
    bodyText: {
      fontSize: 15,
      fontStyle: 'normal',
      fontWeight: '400',
      marginBottom: 8,
      color: theme.colors.base,
    },
    actionSection: {
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
      flexDirection: 'row',
      marginTop: 8,
      marginBottom: 4,
    },
    likeBtn: {
      flexDirection: 'row',
      paddingRight: 6,
      paddingVertical: 12,
    },
    commentBtn: {
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 12,
    },
    btnText: {
      color: theme.colors.baseShade2,
      fontSize: 15,
      fontWeight: '600',
      marginHorizontal: 4,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 72,
      marginRight: 12,
      backgroundColor: '#D9E5FC',
      alignItems: 'center',
      justifyContent: 'center',
    },
    likedText: {
      color: theme.colors.primary,
      fontSize: 15,
      fontWeight: '600',
      marginHorizontal: 4,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    arrow: {
      marginHorizontal: 4,
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
    container: {
      flex: 1,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
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
    videoContainer: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    video: {
      alignSelf: 'center',
      width: 320,
      height: 200,
    },
    mediaWrap: {
      minHeight: 375,
    },
    threeDots: {
      padding: 5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      padding: 10,
      minHeight: 700,
    },
    twoOptions: {
      minHeight: 720,
    },
    modalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
      marginVertical: 8,
    },
    deleteText: {
      paddingLeft: 12,
      fontWeight: '600',
      color: theme.colors.base,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dot: {
      color: theme.colors.baseShade1,
      fontWeight: '900',
      paddingHorizontal: 5,
    },
    mentionText: {
      color: theme.colors.primary,
      fontSize: 15,
    },
    inputText: {
      color: theme.colors.base,
      fontSize: 15,
    },
  });

  return styles;
};
