import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const getStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.background,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 72,
      marginRight: 15,
    },
    itemText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.base,
    },
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dotIcon: {
      width: 16,
      height: 12,
    },
    categoryText: {
      fontSize: 13,
      color: theme.colors.baseShade1,
      marginTop: 4,
    },
  });
  return styles;
};
