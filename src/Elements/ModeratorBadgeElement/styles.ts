import { StyleSheet } from 'react-native';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const useStyles = (theme: MyMD3Theme) => {
  const styles = StyleSheet.create({
    moderatorTitle: {
      fontSize: 10,
      color: theme.colors.primary,
    },
    moderatorRow: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      padding: 4,
      paddingHorizontal: 8,
      backgroundColor: theme.colors.primaryShade3,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    moderatorBadge: {
      width: 8,
      height: 8,
      marginRight: 4,
    },
  });

  return styles;
};
