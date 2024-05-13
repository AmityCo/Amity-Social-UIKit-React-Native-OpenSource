import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    searchScrollList: {
      paddingBottom: 110,
      marginTop: 10,
    },
    notFoundText: {
      marginTop: 40,
      fontSize: 16,
      alignSelf: 'center',
      textAlign: 'center',
      color: theme.colors.baseShade3,
    },
  });

  return styles;
};
