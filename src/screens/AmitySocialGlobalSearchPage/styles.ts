import { StyleSheet } from 'react-native';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const useStyles = (theme: MyMD3Theme) => {
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
