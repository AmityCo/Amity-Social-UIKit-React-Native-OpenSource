import { StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';
export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const { width, height } = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      width,
      marginTop: 8,
    },
    skeletonContainer: {
      backgroundColor: theme.colors.background,
      flexDirection: 'row',
    },
    title: {
      fontSize: 17,
      fontWeight: '600',
      margin: 1,
      color: theme.colors.base,
    },
    modal: {
      flex: 1,
      height,
      width,
    },
    scrollView: {
      justifyContent: 'space-between',
    },
    itemContainer: {
      alignItems: 'center',
      marginLeft: 16,
      width: 68,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 56,
      margin: 4,
    },
    itemText: {
      fontSize: 13,
      fontWeight: '400',
      color: theme.colors.base,
      textAlign: 'center',
    },
    textRow: {
      marginTop: 6,
      flexDirection: 'row',
      alignItems: 'center',
      width: 55,
      justifyContent: 'center',
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    arrowIcon: {
      marginRight: 16,
      display: 'flex',
    },
    seeAllBtn: {
      marginRight: 16,
    },
    seeAllIcon: {
      width: 40,
      height: 40,
      borderRadius: 25,
      backgroundColor: '#ededed',
      alignItems: 'center',
      justifyContent: 'center',
    },
    seeAllText: {
      fontSize: 13,
      marginTop: 6,
    },
    storyRing: {
      position: 'absolute',
    },
    officialIcon: {
      position: 'absolute',
      left: 45,
      top: 42,
    },
    scrollContainer: {
      paddingVertical: 4,
    },
    communityAvatar: {
      width: 60,
      height: 60,
      borderRadius: 56,
      margin: 4,
    },
    avatarContainer: {
      alignItems: 'center',
      width: 68,
      margin: 8,
    },
  });

  return styles;
};
