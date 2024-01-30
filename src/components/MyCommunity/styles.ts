import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';
export const useStyle = () => {
  const theme = useTheme() as MyMD3Theme;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      paddingVertical: 16,
      paddingLeft: 16,
    },
    title: {
      fontSize: 17,
      fontWeight: '600',
      margin: 1,
      color: theme.colors.base,
    },
    scrollView: {
      paddingTop: 16,
      justifyContent: 'space-between',
    },
    itemContainer: {
      alignItems: 'center',
      marginRight: 10,
      width: 68,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 25,
    },
    itemText: {
      fontSize: 12,
      marginHorizontal: 3,
      color: theme.colors.base,
    },
    textRow: {
      marginTop: 6,
      flexDirection: 'row',
      alignItems: 'center',
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
  });

  return styles;
};
