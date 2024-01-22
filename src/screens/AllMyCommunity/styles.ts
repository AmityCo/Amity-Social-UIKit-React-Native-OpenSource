import { Platform, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const getStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
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
      color: theme.colors.base,
      paddingHorizontal: 10,
      paddingVertical: Platform.OS === 'ios' ? 10 : 0,
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
      flex: 2,
    },
    input: {
      flex: 1,
      marginHorizontal: 6,
      backgroundColor: theme.colors.secondary,
      color: theme.colors.base,
    },
    cancelBtn: {
      marginRight: 16,
      color: theme.colors.base,
    },
    searchScrollList: {
      paddingBottom: 110,
      marginTop: 10,
    },
    btnWrap: {
      padding: 10,
    },
  });

  return styles;
};
