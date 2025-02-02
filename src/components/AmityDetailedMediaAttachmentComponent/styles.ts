import { StyleSheet, useWindowDimensions } from 'react-native';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const useStyles = (theme: MyMD3Theme) => {
  const { width } = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      alignSelf: 'center',
      width,
      borderTopWidth: 3,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.baseShade4,
      position: 'absolute',
      bottom: 0,
      paddingBottom: 14,
    },
    handleBar: {
      alignSelf: 'center',
      width: 36,
      backgroundColor: theme.colors.baseShade4,
      height: 5,
      marginVertical: 10,
      borderRadius: 10,
    },
    buttonsContainer: {
      paddingTop: 16,
      paddingHorizontal: 24,
    },
    iconBtn: {
      width: 24,
      height: 24,
      tintColor: theme.colors.base,
      marginRight: 12,
    },
    iconText: {
      color: theme.colors.base,
      fontSize: 15,
      fontWeight: 'bold',
    },
    mediaAttachmentBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 32,
    },
  });

  return styles;
};
