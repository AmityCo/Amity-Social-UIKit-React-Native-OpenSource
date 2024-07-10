import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    btnWrap: {
      padding: 5,
    },
    dotIcon: {
      width: 16,
      height: 12,
      tintColor: theme.colors.base,
    },
    closeIcon: {
      width: 24,
      height: 24,
      tintColor: theme.colors.base,
    },
  });
  return styles;
};
