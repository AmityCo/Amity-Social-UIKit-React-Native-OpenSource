import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;

  const styles = StyleSheet.create({
    tabContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: 12,
    },
    tabBtn: {
      borderRadius: 24,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: theme.colors.baseShade4,
      backgroundColor: theme.colors.background,
    },
    tabName: {
      fontSize: 17,
      lineHeight: 22,
      color: theme.colors.baseShade1,
    },
  });
  return styles;
};
