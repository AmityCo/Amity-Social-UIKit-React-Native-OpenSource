import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '~/providers/amity-ui-kit-provider';

export const useStyle = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    icon: {
      backgroundColor: theme.colors.background,
    },
    cancelText: {
      fontSize: 18,
      color: theme.colors.base,
    },
  });
  return styles;
};
