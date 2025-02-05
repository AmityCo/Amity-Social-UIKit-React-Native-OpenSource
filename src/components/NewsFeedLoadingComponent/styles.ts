import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    container: {
      paddingVertical: 16,
      flex: 1,
      gap: 8,

    },
    postCard:{
      backgroundColor: theme.colors.background,
      paddingHorizontal: 16
    },
    storiesContainer: {
      flexDirection: 'row',
    },
  });

  return styles;
};
