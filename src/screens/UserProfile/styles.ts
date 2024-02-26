import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

const { width } = Dimensions.get('screen');

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // alignItems: 'center',
      width: '100%',
      justifyContent: 'flex-start',
    },
    loadingIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
    },
    dotIcon: {
      width: 16,
      height: 12,
    },

    followIcon: {
      width: 18,
      height: 16,
      color: 'white',
    },
    userDetail: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: theme.colors.background,
    },
    profileContainer: {
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    descriptionContainer: {
      paddingVertical: 12,
    },
    descriptionText: {
      paddingVertical: 12,
      color: theme.colors.base,
      fontSize: 17,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 72,
      marginRight: 10,
    },
    userInfo: {
      marginLeft: 16,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 20,
      color: theme.colors.base,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    horizontalText: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background,
    },
    textComponent: {
      marginBottom: 4,
      fontSize: 13,
      color: theme.colors.base,
    },
    editProfileButton: {
      // flex: 1,
      // backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#A5A9B5',
      padding: 8,
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    followButton: {
      // flex: 1,
      // backgroundColor: 'white',
      // borderWidth: 1,
      // borderColor: '#A5A9B5',
      backgroundColor: theme.colors.primary,
      padding: 8,
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    followText: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: '600',
      color: 'white',
    },
    editProfileText: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.base,
    },
    tabContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
      paddingHorizontal: 10,
    },
    tab: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.border,
      marginRight: 10,
    },
    focusedTab: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      color: theme.colors.baseShade1,
      fontWeight: '500',
    },
    focusedTabText: {
      color: theme.colors.background,
    },
    emptyContentContainer: {
      height: 350,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyContentText: {
      marginTop: 10,
      fontSize: 16,
      color: theme.colors.baseShade1,
    },
    thumbnail: {
      width: width * 0.5 - 30,
      height: width * 0.5 - 30,
      borderRadius: 10,
      margin: 10,
    },
    playButton: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return styles;
};
