import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    icon: {
      backgroundColor: theme.colors.background,
      height: 20,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    doneText: {
      fontSize: 18,
      color: theme.colors.primary,
    },
  });
  return styles;
};
