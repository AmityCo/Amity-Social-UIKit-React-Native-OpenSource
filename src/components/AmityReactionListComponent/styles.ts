import { StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';
import { useTheme } from 'react-native-paper';
export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;
  const { bottom } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      width,
      height,
      backgroundColor: 'transparent',
    },
    modal: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: theme.colors.background,
      width: width,
      height: 0.5 * height,
    },
    modalContainer: {
      paddingTop: 14,
      alignItems: 'center',
      flex: 1,
      paddingBottom: bottom,
    },
    handleBar: {
      width: 0.35 * width,
      backgroundColor: theme.colors.baseShade4,
      height: 5,
      marginVertical: 10,
      borderRadius: 10,
    },
    errorContainer: {
      width: '100%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorTitle: {
      marginTop: 15,
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.baseShade3,
    },
    errorDesc: {
      marginTop: 5,
      fontSize: 12,
      fontWeight: '400',
      color: theme.colors.baseShade1,
      textAlign: 'center',
    },
    reactionHeaderRow: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.baseShade4,
    },
    reactionBtn: {
      marginRight: 20,
      paddingBottom: 14,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 50,
      flexDirection: 'row',
    },
    selectedReactionBtn: {
      borderBottomWidth: 2,
      borderColor: theme.colors.primary,
    },
    reaction: {
      fontSize: 17,
      fontWeight: 'bold',
      color: theme.colors.baseShade3,
      marginLeft: 2,
    },
    selectedReaction: {
      color: theme.colors.primary,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
      paddingHorizontal: 20,
    },
    reactorNameContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    avater: {
      width: 40,
      height: 40,
      borderRadius: 30,
    },
    userName: {
      color: theme.colors.base,
      fontSize: 15,
      fontWeight: '500',
      marginLeft: 10,
    },
  });

  return styles;
};
