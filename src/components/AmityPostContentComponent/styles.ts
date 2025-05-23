import { StyleSheet } from 'react-native';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const useStyles = (theme: MyMD3Theme) => {
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
      alignItems: 'center',
    },
    communityNameContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    fillSpace: {
      flex: 1,
    },
    headerText: {
      fontWeight: '600',
      fontSize: 15,
      color: theme.colors.base,
    },
    user: {
      paddingVertical: 8,
      flexDirection: 'row',
      flex: 1,
    },

    headerTextTime: {
      fontSize: 13,
      fontWeight: '400',
      color: theme.colors.baseShade1,
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
      borderTopColor: theme.colors.baseShade4,
      borderTopWidth: 1,
      flexDirection: 'row',
      marginTop: 8,
      marginBottom: 4,
      paddingVertical: 8,
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
      flex: 1,
    },
    arrow: {
      marginHorizontal: 8,
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
      alignItems: 'center',
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
      width: 18,
      height: 18,
      tintColor: theme.colors.base,
      resizeMode: 'contain',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 10,
      minHeight: 700,
    },
    twoOptions: {
      minHeight: 750,
    },
    modalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
      marginVertical: 8,
    },
    handleBar: {
      alignSelf: 'center',
      width: 36,
      backgroundColor: theme.colors.baseShade4,
      height: 5,
      marginVertical: 10,
      borderRadius: 10,
    },
    editText: {
      paddingLeft: 12,
      fontWeight: '600',
      color: theme.colors.base,
    },
    deleteText: {
      paddingLeft: 12,
      fontWeight: '600',
      color: theme.colors.alert,
    },
    timeRow: {
      marginTop: 4,
      flexDirection: 'row',
      alignItems: 'center',
    },

    dot: {
      color: theme.colors.baseShade1,
      fontWeight: '900',
      paddingHorizontal: 5,
    },
  });

  return styles;
};
