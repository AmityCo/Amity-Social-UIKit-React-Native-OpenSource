import { StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MyMD3Theme } from 'src/providers/amity-ui-kit-provider';

export const useStyles = (theme: MyMD3Theme) => {
  const { width } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const styles = StyleSheet.create({
    container: {
      alignSelf: 'center',
      width,
      paddingBottom: bottom,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: theme.colors.background,
      shadowColor: theme.colors.baseShade1,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 5,
    },
    handleBar: {
      alignSelf: 'center',
      width: 0.35 * width,
      backgroundColor: theme.colors.baseShade4,
      height: 5,
      marginVertical: 10,
      borderRadius: 10,
    },
    buttonsContainer: {
      flexDirection: 'row',
      paddingTop: 16,
      paddingHorizontal: 24,
      width: '100%',
      justifyContent: 'space-between',
    },
    iconBtn: {
      width: 24,
      height: 24,
      tintColor: theme.colors.base,
    },
  });

  return styles;
};
