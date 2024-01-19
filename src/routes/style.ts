import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const getStyles = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    btnWrap: {
      padding: 5,
    },
    dotIcon: {
      width: 16,
      height: 12,
    },
    saveText: {
      color: theme.colors.primary,
    },
  });
  return styles;
};
