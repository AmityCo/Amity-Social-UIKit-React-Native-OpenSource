import { Platform, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const getStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      height: '100%',
    },
    headerWrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    inputWrap: {
      marginHorizontal: 16,
      backgroundColor: theme.colors.secondary,
      paddingHorizontal: 10,
      paddingVertical: Platform.OS === 'ios' ? 10 : 0,
      borderRadius: 4,
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
    searchScrollList: {
      paddingBottom: 110,
      marginTop: 10,
    },
  });

  return styles;
};
