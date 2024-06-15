import { Platform, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    headerWrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    inputWrap: {
      marginHorizontal: 16,
      backgroundColor: theme.colors.baseShade4,
      paddingHorizontal: 10,
      paddingVertical: Platform.OS === 'ios' || Platform.OS === 'web' ? 10 : 0,
      borderRadius: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
      flex: 2,
      alignItems: 'center',
    },
    input: { flex: 1, marginHorizontal: 6, color: theme.colors.base },
    cancelBtn: {
      marginRight: 16,
      color: theme.colors.base,
    },
    searchIcon: { width: 20, height: 20, tintColor: theme.colors.base },
  });

  return styles;
};
