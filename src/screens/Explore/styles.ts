import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const getStyles = () => {
  const theme = useTheme() as MyMD3Theme;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.screenBackground,
    },
    recommendContainer: {
      backgroundColor: theme.colors.screenBackground,
      paddingLeft: 15,
      paddingVertical: 10,
    },
    trendingContainer: {
      paddingLeft: 15,
      paddingVertical: 10,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 20,
      marginTop: 10,
      marginBottom: 20,
      color: theme.colors.base,
    },
    listContainer: {
      flex: 1,
    },
    trendingTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    card: {
      width: 175,
      backgroundColor: theme.colors.background,
      borderRadius: 10,
      marginRight: 10,
      marginBottom: 10,
      padding: 15,
    },
    recommendSubDetail: {
      fontSize: 13,
      marginBottom: 5,
      color: theme.colors.baseShade1,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginBottom: 10,
    },
    name: {
      fontWeight: '600',
      fontSize: 15,
      marginBottom: 5,
      color: theme.colors.base,
    },
    bio: {
      color: theme.colors.base,
      fontSize: 13,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    number: {
      fontSize: 18,
      fontWeight: '600',
      marginHorizontal: 12,
      color: '#1054DE',
      paddingBottom: 10,
    },
    memberContainer: {
      alignItems: 'flex-start',
    },
    memberTextContainer: {
      alignItems: 'flex-start',
      paddingBottom: 10, // Added to horizontally center the text within memberContainer
    },
    memberText: {
      fontSize: 18,
      fontWeight: '600',
      marginRight: 4,
      color: theme.colors.base,
    },
    memberCount: {
      fontSize: 13,
      fontWeight: '400',
      color: theme.colors.baseShade1,
      marginRight: 4,
    },
    categoriesContainer: {
      paddingTop: 20,
      paddingHorizontal: 10,
      paddingBottom: 120,
      backgroundColor: theme.colors.background,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    titleText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.colors.base,
    },
    arrowIcon: {
      width: 10,
      height: 17,
      marginRight: 10,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      // paddingLeft: 10,
      marginBottom: 10,
    },
    column: {
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
    },
    columnText: {
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 10,
      marginBottom: 10,
      color: theme.colors.base,
    },
  });
  return styles;
};
