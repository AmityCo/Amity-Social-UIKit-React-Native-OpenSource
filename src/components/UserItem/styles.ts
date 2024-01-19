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
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 72,
      marginRight: 10,
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
  });
  return styles;
};
