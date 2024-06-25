import { StyleSheet } from 'react-native';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = (theme: MyMD3Theme) => {
  const { top, bottom } = useSafeAreaInsets();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: top + 18,
      paddingBottom: bottom,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      alignItems: 'center',
      marginBottom: 12,
    },
    closeBtn: {
      width: 14,
      height: 14,
    },
    title: {
      color: theme.colors.base,
      fontSize: 17,
      fontWeight: 'bold',
    },
    activePostBtn: {
      color: theme.colors.primary,
    },
    postBtnText: {
      color: theme.colors.primaryShade2,
      fontSize: 15,
    },
    inputWrapper: {
      flex: 1,
      padding: 16,
    },
  });

  return styles;
};
