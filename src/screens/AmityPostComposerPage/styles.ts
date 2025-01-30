import { StyleSheet, useWindowDimensions } from 'react-native';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useStyles = (theme: MyMD3Theme) => {
  const { bottom } = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      alignItems: 'center',
      marginTop: 12,
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
      opacity: 1,
    },
    postBtnText: {
      color: theme.colors.primaryShade2,
      fontSize: 15,
      opacity: 0.5,
    },
    inputWrapper: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 12,
    },
    scrollContainer: {
      height: height,
    },
    imageContainer: {
      flexDirection: 'row',
      flex: 3,
      marginTop: 14,
      paddingBottom: 3 * bottom + 16,
    },
  });

  return styles;
};
