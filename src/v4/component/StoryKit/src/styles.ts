import { StyleSheet, Dimensions, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

const { width, height } = Dimensions.get('window');

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    video: {
      width: width,
      height: height - 50,
    },
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    flex: {
      flex: 1,
    },
    flexCol: {
      flex: 1,
      flexDirection: 'column',
    },
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    image: {
      width: width,
      height: height - 50,
      resizeMode: 'cover',
    },
    backgroundContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    spinnerContainer: {
      zIndex: -100,
      position: 'absolute',
      justifyContent: 'center',
      backgroundColor: 'black',
      alignSelf: 'center',
      width: width,
      height: height,
    },
    animationBarContainer: {
      flexDirection: 'row',
      paddingTop: 10,
      paddingHorizontal: 10,
    },
    animationBackground: {
      height: 2,
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'rgba(117, 117, 117, 0.5)',
      marginHorizontal: 2,
    },
    userContainer: {
      height: 50,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
    },
    avatarImage: {
      height: 35,
      width: 35,
      borderRadius: 100,
    },
    avatarText: {
      fontWeight: 'bold',
      color: 'white',
      paddingLeft: 10,
      fontSize: 14,
    },
    avatarSubText: {
      color: theme.colors.background,
      fontSize: 12,
    },
    closeIconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
      paddingHorizontal: 15,
    },
    menuCloseContaier: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    pressContainer: {
      flex: 1,
      flexDirection: 'row',
    },
    swipeUpBtn: {
      position: 'absolute',
      right: 0,
      left: 0,
      alignItems: 'center',
      bottom: Platform.OS === 'ios' ? 20 : 50,
    },
    whiteText: {
      color: 'white',
    },
    threeDotsMenu: {
      marginRight: 16,
    },
    swipeText: {
      color: 'white',
      marginTop: 5,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 50,
      paddingHorizontal: 20,
    },
    seenContainer: {
      marginHorizontal: 3,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconContainer: {
      marginHorizontal: 3,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    seen: {
      marginLeft: 5,
      fontSize: 12,
      color: theme.colors.background,
    },
    hyperlinkContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.baseShade1,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      position: 'absolute',
      left: width * 0.5 - 75,
      bottom: 30,
      alignSelf: 'center',
    },
    error: {
      textAlign: 'center',
      color: theme.colors.background,
    },
    storyCreateIcon: {
      position: 'absolute',
      left: 25,
      top: 25,
    },
    bottomSheet: {
      backgroundColor: theme.colors.background,
      paddingBottom: '25%',
    },
    deleteBottomSheet: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginVertical: 8,
    },
    commentBottomSheet: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    commentTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: theme.colors.base,
    },
    horizontalSperator: {
      width: '100%',
      backgroundColor: theme.colors.border,
      height: 2,
      marginVertical: 10,
    },
    deleteStoryTxt: {
      color: theme.colors.base,
      fontSize: 14,
    },
  });

  return styles;
};
