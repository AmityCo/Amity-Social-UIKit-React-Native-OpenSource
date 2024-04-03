import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MyMD3Theme } from '../../providers/amity-ui-kit-provider';

export const useStyles = () => {
  const theme = useTheme() as MyMD3Theme;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.colors.background,
    },
    errorContainer: {
      width: '100%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.baseShade4,
      paddingHorizontal: 20,
    },
    reactionCountContainer: {
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary,
      alignSelf: 'flex-start',
      padding: 10,
    },
    reactionCount: {
      color: theme.colors.primary,
      fontWeight: '600',
      fontSize: 16,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginVertical: 10,
      paddingLeft: 20,
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
  });

  return styles;
};
