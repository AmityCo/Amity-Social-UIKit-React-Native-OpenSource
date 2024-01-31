import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const getStyles = () => {
  const theme = useTheme() as MyMD3Theme;

  const styles = StyleSheet.create({
    mentionContainer: {
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
      paddingHorizontal: 0,
      maxHeight: 240,
    },
  });

  return styles;
};
